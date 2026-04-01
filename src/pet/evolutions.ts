import type { Species } from "./species.js";
import type { SpriteFrame } from "./sprites/types.js";
import type { ColorToken } from "./palettes.js";

interface DecorationPatch {
  row: number;      // which row to modify (0-indexed)
  col: number;      // starting column
  chars: string;    // characters to overlay (space = skip/transparent)
  tokens: string;   // token string (space = keep original)
}

interface Evolution {
  level: number;
  name: string;
  patches: Record<Species, DecorationPatch[]>;
}

// --- Evolution tier definitions ---

const EVOLUTIONS: Evolution[] = [
  {
    level: 5,
    name: "Crown",
    patches: {
      // Cat: small crown between ears
      cat: [
        { row: 0, col: 5, chars: "▼▲▼", tokens: "HHH" },
      ],
      // Bird: feather crest
      bird: [
        { row: 0, col: 6, chars: "▲▲", tokens: "HH" },
      ],
      // Worm: bow on head
      worm: [
        { row: 0, col: 5, chars: "♥", tokens: "H" },
      ],
      // Robot: upgraded antenna
      robot: [
        { row: 0, col: 5, chars: "☆●☆", tokens: "HHH" },
      ],
      // Reptile: horn
      reptile: [
        { row: 0, col: 4, chars: "▲▲", tokens: "HH" },
      ],
      // Ghost: halo
      ghost: [
        { row: 0, col: 5, chars: "○○○○", tokens: "HHHH" },
      ],
    },
  },
  {
    level: 10,
    name: "Sparkle Eyes",
    patches: {
      // Cat: eyes at row 1, cols 4 and 8
      cat: [
        { row: 1, col: 4, chars: "★", tokens: "E" },
        { row: 1, col: 8, chars: "★", tokens: "E" },
      ],
      // Bird: eyes at row 1, cols 5 and 9
      bird: [
        { row: 1, col: 5, chars: "★", tokens: "E" },
        { row: 1, col: 9, chars: "★", tokens: "E" },
      ],
      // Worm: eyes at row 2, cols 5 and 9
      worm: [
        { row: 2, col: 5, chars: "★", tokens: "E" },
        { row: 2, col: 9, chars: "★", tokens: "E" },
      ],
      // Robot: eyes at row 2, cols 5 and 8
      robot: [
        { row: 2, col: 5, chars: "◈", tokens: "E" },
        { row: 2, col: 8, chars: "◈", tokens: "E" },
      ],
      // Reptile: eyes at row 1, cols 3 and 7
      reptile: [
        { row: 1, col: 3, chars: "★", tokens: "E" },
        { row: 1, col: 7, chars: "★", tokens: "E" },
      ],
      // Ghost: eyes at row 2, cols 6 and 10
      ghost: [
        { row: 2, col: 6, chars: "★", tokens: "E" },
        { row: 2, col: 10, chars: "★", tokens: "E" },
      ],
    },
  },
  {
    level: 15,
    name: "Aura",
    patches: {
      // Cat: side sparkles on body rows
      cat: [
        { row: 3, col: 0, chars: "░", tokens: "H" },
        { row: 3, col: 13, chars: "░", tokens: "H" },
        { row: 4, col: 0, chars: "░", tokens: "H" },
      ],
      // Bird: wing glow
      bird: [
        { row: 3, col: 1, chars: "░", tokens: "H" },
        { row: 3, col: 13, chars: "░", tokens: "H" },
        { row: 4, col: 0, chars: "░", tokens: "H" },
        { row: 4, col: 14, chars: "░", tokens: "H" },
      ],
      // Worm: trail sparkles
      worm: [
        { row: 5, col: 0, chars: "·", tokens: "H" },
        { row: 6, col: 0, chars: "·", tokens: "H" },
        { row: 4, col: 12, chars: "·", tokens: "H" },
      ],
      // Robot: power glow
      robot: [
        { row: 2, col: 2, chars: "░", tokens: "H" },
        { row: 2, col: 12, chars: "░", tokens: "H" },
        { row: 4, col: 2, chars: "░", tokens: "H" },
        { row: 4, col: 12, chars: "░", tokens: "H" },
      ],
      // Reptile: scale shimmer
      reptile: [
        { row: 3, col: 1, chars: "░", tokens: "H" },
        { row: 4, col: 1, chars: "░", tokens: "H" },
        { row: 5, col: 13, chars: "░", tokens: "H" },
      ],
      // Ghost: wispy trails
      ghost: [
        { row: 5, col: 2, chars: "░", tokens: "A" },
        { row: 5, col: 12, chars: "░", tokens: "A" },
        { row: 6, col: 1, chars: "░", tokens: "A" },
        { row: 6, col: 11, chars: "░", tokens: "A" },
      ],
    },
  },
];

/**
 * Apply evolution decorations to a sprite frame based on level.
 * Returns a new frame with patches overlaid — does not mutate the original.
 */
export function applyEvolutions(frame: SpriteFrame, species: Species, level: number): SpriteFrame {
  // Clone the frame
  const chars = frame.chars.map((line) => [...line]);
  const tokens = frame.tokens.map((row) => [...row]);

  for (const evo of EVOLUTIONS) {
    if (level < evo.level) continue;
    const patches = evo.patches[species];
    if (!patches) continue;

    for (const patch of patches) {
      if (patch.row >= chars.length) continue;
      const row = chars[patch.row];
      const tokenRow = tokens[patch.row];

      for (let i = 0; i < patch.chars.length; i++) {
        const col = patch.col + i;
        if (col >= row.length) continue;
        if (patch.chars[i] === " " && patch.tokens[i] === " ") continue; // transparent

        if (patch.chars[i] !== " ") {
          row[col] = patch.chars[i];
        }
        if (patch.tokens[i] !== " ") {
          tokenRow[col] = patch.tokens[i] as ColorToken;
        }
      }
    }
  }

  return {
    chars: chars.map((c) => c.join("")),
    tokens,
  };
}
