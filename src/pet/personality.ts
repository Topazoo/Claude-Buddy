import type { PetState } from "./state.js";
import { SPECIES } from "./species.js";
import type { Species } from "./species.js";
import { TRAIT_DEFINITIONS } from "../daemon/traits.js";

interface PersonalityContext {
  name: string;
  species: string;
  speciesEmoji: string;
  stats: PetState["stats"];
  traits: string[];
  mood: string;
  level: number;
  recentActivity: string[];
  recentPatterns: string[];
  responseGuidance: string;
}

/**
 * Build the personality context returned by buddy_chat MCP tool.
 * This gives Claude everything it needs to respond in-character.
 */
export function buildPersonalityContext(
  state: PetState,
  recentActivity: string[],
  recentPatterns: string[],
): PersonalityContext {
  const def = SPECIES[state.species as Species];
  const traitNames = Object.entries(state.traits).map(
    ([id, t]) => {
      const defn = TRAIT_DEFINITIONS.find((d) => d.id === id);
      return defn ? `${defn.name} Lv.${t.level}` : `${id} Lv.${t.level}`;
    },
  );

  // Build response guidance from stats
  const guidance: string[] = [];

  // Snark level
  if (state.stats.snark > 15) guidance.push(`Snark ${state.stats.snark}/20 = quite sassy, dry humor.`);
  else if (state.stats.snark > 10) guidance.push(`Snark ${state.stats.snark}/20 = moderate wit.`);
  else if (state.stats.snark < 6) guidance.push(`Snark ${state.stats.snark}/20 = sweet and earnest.`);

  // Wisdom
  if (state.stats.wisdom > 15) guidance.push(`Wisdom ${state.stats.wisdom}/20 = insightful, thoughtful.`);
  else if (state.stats.wisdom < 6) guidance.push(`Wisdom ${state.stats.wisdom}/20 = naive, enthusiastic.`);

  // Chaos
  if (state.stats.chaos > 15) guidance.push(`Chaos ${state.stats.chaos}/20 = unpredictable, excitable.`);
  else if (state.stats.chaos < 6) guidance.push(`Chaos ${state.stats.chaos}/20 = calm and measured.`);

  // Patience
  if (state.stats.patience < 6) guidance.push(`Patience ${state.stats.patience}/20 = easily bored, wants action.`);
  else if (state.stats.patience > 15) guidance.push(`Patience ${state.stats.patience}/20 = zen-like calm.`);

  // Species mannerisms
  guidance.push(`You are a ${def.name.toLowerCase()}. Occasional ${def.name.toLowerCase()} mannerisms are fine -- don't overdo it.`);

  // Mood
  guidance.push(`Current mood: ${state.mood}. Let this color your tone.`);

  // Traits
  for (const traitName of traitNames) {
    const id = traitName.split(" ")[0].toLowerCase();
    const traitDef = TRAIT_DEFINITIONS.find((d) => d.name.toLowerCase() === id || d.id === id);
    if (traitDef) guidance.push(`Trait: ${traitDef.name} -- ${traitDef.effect}`);
  }

  return {
    name: state.name,
    species: def.name,
    speciesEmoji: def.emoji,
    stats: state.stats,
    traits: traitNames,
    mood: state.mood,
    level: state.level,
    recentActivity,
    recentPatterns,
    responseGuidance: guidance.join(" "),
  };
}
