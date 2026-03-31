import type { Species } from "./species.js";

const ADJECTIVES = [
  "Captain",
  "Professor",
  "Tiny",
  "Cosmic",
  "Pixel",
  "Binary",
  "Quantum",
  "Turbo",
  "Mega",
  "Nano",
  "Hyper",
  "Ultra",
  "Major",
  "Chief",
  "Agent",
  "Sir",
  "Doctor",
  "Sergeant",
  "Admiral",
  "Grand",
];

const NOUNS: Record<Species, string[]> = {
  cat: [
    "Whiskers", "Mittens", "Shadow", "Patches", "Mochi",
    "Noodle", "Biscuit", "Cleo", "Luna", "Felix",
    "Marble", "Socks", "Pepper", "Gizmo", "Tofu",
  ],
  bird: [
    "Feathers", "Chirp", "Peep", "Talon", "Robin",
    "Wren", "Sparrow", "Pip", "Flutter", "Beak",
    "Plume", "Crow", "Finch", "Swift", "Raven",
  ],
  worm: [
    "Squiggle", "Noodle", "Wiggles", "Inch", "Slither",
    "Curly", "Twist", "Zigzag", "Stretch", "Loop",
    "Spiral", "Bendy", "Slinky", "Nibble", "Muddy",
  ],
  robot: [
    "Bolt", "Spark", "Circuit", "Chip", "Gear",
    "Servo", "Pixel", "Bit", "Core", "Diode",
    "Amp", "Flux", "Zinc", "Chrome", "Watt",
  ],
  reptile: [
    "Scale", "Spike", "Fang", "Rex", "Crest",
    "Iggy", "Drake", "Basil", "Sage", "Ember",
    "Flint", "Jasper", "Onyx", "Moss", "Ridge",
  ],
  ghost: [
    "Phantom", "Shade", "Wisp", "Echo", "Specter",
    "Wraith", "Mist", "Vapor", "Gloom", "Haze",
    "Flicker", "Drift", "Fade", "Aura", "Void",
  ],
};

/** Generate a name like "Captain Whiskers" from seeded PRNG */
export function generateName(species: Species, random: () => number): string {
  const adj = ADJECTIVES[Math.floor(random() * ADJECTIVES.length)];
  const nouns = NOUNS[species];
  const noun = nouns[Math.floor(random() * nouns.length)];
  return `${adj} ${noun}`;
}
