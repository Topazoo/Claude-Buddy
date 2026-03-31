import type { PetState, ActivityCounters } from "../pet/state.js";

export interface TraitDefinition {
  id: string;
  name: string;
  description: string;
  condition: (counters: ActivityCounters) => boolean;
  effect: string;
}

export interface TraitUnlock {
  traitId: string;
  traitName: string;
}

/** V1 traits: 3 traits, 1 unlock level each. */
export const TRAIT_DEFINITIONS: TraitDefinition[] = [
  {
    id: "adventurous",
    name: "Adventurous",
    description: "Excited by shell commands",
    condition: (c) => c.bashCalls >= 200,
    effect: "\"Let's see what happens!\"",
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Time-aware, alert at night",
    condition: (c) => c.sessionsAfterMidnight >= 10,
    effect: "Sleepy during day, alert at night",
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Reacts to fast coding",
    condition: (c) => c.rapidEditBursts >= 20,
    effect: "\"Zoom zoom!\"",
  },
];

/**
 * Check which traits should be unlocked based on current counters.
 * Only returns newly unlocked traits (not already in state.traits).
 */
export function checkTraitUnlocks(state: PetState): TraitUnlock[] {
  const unlocks: TraitUnlock[] = [];
  for (const def of TRAIT_DEFINITIONS) {
    if (state.traits[def.id]) continue; // Already unlocked
    if (def.condition(state.activityCounters)) {
      unlocks.push({ traitId: def.id, traitName: def.name });
    }
  }
  return unlocks;
}
