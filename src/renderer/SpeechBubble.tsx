import React from "react";
import { Text, Box } from "ink";

interface SpeechBubbleProps {
  text: string | null;
}

export function SpeechBubble({ text }: SpeechBubbleProps) {
  if (!text) return null;

  // Single-line bubble, truncate if needed
  const maxWidth = 28;
  const display = text.length > maxWidth ? text.slice(0, maxWidth - 1) + "\u2026" : text;
  const top = "\u250C" + "\u2500".repeat(display.length + 2) + "\u2510";
  const bottom = "\u2514" + "\u2500".repeat(display.length + 2) + "\u2518";

  return (
    <Box flexDirection="column" alignItems="center">
      <Text>{top}</Text>
      <Text>{"\u2502"} {display} {"\u2502"}</Text>
      <Text>{bottom}</Text>
    </Box>
  );
}
