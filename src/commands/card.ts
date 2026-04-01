import { execSync } from "node:child_process";
import { loadGlobalState } from "../persistence.js";
import { SPECIES } from "../pet/species.js";
import type { Species } from "../pet/species.js";
import { computeLevel } from "../pet/state.js";
import { getFrame } from "../pet/sprites.js";
import { getPalette } from "../pet/palettes.js";
import { renderFrameAnsi } from "../pet/sprite-render.js";

const CARD_WIDTH = 34;

function pad(content: string, width: number): string {
  const stripped = content.replace(/\x1b\[[0-9;]*m/g, "");
  const padding = Math.max(0, width - stripped.length);
  return content + " ".repeat(padding);
}

function divider(style: "top" | "mid" | "bottom" | "thin"): string {
  switch (style) {
    case "top": return "\u2554" + "\u2550".repeat(CARD_WIDTH) + "\u2557";
    case "mid": return "\u2560" + "\u2550".repeat(CARD_WIDTH) + "\u2563";
    case "thin": return "\u2551" + "\u2500".repeat(CARD_WIDTH) + "\u2551";
    case "bottom": return "\u255A" + "\u2550".repeat(CARD_WIDTH) + "\u255D";
  }
}

function cardLine(content: string): string {
  return `\u2551 ${pad(content, CARD_WIDTH - 2)} \u2551`;
}

function formatBar(value: number, max: number, width = 10): string {
  const filled = Math.round((value / max) * width);
  return "\u2588".repeat(filled) + "\u2591".repeat(width - filled);
}

function timeSince(isoDate: string): string {
  const ms = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function cardCommand(opts: { copy?: boolean; raw?: boolean }): void {
  const state = loadGlobalState();
  if (!state) {
    console.log("\nNo buddy found. Run `claude-buddy hatch` first.\n");
    return;
  }

  const species = state.species as Species;
  const def = SPECIES[species];
  const palette = getPalette(species, state.paletteId ?? 0);
  const level = computeLevel(state.activityCounters, Object.keys(state.traits).length);
  const c = state.activityCounters;
  const totalTools = c.bashCalls + c.readCalls + c.writeCalls + c.editCalls + c.searchCalls + c.fetchCalls;
  const frame = getFrame(species, state.mood, 0, level);

  const lines: string[] = [];

  lines.push(divider("top"));
  lines.push(cardLine(`         BUDDY CARD`));
  lines.push(divider("mid"));

  // Sprite — render plain text for card (no ANSI in raw mode)
  if (opts.raw) {
    for (const spriteLine of frame.chars) {
      lines.push(cardLine(`  ${spriteLine}`));
    }
  } else {
    const rendered = renderFrameAnsi(frame.chars, frame.tokens, palette);
    for (const spriteLine of rendered.split("\n")) {
      lines.push(cardLine(`  ${spriteLine}`));
    }
  }

  lines.push(cardLine(""));
  lines.push(cardLine(`${state.name}  ${def.emoji} Lv.${level}  ${state.mood}`));
  lines.push(cardLine(`${palette.name}`));
  lines.push(divider("mid"));

  // Stats
  const s = state.stats;
  lines.push(cardLine(`DBG ${formatBar(s.debugging, 20)} ${s.debugging}`));
  lines.push(cardLine(`PAT ${formatBar(s.patience, 20)} ${s.patience}`));
  lines.push(cardLine(`CHS ${formatBar(s.chaos, 20)} ${s.chaos}`));
  lines.push(cardLine(`WIS ${formatBar(s.wisdom, 20)} ${s.wisdom}`));
  lines.push(cardLine(`SNK ${formatBar(s.snark, 20)} ${s.snark}`));

  // Traits
  const traitEntries = Object.entries(state.traits);
  if (traitEntries.length > 0) {
    lines.push(divider("thin"));
    const traitStr = traitEntries.map(([name, t]) => `${name} Lv.${t.level}`).join(", ");
    lines.push(cardLine(traitStr));
  }

  lines.push(divider("thin"));
  lines.push(cardLine(`Hatched: ${timeSince(state.hatchedAt)}`));
  lines.push(cardLine(`Tool calls: ${totalTools.toLocaleString()}`));
  lines.push(divider("bottom"));

  const output = lines.join("\n");

  if (opts.copy) {
    // Plain text for clipboard (strip ANSI)
    const plain = output.replace(/\x1b\[[0-9;]*m/g, "");
    try {
      if (process.platform === "darwin") {
        execSync("pbcopy", { input: plain });
      } else {
        execSync("xclip -selection clipboard", { input: plain });
      }
      console.log("Card copied to clipboard!");
    } catch {
      // Fallback: print plain
      console.log(plain);
      console.log("\n(Could not copy to clipboard — printed above)");
    }
  } else {
    console.log(output);
  }
}
