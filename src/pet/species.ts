export type Species =
  | "cat"
  | "bird"
  | "worm"
  | "robot"
  | "reptile"
  | "ghost";

export type RarityTier = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface SpeciesDefinition {
  id: Species;
  name: string;
  emoji: string;
  rarity: RarityTier;
  weight: number;
  primaryColor: string;
  accentColor: string;
}

export const SPECIES: Record<Species, SpeciesDefinition> = {
  cat: {
    id: "cat",
    name: "Cat",
    emoji: "🐱",
    rarity: "common",
    weight: 35,
    primaryColor: "#FF9F43",
    accentColor: "#FFEAA7",
  },
  bird: {
    id: "bird",
    name: "Bird",
    emoji: "🐦",
    rarity: "common",
    weight: 35,
    primaryColor: "#54A0FF",
    accentColor: "#FECA57",
  },
  worm: {
    id: "worm",
    name: "Worm",
    emoji: "🪱",
    rarity: "uncommon",
    weight: 15,
    primaryColor: "#FF6B81",
    accentColor: "#C8A2C8",
  },
  robot: {
    id: "robot",
    name: "Robot",
    emoji: "🤖",
    rarity: "rare",
    weight: 8,
    primaryColor: "#00D2D3",
    accentColor: "#C8D6E5",
  },
  reptile: {
    id: "reptile",
    name: "Reptile",
    emoji: "🦎",
    rarity: "epic",
    weight: 5,
    primaryColor: "#2ED573",
    accentColor: "#FFC312",
  },
  ghost: {
    id: "ghost",
    name: "Ghost",
    emoji: "👻",
    rarity: "legendary",
    weight: 2,
    primaryColor: "#A29BFE",
    accentColor: "#DFE6E9",
  },
};

export const ALL_SPECIES: Species[] = Object.keys(SPECIES) as Species[];

export const SPECIES_WEIGHTS: number[] = ALL_SPECIES.map(
  (s) => SPECIES[s].weight,
);

export const RARITY_LABEL: Record<RarityTier, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};
