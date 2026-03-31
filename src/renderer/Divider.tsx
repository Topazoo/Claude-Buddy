import React from "react";
import { Text, Box } from "ink";

interface DividerProps {
  label?: string;
  width?: number;
}

export function Divider({ label, width = 30 }: DividerProps) {
  if (label) {
    const lineLen = Math.max(0, width - label.length - 3);
    const line = "\u2500".repeat(lineLen);
    return (
      <Box>
        <Text dimColor> {"\u2500"} {label} {line}</Text>
      </Box>
    );
  }
  return (
    <Box>
      <Text dimColor>{"\u2500".repeat(width)}</Text>
    </Box>
  );
}
