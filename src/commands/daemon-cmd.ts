import { execSync, spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { BUDDY_SOCKET_PATH, BUDDY_LOG_PATH } from "../utils.js";

function isDaemonRunning(): boolean {
  return existsSync(BUDDY_SOCKET_PATH);
}

export async function daemonCommand(subcommand: string): Promise<void> {
  switch (subcommand) {
    case "run": {
      // Foreground mode (used by launchd/systemd or for dev)
      const { runDaemon } = await import("../daemon/main.js");
      await runDaemon();
      break;
    }

    case "start": {
      if (isDaemonRunning()) {
        console.log("Daemon is already running.");
        return;
      }
      // Start daemon as a detached background process
      const child = spawn(process.execPath, [
        "--import", "tsx",
        new URL("../daemon/main.js", import.meta.url).pathname.replace(/\.js$/, ".ts"),
      ], {
        detached: true,
        stdio: "ignore",
        env: { ...process.env },
      });
      child.unref();
      console.log(`Daemon started (pid: ${child.pid}).`);
      break;
    }

    case "stop": {
      if (!isDaemonRunning()) {
        console.log("Daemon is not running.");
        return;
      }
      // Find and kill the daemon process by socket
      try {
        execSync("pkill -f 'claude-buddy.*daemon run'", { stdio: "ignore" });
        console.log("Daemon stopped.");
      } catch {
        console.log("Could not stop daemon. It may have already exited.");
      }
      break;
    }

    case "status": {
      if (isDaemonRunning()) {
        console.log("Daemon is running.");
        console.log(`  Socket: ${BUDDY_SOCKET_PATH}`);
      } else {
        console.log("Daemon is not running.");
      }
      break;
    }

    case "logs": {
      if (existsSync(BUDDY_LOG_PATH)) {
        const logs = readFileSync(BUDDY_LOG_PATH, "utf-8");
        const lines = logs.split("\n").slice(-50);
        console.log(lines.join("\n"));
      } else {
        console.log("No logs found.");
      }
      break;
    }

    default:
      console.log("Usage: claude-buddy daemon <run|start|stop|status|logs>");
  }
}
