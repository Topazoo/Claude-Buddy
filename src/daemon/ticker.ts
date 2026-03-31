import type { PetState, Mood, SessionActivity } from "../pet/state.js";
import { deriveMood, computeLevel } from "../pet/state.js";
import { checkTraitUnlocks, type TraitUnlock } from "./traits.js";

export interface TickResult {
  stateChanged: boolean;
  traitUnlocks: TraitUnlock[];
}

/**
 * Run one tick of the daemon loop.
 * Updates mood, checks traits, updates level.
 * Called every 60 seconds.
 */
export function tick(state: PetState, activity: SessionActivity): TickResult {
  const traitUnlocks: TraitUnlock[] = [];
  let changed = false;

  // Derive mood from activity
  const newMood = deriveMood(activity);
  if (newMood !== state.mood) {
    state.mood = newMood;
    changed = true;
  }

  // Check trait unlocks
  const unlocks = checkTraitUnlocks(state);
  for (const unlock of unlocks) {
    state.traits[unlock.traitId] = {
      level: 1,
      unlockedAt: new Date().toISOString(),
    };
    traitUnlocks.push(unlock);
    changed = true;
  }

  // Recompute level
  const newLevel = computeLevel(state.activityCounters, Object.keys(state.traits).length);
  if (newLevel !== state.level) {
    state.level = newLevel;
    changed = true;
  }

  // Update tick timestamp
  state.lastTick = new Date().toISOString();
  changed = true;

  return { stateChanged: changed, traitUnlocks };
}
