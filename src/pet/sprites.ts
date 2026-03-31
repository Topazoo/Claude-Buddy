import type { Species } from "./species.js";
import type { SpriteFrame, SpriteSet, AnimationState } from "./sprites/types.js";
import { CAT_SPRITES } from "./sprites/cat.js";
import { BIRD_SPRITES } from "./sprites/bird.js";
import { WORM_SPRITES } from "./sprites/worm.js";
import { ROBOT_SPRITES } from "./sprites/robot.js";
import { REPTILE_SPRITES } from "./sprites/reptile.js";
import { GHOST_SPRITES } from "./sprites/ghost.js";

// Re-export types
export type { SpriteFrame, SpriteSet, AnimationState };

export const SPRITES: Record<Species, SpriteSet> = {
  cat: CAT_SPRITES,
  bird: BIRD_SPRITES,
  worm: WORM_SPRITES,
  robot: ROBOT_SPRITES,
  reptile: REPTILE_SPRITES,
  ghost: GHOST_SPRITES,
};

/**
 * Get a frame for rendering with micro-animation support.
 *
 * For idle: 4 frames with probabilistic selection.
 *   - Frames 0-1: normal sway (60% of the time)
 *   - Frame 2: blink (20%)
 *   - Frame 3: look-around (20%)
 *
 * For other states: alternate between available frames.
 */
export function getFrame(
  species: Species,
  state: string,
  tick: number,
): SpriteFrame {
  const spriteSet = SPRITES[species];
  const animState = mapToAnimState(state);
  const frames = spriteSet[animState];

  if (animState === "idle" && frames.length >= 4) {
    // Micro-animation: every 6 ticks, chance for a variant
    const cycle = tick % 12;
    if (cycle === 5) return frames[2]; // blink
    if (cycle === 9) return frames[3]; // look-around
    return frames[tick % 2]; // normal sway
  }

  // For multi-frame states, alternate
  return frames[tick % frames.length];
}

/** Map mood/event state strings to animation state keys */
function mapToAnimState(state: string): AnimationState {
  switch (state) {
    case "idle":
    case "happy":
    case "focused":
      return "idle";
    case "startled":
      return "startled";
    case "excited":
      return "excited";
    case "sleeping":
    case "sleepy":
      return "sleeping";
    case "thinking":
      return "thinking";
    case "confused":
      return "confused";
    case "eating":
      return "eating";
    case "bored":
      return "idle"; // bored uses idle with slower feel
    default:
      return "idle";
  }
}
