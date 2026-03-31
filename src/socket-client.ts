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
      this.socket = createConnection(BUDDY_SOCKET_PATH, () => resolve());

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

      this.socket.on("error", reject);
    });
  }

  /** Send a message to the daemon. */
  send(msg: Record<string, unknown>): void {
    if (this.socket) {
      this.socket.write(JSON.stringify(msg) + "\n");
    }
  }

  /** Send and immediately disconnect. For fire-and-forget (hook events). */
  sendAndClose(msg: Record<string, unknown>): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = createConnection(BUDDY_SOCKET_PATH, () => {
        socket.write(JSON.stringify(msg) + "\n", () => {
          socket.end();
          resolve();
        });
      });
      socket.on("error", () => resolve()); // Silent failure for hooks
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.end();
      this.socket = null;
    }
  }
}
