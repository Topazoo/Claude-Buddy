import { hostname, userInfo } from "node:os";
import { createInterface } from "node:readline";
import { djb2, mulberry32, weightedPick } from "../utils.js";
import { ALL_SPECIES, SPECIES, SPECIES_WEIGHTS, RARITY_LABEL } from "../pet/species.js";
import type { Species } from "../pet/species.js";
import { generateStats, emptyCounters, computeLevel } from "../pet/state.js";
import type { PetState } from "../pet/state.js";
import { generateName } from "../pet/names.js";
import { loadGlobalState, saveGlobalState } from "../persistence.js";
import { getFrame } from "../pet/sprites.js";
import { pickPalette, getPalette } from "../pet/palettes.js";
import { renderFrameAnsi } from "../pet/sprite-render.js";

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function renderSprite(species: Species, state: string, palette: import("../pet/palettes.js").PetPalette): void {
  const f = getFrame(species, state, 0);
  const rendered = renderFrameAnsi(f.chars, f.tokens, palette);
  for (const line of rendered.split("\n")) {
    console.log(`  ${line}`);
  }
}

export async function hatchCommand(opts: { yes?: boolean; seed?: string }): Promise<void> {
  const existing = loadGlobalState();
  if (existing) {
    console.log(`\nYou already have a buddy: ${existing.name} the ${SPECIES[existing.species].name}`);
    const answer = opts.yes ? "y" : await prompt("Re-hatch? This replaces your current pet. (y/N) ");
    if (answer.toLowerCase() !== "y") {
      console.log("Keeping your current buddy.");
      console.log('Tip: Use --seed <word> to reroll a different species (e.g. claude-buddy hatch --seed lucky)');
      return;
    }
    console.log(`\nFarewell, ${existing.name}...\n`);
  }

  // Seed from username + hostname, mixed with optional user seed for rerolling
  const baseSeed = userInfo().username + hostname();
  const seed = djb2(opts.seed ? baseSeed + ":" + opts.seed : baseSeed);
  const random = mulberry32(seed);

  if (opts.seed) {
    console.log(`\n  Hatching your buddy with seed "${opts.seed}"...\n`);
  } else {
    console.log("\n  Hatching your buddy...\n");
  }
  await sleep(800);

  // Roll species with dramatic reveal
  const species = weightedPick(ALL_SPECIES, SPECIES_WEIGHTS, random);
  const def = SPECIES[species];
  const rarity = RARITY_LABEL[def.rarity];

  // Pick color palette
  const { id: paletteId, palette } = pickPalette(species, random);

  console.log(`  ✦ A wild ${def.emoji} appears!`);
  await sleep(500);
  console.log(`  Species: ${def.name} (${rarity}) · ${palette.name}\n`);
  await sleep(300);

  renderSprite(species, "excited", palette);

  // Generate stats
  const stats = generateStats(random);
  console.log(`\n  Stats:`);
  console.log(`    Debugging ${formatBar(stats.debugging)}  ${stats.debugging}/20`);
  console.log(`    Patience  ${formatBar(stats.patience)}  ${stats.patience}/20`);
  console.log(`    Chaos     ${formatBar(stats.chaos)}  ${stats.chaos}/20`);
  console.log(`    Wisdom    ${formatBar(stats.wisdom)}  ${stats.wisdom}/20`);
  console.log(`    Snark     ${formatBar(stats.snark)}  ${stats.snark}/20`);

  // Name
  const defaultName = generateName(species, random);
  let name: string;
  if (opts.yes) {
    name = defaultName;
  } else {
    console.log("");
    const input = await prompt(`  Name your buddy (enter for "${defaultName}"): `);
    name = input || defaultName;
  }

  const counters = emptyCounters();
  const state: PetState = {
    version: 1,
    species,
    name,
    paletteId,
    level: computeLevel(counters, 0),
    stats,
    mood: "happy",
    traits: {},
    activityCounters: counters,
    hatchedAt: new Date().toISOString(),
    lastActivity: null,
    lastTick: null,
  };

  saveGlobalState(state);

  console.log(`\n  Welcome, ${name}! 🎉`);
  console.log(`  Your ${def.name} buddy is ready.\n`);
}

function formatBar(value: number, max = 20, width = 10): string {
  const filled = Math.round((value / max) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}
