import { Command } from "commander";
import { hatchCommand } from "./commands/hatch.js";
import { statsCommand } from "./commands/stats.js";
import { daemonCommand } from "./commands/daemon-cmd.js";
import { hookEventCommand } from "./daemon/hook-handler.js";
import { paneCommand } from "./commands/pane.js";

const program = new Command();

program
  .name("claude-buddy")
  .description("Tamagotchi-style terminal companion for Claude Code")
  .version("0.1.0");

program
  .command("hatch")
  .description("Hatch a new buddy")
  .option("--yes", "Skip all prompts")
  .action(async (opts) => {
    await hatchCommand(opts);
  });

program
  .command("stats")
  .description("Show your buddy's stats")
  .action(() => {
    statsCommand();
  });

const daemon = program
  .command("daemon")
  .description("Manage the background daemon");

daemon
  .command("run")
  .description("Run daemon in foreground")
  .action(() => daemonCommand("run"));

daemon
  .command("start")
  .description("Start daemon in background")
  .action(() => daemonCommand("start"));

daemon
  .command("stop")
  .description("Stop the daemon")
  .action(() => daemonCommand("stop"));

daemon
  .command("status")
  .description("Check daemon status")
  .action(() => daemonCommand("status"));

daemon
  .command("logs")
  .description("Show recent daemon logs")
  .action(() => daemonCommand("logs"));

program
  .command("feed")
  .description("Feed your buddy")
  .action(async () => {
    const { feedCommand } = await import("./commands/feed.js");
    await feedCommand();
  });

program
  .command("pet")
  .description("Pet your buddy")
  .action(async () => {
    const { petCommand } = await import("./commands/feed.js");
    await petCommand();
  });

program
  .command("pane")
  .description("Open tmux side pane with buddy display")
  .option("--render", "Internal: render Ink app directly")
  .action(async (opts) => {
    await paneCommand(opts);
  });

program
  .command("demo")
  .description("Run a 30-second demo of your buddy")
  .action(async () => {
    const { demoCommand } = await import("./commands/demo.jsx");
    await demoCommand();
  });

program
  .command("install")
  .description("Install Claude Code integration (MCP + hook)")
  .option("--yes", "Skip all prompts")
  .action(async (opts) => {
    const { installCommand } = await import("./commands/install.js");
    await installCommand(opts);
  });

program
  .command("hook-event")
  .description("Internal: handle PostToolUse hook event")
  .action(async () => {
    await hookEventCommand();
  });

program
  .command("mcp-serve")
  .description("Internal: MCP server (spawned by Claude Code)")
  .action(async () => {
    const { runMcpServer } = await import("./daemon/mcp-server.js");
    await runMcpServer();
  });

// Default: show stats if buddy exists, otherwise prompt to hatch
program.action(async () => {
  const { loadGlobalState } = await import("./persistence.js");
  const state = loadGlobalState();
  if (state) {
    statsCommand();
  } else {
    console.log("\nNo buddy found! Let's hatch one.\n");
    await hatchCommand({});
  }
});

program.parse();
