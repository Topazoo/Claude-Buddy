import React, { useRef } from "react";
import { Text } from "ink";
import { parseSegments, displayLength, stripMarkers, sliceMarkedText } from "./scroll-utils.js";

interface ScrollTextProps {
  text: string;
  maxWidth: number;
  tick: number;
  dimColor?: boolean;
}

export function ScrollText({ text, maxWidth, tick, dimColor }: ScrollTextProps) {
  const startTickRef = useRef(tick);
  const prevTextRef = useRef(text);

  if (text !== prevTextRef.current) {
    startTickRef.current = tick;
    prevTextRef.current = text;
  }

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

  const segments = parseSegments(displayText);
  const displayStripped = stripMarkers(displayText);
  const pad = maxWidth - displayStripped.length;

  return (
    <Text dimColor={dimColor}>
      {segments.map((seg, i) =>
        seg.highlighted ? (
          <Text key={i} color="#FECA57">{seg.text}</Text>
        ) : (
          <Text key={i}>{seg.text}</Text>
        )
      )}
      {pad > 0 ? " ".repeat(pad) : ""}
    </Text>
  );
}
