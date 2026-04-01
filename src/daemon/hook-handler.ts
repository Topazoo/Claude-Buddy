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
  const deadline = setTimeout(() => process.exit(0), 1000);
  deadline.unref();

  let input: HookInput;
  try {
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        process.stdin.destroy();
        resolve();
      }, 40);

      process.stdin.on("data", (chunk) => chunks.push(chunk));
      process.stdin.on("end", () => { clearTimeout(timeout); resolve(); });
      process.stdin.on("error", () => { clearTimeout(timeout); resolve(); });
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
  await client.sendAndClose({
    type: "hook_event",
    tool: toolName,
    cwd: input.cwd,
    sessionId: input.session_id,
    context,
    summary,
    timestamp: Date.now(),
  });
}
