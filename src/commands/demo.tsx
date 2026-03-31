import React, { useEffect, useReducer } from "react";
import { render, Box, Text, useApp } from "ink";
import { SpeechBubble } from "../renderer/SpeechBubble.js";
import { Sprite } from "../renderer/Sprite.js";
import { PetInfo } from "../renderer/PetInfo.js";
import { Divider } from "../renderer/Divider.js";
import { loadGlobalState } from "../persistence.js";
import { DEMO_SCRIPT } from "../fixtures/demo-script.js";
import type { Species } from "../pet/species.js";
import { getPalette } from "../pet/palettes.js";

interface DemoState {
  speechText: string | null;
  animation: string;
  tick: number;
  step: number;
  done: boolean;
}

type DemoAction =
  | { type: "REACTION"; text: string; animation: string; step: number }
  | { type: "TICK" }
  | { type: "DONE" };

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "REACTION":
      return { ...state, speechText: action.text, animation: action.animation, step: action.step };
    case "TICK":
      return { ...state, tick: state.tick + 1 };
    case "DONE":
      return { ...state, done: true };
    default:
      return state;
  }
}

function DemoApp() {
  const { exit } = useApp();
  const pet = loadGlobalState();
  const [state, dispatch] = useReducer(demoReducer, {
    speechText: null,
    animation: "idle",
    tick: 0,
    step: 0,
    done: false,
  });

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    for (let i = 0; i < DEMO_SCRIPT.length; i++) {
      const reaction = DEMO_SCRIPT[i];
      timers.push(setTimeout(() => {
        dispatch({ type: "REACTION", text: reaction.text, animation: reaction.animation, step: i });
      }, reaction.delay));
    }
    // End demo
    const last = DEMO_SCRIPT[DEMO_SCRIPT.length - 1];
    timers.push(setTimeout(() => {
      dispatch({ type: "DONE" });
      setTimeout(() => exit(), 3000);
    }, last.delay + 3000));

    return () => timers.forEach(clearTimeout);
  }, [exit]);

  useEffect(() => {
    const interval = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!pet) {
    return (
      <Box padding={1}>
        <Text>No buddy found. Run `claude-buddy hatch` first.</Text>
      </Box>
    );
  }

  const species = pet.species as Species;
  const palette = getPalette(species, pet.paletteId ?? 0);

  return (
    <Box flexDirection="column" padding={1}>
      <SpeechBubble text={state.speechText} />
      <Sprite species={species} animation={state.animation} tick={state.tick} palette={palette} />
      <Text> </Text>
      <PetInfo
        name={pet.name}
        species={species}
        level={pet.level}
        mood={state.animation === "excited" ? "excited" : "happy"}
        traits={[]}
      />
      <Text> </Text>
      <Divider />
      {state.done && (
        <Box paddingLeft={1}>
          <Text color="#2ED573">Demo complete! Your buddy is ready.</Text>
        </Box>
      )}
    </Box>
  );
}

export async function demoCommand(): Promise<void> {
  const pet = loadGlobalState();
  if (!pet) {
    console.log("\nNo buddy found. Run `claude-buddy hatch` first.\n");
    return;
  }
  console.log("\n  Starting 30-second demo...\n");
  const { waitUntilExit } = render(React.createElement(DemoApp));
  await waitUntilExit();
}
