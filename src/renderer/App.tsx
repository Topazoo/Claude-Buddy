import React, { useReducer, useEffect, useRef, useCallback } from "react";
import { Box, Text } from "ink";
import { SpeechBubble } from "./SpeechBubble.js";
import { Sprite } from "./Sprite.js";
import { PetInfo } from "./PetInfo.js";
import { StatsBar } from "./StatsBar.js";
import { ActivityLog } from "./ActivityLog.js";
import { KeyHints } from "./KeyHints.js";
import { Divider } from "./Divider.js";
import { SocketClient } from "../socket-client.js";
import { loadGlobalState } from "../persistence.js";
import type { PetState } from "../pet/state.js";
import type { Species } from "../pet/species.js";
import { getPalette } from "../pet/palettes.js";
import { computeLevel } from "../pet/state.js";

interface RecentEvent {
  summary: string;
  timestamp: number;
}

interface AppState {
  pet: PetState | null;
  speechText: string | null;
  speechTimeout: number;
  animation: string;
  tick: number;
  recentEvents: RecentEvent[];
  connected: boolean;
}

type Action =
  | { type: "REACTION"; text: string; animation: string }
  | { type: "CLEAR_SPEECH" }
  | { type: "TICK" }
  | { type: "SET_CONNECTED"; connected: boolean }
  | { type: "STATE_UPDATE"; state: PetState }
  | { type: "TOOL_EVENT"; event: RecentEvent };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "REACTION":
      return {
        ...state,
        speechText: action.text,
        animation: action.animation,
        speechTimeout: Date.now() + 8000,
      };
    case "CLEAR_SPEECH":
      if (state.speechTimeout && Date.now() >= state.speechTimeout) {
        return { ...state, speechText: null, animation: "idle" };
      }
      return state;
    case "TICK":
      return { ...state, tick: state.tick + 1 };
    case "SET_CONNECTED":
      return { ...state, connected: action.connected };
    case "STATE_UPDATE":
      return { ...state, pet: action.state };
    case "TOOL_EVENT":
      return { ...state, recentEvents: [...state.recentEvents.slice(-5), action.event] };
    default:
      return state;
  }
}

interface AppProps {
  demo?: boolean;
}

export function App({ demo }: AppProps) {
  const clientRef = useRef<SocketClient | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [state, dispatch] = useReducer(reducer, {
    pet: loadGlobalState(),
    speechText: null,
    speechTimeout: 0,
    animation: "idle",
    tick: 0,
    recentEvents: [],
    connected: false,
  });

  const handleMessage = useCallback((msg: Record<string, unknown>) => {
    if (msg.type === "reaction") {
      dispatch({
        type: "REACTION",
        text: msg.text as string,
        animation: msg.animation as string,
      });
    } else if (msg.type === "state_update" && msg.state) {
      dispatch({ type: "STATE_UPDATE", state: msg.state as PetState });
    } else if (msg.type === "tool_event") {
      dispatch({
        type: "TOOL_EVENT",
        event: {
          summary: msg.summary as string,
          timestamp: msg.timestamp as number,
        },
      });
    } else if (msg.type === "trait_unlock") {
      dispatch({
        type: "REACTION",
        text: `New trait: ${msg.trait}!`,
        animation: "excited",
      });
    }
  }, []);

  const connectToDaemon = useCallback(() => {
    const client = new SocketClient();
    clientRef.current = client;

    client.connect(handleMessage).then(() => {
      dispatch({ type: "SET_CONNECTED", connected: true });
      client.send({ type: "get_state" });
    }).catch(() => {
      dispatch({ type: "SET_CONNECTED", connected: false });
      reconnectTimerRef.current = setTimeout(() => connectToDaemon(), 5000);
    });
  }, [handleMessage]);

  useEffect(() => {
    if (demo) return;
    connectToDaemon();
    return () => {
      clientRef.current?.disconnect();
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, [demo, connectToDaemon]);

  // Animation tick
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "TICK" });
      dispatch({ type: "CLEAR_SPEECH" });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!state.pet) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text>No buddy found.</Text>
        <Text dimColor>Run: claude-buddy hatch</Text>
      </Box>
    );
  }

  const species = state.pet.species as Species;
  const palette = getPalette(species, state.pet.paletteId ?? 0);
  const traits = Object.entries(state.pet.traits).map(([id, t]) => `${id} Lv.${t.level}`);
  const c = state.pet.activityCounters;
  const totalXp = c.bashCalls + c.readCalls + c.writeCalls + c.editCalls + c.searchCalls + c.fetchCalls;
  const level = computeLevel(c, Object.keys(state.pet.traits).length);
  const nextLevelXp = Math.pow(level, 2) * 100;
  const xpProgress = Math.min(totalXp / Math.max(nextLevelXp, 1), 1);
  const xpBarWidth = 15;
  const xpFilled = Math.round(xpProgress * xpBarWidth);

  return (
    <Box flexDirection="column" padding={1}>
      <SpeechBubble text={state.speechText} />
      <Sprite
        species={species}
        animation={state.animation}
        tick={state.tick}
        palette={palette}
      />
      <Text> </Text>
      <PetInfo
        name={state.pet.name}
        species={species}
        level={level}
        mood={state.pet.mood}
        traits={traits}
      />
      <Text> </Text>
      <StatsBar mood={state.pet.mood} totalXp={totalXp} />
      <Box paddingLeft={1}>
        <Text>
          <Text dimColor>XP </Text>
          <Text color="#FECA57">{"█".repeat(xpFilled)}</Text>
          <Text dimColor>{"░".repeat(xpBarWidth - xpFilled)}</Text>
          <Text dimColor> {totalXp}</Text>
        </Text>
      </Box>
      <Text> </Text>
      <Divider label="Stats" />
      <Box flexDirection="column" paddingLeft={1}>
        <Text dimColor>  DBG {"█".repeat(Math.round(state.pet.stats.debugging / 2))}{"░".repeat(10 - Math.round(state.pet.stats.debugging / 2))} {state.pet.stats.debugging}</Text>
        <Text dimColor>  PAT {"█".repeat(Math.round(state.pet.stats.patience / 2))}{"░".repeat(10 - Math.round(state.pet.stats.patience / 2))} {state.pet.stats.patience}</Text>
        <Text dimColor>  CHS {"█".repeat(Math.round(state.pet.stats.chaos / 2))}{"░".repeat(10 - Math.round(state.pet.stats.chaos / 2))} {state.pet.stats.chaos}</Text>
        <Text dimColor>  WIS {"█".repeat(Math.round(state.pet.stats.wisdom / 2))}{"░".repeat(10 - Math.round(state.pet.stats.wisdom / 2))} {state.pet.stats.wisdom}</Text>
        <Text dimColor>  SNK {"█".repeat(Math.round(state.pet.stats.snark / 2))}{"░".repeat(10 - Math.round(state.pet.stats.snark / 2))} {state.pet.stats.snark}</Text>
      </Box>
      <Text> </Text>
      <Divider label="Tools" />
      <Box paddingLeft={1}>
        <Text dimColor>
          {totalXp === 0 ? "  No activity yet" :
            [
              c.bashCalls > 0 ? `B:${c.bashCalls}` : "",
              c.editCalls > 0 ? `E:${c.editCalls}` : "",
              c.writeCalls > 0 ? `W:${c.writeCalls}` : "",
              c.readCalls > 0 ? `R:${c.readCalls}` : "",
              c.searchCalls > 0 ? `S:${c.searchCalls}` : "",
              c.fetchCalls > 0 ? `F:${c.fetchCalls}` : "",
            ].filter(Boolean).join(" ")
          }
          {c.errorCount > 0 ? ` Err:${c.errorCount}` : ""}
        </Text>
      </Box>
      <Text> </Text>
      <Divider label="Recent" />
      <Box flexDirection="column" paddingLeft={1}>
        {state.recentEvents.length === 0 && (
          <Text dimColor>  Waiting for events...</Text>
        )}
        {state.recentEvents.slice(-3).map((ev, i) => (
          <Text key={i} dimColor>
            {"  \u25B8"} {ev.summary.slice(0, 30)}
          </Text>
        ))}
      </Box>
      <Text> </Text>
      {!state.connected && !demo && (
        <Box flexDirection="column">
          <Text color="#FF6B81">{"  \u26A0"} daemon offline</Text>
          <Text dimColor>{"  "}claude-buddy daemon run</Text>
        </Box>
      )}
      <KeyHints />
    </Box>
  );
}
