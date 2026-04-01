import { basename, dirname } from "node:path";

export interface SessionContext {
  fileVisits: Map<string, number>;
  recentTools: Array<{ tool: string; file?: string; ts: number }>;
  errorStreak: number;
  lastErrorFile?: string;
  sessionStart: number;
  uniqueFilesWindow: Set<string>;
  windowStart: number;
  visitedDirs: Set<string>;
  lastEventTime: number;
  eventCount: number;
  recentBurstDetected: boolean;
}

export interface DetectedPattern {
  id: string;
  message: string;
  slots: Record<string, string | number>;
}

export function createSessionContext(): SessionContext {
  const now = Date.now();
  return {
    fileVisits: new Map(),
    recentTools: [],
    errorStreak: 0,
    sessionStart: now,
    uniqueFilesWindow: new Set(),
    windowStart: now,
    visitedDirs: new Set(),
    lastEventTime: now,
    eventCount: 0,
    recentBurstDetected: false,
  };
}

interface HookEvent {
  tool: string;
  context?: {
    filePath?: string;
    command?: string;
    query?: string;
    errorSnippet?: string;
  };
  timestamp: number;
  isError?: boolean;
}

/**
 * Process an event and detect notable patterns.
 * Returns detected patterns (if any) for the reaction engine.
 */
export function processEvent(ctx: SessionContext, event: HookEvent): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  const now = event.timestamp;
  const file = event.context?.filePath;

  ctx.eventCount++;
  ctx.lastEventTime = now;

  // Track tool usage
  ctx.recentTools.push({ tool: event.tool, file, ts: now });
  if (ctx.recentTools.length > 50) ctx.recentTools.shift();

  // --- File tracking ---
  if (file) {
    const count = (ctx.fileVisits.get(file) ?? 0) + 1;
    ctx.fileVisits.set(file, count);

    // Cap fileVisits to prevent unbounded memory growth in long sessions
    if (ctx.fileVisits.size > 200) {
      // Evict least-visited entries
      const entries = [...ctx.fileVisits.entries()].sort((a, b) => a[1] - b[1]);
      for (let i = 0; i < 50; i++) {
        ctx.fileVisits.delete(entries[i][0]);
      }
    }

    // File revisit (5+ times)
    if (count === 5 || count === 10 || count === 20) {
      patterns.push({
        id: "file_revisit",
        message: "Back to {file} again -- that's {n} times now",
        slots: { file: basename(file), n: count },
      });
    }

    // New directory
    const dir = dirname(file);
    if (!ctx.visitedDirs.has(dir)) {
      ctx.visitedDirs.add(dir);
      if (ctx.visitedDirs.size > 3) {
        patterns.push({
          id: "new_territory",
          message: "Venturing into {dir}/",
          slots: { dir: basename(dir) },
        });
      }
    }

    // Context switching: 6+ unique files in 5 min window
    ctx.uniqueFilesWindow.add(file);
    if (now - ctx.windowStart > 5 * 60_000) {
      ctx.uniqueFilesWindow = new Set([file]);
      ctx.windowStart = now;
    }
    if (ctx.uniqueFilesWindow.size === 6) {
      patterns.push({
        id: "context_switching",
        message: "Jumping around a lot -- exploring?",
        slots: {},
      });
    }
  }

  // --- Error tracking ---
  if (event.isError) {
    ctx.errorStreak++;
    ctx.lastErrorFile = file;
    if (ctx.errorStreak === 3) {
      patterns.push({
        id: "error_streak_3",
        message: "That's 3 in a row{on_file}...",
        slots: { on_file: file ? ` on ${basename(file)}` : "" },
      });
    } else if (ctx.errorStreak === 5) {
      patterns.push({
        id: "error_streak_5",
        message: "5 errors in a row. Take a breath.",
        slots: {},
      });
    } else if (ctx.errorStreak === 10) {
      patterns.push({
        id: "error_streak_10",
        message: "10 in a row... maybe step back and rethink?",
        slots: {},
      });
    }
  } else if (ctx.errorStreak >= 3) {
    // Streak broken!
    patterns.push({
      id: "error_streak_broken",
      message: "You got it! That was {n} errors deep.",
      slots: { n: ctx.errorStreak },
    });
    ctx.errorStreak = 0;
  } else {
    ctx.errorStreak = 0;
  }

  // --- Rapid burst detection ---
  const recentWindow = ctx.recentTools.filter((t) => now - t.ts < 2 * 60_000);
  if (recentWindow.length >= 10 && !ctx.recentBurstDetected) {
    ctx.recentBurstDetected = true;
    patterns.push({
      id: "rapid_burst",
      message: "You're on fire!",
      slots: {},
    });
  }
  // Reset burst flag if activity slows
  if (recentWindow.length < 5) {
    ctx.recentBurstDetected = false;
  }

  // --- Session milestone ---
  const sessionMinutes = Math.floor((now - ctx.sessionStart) / 60_000);
  if (sessionMinutes > 0 && sessionMinutes % 60 === 0 && ctx.eventCount > 1) {
    const hours = sessionMinutes / 60;
    patterns.push({
      id: "session_milestone",
      message: "You've been at it for {n} hour{s}",
      slots: { n: hours, s: hours > 1 ? "s" : "" },
    });
  }

  // --- Return from idle ---
  if (ctx.recentTools.length >= 2) {
    const prev = ctx.recentTools[ctx.recentTools.length - 2];
    const gap = now - prev.ts;
    if (gap > 10 * 60_000) {
      patterns.push({
        id: "return_from_idle",
        message: "Oh, you're back!",
        slots: {},
      });
    }
  }

  // --- Repeated command ---
  if (event.tool === "Bash" && event.context?.command) {
    const cmd = event.context.command;
    const recent5min = ctx.recentTools.filter(
      (t) => t.tool === "Bash" && now - t.ts < 5 * 60_000,
    );
    // Count how many times this exact command appeared (simplified: check tool entries)
    // We track by file field which we reuse for command storage
    const sameCmd = recent5min.filter((t) => t.file === cmd);
    if (sameCmd.length === 3) {
      const shortCmd = cmd.length > 30 ? cmd.slice(0, 30) + "..." : cmd;
      patterns.push({
        id: "repeated_command",
        message: "Running `{cmd}` again?",
        slots: { cmd: shortCmd },
      });
    }
  }

  return patterns;
}
