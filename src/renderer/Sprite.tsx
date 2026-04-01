import React from "react";
import { Text, Box } from "ink";
import { getFrame } from "../pet/sprites.js";
import type { Species } from "../pet/species.js";
import type { PetPalette, ColorToken } from "../pet/palettes.js";
import { segmentLine } from "../pet/sprite-render.js";

interface SpriteProps {
  species: Species;
  animation: string;
  tick: number;
  palette: PetPalette;
  level?: number;
}

export function Sprite({ species, animation, tick, palette, level }: SpriteProps) {
  const frame = getFrame(species, animation, tick, level);

  return (
    <Box flexDirection="column" alignItems="center">
      {frame.chars.map((line, row) => {
        const tokens = frame.tokens[row] ?? [];
        const segments = segmentLine(line, tokens, palette);
        return (
          <Box key={row}>
            {segments.map((seg, i) =>
              seg.color ? (
                <Text key={i} color={seg.color}>{seg.text}</Text>
              ) : (
                <Text key={i}>{seg.text}</Text>
              )
            )}
          </Box>
        );
      })}
    </Box>
  );
}
