import React, { useRef } from "react";
import { Text, Box } from "ink";
import { parseSegments, displayLength, stripMarkers, sliceMarkedText } from "./scroll-utils.js";

interface SpeechBubbleProps {
  text: string | null;
  tick?: number;
}

export function SpeechBubble({ text, tick = 0 }: SpeechBubbleProps) {
  const startTickRef = useRef(tick);
  const prevTextRef = useRef(text);

  if (text !== prevTextRef.current) {
    startTickRef.current = tick;
    prevTextRef.current = text;
  }

  if (!text) return null;

  const maxWidth = 50;
  const rawLen = displayLength(text);

  let displayText: string;
  if (rawLen <= maxWidth) {
    displayText = text;
  } else {
    const gap = "   ";
    const padded = text + gap;
    const paddedLen = displayLength(padded);
    const elapsed = tick - startTickRef.current;
    const offset = (elapsed * 4) % paddedLen;
    displayText = sliceMarkedText(padded, offset, maxWidth);
  }

  const bubbleWidth = maxWidth;
  const displayStripped = stripMarkers(displayText);
  const pad = bubbleWidth - displayStripped.length;
  const top = "\u250C" + "\u2500".repeat(bubbleWidth + 2) + "\u2510";
  const bottom = "\u2514" + "\u2500".repeat(bubbleWidth + 2) + "\u2518";

  const segments = parseSegments(displayText);

  return (
    <Box flexDirection="column">
      <Text>{top}</Text>
      <Text>
        {"\u2502"}{" "}
        {segments.map((seg, i) =>
          seg.highlighted ? (
            <Text key={i} color="#FECA57">{seg.text}</Text>
          ) : (
            <Text key={i}>{seg.text}</Text>
          )
        )}
        {pad > 0 ? " ".repeat(pad) : ""}
        {" "}{"\u2502"}
      </Text>
      <Text>{bottom}</Text>
    </Box>
  );
}
