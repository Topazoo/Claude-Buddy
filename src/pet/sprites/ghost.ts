import { frame } from "./types.js";
import type { SpriteSet } from "./types.js";

// Ghost: Floaty, tapered bottom with wave, ethereal glow via ░, transparent body
// Body=B, dark(inner)=b, accent(glow/aura)=A, eyes=E, mouth=M, highlight=H

export const GHOST_SPRITES: SpriteSet = {
  idle: [
    // Frame 0: float up, wave left
    frame([
      ["   ░▄████▄░     ", "   ABBBBBBBA    "],
      ["  ░████████░    ", "  ABBBBBBBBA    "],
      ["  ░█ ◕  ◕ █░   ", "  AB E  E BA   "],
      ["   █  ▽   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   █▄▀▄▀█      ", "   BbBbBB      "],
      ["    ▀ ▀ ▀      ", "    b b b      "],
    ]),
    // Frame 1: float down, wave right
    frame([
      ["                ", "                "],
      ["   ░▄████▄░     ", "   ABBBBBBBA    "],
      ["  ░████████░    ", "  ABBBBBBBBA    "],
      ["  ░█ ◕  ◕ █░   ", "  AB E  E BA   "],
      ["   █  ▽   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   ▀▄▀▄▀▄      ", "   bBbBbB      "],
    ]),
    // Frame 2: blink
    frame([
      ["   ░▄████▄░     ", "   ABBBBBBBA    "],
      ["  ░████████░    ", "  ABBBBBBBBA    "],
      ["  ░█ ▄  ▄ █░   ", "  AB b  b BA   "],
      ["   █  ▽   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   █▄▀▄▀█      ", "   BbBbBB      "],
      ["    ▀ ▀ ▀      ", "    b b b      "],
    ]),
    // Frame 3: look away
    frame([
      ["   ░▄████▄░     ", "   ABBBBBBBA    "],
      ["  ░████████░    ", "  ABBBBBBBBA    "],
      ["  ░█  ◕ ◕ █░   ", "  AB  E E BA   "],
      ["   █  ▽   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   █▄▀▄▀█      ", "   BbBbBB      "],
      ["    ▀ ▀ ▀      ", "    b b b      "],
    ]),
  ],
  startled: [
    frame([
      ["      ❗        ", "      H        "],
      ["   ░▄████▄░     ", "   ABBBBBBBA    "],
      ["  ░█ ◉  ◉ █░   ", "  AB E  E BA   "],
      ["   █  ○   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   █▄▀▄▀█      ", "   BbBbBB      "],
      ["    ▀ ▀ ▀      ", "    b b b      "],
    ]),
    frame([
      ["   ░▄████▄░     ", "   ABBBBBBBA    "],
      ["  ░████████░    ", "  ABBBBBBBBA    "],
      ["  ░█ ◉  ◉ █░   ", "  AB E  E BA   "],
      ["   █  ○   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   █▄▀▄▀█      ", "   BbBbBB      "],
      ["    ▀ ▀ ▀      ", "    b b b      "],
    ]),
  ],
  excited: [
    frame([
      ["   ░▄████▄░     ", "   ABBBBBBBA    "],
      [" ░░████████░░   ", " AABBBBBBBBA A "],
      [" ░░█ ▸  ▸ █░░  ", " AAB E  E BAA  "],
      ["   █  ▽   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   █▄▀▄▀█      ", "   BbBbBB      "],
      ["    ▀ ▀ ▀      ", "    b b b      "],
    ]),
    frame([
      ["                ", "                "],
      ["   ░▄████▄░     ", "   ABBBBBBBA    "],
      [" ░░████████░░   ", " AABBBBBBBBAA  "],
      [" ░░█ ▸  ▸ █░░  ", " AAB E  E BAA  "],
      ["   █  ▽   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   ▀▄▀▄▀▄      ", "   bBbBbB      "],
    ]),
  ],
  sleeping: [
    frame([
      ["           zzZ  ", "           HHH  "],
      ["   ░▄████▄░     ", "   ABBBBBBBA    "],
      ["  ░█ ▄  ▄ █░   ", "  AB b  b BA   "],
      ["   █  ▽   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   █████████    ", "   BBBBBBBBB    "],
      ["   ▀▀▀▀▀▀▀▀    ", "   bbbbbbbb    "],
    ]),
    frame([
      ["          zzZ   ", "          HHH   "],
      ["   ░▄████▄░     ", "   ABBBBBBBA    "],
      ["  ░█ ▄  ▄ █░   ", "  AB b  b BA   "],
      ["   █  ▽   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   █████████    ", "   BBBBBBBBB    "],
      ["   ▀▀▀▀▀▀▀▀    ", "   bbbbbbbb    "],
    ]),
  ],
  thinking: [
    frame([
      ["   ░▄████▄░   · ", "   ABBBBBBBA  H "],
      ["  ░████████░  · ", "  ABBBBBBBBA  H "],
      ["  ░█ ◕  ◕ █░   ", "  AB E  E BA   "],
      ["   █  ▽   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   █▄▀▄▀█      ", "   BbBbBB      "],
      ["    ▀ ▀ ▀      ", "    b b b      "],
    ]),
    frame([
      ["   ░▄████▄░  ·· ", "   ABBBBBBBA HH "],
      ["  ░████████░ ·  ", "  ABBBBBBBBA H  "],
      ["  ░█ ◕  ◕ █░   ", "  AB E  E BA   "],
      ["   █  ▽   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   █▄▀▄▀█      ", "   BbBbBB      "],
      ["    ▀ ▀ ▀      ", "    b b b      "],
    ]),
  ],
  confused: [
    frame([
      ["      ？        ", "      H        "],
      ["   ░▄████▄░     ", "   ABBBBBBBA    "],
      ["  ░█ ◑  ◑ █░   ", "  AB E  E BA   "],
      ["   █  ~   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   █▄▀▄▀█      ", "   BbBbBB      "],
      ["    ▀ ▀ ▀      ", "    b b b      "],
    ]),
    frame([
      ["   ░▄████▄░     ", "   ABBBBBBBA    "],
      ["  ░████████░    ", "  ABBBBBBBBA    "],
      ["  ░█ ◑  ◑ █░   ", "  AB E  E BA   "],
      ["   █  ~   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   █▄▀▄▀█      ", "   BbBbBB      "],
      ["    ▀ ▀ ▀      ", "    b b b      "],
    ]),
  ],
  eating: [
    frame([
      ["   ░▄████▄░     ", "   ABBBBBBBA    "],
      ["  ░████████░  ♨ ", "  ABBBBBBBBA  H "],
      ["  ░█ ◕  ◕ █░   ", "  AB E  E BA   "],
      ["   █  █   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   █▄▀▄▀█      ", "   BbBbBB      "],
      ["    ▀ ▀ ▀      ", "    b b b      "],
    ]),
    frame([
      ["   ░▄████▄░     ", "   ABBBBBBBA    "],
      ["  ░████████░    ", "  ABBBBBBBBA    "],
      ["  ░█ ◕  ◕ █░   ", "  AB E  E BA   "],
      ["   █  ▽   █    ", "   B  M   B    "],
      ["   ██████▀     ", "   BBBBBBb     "],
      ["   █▄▀▄▀█      ", "   BbBbBB      "],
      ["    ▀ ▀ ▀      ", "    b b b      "],
    ]),
  ],
};
