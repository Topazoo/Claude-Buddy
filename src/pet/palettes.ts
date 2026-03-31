import type { Species } from "./species.js";

/** Color tokens used in sprite definitions */
export type ColorToken = "B" | "b" | "A" | "E" | "M" | "H" | " ";

/** A pet's personal color palette, resolved from species + paletteId */
export interface PetPalette {
  name: string;
  body: string;       // 'B' token -- primary body
  bodyDark: string;   // 'b' token -- shadow/depth
  accent: string;     // 'A' token -- belly, chest, markings
  eyes: string;       // 'E' token -- eye color
  mouth: string;      // 'M' token -- nose, mouth, beak
  highlight: string;  // 'H' token -- effects, sparkles, ❗
}

/** Resolve a color token to a hex color using a palette */
export function tokenToColor(token: ColorToken, palette: PetPalette): string | null {
  switch (token) {
    case "B": return palette.body;
    case "b": return palette.bodyDark;
    case "A": return palette.accent;
    case "E": return palette.eyes;
    case "M": return palette.mouth;
    case "H": return palette.highlight;
    case " ": return null;
  }
}

// --- Palette presets per species ---

const CAT_PALETTES: PetPalette[] = [
  { name: "Orange Tabby",  body: "#FF9F43", bodyDark: "#E17055", accent: "#FFEAA7", eyes: "#2ED573", mouth: "#FF6B81", highlight: "#FDCB6E" },
  { name: "Tuxedo",        body: "#2C3E50", bodyDark: "#1A1A2E", accent: "#ECF0F1", eyes: "#F1C40F", mouth: "#FF6B81", highlight: "#FDCB6E" },
  { name: "Gray",           body: "#95A5A6", bodyDark: "#7F8C8D", accent: "#BDC3C7", eyes: "#3498DB", mouth: "#FF6B81", highlight: "#74B9FF" },
  { name: "Calico",        body: "#E67E22", bodyDark: "#D35400", accent: "#F5F5DC", eyes: "#27AE60", mouth: "#FF6B81", highlight: "#FDCB6E" },
  { name: "Void",          body: "#1A1A2E", bodyDark: "#0D0D1A", accent: "#2D2D44", eyes: "#FDCB6E", mouth: "#A29BFE", highlight: "#6C5CE7" },
];

const BIRD_PALETTES: PetPalette[] = [
  { name: "Blue Jay",      body: "#54A0FF", bodyDark: "#2E86DE", accent: "#FECA57", eyes: "#2C3E50", mouth: "#F39C12", highlight: "#74B9FF" },
  { name: "Cardinal",      body: "#E74C3C", bodyDark: "#C0392B", accent: "#F39C12", eyes: "#2C3E50", mouth: "#F1C40F", highlight: "#FDCB6E" },
  { name: "Parrot",        body: "#2ED573", bodyDark: "#00B894", accent: "#E74C3C", eyes: "#F1C40F", mouth: "#F39C12", highlight: "#FECA57" },
  { name: "Sparrow",       body: "#A0522D", bodyDark: "#8B4513", accent: "#F5DEB3", eyes: "#2C3E50", mouth: "#D4A574", highlight: "#DEB887" },
  { name: "Robin",         body: "#636E72", bodyDark: "#2D3436", accent: "#E17055", eyes: "#2C3E50", mouth: "#F39C12", highlight: "#FAB1A0" },
];

const WORM_PALETTES: PetPalette[] = [
  { name: "Rose",          body: "#FF6B81", bodyDark: "#EE5A6F", accent: "#C8A2C8", eyes: "#2C3E50", mouth: "#FF9FF3", highlight: "#FD79A8" },
  { name: "Earthworm",     body: "#A0522D", bodyDark: "#8B4513", accent: "#DEB887", eyes: "#FFFFFF", mouth: "#D4A574", highlight: "#F5DEB3" },
  { name: "Neon",          body: "#6C5CE7", bodyDark: "#5541C9", accent: "#A29BFE", eyes: "#FD79A8", mouth: "#FF9FF3", highlight: "#E056A0" },
  { name: "Mint",          body: "#00B894", bodyDark: "#00997B", accent: "#55EFC4", eyes: "#2C3E50", mouth: "#81ECEC", highlight: "#00CEC9" },
];

const ROBOT_PALETTES: PetPalette[] = [
  { name: "Cyan Chrome",   body: "#00D2D3", bodyDark: "#01A3A4", accent: "#C8D6E5", eyes: "#FF6B6B", mouth: "#DFE6E9", highlight: "#FECA57" },
  { name: "Gold Plated",   body: "#F1C40F", bodyDark: "#D4AC0D", accent: "#7F8C8D", eyes: "#E74C3C", mouth: "#BDC3C7", highlight: "#FDCB6E" },
  { name: "Gunmetal",      body: "#636E72", bodyDark: "#2D3436", accent: "#DFE6E9", eyes: "#00B894", mouth: "#B2BEC3", highlight: "#55EFC4" },
  { name: "Rust",          body: "#E17055", bodyDark: "#D63031", accent: "#FAB1A0", eyes: "#FDCB6E", mouth: "#DFE6E9", highlight: "#FECA57" },
  { name: "Military",      body: "#6B8E23", bodyDark: "#556B2F", accent: "#8FBC8F", eyes: "#FF6347", mouth: "#BDC3C7", highlight: "#F1C40F" },
];

const REPTILE_PALETTES: PetPalette[] = [
  { name: "Emerald",       body: "#2ED573", bodyDark: "#00B894", accent: "#FFC312", eyes: "#E74C3C", mouth: "#FECA57", highlight: "#55EFC4" },
  { name: "Desert",        body: "#D4A574", bodyDark: "#C19A6B", accent: "#F5DEB3", eyes: "#E67E22", mouth: "#DEB887", highlight: "#F39C12" },
  { name: "Poison",        body: "#6C5CE7", bodyDark: "#5541C9", accent: "#00CEC9", eyes: "#FD79A8", mouth: "#A29BFE", highlight: "#E056A0" },
  { name: "Dragon",        body: "#E74C3C", bodyDark: "#C0392B", accent: "#F39C12", eyes: "#F1C40F", mouth: "#FDCB6E", highlight: "#FF6348" },
];

const GHOST_PALETTES: PetPalette[] = [
  { name: "Lavender",      body: "#A29BFE", bodyDark: "#6C5CE7", accent: "#DFE6E9", eyes: "#74B9FF", mouth: "#BDC3C7", highlight: "#DCDDE1" },
  { name: "Crimson",       body: "#E74C3C", bodyDark: "#C0392B", accent: "#FDCB6E", eyes: "#FFFFFF", mouth: "#F39C12", highlight: "#FF6348" },
  { name: "Ethereal",      body: "#DFE6E9", bodyDark: "#B2BEC3", accent: "#74B9FF", eyes: "#A29BFE", mouth: "#C8D6E5", highlight: "#DCDDE1" },
  { name: "Void",          body: "#2D3436", bodyDark: "#1A1A2E", accent: "#636E72", eyes: "#6C5CE7", mouth: "#A29BFE", highlight: "#5541C9" },
  { name: "Jade",          body: "#00B894", bodyDark: "#00997B", accent: "#55EFC4", eyes: "#FDCB6E", mouth: "#81ECEC", highlight: "#00CEC9" },
];

export const PALETTES: Record<Species, PetPalette[]> = {
  cat: CAT_PALETTES,
  bird: BIRD_PALETTES,
  worm: WORM_PALETTES,
  robot: ROBOT_PALETTES,
  reptile: REPTILE_PALETTES,
  ghost: GHOST_PALETTES,
};

/** Pick a palette for a species using seeded PRNG */
export function pickPalette(species: Species, random: () => number): { id: number; palette: PetPalette } {
  const options = PALETTES[species];
  const id = Math.floor(random() * options.length);
  return { id, palette: options[id] };
}

/** Resolve a palette by species + id */
export function getPalette(species: Species, paletteId: number): PetPalette {
  const options = PALETTES[species];
  return options[paletteId % options.length];
}
