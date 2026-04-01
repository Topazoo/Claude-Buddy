import { appendFileSync, existsSync, mkdirSync, openSync, closeSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// --- Seeded PRNG (mulberry32) ---

export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Hash (djb2) ---

export function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return hash >>> 0; // ensure unsigned
}

// --- Weighted random selection ---

export function weightedPick<T>(
  items: T[],
  weights: number[],
  random: () => number,
): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

// --- Path helpers ---

/** Claude Code's project path slug encoding: /Users/peter/repos/buddy -> -Users-peter-repos-buddy */
export function pathToSlug(absolutePath: string): string {
  return absolutePath.replace(/\//g, "-");
}

/** Reverse: -Users-peter-repos-buddy -> /Users/peter/repos/buddy */
export function slugToPath(slug: string): string {
  // Leading dash represents the root /
  return slug.replace(/-/g, "/");
}

// --- Standard paths ---

export const BUDDY_HOME = join(homedir(), ".claude-buddy");
export const BUDDY_GLOBAL_DIR = join(BUDDY_HOME, "global");
export const BUDDY_PROJECTS_DIR = join(BUDDY_HOME, "projects");
export const BUDDY_CONFIG_PATH = join(BUDDY_HOME, "config.json");
export const BUDDY_SOCKET_PATH = join(BUDDY_HOME, "buddy.sock");
export const BUDDY_LOG_PATH = join(BUDDY_HOME, "daemon.log");

export const CLAUDE_HOME = join(homedir(), ".claude");
export const CLAUDE_PROJECTS_DIR = join(CLAUDE_HOME, "projects");
export const CLAUDE_SETTINGS_PATH = join(CLAUDE_HOME, "settings.json");

// --- Logging ---

/** Append a timestamped log line to ~/.claude-buddy/daemon.log. Never throws.
 *  Log file is created with 0o600 permissions (owner-only). */
export function buddyLog(component: string, msg: string): void {
  try {
    mkdirSync(BUDDY_HOME, { recursive: true, mode: 0o700 });
    // Create file with restrictive permissions if it doesn't exist
    if (!existsSync(BUDDY_LOG_PATH)) {
      const fd = openSync(BUDDY_LOG_PATH, "a", 0o600);
      closeSync(fd);
    }
    const ts = new Date().toISOString();
    appendFileSync(BUDDY_LOG_PATH, `[${ts}] [${component}] ${msg}\n`);
  } catch {
    // Logging must never cause a failure
  }
}
