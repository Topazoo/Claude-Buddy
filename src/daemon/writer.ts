import { existsSync, mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { PetState } from "../pet/state.js";

/** Atomically write pet state to disk. */
export function writeState(dir: string, state: PetState): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const filePath = join(dir, "state.json");
  const tmpPath = join(dirname(filePath), `.tmp.${process.pid}.json`);
  writeFileSync(tmpPath, JSON.stringify(state, null, 2));
  renameSync(tmpPath, filePath);
}
