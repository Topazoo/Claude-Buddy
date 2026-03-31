export interface DemoReaction {
  delay: number;
  text: string;
  animation: string;
}

export const DEMO_SCRIPT: DemoReaction[] = [
  { delay: 0, text: "Oh! We're coding!", animation: "excited" },
  { delay: 3000, text: "Reading package.json...", animation: "idle" },
  { delay: 5000, text: "Editing src/index.ts -- new code!", animation: "excited" },
  { delay: 8000, text: "Running bun test...", animation: "startled" },
  { delay: 11000, text: "Oof, tests failed...", animation: "startled" },
  { delay: 14000, text: "Fixing the code. You got this.", animation: "idle" },
  { delay: 18000, text: "bun test again...", animation: "startled" },
  { delay: 21000, text: "All tests pass!", animation: "excited" },
  { delay: 25000, text: "That was a demo! I'll react for real now.", animation: "idle" },
];
