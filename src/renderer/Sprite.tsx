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
  bordered?: boolean;
}

export function Sprite({ species, animation, tick, palette, level, bordered }: SpriteProps) {
  const frame = getFrame(species, animation, tick, level);
  const width = 18; // sprite chars (16) + 1 padding each side

  const rows = frame.chars.map((line, row) => {
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
  });

  if (!bordered) {
    return <Box flexDirection="column" alignItems="center">{rows}</Box>;
  }

  const top = "╭" + "─".repeat(width) + "╮";
  const bot = "╰" + "─".repeat(width) + "╯";
  const pad = " ";

  return (
    <Box flexDirection="column">
      <Text dimColor>{top}</Text>
      {rows.map((row, i) => (
        <Box key={i}>
          <Text dimColor>│</Text><Text>{pad}</Text>{row}<Text>{pad}</Text><Text dimColor>│</Text>
        </Box>
      ))}
      <Text dimColor>{bot}</Text>
    </Box>
  );
}
