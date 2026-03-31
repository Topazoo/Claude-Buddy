import type { Species } from "./species.js";

// --- Stats ---

export interface Stats {
  debugging: number; // 1-20: excitement on bug fixes
  patience: number; // 1-20: tolerance for waits
  chaos: number; // 1-20: frequency of random comments
  wisdom: number; // 1-20: quality of observations
  snark: number; // 1-20: sass level
}

export function generateStats(random: () => number): Stats {
  const roll = () => Math.floor(random() * 20) + 1;
  return {
    debugging: roll(),
    patience: roll(),
    chaos: roll(),
    wisdom: roll(),
    snark: roll(),
  };
}

// --- Mood (derived from activity, no manual needs) ---

export type Mood =
  | "happy"
  | "excited"
  | "focused"
  | "confused"
  | "bored"
  | "sleepy";

export interface SessionActivity {
  lastEventTime: number | null;
  eventCount: number;
  recentErrorStreak: number;
  recentBurstDetected: boolean;
  sessionStartTime: number | null;
}

/**
 * Derive mood purely from coding activity.
 * No manual feeding required -- the pet's mood mirrors the session.
 */
export function deriveMood(activity: SessionActivity): Mood {
  const now = Date.now();
  const { lastEventTime, recentErrorStreak, recentBurstDetected } = activity;

  // No recent activity at all
  if (!lastEventTime || !activity.sessionStartTime) {
    return "sleepy";
  }

  const idleMinutes = (now - lastEventTime) / 60_000;

  // Long idle -> sleepy
  if (idleMinutes > 30) return "sleepy";

  // Medium idle -> bored
  if (idleMinutes > 10) return "bored";

  // Error streak -> confused
  if (recentErrorStreak >= 3) return "confused";

  // Rapid burst -> excited
  if (recentBurstDetected) return "excited";

  // Active with varied activity -> focused
  if (activity.eventCount > 5 && idleMinutes < 5) return "focused";

  return "happy";
}

// --- Activity Counters ---

export interface ActivityCounters {
  bashCalls: number;
  readCalls: number;
  writeCalls: number;
  editCalls: number;
  searchCalls: number;
  fetchCalls: number;
  errorCount: number;
  successCount: number;
  sessionsAfterMidnight: number;
  sessionsOver3Hours: number;
  rapidEditBursts: number;
  totalSessions: number;
  totalMinutesCoding: number;
}

export function emptyCounters(): ActivityCounters {
  return {
    bashCalls: 0,
    readCalls: 0,
    writeCalls: 0,
    editCalls: 0,
    searchCalls: 0,
    fetchCalls: 0,
    errorCount: 0,
    successCount: 0,
    sessionsAfterMidnight: 0,
    sessionsOver3Hours: 0,
    rapidEditBursts: 0,
    totalSessions: 0,
    totalMinutesCoding: 0,
  };
}

// --- Pet Level ---

export function computeLevel(counters: ActivityCounters, traitCount: number): number {
  const totalTools =
    counters.bashCalls +
    counters.readCalls +
    counters.writeCalls +
    counters.editCalls +
    counters.searchCalls +
    counters.fetchCalls;
  return Math.floor(Math.sqrt(totalTools / 100)) + traitCount + 1;
}

// --- Full Pet State ---

export interface PetState {
  version: number;
  species: Species;
  name: string;
  paletteId: number;
  level: number;
  stats: Stats;
  mood: Mood;
  traits: Record<string, { level: number; unlockedAt: string }>;
  activityCounters: ActivityCounters;
  hatchedAt: string;
  lastActivity: string | null;
  lastTick: string | null;
}
