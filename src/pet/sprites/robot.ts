import { frame } from "./types.js";
import type { SpriteSet } from "./types.js";

// Robot: Boxy, antenna with light, screen-face, panel lines, mechanical legs
// Body=B, dark(panels)=b, accent(screen/chest)=A, eyes(LEDs)=E, mouth(display)=M, highlight(antenna)=H

export const ROBOT_SPRITES: SpriteSet = {
  idle: [
    // Frame 0: antenna light on
    frame([
      ["     ▄●▄       ", "     bHb       "],
      ["   ▄█████▄     ", "   bBBBBBb     "],
      ["   █ ■  ■ █    ", "   B E  E B    "],
      ["   █ ▀══▀ █    ", "   B MAAM B    "],
      ["   ▀█████▀     ", "   bBBBBBb     "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
    // Frame 1: antenna light off
    frame([
      ["     ▄○▄       ", "     bAb       "],
      ["   ▄█████▄     ", "   bBBBBBb     "],
      ["   █ ■  ■ █    ", "   B E  E B    "],
      ["   █ ▀══▀ █    ", "   B MAAM B    "],
      ["   ▀█████▀     ", "   bBBBBBb     "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   ▀█    █▀    ", "   bB    Bb    "],
    ]),
    // Frame 2: blink (LEDs off)
    frame([
      ["     ▄●▄       ", "     bHb       "],
      ["   ▄█████▄     ", "   bBBBBBb     "],
      ["   █ ▄  ▄ █    ", "   B b  b B    "],
      ["   █ ▀══▀ █    ", "   B MAAM B    "],
      ["   ▀█████▀     ", "   bBBBBBb     "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
    // Frame 3: LEDs look right
    frame([
      ["     ▄●▄       ", "     bHb       "],
      ["   ▄█████▄     ", "   bBBBBBb     "],
      ["   █  ■ ■ █    ", "   B  E E B    "],
      ["   █ ▀══▀ █    ", "   B MAAM B    "],
      ["   ▀█████▀     ", "   bBBBBBb     "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
  ],
  startled: [
    frame([
      ["     ▄●▄  ❗   ", "     bHb  H    "],
      ["   ▄█████▄     ", "   bBBBBBb     "],
      ["   █ ●  ● █    ", "   B E  E B    "],
      ["   █ ▀══▀ █    ", "   B MAAM B    "],
      ["   ▀█████▀     ", "   bBBBBBb     "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
    frame([
      ["     ▄●▄       ", "     bHb       "],
      ["   ▄█████▄     ", "   bBBBBBb     "],
      ["   █ ●  ● █    ", "   B E  E B    "],
      ["   █ ▀══▀ █    ", "   B MAAM B    "],
      ["   ▀█████▀     ", "   bBBBBBb     "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
  ],
  excited: [
    frame([
      ["     ▄●▄       ", "     bHb       "],
      ["   ▄█████▄     ", "   bBBBBBb     "],
      ["   █ ▸  ▸ █    ", "   B E  E B    "],
      ["   █ ▀▀▀▀ █    ", "   B MMMM B    "],
      ["  ░▀█████▀░    ", "  HbBBBBBbH    "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
    frame([
      ["                ", "                "],
      ["     ▄●▄       ", "     bHb       "],
      ["   ▄█████▄     ", "   bBBBBBb     "],
      ["   █ ▸  ▸ █    ", "   B E  E B    "],
      ["   █ ▀▀▀▀ █    ", "   B MMMM B    "],
      ["  ░▀█████▀░    ", "  HbBBBBBbH    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
  ],
  sleeping: [
    frame([
      ["     ▄○▄  zzZ  ", "     bAb  HHH  "],
      ["   ▄█████▄     ", "   bBBBBBb     "],
      ["   █ ▄  ▄ █    ", "   B b  b B    "],
      ["   █ ▀══▀ █    ", "   B MAAM B    "],
      ["   ▀█████▀     ", "   bBBBBBb     "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
    frame([
      ["     ▄○▄ zzZ   ", "     bAb HHH   "],
      ["   ▄█████▄     ", "   bBBBBBb     "],
      ["   █ ▄  ▄ █    ", "   B b  b B    "],
      ["   █ ▀══▀ █    ", "   B MAAM B    "],
      ["   ▀█████▀     ", "   bBBBBBb     "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
  ],
  thinking: [
    frame([
      ["     ▄●▄     · ", "     bHb     H "],
      ["   ▄█████▄   · ", "   bBBBBBb   H "],
      ["   █ ■  ■ █    ", "   B E  E B    "],
      ["   █ ▀══▀ █    ", "   B MAAM B    "],
      ["   ▀█████▀     ", "   bBBBBBb     "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
    frame([
      ["     ▄●▄    ·· ", "     bHb    HH "],
      ["   ▄█████▄  ·  ", "   bBBBBBb  H  "],
      ["   █ ■  ■ █    ", "   B E  E B    "],
      ["   █ ▀══▀ █    ", "   B MAAM B    "],
      ["   ▀█████▀     ", "   bBBBBBb     "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
  ],
  confused: [
    frame([
      ["     ▄●▄  ？   ", "     bHb  H    "],
      ["   ▄█████▄     ", "   bBBBBBb     "],
      ["   █ ◑  ◑ █    ", "   B E  E B    "],
      ["   █ ▀~═▀ █    ", "   B MMAM B    "],
      ["   ▀█████▀     ", "   bBBBBBb     "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
    frame([
      ["     ▄●▄       ", "     bHb       "],
      ["   ▄█████▄     ", "   bBBBBBb     "],
      ["   █ ◑  ◑ █    ", "   B E  E B    "],
      ["   █ ▀~═▀ █    ", "   B MMAM B    "],
      ["   ▀█████▀     ", "   bBBBBBb     "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
  ],
  eating: [
    frame([
      ["     ▄●▄       ", "     bHb       "],
      ["   ▄█████▄   ♨ ", "   bBBBBBb   H "],
      ["   █ ■  ■ █    ", "   B E  E B    "],
      ["   █ ▀██▀ █    ", "   B MMMM B    "],
      ["   ▀█████▀     ", "   bBBBBBb     "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
    frame([
      ["     ▄●▄       ", "     bHb       "],
      ["   ▄█████▄     ", "   bBBBBBb     "],
      ["   █ ■  ■ █    ", "   B E  E B    "],
      ["   █ ▀══▀ █    ", "   B MAAM B    "],
      ["   ▀█████▀     ", "   bBBBBBb     "],
      ["   █▌▐██▌▐█    ", "   BbBABbBB    "],
      ["   █▀    ▀█    ", "   Bb    bB    "],
    ]),
  ],
};
