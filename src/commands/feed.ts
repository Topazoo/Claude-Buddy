import { SocketClient } from "../socket-client.js";

export async function feedCommand(): Promise<void> {
  const client = new SocketClient();
  try {
    await client.connect();
    client.send({ type: "feed" });
    // Brief wait for daemon to broadcast reaction
    await new Promise((r) => setTimeout(r, 200));
    client.disconnect();
    console.log("  Fed your buddy! 🍕");
  } catch {
    console.log("  Daemon not running. Start with: claude-buddy daemon run");
  }
}

export async function petCommand(): Promise<void> {
  const client = new SocketClient();
  try {
    await client.connect();
    client.send({ type: "pet_interact" });
    await new Promise((r) => setTimeout(r, 200));
    client.disconnect();
    console.log("  Petted your buddy! 💜");
  } catch {
    console.log("  Daemon not running. Start with: claude-buddy daemon run");
  }
}
