import { execSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import React from "react";
import { render } from "ink";
import { App } from "../renderer/App.js";
import { BUDDY_SOCKET_PATH } from "../utils.js";

function hasTmux(): boolean {
  try {
    execSync("which tmux", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function inTmux(): boolean {
  return !!process.env.TMUX;
}

function buddySessionExists(): boolean {
  try {
    execSync("tmux has-session -t buddy 2>/dev/null", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function killBuddySession(): void {
  try {
    execSync("tmux kill-session -t buddy 2>/dev/null", { stdio: "ignore" });
  } catch {}
}

function isDaemonRunning(): boolean {
  return existsSync(BUDDY_SOCKET_PATH);
}

function ensureDaemon(): void {
  if (isDaemonRunning()) return;
  const child = spawn("claude-buddy", ["daemon", "run"], {
    detached: true,
    stdio: "ignore",
  });
  child.unref();
}

export async function paneCommand(opts: { render?: boolean }): Promise<void> {
  if (opts.render) {
    const { waitUntilExit } = render(React.createElement(App));
    await waitUntilExit();
    return;
  }

  if (!hasTmux()) {
    console.log("\ntmux is not installed. The pane requires tmux.");
    console.log("Install it with:");
    console.log("  macOS:  brew install tmux");
    console.log("  Linux:  sudo apt install tmux");
    console.log("\nYou can still use claude-buddy without a pane:");
    console.log("  claude-buddy stats    # View stats");
    console.log("  claude-buddy daemon   # Manage daemon\n");
    return;
  }

  if (!isDaemonRunning()) {
    console.log("  Starting daemon...");
    ensureDaemon();
    // Poll for socket readiness instead of hard sleep
    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 200));
      if (isDaemonRunning()) break;
    }
  }

  const renderCmd = "claude-buddy pane --render";

  if (inTmux()) {
    execSync(`tmux split-window -d -h -l 35 '${renderCmd}'`, { stdio: "inherit" });
  } else {
    if (buddySessionExists()) killBuddySession();
    execSync(`tmux new-session -d -s buddy -x 120 -y 40`, { stdio: "ignore" });
    execSync(`tmux split-window -d -h -l 35 -t buddy '${renderCmd}'`, { stdio: "ignore" });
    execSync(`tmux attach -t buddy`, { stdio: "inherit" });
  }

  console.log("  Buddy pane opened.");
  console.log("  Interact via: claude-buddy feed | pet | stats");
}
