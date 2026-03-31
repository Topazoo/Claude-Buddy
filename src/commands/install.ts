import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { createInterface } from "node:readline";
import { resolve } from "node:path";
import { CLAUDE_SETTINGS_PATH } from "../utils.js";

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function hasNodeVersion(): boolean {
  try {
    const version = execSync("node --version", { encoding: "utf-8" }).trim();
    const major = parseInt(version.replace("v", "").split(".")[0]);
    return major >= 20;
  } catch {
    return false;
  }
}

function hasClaude(): boolean {
  try {
    execSync("which claude", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function hasTmux(): boolean {
  try {
    execSync("which tmux", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolve the command to invoke claude-buddy.
 * If `claude-buddy` is on PATH (npm link), use that.
 * Otherwise fall back to npx tsx with absolute path.
 */
function resolveBuddyCommand(): { command: string; args: (cmd: string) => string[] } {
  try {
    const binPath = execSync("which claude-buddy", { encoding: "utf-8" }).trim();
    if (binPath) {
      return {
        command: "claude-buddy",
        args: (cmd: string) => [cmd],
      };
    }
  } catch {
    // Not on PATH
  }
  // Fallback: absolute path via tsx
  const buddyBin = resolve(process.argv[1]);
  return {
    command: "npx",
    args: (cmd: string) => ["tsx", buddyBin, cmd],
  };
}

/**
 * Register MCP server and PostToolUse hook in Claude Code settings.
 * Non-destructive: preserves existing settings.
 */
function registerClaudeIntegration(): void {
  let settings: Record<string, unknown> = {};
  if (existsSync(CLAUDE_SETTINGS_PATH)) {
    try {
      settings = JSON.parse(readFileSync(CLAUDE_SETTINGS_PATH, "utf-8"));
    } catch {
      console.log("  Warning: could not parse existing settings.json, creating fresh.");
    }
  }

  const buddy = resolveBuddyCommand();

  // Register MCP server
  const mcpServers = (settings.mcpServers ?? {}) as Record<string, unknown>;
  mcpServers["claude-buddy"] = {
    type: "stdio",
    command: buddy.command,
    args: buddy.args("mcp-serve"),
  };
  settings.mcpServers = mcpServers;

  // Register PostToolUse hook
  const hooks = (settings.hooks ?? {}) as Record<string, unknown>;
  const postToolUse = (hooks.PostToolUse ?? []) as Array<Record<string, unknown>>;

  // Remove any existing claude-buddy hooks before adding
  const filtered = postToolUse.filter((h) => {
    const hookList = h.hooks as Array<Record<string, string>> | undefined;
    return !hookList?.some((hh) => hh.command?.includes("claude-buddy"));
  });

  const hookCmd = buddy.command === "claude-buddy"
    ? "claude-buddy hook-event 2>/dev/null || true"
    : `npx tsx ${resolve(process.argv[1])} hook-event 2>/dev/null || true`;

  filtered.push({
    matcher: "*",
    hooks: [{
      type: "command",
      command: hookCmd,
    }],
  });
  hooks.PostToolUse = filtered;
  settings.hooks = hooks;

  writeFileSync(CLAUDE_SETTINGS_PATH, JSON.stringify(settings, null, 2));
}

export async function installCommand(opts: { yes?: boolean }): Promise<void> {
  console.log("\n  Checking environment...");

  // Preflight
  const nodeOk = hasNodeVersion();
  const claudeOk = hasClaude();
  const tmuxOk = hasTmux();

  console.log(`    ${nodeOk ? "\u2713" : "\u2717"} Node 20+ ${nodeOk ? "found" : "required"}`);
  console.log(`    ${claudeOk ? "\u2713" : "\u2717"} claude CLI ${claudeOk ? "found" : "not found"}`);
  console.log(`    ${tmuxOk ? "\u2713" : "-"} tmux ${tmuxOk ? "found" : "not found (pane optional)"}`);
  console.log("");

  if (!nodeOk) {
    console.log("  Node 20+ is required. Please upgrade Node.js.");
    return;
  }

  if (!claudeOk) {
    console.log("  Claude CLI not found. Install Claude Code first.");
    console.log("  Visit: https://claude.ai/code\n");
    return;
  }

  // Register Claude Code integration
  console.log("  Installing Claude Code integration...");
  registerClaudeIntegration();
  console.log("    \u2713 MCP server registered");
  console.log("    \u2713 PostToolUse hook registered");
  console.log("");

  // Check if we need to hatch
  const { loadGlobalState } = await import("../persistence.js");
  if (!loadGlobalState()) {
    console.log("  No buddy found -- let's hatch one!\n");
    const { hatchCommand } = await import("./hatch.js");
    await hatchCommand({ yes: opts.yes });
  } else {
    console.log("  Buddy already exists.\n");
  }

  console.log("  Installation complete!");
  console.log("  Your buddy is now integrated with Claude Code.");
  if (tmuxOk) {
    console.log("  Run `claude-buddy pane` to open the side pane.");
  }
  console.log("  Run `claude-buddy demo` to see a quick demo.\n");
}
