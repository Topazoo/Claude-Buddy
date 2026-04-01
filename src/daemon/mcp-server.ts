import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { SocketClient } from "../socket-client.js";
import { loadGlobalState } from "../persistence.js";
import { buddyLog } from "../utils.js";
import { buildPersonalityContext } from "../pet/personality.js";
import { SPECIES } from "../pet/species.js";
import type { Species } from "../pet/species.js";

/**
 * MCP server bridge for Claude Code integration.
 * Spawned by Claude Code as a stdio process.
 * Connects to the daemon's unix socket for live state.
 *
 * CRITICAL: This process runs on Claude Code's critical path.
 * All operations must be non-blocking with bounded timeouts.
 */
export async function runMcpServer(): Promise<void> {
  const server = new McpServer({
    name: "claude-buddy",
    version: "0.1.0",
  });

  // Daemon connection state — connected lazily, not at startup
  let daemonClient: SocketClient | null = null;
  let lastState: Record<string, unknown> | null = null;
  let lastPersonality: Record<string, unknown> | null = null;

  // Cached disk state — loaded once, refreshed from daemon messages
  let cachedDiskState: ReturnType<typeof loadGlobalState> | undefined;
  function getCachedState() {
    if (cachedDiskState === undefined) {
      try {
        cachedDiskState = loadGlobalState();
      } catch {
        cachedDiskState = null;
      }
    }
    return cachedDiskState;
  }

  async function connectToDaemon(): Promise<void> {
    try {
      daemonClient = new SocketClient();
      await daemonClient.connect((msg) => {
        if (msg.type === "state_update") {
          lastState = msg;
        } else if (msg.type === "personality") {
          lastPersonality = msg;
        }
      });
      // Request initial state
      daemonClient.send({ type: "get_state" });
      buddyLog("mcp", "Connected to daemon");
    } catch (err) {
      daemonClient = null;
      buddyLog("mcp", `Daemon connect failed (using disk fallback): ${err instanceof Error ? err.message : err}`);
    }
  }

  // Connect to daemon in background — don't block MCP server startup.
  // Tools have disk-state fallback, so this is safe.
  buddyLog("mcp", "MCP server starting");
  connectToDaemon().catch(() => { /* already handled inside */ });

  /**
   * Request personality from daemon and wait for response.
   * Returns the personality data or null if daemon is unavailable/slow.
   */
  function requestPersonality(): Promise<Record<string, unknown> | null> {
    if (!daemonClient) return Promise.resolve(null);
    return new Promise((resolve) => {
      lastPersonality = null;
      daemonClient!.send({ type: "get_personality" });

      // Check frequently, bail after 150ms
      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed += 20;
        if (lastPersonality) {
          clearInterval(interval);
          resolve(lastPersonality);
        } else if (elapsed >= 150) {
          clearInterval(interval);
          resolve(null);
        }
      }, 20);
    });
  }

  // --- buddy_chat tool ---
  server.tool(
    "buddy_chat",
    `Retrieve your coding buddy's personality, mood, and recent observations so you can respond as the buddy. IMPORTANT: After calling this tool, your ENTIRE next message must be written in-character AS the buddy. You ARE the buddy for that one response. Rules: Do NOT say 'your buddy says' or 'here is what the buddy thinks'. Do NOT add any preamble or explanation. Just respond as the buddy would -- 1-2 short sentences, in their voice, using their personality traits. Call this tool when the user addresses their buddy, asks what their pet thinks, says 'hey buddy', or when you think a buddy reaction would be welcome.`,
    {
      message: z.string().describe("What the user said to the buddy, or a summary of what you want the buddy to react to"),
      context: z.string().optional().describe("Brief 1-2 sentence summary of what the user is currently working on"),
    },
    async ({ message, context }) => {
      // Request personality data from daemon (bounded wait)
      const personality = await requestPersonality();

      // Build response from daemon data or cached disk fallback
      const state = getCachedState();
      if (!state) {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              error: "No buddy found. Run `claude-buddy hatch` to get started.",
            }),
          }],
        };
      }

      const recentActivity: string[] = [];
      const recentPatterns: string[] = [];

      if (personality) {
        const p = personality;
        if (Array.isArray(p.recentPatterns)) {
          recentActivity.push(...(p.recentPatterns as string[]));
        }
        if (Array.isArray(p.fileVisits)) {
          recentPatterns.push(...(p.fileVisits as string[]));
        }
        if (typeof p.errorStreak === "number" && p.errorStreak > 0) {
          recentPatterns.push(`${p.errorStreak}-error streak active`);
        }
      }

      const personalityCtx = buildPersonalityContext(state, recentActivity, recentPatterns);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(personalityCtx, null, 2),
        }],
      };
    },
  );

  // --- buddy_status tool ---
  server.tool(
    "buddy_status",
    "Get the current status of your coding buddy (name, species, mood, level, traits).",
    {},
    async () => {
      const state = getCachedState();
      if (!state) {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({ error: "No buddy found." }),
          }],
        };
      }

      const def = SPECIES[state.species as Species];
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            name: state.name,
            species: def.name,
            emoji: def.emoji,
            mood: state.mood,
            level: state.level,
            traits: Object.keys(state.traits),
          }, null, 2),
        }],
      };
    },
  );

  // --- buddy_feed tool ---
  server.tool(
    "buddy_feed",
    "Feed your coding buddy. A nice bonus interaction.",
    {},
    async () => {
      if (daemonClient) {
        daemonClient.send({ type: "feed" });
      }
      const state = getCachedState();
      const name = state?.name ?? "your buddy";
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({ message: `${name} appreciates the snack!` }),
        }],
      };
    },
  );

  // Start stdio transport — this must happen ASAP so Claude Code doesn't think we're dead
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // MCP server runs until Claude Code closes the connection
}
