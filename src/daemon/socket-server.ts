import { createServer, type Server, type Socket } from "node:net";
import { existsSync, unlinkSync } from "node:fs";
import { BUDDY_SOCKET_PATH } from "../utils.js";

export type MessageHandler = (msg: Record<string, unknown>, client: Socket) => void;

/**
 * NDJSON socket server over a Unix domain socket.
 * Broadcasts state/reaction updates to all connected clients.
 * Receives hook events, feed/pet commands from clients.
 */
export class SocketServer {
  private server: Server | null = null;
  private clients: Set<Socket> = new Set();
  private handler: MessageHandler;

  constructor(handler: MessageHandler) {
    this.handler = handler;
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Clean up stale socket file
      if (existsSync(BUDDY_SOCKET_PATH)) {
        unlinkSync(BUDDY_SOCKET_PATH);
      }

      this.server = createServer((socket) => {
        this.clients.add(socket);
        let buffer = "";

        socket.on("data", (chunk) => {
          buffer += chunk.toString();
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const msg = JSON.parse(line);
              this.handler(msg, socket);
            } catch {
              // Skip malformed messages
            }
          }
        });

        socket.on("close", () => {
          this.clients.delete(socket);
        });

        socket.on("error", () => {
          this.clients.delete(socket);
        });
      });

      this.server.on("error", reject);
      this.server.listen(BUDDY_SOCKET_PATH, () => resolve());
    });
  }

  /** Broadcast a message to all connected clients. */
  broadcast(msg: Record<string, unknown>): void {
    const line = JSON.stringify(msg) + "\n";
    for (const client of this.clients) {
      try {
        if (!client.destroyed && client.writable) {
          client.write(line);
        }
      } catch {
        // Client disconnected, will be cleaned up on close event
      }
    }
  }

  /** Send a message to a specific client. */
  send(client: Socket, msg: Record<string, unknown>): void {
    try {
      client.write(JSON.stringify(msg) + "\n");
    } catch {
      // Client disconnected
    }
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(forceTimeout);
        // Clean up socket file
        try {
          if (existsSync(BUDDY_SOCKET_PATH)) {
            unlinkSync(BUDDY_SOCKET_PATH);
          }
        } catch {
          // Ignore cleanup errors
        }
        resolve();
      };

      // Force-resolve after 3s if server.close() hangs waiting for connections
      const forceTimeout = setTimeout(finish, 3000);

      for (const client of this.clients) {
        client.destroy();
      }
      this.clients.clear();
      if (this.server) {
        this.server.close(() => finish());
      } else {
        finish();
      }
    });
  }
}
