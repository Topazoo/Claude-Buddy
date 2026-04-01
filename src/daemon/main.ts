import { existsSync, mkdirSync } from "node:fs";
import type { Socket } from "node:net";
import { basename } from "node:path";
import { BUDDY_HOME, BUDDY_GLOBAL_DIR, CLAUDE_HOME } from "../utils.js";
import { loadGlobalState, saveGlobalState } from "../persistence.js";
import type { PetState } from "../pet/state.js";
import type { SessionActivity } from "../pet/state.js";
import { SocketServer } from "./socket-server.js";
import { createSessionContext, processEvent, type SessionContext } from "./pattern-tracker.js";
import { selectReaction } from "./reactions.js";
import { tick } from "./ticker.js";
import { writeState } from "./writer.js";
import { mulberry32 } from "../utils.js";
import type { Stats } from "../pet/state.js";

// --- Personality-flavored narration ---

const NARRATION: Record<string, { default: string[]; snark: string[]; wisdom: string[]; chaos: string[] }> = {
  Read:      { default: ["Peeking at {x}", "Looking at {x}"], snark: ["Snooping around {x}", "Oh, reading {x} now?"], wisdom: ["Studying {x}", "Examining {x}"], chaos: ["READING {x}!", "Ooh what's in {x}?!"] },
  Edit:      { default: ["Tweaking {x}", "Updating {x}"], snark: ["Back in {x}, huh?", "Fiddling with {x} again"], wisdom: ["Refining {x}", "Improving {x}"], chaos: ["CHANGING {x}!", "Hacking on {x}!"] },
  Write:     { default: ["Creating {x}!", "New file: {x}"], snark: ["Another file? {x}", "Spawning {x}"], wisdom: ["Building {x}", "Laying foundations in {x}"], chaos: ["NEW FILE {x}!!", "MAKING {x}!"] },
  Bash:      { default: ["Running a command...", "Shell time!"], snark: ["Fingers crossed...", "Let's see if this works"], wisdom: ["Executing carefully...", "Testing something..."], chaos: ["SHELL GO BRRRR!", "RUNNING STUFF!"] },
  Grep:      { default: ["Hunting for {x}", "Searching: {x}"], snark: ["Where is that {x}...", "Trying to find {x}"], wisdom: ["Tracing {x}", "Investigating {x}"], chaos: ["FINDING {x}!!", "SEEK {x}!"] },
  Glob:      { default: ["Finding files...", "Looking around"], snark: ["Where'd I put that?", "Digging through files"], wisdom: ["Mapping the codebase", "Surveying files"], chaos: ["ALL THE FILES!", "SCANNING!"] },
  WebSearch: { default: ["Researching...", "Looking it up"], snark: ["Off to Google...", "Let's ask the internet"], wisdom: ["Gathering knowledge...", "Smart -- researching first"], chaos: ["TO THE WEB!", "INTERNET TIME!"] },
  WebFetch:  { default: ["Fetching a page", "Loading URL"], snark: ["Downloading wisdom...", "Reading the internet"], wisdom: ["Pulling in docs", "External reference"], chaos: ["DOWNLOADING!", "FETCH!"] },
  Agent:     { default: ["Deploying a helper!", "Subagent launched"], snark: ["Getting backup...", "Can't do it alone huh?"], wisdom: ["Delegating wisely", "Parallelizing work"], chaos: ["AGENTS ASSEMBLE!", "MORE AGENTS!"] },
};

function narrateSummary(summary: string, tool: string, stats: Stats, random: () => number): string {
  const templates = NARRATION[tool];
  if (!templates) return summary;

  // Pick personality bucket based on highest stat
  let bucket: string[] = templates.default;
  if (stats.snark > 14 && random() > 0.3) bucket = templates.snark;
  else if (stats.wisdom > 14 && random() > 0.3) bucket = templates.wisdom;
  else if (stats.chaos > 14 && random() > 0.3) bucket = templates.chaos;

  const template = bucket[Math.floor(random() * bucket.length)];

  // Extract the key detail from the summary for {x} substitution
  const detail = summary.replace(/^(Reading|Editing|Created|Ran|Searching for|Finding files:|Researching:|Fetching|Agent:)\s*/i, "").replace(/["`]/g, "").slice(0, 20);

  return template.replace("{x}", detail || "...");
}

function log(msg: string): void {
  const ts = new Date().toISOString();
  console.error(`[${ts}] ${msg}`);
}

/**
 * Map tool name to the activity counter key to increment.
 */
function toolToCounter(tool: string): keyof PetState["activityCounters"] | null {
  const map: Record<string, keyof PetState["activityCounters"]> = {
    Bash: "bashCalls",
    Read: "readCalls",
    Write: "writeCalls",
    Edit: "editCalls",
    Grep: "searchCalls",
    Glob: "searchCalls",
    WebSearch: "searchCalls",
    WebFetch: "fetchCalls",
  };
  return map[tool] ?? null;
}

export async function runDaemon(): Promise<void> {
  log("Starting claude-buddy daemon...");

  // Preflight: check ~/.claude/ exists
  if (!existsSync(CLAUDE_HOME)) {
    log(`Claude home not found at ${CLAUDE_HOME}. Is Claude Code installed?`);
    log("Daemon will start anyway (hook events may not arrive until Claude Code runs).");
  }

  // Ensure data directories
  mkdirSync(BUDDY_HOME, { recursive: true });
  mkdirSync(BUDDY_GLOBAL_DIR, { recursive: true });

  // Load state
  let state = loadGlobalState();
  if (!state) {
    log("No global pet found. Daemon running but idle -- hatch a pet first.");
  }

  // Session context for pattern tracking
  let session = createSessionContext();
  let reactionRng = mulberry32(Date.now());

  // Session activity for mood derivation
  const activity: SessionActivity = {
    lastEventTime: null,
    eventCount: 0,
    recentErrorStreak: 0,
    recentBurstDetected: false,
    sessionStartTime: null,
  };

  // Socket server
  const server = new SocketServer((msg: Record<string, unknown>, client: Socket) => {
    const type = msg.type as string;

    if (type === "hook_event") {
      if (!state) {
        state = loadGlobalState();
        if (!state) return;
      }

      const tool = (msg.tool as string) ?? "unknown";
      const context = (msg.context as Record<string, unknown>) ?? {};
      const timestamp = (msg.timestamp as number) ?? Date.now();
      const isError = tool === "Bash" && context.command && String(context.command).includes("error");

      // Update activity counters
      const counterKey = toolToCounter(tool);
      if (counterKey) {
        (state.activityCounters[counterKey] as number)++;
      }
      state.lastActivity = new Date().toISOString();

      // Update session activity for mood
      activity.lastEventTime = timestamp;
      activity.eventCount++;
      if (!activity.sessionStartTime) activity.sessionStartTime = timestamp;

      // Process through pattern tracker
      const fileContext: Record<string, string | number> = {};
      if (context.filePath) fileContext.file = basename(context.filePath as string);
      if (context.command) fileContext.command = String(context.command).slice(0, 40);
      if (context.query) fileContext.query = String(context.query);

      const patterns = processEvent(session, {
        tool,
        context: context as { filePath?: string; command?: string; query?: string },
        timestamp,
        isError: !!isError,
      });

      // Update error streak in activity
      activity.recentErrorStreak = session.errorStreak;
      activity.recentBurstDetected = session.recentBurstDetected;

      // Build summary from hook data (human-readable narration)
      const summary = (msg.summary as string) ??
        (context.filePath ? `${tool}: ${basename(context.filePath as string)}` :
         context.command ? `Ran: ${String(context.command).slice(0, 30)}` :
         context.query ? `Search: ${String(context.query).slice(0, 30)}` :
         tool);

      // Check for notable patterns -- these get personality-flavored reactions
      const reaction = selectReaction({
        tool,
        isError: !!isError,
        context: fileContext,
        patterns,
        stats: state.stats,
        random: reactionRng,
      });

      // Speech bubble: pattern reaction if notable, personality narration otherwise
      const speechText = reaction ? reaction.text : narrateSummary(summary, tool, state.stats, reactionRng);
      const animation = reaction
        ? reaction.animation
        : (isError ? "startled" : tool === "WebSearch" ? "thinking" : tool === "Agent" ? "excited" : "idle");

      server.broadcast({
        type: "reaction",
        pet: state.name,
        text: speechText,
        animation,
      });

      // Also broadcast for the recent feed
      server.broadcast({
        type: "tool_event",
        tool,
        summary,
        timestamp,
      });

      // Broadcast state update
      server.broadcast({ type: "state_update", state });

    } else if (type === "get_state") {
      if (state) {
        server.send(client, { type: "state_update", state });
      }

    } else if (type === "get_personality") {
      if (state) {
        // For MCP buddy_chat: return personality context
        server.send(client, {
          type: "personality",
          name: state.name,
          species: state.species,
          stats: state.stats,
          traits: Object.entries(state.traits).map(([id, t]) => `${id} Lv.${t.level}`),
          mood: state.mood,
          level: state.level,
          recentPatterns: session.recentTools.slice(-5).map((t) => {
            const file = t.file ? ` ${basename(t.file)}` : "";
            return `${t.tool}${file}`;
          }),
          fileVisits: Array.from(session.fileVisits.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([f, n]) => `${basename(f)} (${n}x)`),
          errorStreak: session.errorStreak,
        });
      }

    } else if (type === "feed") {
      if (state) {
        server.broadcast({
          type: "reaction",
          pet: state.name,
          text: "Yum! Thanks!",
          animation: "eating",
        });
        server.broadcast({
          type: "tool_event",
          tool: "Feed",
          summary: "Fed your buddy!",
          timestamp: Date.now(),
        });
      }

    } else if (type === "pet_interact") {
      if (state) {
        server.broadcast({
          type: "reaction",
          pet: state.name,
          text: "That feels nice!",
          animation: "excited",
        });
        server.broadcast({
          type: "tool_event",
          tool: "Pet",
          summary: "Petted your buddy!",
          timestamp: Date.now(),
        });
      }
    }
  });

  await server.start();
  log(`Socket server listening at ${BUDDY_HOME}/buddy.sock`);

  // Tick loop: 60s
  const tickInterval = setInterval(() => {
    if (!state) {
      state = loadGlobalState();
      return;
    }

    const result = tick(state, activity);

    for (const unlock of result.traitUnlocks) {
      server.broadcast({
        type: "trait_unlock",
        trait: unlock.traitName,
        level: 1,
        pet: state.name,
      });
      log(`Trait unlocked: ${unlock.traitName}`);
    }

    if (result.stateChanged) {
      writeState(BUDDY_GLOBAL_DIR, state);
    }
  }, 60_000);

  // Graceful shutdown
  const shutdown = async () => {
    log("Shutting down...");
    clearInterval(tickInterval);
    if (state) {
      writeState(BUDDY_GLOBAL_DIR, state);
      log("State saved.");
    }
    await server.stop();
    log("Daemon stopped.");
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  log("Daemon running. Press Ctrl+C to stop.");
}
