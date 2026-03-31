import { frame } from "./types.js";
import type { SpriteSet } from "./types.js";

// Worm: S-curve body that undulates, rosy cheeks, simple face
// Body=B, dark=b, accent(cheeks/belly)=A, eyes=E, mouth=M, highlight=H

export const WORM_SPRITES: SpriteSet = {
  idle: [
    // Frame 0: curve left
    frame([
      ["                ", "                "],
      ["    ▄▄▄▄▄▄      ", "    BBBBBB      "],
      ["   █ ◕  ◕█     ", "   B E  EB     "],
      ["   █●▄▄▄●█     ", "   BAMBBBAB     "],
      ["  ▄██████▀      ", "  bBBBBBBb      "],
      [" ████▀▀         ", " BBBBbb         "],
      [" ▀▀▀▀           ", " bbbb           "],
    ]),
    // Frame 1: curve right
    frame([
      ["                ", "                "],
      ["    ▄▄▄▄▄▄      ", "    BBBBBB      "],
      ["   █ ◕  ◕█     ", "   B E  EB     "],
      ["   █●▄▄▄●█     ", "   BAMBBBAB     "],
      ["    ▀██████▄    ", "    bBBBBBBb    "],
      ["       ▀▀████   ", "       bbBBBB   "],
      ["          ▀▀▀▀  ", "          bbbb  "],
    ]),
    // Frame 2: blink
    frame([
      ["                ", "                "],
      ["    ▄▄▄▄▄▄      ", "    BBBBBB      "],
      ["   █ ▄  ▄█     ", "   B E  EB     "],
      ["   █●▄▄▄●█     ", "   BAMBBBAB     "],
      ["  ▄██████▀      ", "  bBBBBBBb      "],
      [" ████▀▀         ", " BBBBbb         "],
      [" ▀▀▀▀           ", " bbbb           "],
    ]),
    // Frame 3: look up
    frame([
      ["                ", "                "],
      ["    ▄▄▄▄▄▄      ", "    BBBBBB      "],
      ["   █ ◕  ◕█     ", "   B E  EB     "],
      ["   █●▄▀▄●█     ", "   BAMBMBAB     "],
      ["  ▄██████▀      ", "  bBBBBBBb      "],
      [" ████▀▀         ", " BBBBbb         "],
      [" ▀▀▀▀           ", " bbbb           "],
    ]),
  ],
  startled: [
    frame([
      ["      ❗        ", "      H        "],
      ["    ▄▄▄▄▄▄      ", "    BBBBBB      "],
      ["   █ ◉  ◉█     ", "   B E  EB     "],
      ["   █● °° ●█     ", "   BA MM AB     "],
      ["  ▄██████▀      ", "  bBBBBBBb      "],
      [" ████▀▀         ", " BBBBbb         "],
      [" ▀▀▀▀           ", " bbbb           "],
    ]),
    frame([
      ["    ▄▄▄▄▄▄      ", "    BBBBBB      "],
      ["   █ ◉  ◉█     ", "   B E  EB     "],
      ["   █● °° ●█     ", "   BA MM AB     "],
      ["  ▄██████▀      ", "  bBBBBBBb      "],
      [" ████▀▀         ", " BBBBbb         "],
      [" ▀▀▀▀           ", " bbbb           "],
      ["                ", "                "],
    ]),
  ],
  excited: [
    frame([
      ["    ▄▄▄▄▄▄      ", "    BBBBBB      "],
      ["   █ ▸  ▸█     ", "   B E  EB     "],
      ["   █●▀▀▀●█     ", "   BAMBBBAB     "],
      [" ░▄██████▀░     ", " HbBBBBBBbH     "],
      ["░████▀▀  ░      ", "HBBBBbb  H      "],
      [" ▀▀▀▀           ", " bbbb           "],
      ["                ", "                "],
    ]),
    frame([
      ["                ", "                "],
      ["    ▄▄▄▄▄▄      ", "    BBBBBB      "],
      ["   █ ▸  ▸█     ", "   B E  EB     "],
      ["   █●▀▀▀●█     ", "   BAMBBBAB     "],
      ["  ░▀██████▄░    ", "  HbBBBBBBbH    "],
      ["  ░  ▀▀████░    ", "  H  bbBBBBH    "],
      ["        ▀▀▀▀    ", "        bbbb    "],
    ]),
  ],
  sleeping: [
    frame([
      ["           zzZ  ", "           HHH  "],
      ["    ▄▄▄▄▄▄      ", "    BBBBBB      "],
      ["   █ ▄  ▄█     ", "   B b  bB     "],
      ["   █●▄▄▄●█     ", "   BAMBBBAB     "],
      ["  ▄████████▄    ", "  bBBBBBBBBBb   "],
      ["  ▀▀▀▀▀▀▀▀▀▀    ", "  bbbbbbbbbb    "],
      ["                ", "                "],
    ]),
    frame([
      ["          zzZ   ", "          HHH   "],
      ["    ▄▄▄▄▄▄      ", "    BBBBBB      "],
      ["   █ ▄  ▄█     ", "   B b  bB     "],
      ["   █●▄▄▄●█     ", "   BAMBBBAB     "],
      ["  ▄████████▄    ", "  bBBBBBBBBBb   "],
      ["  ▀▀▀▀▀▀▀▀▀▀    ", "  bbbbbbbbbb    "],
      ["                ", "                "],
    ]),
  ],
  thinking: [
    frame([
      ["    ▄▄▄▄▄▄    · ", "    BBBBBB    H "],
      ["   █ ◕  ◕█   · ", "   B E  EB   H "],
      ["   █●▄▄▄●█     ", "   BAMBBBAB     "],
      ["  ▄██████▀      ", "  bBBBBBBb      "],
      [" ████▀▀         ", " BBBBbb         "],
      [" ▀▀▀▀           ", " bbbb           "],
      ["                ", "                "],
    ]),
    frame([
      ["    ▄▄▄▄▄▄   ·· ", "    BBBBBB   HH "],
      ["   █ ◕  ◕█  ·  ", "   B E  EB  H  "],
      ["   █●▄▄▄●█     ", "   BAMBBBAB     "],
      ["  ▄██████▀      ", "  bBBBBBBb      "],
      [" ████▀▀         ", " BBBBbb         "],
      [" ▀▀▀▀           ", " bbbb           "],
      ["                ", "                "],
    ]),
  ],
  confused: [
    frame([
      ["      ？        ", "      H        "],
      ["    ▄▄▄▄▄▄      ", "    BBBBBB      "],
      ["   █ ◑  ◑█     ", "   B E  EB     "],
      ["   █●▄~▄●█     ", "   BAMBMAB     "],
      ["  ▄██████▀      ", "  bBBBBBBb      "],
      [" ████▀▀         ", " BBBBbb         "],
      [" ▀▀▀▀           ", " bbbb           "],
    ]),
    frame([
      ["    ▄▄▄▄▄▄      ", "    BBBBBB      "],
      ["   █ ◑  ◑█     ", "   B E  EB     "],
      ["   █●▄~▄●█     ", "   BAMBMAB     "],
      ["  ▄██████▀      ", "  bBBBBBBb      "],
      [" ████▀▀         ", " BBBBbb         "],
      [" ▀▀▀▀           ", " bbbb           "],
      ["                ", "                "],
    ]),
  ],
  eating: [
    frame([
      ["    ▄▄▄▄▄▄      ", "    BBBBBB      "],
      ["   █ ◕  ◕█   ♨ ", "   B E  EB   H "],
      ["   █●▀█▀●█     ", "   BAMBMBAB     "],
      ["  ▄██████▀      ", "  bBBBBBBb      "],
      [" ████▀▀         ", " BBBBbb         "],
      [" ▀▀▀▀           ", " bbbb           "],
      ["                ", "                "],
    ]),
    frame([
      ["    ▄▄▄▄▄▄      ", "    BBBBBB      "],
      ["   █ ◕  ◕█     ", "   B E  EB     "],
      ["   █●▄▀▄●█     ", "   BAMBMBAB     "],
      ["  ▄██████▀      ", "  bBBBBBBb      "],
      [" ████▀▀         ", " BBBBbb         "],
      [" ▀▀▀▀           ", " bbbb           "],
      ["                ", "                "],
    ]),
  ],
};
