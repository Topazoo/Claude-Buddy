import { frame } from "./types.js";
import type { SpriteSet } from "./types.js";

// Cat: Pointed ears, round face, visible tail, whisker hints
// 7 lines tall. Body=B, dark=b, accent(belly)=A, eyes=E, mouth=M, highlight=H

export const CAT_SPRITES: SpriteSet = {
  idle: [
    // Frame 0: normal, tail right
    frame([
      ["  ▄ ▄▄▄▄▄ ▄    ", "  B BBBBB B    "],
      [" █▀ ◕   ◕ ▀█   ", " BB EEEEE BB   "],
      [" █   ▄▀▄   █   ", " B   MMM   B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      ["   ██▄▄▄██     ", "   BBAAABB     "],
      ["   ██   ██  ▄▀ ", "   BB   BB  Bb "],
      ["   ▀▀   ▀▀  ▀  ", "   bb   bb  b  "],
    ]),
    // Frame 1: normal, tail curled
    frame([
      ["  ▄ ▄▄▄▄▄ ▄    ", "  B BBBBB B    "],
      [" █▀ ◕   ◕ ▀█   ", " BB EEEEE BB   "],
      [" █   ▄▀▄   █   ", " B   MMM   B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      ["   ██▄▄▄██     ", "   BBAAABB     "],
      ["   █▌   ▐█ ▄▀  ", "   Bb   bB Bb  "],
      ["   ▀▀   ▀▀ ▀   ", "   bb   bb b   "],
    ]),
    // Frame 2: blink (eyes closed)
    frame([
      ["  ▄ ▄▄▄▄▄ ▄    ", "  B BBBBB B    "],
      [" █▀ ▄   ▄ ▀█   ", " BB EEEEE BB   "],
      [" █   ▄▀▄   █   ", " B   MMM   B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      ["   ██▄▄▄██     ", "   BBAAABB     "],
      ["   ██   ██  ▄▀ ", "   BB   BB  Bb "],
      ["   ▀▀   ▀▀  ▀  ", "   bb   bb  b  "],
    ]),
    // Frame 3: look right
    frame([
      ["  ▄ ▄▄▄▄▄ ▄    ", "  B BBBBB B    "],
      [" █▀  ◕  ◕ ▀█   ", " BB  EE EE BB  "],
      [" █   ▄▀▄   █   ", " B   MMM   B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      ["   ██▄▄▄██     ", "   BBAAABB     "],
      ["   ██   ██  ▄▀ ", "   BB   BB  Bb "],
      ["   ▀▀   ▀▀  ▀  ", "   bb   bb  b  "],
    ]),
  ],
  startled: [
    // Frame 0: jump up, wide eyes
    frame([
      ["      ❗        ", "      H        "],
      ["  ▄ ▄▄▄▄▄ ▄    ", "  B BBBBB B    "],
      [" █▀ ◉   ◉ ▀█   ", " BB EEEEE BB   "],
      [" █    ▿    █   ", " B    M    B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      ["   ██   ██     ", "   BB   BB     "],
      ["   ▀▀   ▀▀     ", "   bb   bb     "],
    ]),
    // Frame 1: settling
    frame([
      ["  ▄ ▄▄▄▄▄ ▄    ", "  B BBBBB B    "],
      [" █▀ ◉   ◉ ▀█   ", " BB EEEEE BB   "],
      [" █    ▿    █   ", " B    M    B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      ["   ██▄▄▄██     ", "   BBAAABB     "],
      ["   ██   ██     ", "   BB   BB     "],
      ["   ▀▀   ▀▀     ", "   bb   bb     "],
    ]),
  ],
  excited: [
    // Frame 0: bounce up, speed lines
    frame([
      ["  ▄ ▄▄▄▄▄ ▄    ", "  B BBBBB B    "],
      [" █▀ ▸   ▸ ▀█   ", " BB EEEEE BB   "],
      [" █   ▀▀▀   █   ", " B   MMM   B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      [" ░ ██▄▄▄██ ░   ", " H BBAAABB H   "],
      [" ░ ██   ██ ░   ", " H BB   BB H   "],
      ["   ▀▀   ▀▀     ", "   bb   bb     "],
    ]),
    // Frame 1: bounce down
    frame([
      ["                ", "                "],
      ["  ▄ ▄▄▄▄▄ ▄    ", "  B BBBBB B    "],
      [" █▀ ▸   ▸ ▀█   ", " BB EEEEE BB   "],
      [" █   ▀▀▀   █   ", " B   MMM   B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      [" ░ ██▄▄▄██ ░   ", " H BBAAABB H   "],
      ["   █▀   ▀█     ", "   Bb   bB     "],
    ]),
  ],
  sleeping: [
    // Frame 0: curled up, eyes closed
    frame([
      ["           zzZ  ", "           HHH  "],
      ["  ▄ ▄▄▄▄▄ ▄    ", "  B BBBBB B    "],
      [" █▀ ▄   ▄ ▀█   ", " BB bBBBb BB   "],
      [" █   ▄▄▄   █   ", " B   MMM   B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      ["   █████████▄   ", "   BBBBBBBBBBb  "],
      ["   ▀▀▀▀▀▀▀▀▀   ", "   bbbbbbbbb   "],
    ]),
    // Frame 1: breathing
    frame([
      ["          zzZ   ", "          HHH   "],
      ["  ▄ ▄▄▄▄▄ ▄    ", "  B BBBBB B    "],
      [" █▀ ▄   ▄ ▀█   ", " BB bBBBb BB   "],
      [" █   ▄▄▄   █   ", " B   MMM   B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      ["   █████████▄   ", "   BBBBBBBBBBb  "],
      ["   ▀▀▀▀▀▀▀▀▀   ", "   bbbbbbbbb   "],
    ]),
  ],
  thinking: [
    // Frame 0: dots appearing
    frame([
      ["  ▄ ▄▄▄▄▄ ▄  · ", "  B BBBBB B  H "],
      [" █▀ ◕   ◕ ▀█ · ", " BB EEEEE BB H "],
      [" █   ▄▄▄   █   ", " B   MMM   B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      ["   ██▄▄▄██     ", "   BBAAABB     "],
      ["   ██   ██  ▄▀ ", "   BB   BB  Bb "],
      ["   ▀▀   ▀▀  ▀  ", "   bb   bb  b  "],
    ]),
    // Frame 1: more dots
    frame([
      ["  ▄ ▄▄▄▄▄ ▄ ·· ", "  B BBBBB B HH "],
      [" █▀ ◕   ◕ ▀█·  ", " BB EEEEE BBH  "],
      [" █   ▄▄▄   █   ", " B   MMM   B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      ["   ██▄▄▄██     ", "   BBAAABB     "],
      ["   ██   ██  ▄▀ ", "   BB   BB  Bb "],
      ["   ▀▀   ▀▀  ▀  ", "   bb   bb  b  "],
    ]),
  ],
  confused: [
    // Frame 0: tilted, question mark
    frame([
      ["      ？        ", "      H        "],
      ["  ▄ ▄▄▄▄▄ ▄    ", "  B BBBBB B    "],
      [" █▀ ◑   ◑ ▀█   ", " BB EEEEE BB   "],
      [" █   ▄~▄   █   ", " B   MMM   B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      ["   ██▄▄▄██     ", "   BBAAABB     "],
      ["   ██   ██     ", "   BB   BB     "],
    ]),
    // Frame 1: settling back
    frame([
      ["  ▄ ▄▄▄▄▄ ▄    ", "  B BBBBB B    "],
      [" █▀ ◑   ◑ ▀█   ", " BB EEEEE BB   "],
      [" █   ▄~▄   █   ", " B   MMM   B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      ["   ██▄▄▄██     ", "   BBAAABB     "],
      ["   ██   ██  ▄▀ ", "   BB   BB  Bb "],
      ["   ▀▀   ▀▀  ▀  ", "   bb   bb  b  "],
    ]),
  ],
  eating: [
    // Frame 0: mouth open
    frame([
      ["  ▄ ▄▄▄▄▄ ▄    ", "  B BBBBB B    "],
      [" █▀ ◕   ◕ ▀█   ", " BB EEEEE BB   "],
      [" █   ▀█▀   █   ", " B   MMM   B   "],
      [" ▀█▄▄███▄▄█▀ ♨ ", " bbBBAAAbBBb H "],
      ["   ██▄▄▄██     ", "   BBAAABB     "],
      ["   ██   ██  ▄▀ ", "   BB   BB  Bb "],
      ["   ▀▀   ▀▀  ▀  ", "   bb   bb  b  "],
    ]),
    // Frame 1: mouth closed (nom)
    frame([
      ["  ▄ ▄▄▄▄▄ ▄    ", "  B BBBBB B    "],
      [" █▀ ◕   ◕ ▀█   ", " BB EEEEE BB   "],
      [" █   ▄▀▄   █   ", " B   MMM   B   "],
      [" ▀█▄▄███▄▄█▀   ", " bbBBAAAbBBb   "],
      ["   ██▄▄▄██     ", "   BBAAABB     "],
      ["   ██   ██  ▄▀ ", "   BB   BB  Bb "],
      ["   ▀▀   ▀▀  ▀  ", "   bb   bb  b  "],
    ]),
  ],
};
