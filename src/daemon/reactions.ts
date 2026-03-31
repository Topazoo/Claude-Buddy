import type { Stats } from "../pet/state.js";
import type { DetectedPattern } from "./pattern-tracker.js";

export interface Reaction {
  text: string;
  animation: string;
}

interface TextVariant {
  base: string;
  highSnark?: string;
  highWisdom?: string;
  highChaos?: string;
}

// --- Reaction probabilities per tool type ---
// Pattern reactions always fire (handled separately).
const TOOL_REACTION_CHANCE: Record<string, number> = {
  Read: 0.30,
  Edit: 0.50,
  Write: 0.60,
  Bash: 0.50,
  Grep: 0.35,
  Glob: 0.25,
  WebSearch: 0.70,
  WebFetch: 0.50,
  Agent: 0.60,
};

// --- Generic tool reaction templates ---

const TOOL_REACTIONS: Record<string, TextVariant[]> = {
  Bash: [
    { base: "Running {command}...", highSnark: "Oh, we're running `{command}` now? Bold.", highWisdom: "Running `{command}` -- let's see what we learn." },
    { base: "Shell time.", highSnark: "Try not to break anything.", highChaos: "SHELL MODE ACTIVATED!" },
    { base: "Executing...", highWisdom: "A command is worth a thousand keystrokes." },
    { base: "Let's see what happens...", highSnark: "Fingers crossed.", highChaos: "FIRE IN THE HOLE!" },
    { base: "Running something in the terminal.", highWisdom: "The terminal reveals all truths." },
    { base: "Off to the shell we go.", highSnark: "This should be interesting." },
    { base: "Processing...", highChaos: "GO GO GO!" },
    { base: "Testing something out.", highWisdom: "Experimentation is key." },
  ],
  Write: [
    { base: "New file: {file}", highSnark: "Creating {file}. Hope you know what you're doing.", highWisdom: "Building something new." },
    { base: "Writing code!", highChaos: "MORE FILES! FEED ME MORE FILES!" },
    { base: "A new file is born!", highWisdom: "Every great project starts with a single file." },
    { base: "Creating {file}.", highSnark: "Another file enters the world." },
    { base: "Scaffolding away.", highChaos: "BUILD BUILD BUILD!" },
  ],
  Edit: [
    { base: "Editing {file}...", highSnark: "Tweaking {file} again, huh?" },
    { base: "Changes incoming.", highWisdom: "Refining the code." },
    { base: "Modifying {file}.", highSnark: "More changes? Shocking." },
    { base: "Fine-tuning things.", highWisdom: "Attention to detail matters." },
    { base: "Updating {file}.", highChaos: "CHANGE EVERYTHING!" },
    { base: "Making adjustments.", highWisdom: "Iteration is the path to quality." },
    { base: "Patching {file}.", highSnark: "Hopefully for the better." },
  ],
  Read: [
    { base: "Reading {file}...", highWisdom: "Studying {file}. Knowledge is power." },
    { base: "Looking at {file}.", highSnark: "Let's see what we're dealing with." },
    { base: "Checking out {file}.", highWisdom: "Understanding before changing. Smart." },
    { base: "Examining the code.", highChaos: "INVESTIGATING!" },
    { base: "Peeking at {file}.", highSnark: "Nosy, aren't we?" },
    { base: "Reviewing {file}.", highWisdom: "Read first, code second." },
  ],
  Grep: [
    { base: "Searching for {query}...", highWisdom: "Hunting for patterns." },
    { base: "Looking for {query}.", highSnark: "Like finding a needle in a haystack." },
    { base: "Scanning the codebase.", highChaos: "SEEK AND DESTROY!" },
    { base: "Grep time.", highWisdom: "The codebase has secrets to tell." },
  ],
  Glob: [
    { base: "Finding files...", highWisdom: "Mapping the territory." },
    { base: "Looking for files.", highSnark: "Where did I put that thing?" },
    { base: "Scanning directory structure.", highChaos: "ALL THE FILES!" },
  ],
  WebSearch: [
    { base: "Searching: {query}", highSnark: "Googling it. Very original.", highWisdom: "Research: {query}. Smart move." },
    { base: "Looking something up...", highChaos: "TO THE INTERNET!" },
    { base: "Researching: {query}", highWisdom: "Good engineers research first." },
    { base: "Time for some research.", highSnark: "Stack Overflow to the rescue?" },
    { base: "Investigating: {query}", highWisdom: "Gathering intelligence." },
  ],
  WebFetch: [
    { base: "Fetching a page.", highWisdom: "Gathering external knowledge." },
    { base: "Loading a URL.", highSnark: "Ah yes, the internet." },
    { base: "Pulling in external info.", highChaos: "DOWNLOADING THE INTERNET!" },
  ],
  Agent: [
    { base: "Launching a subagent!", highWisdom: "Delegating wisely." },
    { base: "Spinning up help.", highSnark: "Can't do it alone, huh?" },
    { base: "Sending out a scout.", highChaos: "DEPLOY THE AGENTS!" },
    { base: "Parallelizing the work.", highWisdom: "Divide and conquer." },
  ],
  error: [
    { base: "Hmm, that didn't work.", highSnark: "Well, that went well.", highWisdom: "Errors are just learning opportunities.", highChaos: "BOOM! Error!" },
    { base: "Something went wrong...", highSnark: "Shocking." },
    { base: "Error. Let's figure it out.", highWisdom: "Every bug has a story." },
    { base: "Oops.", highSnark: "Called it.", highChaos: "KABOOM!" },
    { base: "That didn't go as planned.", highWisdom: "Failure is feedback." },
  ],
  success: [
    { base: "Nice, that worked!", highSnark: "Oh good, it actually worked.", highWisdom: "Clean execution." },
    { base: "Smooth.", highChaos: "VICTORY!" },
    { base: "Looking good!", highWisdom: "Progress." },
  ],
};

// --- Pattern reaction templates (these always fire) ---

const PATTERN_REACTIONS: Record<string, TextVariant[]> = {
  file_revisit: [
    {
      base: "{message}",
      highSnark: "Oh look, {file} again. Becoming a regular.",
      highWisdom: "Returning to {file} -- persistent debugging?",
    },
  ],
  error_streak_broken: [
    {
      base: "{message}",
      highSnark: "Finally! Only took {n} tries.",
      highChaos: "WE DID IT!",
    },
  ],
  error_streak_3: [
    {
      base: "{message}",
      highWisdom: "Three errors -- maybe try a different angle?",
    },
  ],
  rapid_burst: [
    {
      base: "You're on fire!",
      highSnark: "Whoa, slow down speed demon.",
      highChaos: "ZOOM ZOOM ZOOM!",
    },
  ],
  return_from_idle: [
    {
      base: "Oh, you're back!",
      highSnark: "Oh, you remembered me.",
      highWisdom: "Welcome back. Fresh eyes help.",
    },
  ],
  context_switching: [
    {
      base: "Jumping around a lot -- exploring?",
      highWisdom: "Mapping the codebase. Good strategy.",
    },
  ],
  new_territory: [
    {
      base: "Ooh, venturing into {dir}/",
      highChaos: "NEW TERRITORY! UNCHARTED LANDS!",
    },
  ],
};

// --- Selection logic ---

function fillSlots(template: string, slots: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(slots)) {
    result = result.replace(`{${key}}`, String(value));
  }
  return result;
}

function pickVariant(variants: TextVariant[], stats: Stats, random: () => number): string {
  const variant = variants[Math.floor(random() * variants.length)];
  // Pick the stat-specific variant if the stat is high enough
  if (stats.snark > 15 && variant.highSnark && random() > 0.3) return variant.highSnark;
  if (stats.chaos > 15 && variant.highChaos && random() > 0.4) return variant.highChaos;
  if (stats.wisdom > 15 && variant.highWisdom && random() > 0.3) return variant.highWisdom;
  return variant.base;
}

function animationForEvent(tool: string, isError: boolean, pattern?: DetectedPattern): string {
  if (pattern) {
    if (pattern.id.startsWith("error_streak")) return "startled";
    if (pattern.id === "rapid_burst") return "excited";
    if (pattern.id === "return_from_idle") return "excited";
  }
  if (isError) return "startled";
  if (tool === "Bash") return "startled";
  if (tool === "Write") return "excited";
  return "idle";
}

export interface ReactionInput {
  tool: string;
  isError: boolean;
  context: Record<string, string | number>;
  patterns: DetectedPattern[];
  stats: Stats;
  random: () => number;
}

/**
 * Decide whether and what the pet should say in response to an event.
 * Pattern reactions always fire. Generic reactions are probability-gated.
 */
export function selectReaction(input: ReactionInput): Reaction | null {
  const { tool, isError, context, patterns, stats, random } = input;

  // Pattern reactions take priority and always fire
  if (patterns.length > 0) {
    const pattern = patterns[0]; // Take the most interesting one
    const templates = PATTERN_REACTIONS[pattern.id];
    if (templates) {
      const text = fillSlots(pickVariant(templates, stats, random), {
        ...pattern.slots,
        message: fillSlots(pattern.message, pattern.slots),
      });
      return { text, animation: animationForEvent(tool, isError, pattern) };
    }
    // Fallback: use the pattern's own message
    return {
      text: fillSlots(pattern.message, pattern.slots),
      animation: animationForEvent(tool, isError, pattern),
    };
  }

  // Generic tool reactions with probability gating
  const category = isError ? "error" : tool;
  const chance = isError ? 0.40 : (TOOL_REACTION_CHANCE[tool] ?? 0.05);
  if (random() > chance) return null; // Suppressed

  const templates = TOOL_REACTIONS[category];
  if (!templates) return null;

  const text = fillSlots(pickVariant(templates, stats, random), context);
  return { text, animation: animationForEvent(tool, isError) };
}
