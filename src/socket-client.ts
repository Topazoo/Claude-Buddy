import { createConnection, type Socket } from "node:net";
import { BUDDY_SOCKET_PATH } from "./utils.js";

export type ClientMessageHandler = (msg: Record<string, unknown>) => void;

/**
 * NDJSON client for connecting to the buddy daemon socket.
 * Used by hook-handler (fire-and-forget), CLI commands, MCP bridge, and pane renderer.
 */
export class SocketClient {
  private socket: Socket | null = null;
  private buffer = "";
  private handler: ClientMessageHandler | null = null;

  /** Connect to the daemon socket. */
  connect(onMessage?: ClientMessageHandler): Promise<void> {
    this.handler = onMessage ?? null;
    return new Promise((resolve, reject) => {
      this.socket = createConnection(BUDDY_SOCKET_PATH, () => {
        clearTimeout(deadline);
        resolve();
      });

      const deadline = setTimeout(() => {
        this.socket?.destroy();
        reject(new Error("Connection timeout"));
      }, 2000);

      this.socket.on("data", (chunk) => {
        if (!this.handler) return;
        this.buffer += chunk.toString();
        const lines = this.buffer.split("\n");
        this.buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            this.handler(JSON.parse(line));
          } catch {
            // Skip malformed
          }
        }
      });

      this.socket.on("error", (err) => {
        clearTimeout(deadline);
        reject(err);
      });
    });
  }

  /** Send a message to the daemon. */
  send(msg: Record<string, unknown>): void {
    try {
      if (this.socket && !this.socket.destroyed) {
        this.socket.write(JSON.stringify(msg) + "\n");
      }
    } catch {
      // Socket dead, ignore
    }
  }

  /** Send and immediately disconnect. For fire-and-forget (hook events).
   *  Returns true if sent successfully, false on timeout/error. */
  sendAndClose(msg: Record<string, unknown>, timeoutMs = 500): Promise<boolean> {
    return new Promise((resolve) => {
      let done = false;
      const finish = (ok: boolean) => {
        if (done) return;
        done = true;
        clearTimeout(deadline);
        resolve(ok);
      };

      const socket = createConnection(BUDDY_SOCKET_PATH, () => {
        socket.write(JSON.stringify(msg) + "\n", () => {
          socket.end();
          finish(true);
        });
      });
      const deadline = setTimeout(() => {
        socket.destroy();
        finish(false);
      }, timeoutMs);
      socket.on("error", () => {
        socket.destroy();
        finish(false);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.end();
      this.socket = null;
    }
  }
}
