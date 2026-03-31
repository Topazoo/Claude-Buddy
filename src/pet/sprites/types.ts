import type { ColorToken } from "../palettes.js";

/** A single frame of sprite animation with per-character color tokens */
export interface SpriteFrame {
  chars: string[];
  tokens: ColorToken[][];
}

/** Full animation set for a species */
export interface SpriteSet {
  idle: SpriteFrame[];       // 4 frames: normal1, normal2, blink, look-around
  startled: SpriteFrame[];   // 2 frames: jump, settle
  excited: SpriteFrame[];    // 2 frames: bounce up, bounce down
  sleeping: SpriteFrame[];   // 2 frames: breathing cycle
  thinking: SpriteFrame[];   // 2 frames: dots cycling
  confused: SpriteFrame[];   // 2 frames: head tilt, settle
  eating: SpriteFrame[];     // 2 frames: nom nom
}

export type AnimationState = keyof SpriteSet;

/** Helper to create a frame from aligned char/token pairs */
export function frame(lines: Array<[string, string]>): SpriteFrame {
  return {
    chars: lines.map(([c]) => c),
    tokens: lines.map(([, t]) => [...t] as ColorToken[]),
  };
}
