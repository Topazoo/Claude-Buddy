import React from "react";
import { Text, Box } from "ink";

export interface Particle {
  x: number;       // column position (0-15)
  y: number;       // row position (0 = top of 3-line region)
  char: string;
  color: string;   // hex color
  lifetime: number; // ticks remaining
  dy?: number;     // vertical movement per tick (positive = down)
  dx?: number;     // horizontal drift per tick
}

interface ParticlesProps {
  particles: Particle[];
  width?: number;
  height?: number;
}

/** Advance particles by one tick: move, age, filter expired */
export function tickParticles(particles: Particle[]): Particle[] {
  return particles
    .map((p) => ({
      ...p,
      lifetime: p.lifetime - 1,
      y: p.y + (p.dy ?? 0),
      x: p.x + (p.dx ?? 0),
    }))
    .filter((p) => p.lifetime > 0 && p.y >= 0 && p.y < 3);
}

/** Sparkles for level-up and trait unlock */
export function spawnSparkles(): Particle[] {
  const chars = ["✦", "✧", "⋆", "·", "✦", "✧"];
  const colors = ["#FECA57", "#FF9FF3", "#48DBFB", "#FECA57", "#1DD1A1"];
  const particles: Particle[] = [];
  for (let i = 0; i < 6; i++) {
    particles.push({
      x: Math.floor(Math.random() * 14) + 1,
      y: Math.floor(Math.random() * 3),
      char: chars[i % chars.length],
      color: colors[i % colors.length],
      lifetime: 4 + Math.floor(Math.random() * 5),
    });
  }
  return particles;
}

/** Error rain for error streaks */
export function spawnErrorRain(): Particle[] {
  const chars = ["!", "×", "‼", "!", "×"];
  const particles: Particle[] = [];
  for (let i = 0; i < 4; i++) {
    particles.push({
      x: Math.floor(Math.random() * 14) + 1,
      y: 0,
      char: chars[i % chars.length],
      color: "#FF6B6B",
      lifetime: 3 + Math.floor(Math.random() * 3),
      dy: 1,
    });
  }
  return particles;
}

/** Confetti for special achievements */
export function spawnConfetti(): Particle[] {
  const chars = ["▪", "◆", "★", "●", "■", "◆"];
  const colors = ["#FF6B6B", "#FECA57", "#48DBFB", "#1DD1A1", "#FF9FF3", "#FF9F43"];
  const particles: Particle[] = [];
  for (let i = 0; i < 8; i++) {
    particles.push({
      x: Math.floor(Math.random() * 14) + 1,
      y: Math.floor(Math.random() * 2),
      char: chars[i % chars.length],
      color: colors[i % colors.length],
      lifetime: 5 + Math.floor(Math.random() * 6),
      dx: Math.random() > 0.5 ? 1 : -1,
    });
  }
  return particles;
}

/** Render a fixed 3-line particle region */
export function Particles({ particles, width = 16, height = 3 }: ParticlesProps) {
  if (particles.length === 0) return null;

  const lines: React.ReactNode[] = [];

  for (let row = 0; row < height; row++) {
    // Build a sparse map of particles on this row
    const rowParticles = particles.filter(
      (p) => Math.floor(p.y) === row && Math.floor(p.x) >= 0 && Math.floor(p.x) < width
    );

    if (rowParticles.length === 0) {
      lines.push(<Text key={row}>{" ".repeat(width)}</Text>);
      continue;
    }

    // Place particles on a blank line
    const cells: Array<{ char: string; color: string } | null> = new Array(width).fill(null);
    for (const p of rowParticles) {
      const col = Math.floor(p.x);
      if (col >= 0 && col < width) {
        cells[col] = { char: p.char, color: p.color };
      }
    }

    // Build segments for efficient rendering
    const segments: React.ReactNode[] = [];
    let buf = "";
    let bufColor: string | null = null;

    for (let col = 0; col <= width; col++) {
      const cell = col < width ? cells[col] : null;
      const cellColor = cell ? cell.color : null;
      const cellChar = cell ? cell.char : " ";

      if (cellColor !== bufColor) {
        if (buf) {
          segments.push(
            bufColor
              ? <Text key={`${row}-${segments.length}`} color={bufColor}>{buf}</Text>
              : <Text key={`${row}-${segments.length}`}>{buf}</Text>
          );
        }
        buf = col < width ? cellChar : "";
        bufColor = cellColor;
      } else {
        buf += col < width ? cellChar : "";
      }
    }
    if (buf) {
      segments.push(
        bufColor
          ? <Text key={`${row}-${segments.length}`} color={bufColor}>{buf}</Text>
          : <Text key={`${row}-${segments.length}`}>{buf}</Text>
      );
    }

    lines.push(<Box key={row}>{segments}</Box>);
  }

  return (
    <Box flexDirection="column" alignItems="center">
      {lines}
    </Box>
  );
}
