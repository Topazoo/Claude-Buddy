import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { z } from "zod";
import { BUDDY_GLOBAL_DIR } from "./utils.js";
import type { PetState } from "./pet/state.js";

// --- Zod Schemas ---

const StatsSchema = z.object({
  debugging: z.number().min(1).max(20),
  patience: z.number().min(1).max(20),
  chaos: z.number().min(1).max(20),
  wisdom: z.number().min(1).max(20),
  snark: z.number().min(1).max(20),
});

const ActivityCountersSchema = z.object({
  bashCalls: z.number().default(0),
  readCalls: z.number().default(0),
  writeCalls: z.number().default(0),
  editCalls: z.number().default(0),
  searchCalls: z.number().default(0),
  fetchCalls: z.number().default(0),
  errorCount: z.number().default(0),
  successCount: z.number().default(0),
  sessionsAfterMidnight: z.number().default(0),
  sessionsOver3Hours: z.number().default(0),
  rapidEditBursts: z.number().default(0),
  totalSessions: z.number().default(0),
  totalMinutesCoding: z.number().default(0),
});

const TraitStateSchema = z.object({
  level: z.number().default(1),
  unlockedAt: z.string(),
});

export const PetStateSchema = z.object({
  version: z.number().default(1),
  species: z.string(),
  name: z.string(),
  paletteId: z.number().default(0),
  level: z.number().default(1),
  stats: StatsSchema,
  mood: z.string().default("happy"),
  traits: z.record(z.string(), TraitStateSchema).default({}),
  activityCounters: ActivityCountersSchema.default({
    bashCalls: 0, readCalls: 0, writeCalls: 0, editCalls: 0,
    searchCalls: 0, fetchCalls: 0, errorCount: 0, successCount: 0,
    sessionsAfterMidnight: 0, sessionsOver3Hours: 0, rapidEditBursts: 0,
    totalSessions: 0, totalMinutesCoding: 0,
  }),
  hatchedAt: z.string(),
  lastActivity: z.string().nullable().default(null),
  lastTick: z.string().nullable().default(null),
});

// --- Load / Save ---

function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/** Load pet state from a directory. Returns null if missing or corrupt. */
export function loadState(dir: string): PetState | null {
  const filePath = join(dir, "state.json");
  if (!existsSync(filePath)) return null;

  try {
    const raw = readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return PetStateSchema.parse(parsed) as PetState;
  } catch (err) {
    // Corruption recovery: back up and return null
    const backupPath = `${filePath}.corrupt.${Date.now()}`;
    try {
      copyFileSync(filePath, backupPath);
    } catch {
      // Can't back up, ignore
    }
    console.error(`State file corrupt (backed up to ${backupPath}): ${err}`);
    return null;
  }
}

/** Atomically write pet state to a directory. */
export function saveState(dir: string, state: PetState): void {
  ensureDir(dir);
  const filePath = join(dir, "state.json");
  const tmpPath = join(dirname(filePath), `.tmp.${process.pid}.json`);
  writeFileSync(tmpPath, JSON.stringify(state, null, 2));
  renameSync(tmpPath, filePath);
}

/** Load the global pet state. */
export function loadGlobalState(): PetState | null {
  return loadState(BUDDY_GLOBAL_DIR);
}

/** Save the global pet state. */
export function saveGlobalState(state: PetState): void {
  saveState(BUDDY_GLOBAL_DIR, state);
}
