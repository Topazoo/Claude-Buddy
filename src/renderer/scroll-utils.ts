export interface Segment {
  text: string;
  highlighted: boolean;
}

/** Parse \x01...\x02 markers into segments */
export function parseSegments(text: string): Segment[] {
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
export function displayLength(text: string): number {
  return text.replace(/[\x01\x02]/g, "").length;
}

/** Strip marker chars */
export function stripMarkers(text: string): string {
  return text.replace(/[\x01\x02]/g, "");
}

/**
 * Extract a visible window from marked text, preserving marker positions.
 */
export function sliceMarkedText(text: string, offset: number, length: number): string {
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

  let result = "";
  let inHighlight = false;
  for (let i = 0; i < startCharIdx; i++) {
    if (text[i] === "\x01") inHighlight = true;
    else if (text[i] === "\x02") inHighlight = false;
  }
  if (inHighlight) result += "\x01";

  for (let i = startCharIdx; i < endCharIdx; i++) {
    result += text[i];
  }

  const opens = (result.match(/\x01/g) || []).length;
  const closes = (result.match(/\x02/g) || []).length;
  if (opens > closes) result += "\x02";

  return result;
}
