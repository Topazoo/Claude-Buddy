import { loadGlobalState } from "../persistence.js";
import { SPECIES, RARITY_LABEL } from "../pet/species.js";
import type { Species } from "../pet/species.js";
import { computeLevel } from "../pet/state.js";
import { getFrame } from "../pet/sprites.js";
import { getPalette } from "../pet/palettes.js";
import { renderFrameAnsi } from "../pet/sprite-render.js";

function formatBar(value: number, max: number, width = 10): string {
  const filled = Math.round((value / max) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function timeSince(isoDate: string): string {
  const ms = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function statsCommand(): void {
  const state = loadGlobalState();
  if (!state) {
    console.log("\nNo buddy found. Run `claude-buddy hatch` to get started.\n");
    return;
  }

  const species = state.species as Species;
  const def = SPECIES[species];
  const palette = getPalette(species, state.paletteId ?? 0);
  const rarity = RARITY_LABEL[def.rarity];
  const level = computeLevel(state.activityCounters, Object.keys(state.traits).length);

  // Header
  console.log("");
  console.log(`  \x1b[1m${state.name}\x1b[0m ${def.emoji} Lv.${level}`);
  console.log(`  ${def.name} (${rarity}) · ${palette.name} · Mood: ${state.mood}`);
  console.log("");

  // Sprite
  const f = getFrame(species, state.mood, 0, level);
  const rendered = renderFrameAnsi(f.chars, f.tokens, palette);
  for (const line of rendered.split("\n")) {
    console.log(`  ${line}`);
  }
  console.log("");

  // Stats
  console.log("  Stats:");
  console.log(`    Debugging ${formatBar(state.stats.debugging, 20)} ${state.stats.debugging}/20`);
  console.log(`    Patience  ${formatBar(state.stats.patience, 20)} ${state.stats.patience}/20`);
  console.log(`    Chaos     ${formatBar(state.stats.chaos, 20)} ${state.stats.chaos}/20`);
  console.log(`    Wisdom    ${formatBar(state.stats.wisdom, 20)} ${state.stats.wisdom}/20`);
  console.log(`    Snark     ${formatBar(state.stats.snark, 20)} ${state.stats.snark}/20`);
  console.log("");

  // Traits
  const traitEntries = Object.entries(state.traits);
  if (traitEntries.length > 0) {
    console.log("  Traits:");
    for (const [name, trait] of traitEntries) {
      console.log(`    ${name} Lv.${trait.level}`);
    }
    console.log("");
  }

  // Activity
  const c = state.activityCounters;
  const totalTools = c.bashCalls + c.readCalls + c.writeCalls + c.editCalls + c.searchCalls + c.fetchCalls;
  if (totalTools > 0) {
    console.log("  Activity:");
    console.log(`    Total tool calls: ${totalTools}`);
    if (c.bashCalls > 0) console.log(`    Bash: ${c.bashCalls}`);
    if (c.readCalls > 0) console.log(`    Read: ${c.readCalls}`);
    if (c.writeCalls > 0) console.log(`    Write: ${c.writeCalls}`);
    if (c.editCalls > 0) console.log(`    Edit: ${c.editCalls}`);
    if (c.searchCalls > 0) console.log(`    Search: ${c.searchCalls}`);
    if (c.fetchCalls > 0) console.log(`    Fetch: ${c.fetchCalls}`);
    if (c.errorCount > 0) console.log(`    Errors: ${c.errorCount}`);
    console.log(`    Sessions: ${c.totalSessions}`);
    console.log("");
  }

  // Meta
  console.log(`  Hatched: ${timeSince(state.hatchedAt)}`);
  if (state.lastActivity) {
    console.log(`  Last active: ${timeSince(state.lastActivity)}`);
  }
  console.log("");
}
