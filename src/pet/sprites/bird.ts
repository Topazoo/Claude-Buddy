import { frame } from "./types.js";
import type { SpriteSet } from "./types.js";

// Bird: Round body, wing shapes that flap, distinct beak, thin legs
// Body=B, dark=b, accent(chest)=A, eyes=E, mouth(beak)=M, highlight=H

export const BIRD_SPRITES: SpriteSet = {
  idle: [
    // Frame 0: wings tucked
    frame([
      ["    ▄████▄      ", "    BBBBBB      "],
      ["   █ ◕  ◕ █    ", "   B E  E B    "],
      ["   █▄ ▸▸ ▄█    ", "   Bb MM bB    "],
      ["  ▄██████▄     ", "  bBAAAABb     "],
      [" ▐░██████░▌    ", " bABBBBBBAb    "],
      ["  ▀ ████ ▀     ", "  b BBBB b     "],
      ["    ▐▌▐▌       ", "    Mb Mb      "],
    ]),
    // Frame 1: wings slightly out
    frame([
      ["    ▄████▄      ", "    BBBBBB      "],
      ["   █ ◕  ◕ █    ", "   B E  E B    "],
      ["   █▄ ▸▸ ▄█    ", "   Bb MM bB    "],
      ["  ▄██████▄     ", "  bBAAAABb     "],
      [" ░ ██████ ░    ", " A BBBBBB A    "],
      ["  ▀ ████ ▀     ", "  b BBBB b     "],
      ["    ▐▌▐▌       ", "    Mb Mb      "],
    ]),
    // Frame 2: blink
    frame([
      ["    ▄████▄      ", "    BBBBBB      "],
      ["   █ ▄  ▄ █    ", "   B E  E B    "],
      ["   █▄ ▸▸ ▄█    ", "   Bb MM bB    "],
      ["  ▄██████▄     ", "  bBAAAABb     "],
      [" ▐░██████░▌    ", " bABBBBBBAb    "],
      ["  ▀ ████ ▀     ", "  b BBBB b     "],
      ["    ▐▌▐▌       ", "    Mb Mb      "],
    ]),
    // Frame 3: head tilt
    frame([
      ["    ▄████▄      ", "    BBBBBB      "],
      ["   █  ◕ ◕ █    ", "   B  E E B    "],
      ["   █▄ ▸▸ ▄█    ", "   Bb MM bB    "],
      ["  ▄██████▄     ", "  bBAAAABb     "],
      [" ▐░██████░▌    ", " bABBBBBBAb    "],
      ["  ▀ ████ ▀     ", "  b BBBB b     "],
      ["    ▐▌▐▌       ", "    Mb Mb      "],
    ]),
  ],
  startled: [
    frame([
      ["     ❗         ", "     H         "],
      ["    ▄████▄      ", "    BBBBBB      "],
      ["   █ ◉  ◉ █    ", "   B E  E B    "],
      ["   █▄ ▾▾ ▄█    ", "   Bb MM bB    "],
      [" ▐░██████░▌    ", " bABBBBBBAb    "],
      ["  ▀ ████ ▀     ", "  b BBBB b     "],
      ["    ▐▌▐▌       ", "    Mb Mb      "],
    ]),
    frame([
      ["    ▄████▄      ", "    BBBBBB      "],
      ["   █ ◉  ◉ █    ", "   B E  E B    "],
      ["   █▄ ▾▾ ▄█    ", "   Bb MM bB    "],
      ["  ▄██████▄     ", "  bBAAAABb     "],
      [" ▐░██████░▌    ", " bABBBBBBAb    "],
      ["  ▀ ████ ▀     ", "  b BBBB b     "],
      ["    ▐▌▐▌       ", "    Mb Mb      "],
    ]),
  ],
  excited: [
    // Wings wide, bouncing
    frame([
      ["    ▄████▄      ", "    BBBBBB      "],
      ["   █ ▸  ▸ █    ", "   B E  E B    "],
      ["   █▄ ▾▾ ▄█    ", "   Bb MM bB    "],
      ["  ▄██████▄     ", "  bBAAAABb     "],
      ["▐░░██████░░▌   ", "HAABBBBBBAAAH  "],
      ["  ▀ ████ ▀     ", "  b BBBB b     "],
      ["    ▐▌▐▌       ", "    Mb Mb      "],
    ]),
    frame([
      ["                ", "                "],
      ["    ▄████▄      ", "    BBBBBB      "],
      ["   █ ▸  ▸ █    ", "   B E  E B    "],
      ["   █▄ ▾▾ ▄█    ", "   Bb MM bB    "],
      ["▐░░██████░░▌   ", "HAABBBBBBAAAH  "],
      ["  ▀ ████ ▀     ", "  b BBBB b     "],
      ["   ▐▌  ▐▌      ", "   Mb  Mb      "],
    ]),
  ],
  sleeping: [
    frame([
      ["           zzZ  ", "           HHH  "],
      ["    ▄████▄      ", "    BBBBBB      "],
      ["   █ ▄  ▄ █    ", "   B b  b B    "],
      ["   █▄ ▸▸ ▄█    ", "   Bb MM bB    "],
      ["  ▄██████▄     ", "  bBAAAABb     "],
      ["  █████████    ", "  BBBBBBBBB    "],
      ["  ▀▀▀▀▀▀▀▀▀    ", "  bbbbbbbbb    "],
    ]),
    frame([
      ["          zzZ   ", "          HHH   "],
      ["    ▄████▄      ", "    BBBBBB      "],
      ["   █ ▄  ▄ █    ", "   B b  b B    "],
      ["   █▄ ▸▸ ▄█    ", "   Bb MM bB    "],
      ["  ▄██████▄     ", "  bBAAAABb     "],
      ["  █████████    ", "  BBBBBBBBB    "],
      ["  ▀▀▀▀▀▀▀▀▀    ", "  bbbbbbbbb    "],
    ]),
  ],
  thinking: [
    frame([
      ["    ▄████▄    · ", "    BBBBBB    H "],
      ["   █ ◕  ◕ █  · ", "   B E  E B  H "],
      ["   █▄ ▸▸ ▄█    ", "   Bb MM bB    "],
      ["  ▄██████▄     ", "  bBAAAABb     "],
      [" ▐░██████░▌    ", " bABBBBBBAb    "],
      ["  ▀ ████ ▀     ", "  b BBBB b     "],
      ["    ▐▌▐▌       ", "    Mb Mb      "],
    ]),
    frame([
      ["    ▄████▄   ·· ", "    BBBBBB   HH "],
      ["   █ ◕  ◕ █ ·  ", "   B E  E B H  "],
      ["   █▄ ▸▸ ▄█    ", "   Bb MM bB    "],
      ["  ▄██████▄     ", "  bBAAAABb     "],
      [" ▐░██████░▌    ", " bABBBBBBAb    "],
      ["  ▀ ████ ▀     ", "  b BBBB b     "],
      ["    ▐▌▐▌       ", "    Mb Mb      "],
    ]),
  ],
  confused: [
    frame([
      ["      ？        ", "      H        "],
      ["    ▄████▄      ", "    BBBBBB      "],
      ["   █ ◑  ◑ █    ", "   B E  E B    "],
      ["   █▄ ~~ ▄█    ", "   Bb MM bB    "],
      ["  ▄██████▄     ", "  bBAAAABb     "],
      [" ▐░██████░▌    ", " bABBBBBBAb    "],
      ["    ▐▌▐▌       ", "    Mb Mb      "],
    ]),
    frame([
      ["    ▄████▄      ", "    BBBBBB      "],
      ["   █ ◑  ◑ █    ", "   B E  E B    "],
      ["   █▄ ~~ ▄█    ", "   Bb MM bB    "],
      ["  ▄██████▄     ", "  bBAAAABb     "],
      [" ▐░██████░▌    ", " bABBBBBBAb    "],
      ["  ▀ ████ ▀     ", "  b BBBB b     "],
      ["    ▐▌▐▌       ", "    Mb Mb      "],
    ]),
  ],
  eating: [
    frame([
      ["    ▄████▄      ", "    BBBBBB      "],
      ["   █ ◕  ◕ █    ", "   B E  E B    "],
      ["   █▄ ▼▼ ▄█  ♨ ", "   Bb MM bB  H "],
      ["  ▄██████▄     ", "  bBAAAABb     "],
      [" ▐░██████░▌    ", " bABBBBBBAb    "],
      ["  ▀ ████ ▀     ", "  b BBBB b     "],
      ["    ▐▌▐▌       ", "    Mb Mb      "],
    ]),
    frame([
      ["    ▄████▄      ", "    BBBBBB      "],
      ["   █ ◕  ◕ █    ", "   B E  E B    "],
      ["   █▄ ▸▸ ▄█    ", "   Bb MM bB    "],
      ["  ▄██████▄     ", "  bBAAAABb     "],
      [" ▐░██████░▌    ", " bABBBBBBAb    "],
      ["  ▀ ████ ▀     ", "  b BBBB b     "],
      ["    ▐▌▐▌       ", "    Mb Mb      "],
    ]),
  ],
};
