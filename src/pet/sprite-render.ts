import type { ColorToken, PetPalette } from "./palettes.js";
import { tokenToColor } from "./palettes.js";

/** A segment of characters sharing one color */
export interface ColorSegment {
  text: string;
  color: string | null; // hex color, or null for default/transparent
}

/**
 * Convert a line of chars + tokens into colored segments.
 * Groups consecutive same-token characters for efficient rendering.
 */
export function segmentLine(chars: string, tokens: ColorToken[], palette: PetPalette): ColorSegment[] {
  const segments: ColorSegment[] = [];
  let currentToken: ColorToken | null = null;
  let currentText = "";

  for (let i = 0; i < chars.length; i++) {
    const token = tokens[i] ?? " ";
    if (token !== currentToken) {
      if (currentText) {
        segments.push({ text: currentText, color: currentToken ? tokenToColor(currentToken, palette) : null });
      }
      currentToken = token;
      currentText = chars[i];
    } else {
      currentText += chars[i];
    }
  }
  if (currentText) {
    segments.push({ text: currentText, color: currentToken ? tokenToColor(currentToken, palette) : null });
  }

  return segments;
}

/**
 * Render a full sprite frame to ANSI-colored string for console output.
 */
export function renderFrameAnsi(
  chars: string[],
  tokens: ColorToken[][],
  palette: PetPalette,
): string {
  const lines: string[] = [];
  for (let row = 0; row < chars.length; row++) {
    const rowTokens = tokens[row] ?? [];
    const segments = segmentLine(chars[row], rowTokens, palette);
    let line = "";
    for (const seg of segments) {
      if (seg.color) {
        line += hexToAnsi(seg.color) + seg.text + "\x1b[0m";
      } else {
        line += seg.text;
      }
    }
    lines.push(line);
  }
  return lines.join("\n");
}

/** Convert hex color to ANSI truecolor escape */
function hexToAnsi(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `\x1b[38;2;${r};${g};${b}m`;
}
