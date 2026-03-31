import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { SocketClient } from "../socket-client.js";
import { loadGlobalState } from "../persistence.js";
import { buildPersonalityContext } from "../pet/personality.js";
import { SPECIES } from "../pet/species.js";
import type { Species } from "../pet/species.js";

/**
 * MCP server bridge for Claude Code integration.
 * Spawned by Claude Code as a stdio process.
 * Connects to the daemon's unix socket for live state.
 */
export async function runMcpServer(): Promise<void> {
  const server = new McpServer({
    name: "claude-buddy",
    version: "0.1.0",
  });

  // Try to connect to daemon for live data
  let daemonClient: SocketClient | null = null;
  let lastState: Record<string, unknown> | null = null;
  let lastPersonality: Record<string, unknown> | null = null;

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
    } catch {
      daemonClient = null;
      // Daemon not running -- fall back to disk state
    }
  }

  await connectToDaemon();

  // --- buddy_chat tool ---
  server.tool(
    "buddy_chat",
    `Retrieve your coding buddy's personality, mood, and recent observations so you can respond as the buddy. IMPORTANT: After calling this tool, your ENTIRE next message must be written in-character AS the buddy. You ARE the buddy for that one response. Rules: Do NOT say 'your buddy says' or 'here is what the buddy thinks'. Do NOT add any preamble or explanation. Just respond as the buddy would -- 1-2 short sentences, in their voice, using their personality traits. Call this tool when the user addresses their buddy, asks what their pet thinks, says 'hey buddy', or when you think a buddy reaction would be welcome.`,
    {
      message: z.string().describe("What the user said to the buddy, or a summary of what you want the buddy to react to"),
      context: z.string().optional().describe("Brief 1-2 sentence summary of what the user is currently working on"),
    },
    async ({ message, context }) => {
      // Request personality data from daemon
      if (daemonClient) {
        lastPersonality = null;
        daemonClient.send({ type: "get_personality" });
        // Wait briefly for response
        await new Promise((r) => setTimeout(r, 100));
      }

      // Build response from daemon data or disk fallback
      const state = loadGlobalState();
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

      if (lastPersonality) {
        const p = lastPersonality as Record<string, unknown>;
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

      const personality = buildPersonalityContext(state, recentActivity, recentPatterns);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(personality, null, 2),
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
      const state = loadGlobalState();
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
      const state = loadGlobalState();
      const name = state?.name ?? "your buddy";
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({ message: `${name} appreciates the snack!` }),
        }],
      };
    },
  );

  // Start stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // MCP server runs until Claude Code closes the connection
}
