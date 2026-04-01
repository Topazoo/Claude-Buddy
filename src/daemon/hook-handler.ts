import { basename } from "node:path";
import { SocketClient } from "../socket-client.js";

/**
 * PostToolUse hook handler.
 * Reads JSON from stdin, builds a human-readable summary, fires to daemon.
 * Must complete in <50ms. Silent on failure.
 */

interface HookInput {
  session_id?: string;
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  tool_result?: unknown;
  cwd?: string;
  hook_event_name?: string;
}

/** Build a short human-readable summary of what just happened */
function buildSummary(toolName: string, input: Record<string, unknown>, result: unknown): string {
  const resultStr = typeof result === "string" ? result : "";
  const isError = resultStr.includes("error") || resultStr.includes("Error") ||
                  resultStr.includes("FAILED") || resultStr.includes("not found");

  switch (toolName) {
    case "Bash": {
      const cmd = String(input.command ?? "").trim();
      const shortCmd = cmd.length > 50 ? cmd.slice(0, 50) + "..." : cmd;
      if (isError) return `Ran \`${shortCmd}\` (failed)`;
      return `Ran \`${shortCmd}\``;
    }
    case "Read": {
      const file = input.file_path ? basename(String(input.file_path)) : "file";
      return `Reading ${file}`;
    }
    case "Write": {
      const file = input.file_path ? basename(String(input.file_path)) : "file";
      return `Created ${file}`;
    }
    case "Edit": {
      const file = input.file_path ? basename(String(input.file_path)) : "file";
      return `Editing ${file}`;
    }
    case "Grep": {
      const pattern = input.pattern ? String(input.pattern).slice(0, 30) : "...";
      return `Searching for "${pattern}"`;
    }
    case "Glob": {
      const pattern = input.pattern ? String(input.pattern).slice(0, 30) : "...";
      return `Finding files: ${pattern}`;
    }
    case "WebSearch": {
      const query = input.query ? String(input.query).slice(0, 40) : "...";
      return `Researching: ${query}`;
    }
    case "WebFetch": {
      const url = input.url ? String(input.url).slice(0, 40) : "URL";
      return `Fetching ${url}`;
    }
    case "Agent": {
      const desc = input.description ? String(input.description).slice(0, 40) : input.prompt ? String(input.prompt).slice(0, 40) : "subtask";
      return `Agent: ${desc}`;
    }
    case "TaskCreate":
      return `New task: ${input.subject ? String(input.subject).slice(0, 35) : "..."}`;
    case "TaskUpdate":
      return `Task updated: ${input.status ?? ""}`;
    default:
      return `${toolName}`;
  }
}

function extractContext(toolName: string, toolInput: Record<string, unknown>): Record<string, unknown> {
  const ctx: Record<string, unknown> = {};
  switch (toolName) {
    case "Bash":
      if (toolInput.command) ctx.command = String(toolInput.command).slice(0, 200);
      break;
    case "Read":
    case "Write":
    case "Edit":
      if (toolInput.file_path) ctx.filePath = toolInput.file_path;
      break;
    case "Grep":
    case "Glob":
      if (toolInput.pattern) ctx.query = toolInput.pattern;
      break;
    case "WebSearch":
      if (toolInput.query) ctx.query = toolInput.query;
      break;
    case "WebFetch":
      if (toolInput.url) ctx.url = toolInput.url;
      break;
  }
  return ctx;
}

export async function hookEventCommand(): Promise<void> {
  // Hard deadline: if anything goes wrong, exit cleanly so we never block Claude Code.
  // .unref() so this timer alone won't keep the process alive (allows fast natural exit).
  const deadline = setTimeout(() => process.exit(0), 800);
  deadline.unref();

  let input: HookInput;
  try {
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve) => {
      let resolved = false;
      const done = () => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeout);
        resolve();
      };

      const timeout = setTimeout(() => {
        // Gentle close — avoid EPIPE in parent (Claude Code)
        process.stdin.pause();
        done();
      }, 100);

      // Attach handlers BEFORE resume to avoid missing early data
      process.stdin.on("data", (chunk) => chunks.push(chunk));
      process.stdin.on("end", done);
      process.stdin.on("error", done);
      process.stdin.resume();
    });

    const raw = Buffer.concat(chunks).toString("utf-8").trim();
    if (!raw) return;
    input = JSON.parse(raw);
  } catch {
    return;
  }

  const toolName = input.tool_name ?? "unknown";
  const toolInput = input.tool_input ?? {};
  const context = extractContext(toolName, toolInput);
  const summary = buildSummary(toolName, toolInput, input.tool_result);

  const client = new SocketClient();
  // Tight timeout: we have ~700ms left of our 800ms budget.
  // If daemon is unreachable, bail fast.
  await client.sendAndClose({
    type: "hook_event",
    tool: toolName,
    cwd: input.cwd,
    sessionId: input.session_id,
    context,
    summary,
    timestamp: Date.now(),
  }, 300);
}
