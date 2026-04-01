import React, { useRef } from "react";
import { Text, Box } from "ink";

interface SpeechBubbleProps {
  text: string | null;
  tick?: number;
}

interface Segment {
  text: string;
  highlighted: boolean;
}

/** Parse \x01...\x02 markers into segments */
function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  let i = 0;
  while (i < text.length) {
    const start = text.indexOf("\x01", i);
    if (start === -1) {
      segments.push({ text: text.slice(i), highlighted: false });
      break;
    }
    if (start > i) {
      segments.push({ text: text.slice(i, start), highlighted: false });
    }
    const end = text.indexOf("\x02", start + 1);
    if (end === -1) {
      segments.push({ text: text.slice(start + 1), highlighted: true });
      break;
    }
    segments.push({ text: text.slice(start + 1, end), highlighted: true });
    i = end + 1;
  }
  return segments;
}

/** Strip marker chars to get display length */
function displayLength(text: string): number {
  return text.replace(/[\x01\x02]/g, "").length;
}

/** Strip marker chars */
function stripMarkers(text: string): string {
  return text.replace(/[\x01\x02]/g, "");
}

/**
 * Extract a visible window from marked text, preserving marker positions.
 * Returns the substring with markers intact for the visible portion.
 */
function sliceMarkedText(text: string, offset: number, length: number): string {
  let visibleIdx = 0;
  let startCharIdx = -1;
  let endCharIdx = -1;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\x01" || text[i] === "\x02") continue;
    if (visibleIdx === offset && startCharIdx === -1) startCharIdx = i;
    if (visibleIdx === offset + length) {
      endCharIdx = i;
      break;
    }
    visibleIdx++;
  }
  if (startCharIdx === -1) return "";
  if (endCharIdx === -1) endCharIdx = text.length;

  // Extract slice, keeping markers that fall within the range
  let result = "";
  let inHighlight = false;
  // Check if we're inside a highlight at startCharIdx
  for (let i = 0; i < startCharIdx; i++) {
    if (text[i] === "\x01") inHighlight = true;
    else if (text[i] === "\x02") inHighlight = false;
  }
  if (inHighlight) result += "\x01";

  for (let i = startCharIdx; i < endCharIdx; i++) {
    result += text[i];
  }

  // Close any unclosed highlight
  const opens = (result.match(/\x01/g) || []).length;
  const closes = (result.match(/\x02/g) || []).length;
  if (opens > closes) result += "\x02";

  return result;
}

export function SpeechBubble({ text, tick = 0 }: SpeechBubbleProps) {
  const startTickRef = useRef(tick);
  const prevTextRef = useRef(text);

  // Reset scroll position when text changes
  if (text !== prevTextRef.current) {
    startTickRef.current = tick;
    prevTextRef.current = text;
  }

  if (!text) return null;

  const maxWidth = 28;
  const rawLen = displayLength(text);

  let displayText: string;
  if (rawLen <= maxWidth) {
    // Fits — show as-is
    displayText = text;
  } else {
    // Scrolling marquee: pad with gap, slide window
    const gap = "   ";
    const padded = text + gap;
    const paddedLen = displayLength(padded);
    const elapsed = tick - startTickRef.current;
    const offset = (elapsed * 4) % paddedLen;
    displayText = sliceMarkedText(padded, offset, maxWidth);
  }

  const bubbleWidth = Math.min(rawLen, maxWidth);
  const displayStripped = stripMarkers(displayText);
  const pad = bubbleWidth - displayStripped.length;
  const top = "\u250C" + "\u2500".repeat(bubbleWidth + 2) + "\u2510";
  const bottom = "\u2514" + "\u2500".repeat(bubbleWidth + 2) + "\u2518";

  const segments = parseSegments(displayText);

  return (
    <Box flexDirection="column" alignItems="center">
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
