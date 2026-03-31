import { frame } from "./types.js";
import type { SpriteSet } from "./types.js";

// Reptile: Spiny crest, long curling tail, scales via ░▓, wide stance
// Body=B, dark(scales)=b, accent(belly/crest)=A, eyes=E, mouth=M, highlight=H

export const REPTILE_SPRITES: SpriteSet = {
  idle: [
    // Frame 0: tail curled right
    frame([
      ["  ▄▄▀▀▀▀▄      ", "  AABBBB b     "],
      [" █ ◕   ◕ █     ", " B E   E B     "],
      [" █▄ ▿▿  ▄█     ", " Bb MM  bB     "],
      ["  ▀█████▀▄     ", "  bBBBBBbA     "],
      ["   ████  █▄    ", "   BBBB  Bb    "],
      ["   █▌  ▐█  ▀▄  ", "   Bb  bB  BA  "],
      ["   ▀▀  ▀▀   ▀  ", "   bb  bb   b  "],
    ]),
    // Frame 1: tail swish
    frame([
      ["  ▄▄▀▀▀▀▄      ", "  AABBBB b     "],
      [" █ ◕   ◕ █     ", " B E   E B     "],
      [" █▄ ▿▿  ▄█     ", " Bb MM  bB     "],
      ["  ▀█████▀▄     ", "  bBBBBBbA     "],
      ["   ████  █▄    ", "   BBBB  Bb    "],
      ["   ▐█  █▌ ▀▄   ", "   bB  Bb BA   "],
      ["   ▀▀  ▀▀  ▀   ", "   bb  bb  b   "],
    ]),
    // Frame 2: blink
    frame([
      ["  ▄▄▀▀▀▀▄      ", "  AABBBB b     "],
      [" █ ▄   ▄ █     ", " B b   b B     "],
      [" █▄ ▿▿  ▄█     ", " Bb MM  bB     "],
      ["  ▀█████▀▄     ", "  bBBBBBbA     "],
      ["   ████  █▄    ", "   BBBB  Bb    "],
      ["   █▌  ▐█  ▀▄  ", "   Bb  bB  BA  "],
      ["   ▀▀  ▀▀   ▀  ", "   bb  bb   b  "],
    ]),
    // Frame 3: look left
    frame([
      ["  ▄▄▀▀▀▀▄      ", "  AABBBB b     "],
      [" █ ◕ ◕   █     ", " B E E   B     "],
      [" █▄ ▿▿  ▄█     ", " Bb MM  bB     "],
      ["  ▀█████▀▄     ", "  bBBBBBbA     "],
      ["   ████  █▄    ", "   BBBB  Bb    "],
      ["   █▌  ▐█  ▀▄  ", "   Bb  bB  BA  "],
      ["   ▀▀  ▀▀   ▀  ", "   bb  bb   b  "],
    ]),
  ],
  startled: [
    frame([
      ["  ▄▄▀▀▀▀▄  ❗  ", "  AABBBB b  H  "],
      [" █ ◉   ◉ █     ", " B E   E B     "],
      [" █▄      ▄█    ", " Bb      bB    "],
      ["  ▀█████▀▄     ", "  bBBBBBbA     "],
      ["   ████  █▄    ", "   BBBB  Bb    "],
      ["   █▌  ▐█  ▀   ", "   Bb  bB  b   "],
      ["   ▀▀  ▀▀      ", "   bb  bb      "],
    ]),
    frame([
      ["  ▄▄▀▀▀▀▄      ", "  AABBBB b     "],
      [" █ ◉   ◉ █     ", " B E   E B     "],
      [" █▄      ▄█    ", " Bb      bB    "],
      ["  ▀█████▀▄     ", "  bBBBBBbA     "],
      ["   ████  █▄    ", "   BBBB  Bb    "],
      ["   █▌  ▐█  ▀▄  ", "   Bb  bB  BA  "],
      ["   ▀▀  ▀▀   ▀  ", "   bb  bb   b  "],
    ]),
  ],
  excited: [
    frame([
      ["  ▄▄▀▀▀▀▄      ", "  AABBBB b     "],
      [" █ ▸   ▸ █     ", " B E   E B     "],
      [" █▄ ▿▿  ▄█     ", " Bb MM  bB     "],
      [" ░▀█████▀▄░    ", " HbBBBBBbAH    "],
      [" ░ ████  █▄░   ", " H BBBB  BbH   "],
      ["   █▌  ▐█  ▀▄  ", "   Bb  bB  BA  "],
      ["   ▀▀  ▀▀   ▀  ", "   bb  bb   b  "],
    ]),
    frame([
      ["                ", "                "],
      ["  ▄▄▀▀▀▀▄      ", "  AABBBB b     "],
      [" █ ▸   ▸ █     ", " B E   E B     "],
      [" █▄ ▿▿  ▄█     ", " Bb MM  bB     "],
      [" ░▀█████▀▄░    ", " HbBBBBBbAH    "],
      ["   ████  █▄    ", "   BBBB  Bb    "],
      ["   ▀█  █▀  ▀▄  ", "   bB  Bb  BA  "],
    ]),
  ],
  sleeping: [
    frame([
      ["             zzZ", "             HHH"],
      ["  ▄▄▀▀▀▀▄      ", "  AABBBB b     "],
      [" █ ▄   ▄ █     ", " B b   b B     "],
      [" █▄ ▄▄  ▄█     ", " Bb MM  bB     "],
      ["  ▀██████████▄  ", "  bBBBBBBBBBBBb "],
      ["   ▀▀▀▀▀▀▀▀▀▀  ", "   bbbbbbbbbb  "],
      ["                ", "                "],
    ]),
    frame([
      ["            zzZ ", "            HHH "],
      ["  ▄▄▀▀▀▀▄      ", "  AABBBB b     "],
      [" █ ▄   ▄ █     ", " B b   b B     "],
      [" █▄ ▄▄  ▄█     ", " Bb MM  bB     "],
      ["  ▀██████████▄  ", "  bBBBBBBBBBBBb "],
      ["   ▀▀▀▀▀▀▀▀▀▀  ", "   bbbbbbbbbb  "],
      ["                ", "                "],
    ]),
  ],
  thinking: [
    frame([
      ["  ▄▄▀▀▀▀▄    · ", "  AABBBB b   H "],
      [" █ ◕   ◕ █   · ", " B E   E B   H "],
      [" █▄ ▿▿  ▄█     ", " Bb MM  bB     "],
      ["  ▀█████▀▄     ", "  bBBBBBbA     "],
      ["   ████  █▄    ", "   BBBB  Bb    "],
      ["   █▌  ▐█  ▀▄  ", "   Bb  bB  BA  "],
      ["   ▀▀  ▀▀   ▀  ", "   bb  bb   b  "],
    ]),
    frame([
      ["  ▄▄▀▀▀▀▄   ·· ", "  AABBBB b  HH "],
      [" █ ◕   ◕ █  ·  ", " B E   E B  H  "],
      [" █▄ ▿▿  ▄█     ", " Bb MM  bB     "],
      ["  ▀█████▀▄     ", "  bBBBBBbA     "],
      ["   ████  █▄    ", "   BBBB  Bb    "],
      ["   █▌  ▐█  ▀▄  ", "   Bb  bB  BA  "],
      ["   ▀▀  ▀▀   ▀  ", "   bb  bb   b  "],
    ]),
  ],
  confused: [
    frame([
      ["  ▄▄▀▀▀▀▄  ？  ", "  AABBBB b  H  "],
      [" █ ◑   ◑ █     ", " B E   E B     "],
      [" █▄  ~   ▄█    ", " Bb  M   bB    "],
      ["  ▀█████▀▄     ", "  bBBBBBbA     "],
      ["   ████  █▄    ", "   BBBB  Bb    "],
      ["   █▌  ▐█  ▀▄  ", "   Bb  bB  BA  "],
      ["   ▀▀  ▀▀   ▀  ", "   bb  bb   b  "],
    ]),
    frame([
      ["  ▄▄▀▀▀▀▄      ", "  AABBBB b     "],
      [" █ ◑   ◑ █     ", " B E   E B     "],
      [" █▄  ~   ▄█    ", " Bb  M   bB    "],
      ["  ▀█████▀▄     ", "  bBBBBBbA     "],
      ["   ████  █▄    ", "   BBBB  Bb    "],
      ["   █▌  ▐█  ▀▄  ", "   Bb  bB  BA  "],
      ["   ▀▀  ▀▀   ▀  ", "   bb  bb   b  "],
    ]),
  ],
  eating: [
    frame([
      ["  ▄▄▀▀▀▀▄      ", "  AABBBB b     "],
      [" █ ◕   ◕ █   ♨ ", " B E   E B   H "],
      [" █▄ ▀█▀  ▄█    ", " Bb MMM  bB    "],
      ["  ▀█████▀▄     ", "  bBBBBBbA     "],
      ["   ████  █▄    ", "   BBBB  Bb    "],
      ["   █▌  ▐█  ▀▄  ", "   Bb  bB  BA  "],
      ["   ▀▀  ▀▀   ▀  ", "   bb  bb   b  "],
    ]),
    frame([
      ["  ▄▄▀▀▀▀▄      ", "  AABBBB b     "],
      [" █ ◕   ◕ █     ", " B E   E B     "],
      [" █▄ ▿▿  ▄█     ", " Bb MM  bB     "],
      ["  ▀█████▀▄     ", "  bBBBBBbA     "],
      ["   ████  █▄    ", "   BBBB  Bb    "],
      ["   █▌  ▐█  ▀▄  ", "   Bb  bB  BA  "],
      ["   ▀▀  ▀▀   ▀  ", "   bb  bb   b  "],
    ]),
  ],
};
