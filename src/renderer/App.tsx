import React, { useReducer, useEffect, useRef, useCallback } from "react";
import { Box, Text } from "ink";
import { SpeechBubble } from "./SpeechBubble.js";
import { Sprite } from "./Sprite.js";
import { Particles, tickParticles, spawnSparkles, spawnErrorRain, type Particle } from "./Particles.js";
import { PetInfo } from "./PetInfo.js";
import { StatsBar } from "./StatsBar.js";
import { ActivityLog } from "./ActivityLog.js";
import { KeyHints } from "./KeyHints.js";
import { Divider } from "./Divider.js";
import { ScrollText } from "./ScrollText.js";
import { SocketClient } from "../socket-client.js";
import { loadGlobalState } from "../persistence.js";
import type { PetState } from "../pet/state.js";
import type { Species } from "../pet/species.js";
import { getPalette } from "../pet/palettes.js";
import { computeLevel } from "../pet/state.js";
import { TRAIT_DEFINITIONS } from "../daemon/traits.js";

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
  particles: Particle[];
}

type Action =
  | { type: "REACTION"; text: string; animation: string }
  | { type: "CLEAR_SPEECH" }
  | { type: "TICK" }
  | { type: "SET_CONNECTED"; connected: boolean }
  | { type: "STATE_UPDATE"; state: PetState }
  | { type: "TOOL_EVENT"; event: RecentEvent }
  | { type: "SPAWN_PARTICLES"; particles: Particle[] };

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
      return { ...state, tick: state.tick + 1, particles: tickParticles(state.particles) };
    case "SET_CONNECTED":
      return { ...state, connected: action.connected };
    case "STATE_UPDATE":
      return { ...state, pet: action.state };
    case "TOOL_EVENT":
      return { ...state, recentEvents: [...state.recentEvents.slice(-5), action.event] };
    case "SPAWN_PARTICLES":
      return { ...state, particles: [...state.particles, ...action.particles] };
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
    particles: [],
  });

  const handleMessage = useCallback((msg: Record<string, unknown>) => {
    if (msg.type === "reaction") {
      dispatch({
        type: "REACTION",
        text: msg.text as string,
        animation: msg.animation as string,
      });
      if (msg.animation === "startled") {
        dispatch({ type: "SPAWN_PARTICLES", particles: spawnErrorRain() });
      }
    } else if (msg.type === "state_update" && msg.state) {
      dispatch({ type: "STATE_UPDATE", state: msg.state as PetState });
    } else if (msg.type === "tool_event") {
      dispatch({
        type: "TOOL_EVENT",
        event: {
          summary: (msg.summary as string) ?? (msg.detail as string) ?? String(msg.tool ?? "event"),
          timestamp: msg.timestamp as number,
        },
      });
    } else if (msg.type === "trait_unlock") {
      dispatch({
        type: "REACTION",
        text: `New trait: \x01${msg.trait}\x02!`,
        animation: "excited",
      });
      dispatch({ type: "SPAWN_PARTICLES", particles: spawnSparkles() });
    } else if (msg.type === "level_up") {
      dispatch({
        type: "REACTION",
        text: `Level up! \x01Lv.${msg.level}\x02`,
        animation: "excited",
      });
      dispatch({ type: "SPAWN_PARTICLES", particles: spawnSparkles() });
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
  const traits = Object.entries(state.pet.traits).map(([id, t]) => {
    const def = TRAIT_DEFINITIONS.find((d) => d.id === id);
    return { name: def?.name ?? id, level: t.level, effect: def?.effect ?? "" };
  });
  const c = state.pet.activityCounters;
  const totalXp = c.bashCalls + c.readCalls + c.writeCalls + c.editCalls + c.searchCalls + c.fetchCalls;
  const level = computeLevel(c, Object.keys(state.pet.traits).length);
  const nextLevelXp = Math.pow(level, 2) * 100;
  const xpProgress = Math.min(totalXp / Math.max(nextLevelXp, 1), 1);
  const xpBarWidth = 10;
  const xpFilled = Math.round(xpProgress * xpBarWidth);

  const statBar = (label: string, value: number) => {
    const filled = Math.round(value / 2.5);
    return `${label} ${"█".repeat(filled)}${"░".repeat(8 - filled)} ${value}`;
  };
  const rightWidth = 26;

  const toolPair = (l1: string, v1: number, l2: string, v2: number) => {
    const left = v1 > 0 ? `${l1.padEnd(7)}${String(v1).padStart(4)}` : "           ";
    const right = v2 > 0 ? `${l2.padEnd(7)}${String(v2).padStart(4)}` : "";
    return <Text dimColor key={l1}>{left} {right}</Text>;
  };

  return (
    <Box flexDirection="column" padding={1}>
      <KeyHints />
      {!state.connected && !demo && (
        <Box marginBottom={1}>
          <Text color="#FF6B81">{"\u26A0"} daemon offline </Text>
          <Text dimColor>claude-buddy daemon run</Text>
        </Box>
      )}
      <SpeechBubble text={state.speechText} tick={state.tick} />
      <Box flexDirection="row">
        {/* Left column: sprite + mood + traits — bottom-aligned */}
        <Box flexDirection="column" width={24} justifyContent="flex-end">
          <Box flexDirection="column" borderStyle="round" borderDimColor paddingX={1}>
            <Particles particles={state.particles} />
            <Sprite
              species={species}
              animation={state.animation}
              tick={state.tick}
              palette={palette}
              level={level}
            />
          </Box>
          <Box paddingLeft={1} flexDirection="column">
            <Text bold>{state.pet.name}</Text>
            <Text dimColor>Lv.{level} {state.pet.mood}</Text>
            <Text>
              <Text dimColor>XP </Text>
              <Text color="#FECA57">{"█".repeat(xpFilled)}</Text>
              <Text dimColor>{"░".repeat(xpBarWidth - xpFilled)}</Text>
            </Text>
          </Box>
          {traits.length > 0 && (
            <Box flexDirection="column" marginTop={1} paddingLeft={1}>
              <Text dimColor>Traits</Text>
              {traits.map((t, i) => (
                <Box key={i} flexDirection="column">
                  <Text> {t.name} <Text dimColor>Lv.{t.level}</Text></Text>
                  <Text dimColor italic> {t.effect}</Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Right column: name + stats + tools + recent */}
        <Box flexDirection="column" marginLeft={2} flexGrow={1}>
          <Divider label="Stats" width={rightWidth} />
          <Box flexDirection="column" paddingLeft={1}>
            <Text dimColor>{statBar("DBG", state.pet.stats.debugging)}</Text>
            <Text dimColor>{statBar("PAT", state.pet.stats.patience)}</Text>
            <Text dimColor>{statBar("CHS", state.pet.stats.chaos)}</Text>
            <Text dimColor>{statBar("WIS", state.pet.stats.wisdom)}</Text>
            <Text dimColor>{statBar("SNK", state.pet.stats.snark)}</Text>
          </Box>
          <Text> </Text>
          <Divider label="Tools" width={rightWidth} />
          <Box flexDirection="column" paddingLeft={1}>
            {totalXp === 0 ? (
              <Text dimColor>No activity yet</Text>
            ) : (
              <>
                {toolPair("Bash", c.bashCalls, "Read", c.readCalls)}
                {toolPair("Edit", c.editCalls, "Search", c.searchCalls)}
                {toolPair("Write", c.writeCalls, "Fetch", c.fetchCalls)}
                {c.errorCount > 0 && <Text dimColor>{"Errors".padEnd(7)}{String(c.errorCount).padStart(4)}</Text>}
              </>
            )}
          </Box>
          <Text> </Text>
          <Divider label="Recent" width={rightWidth} />
          <Box flexDirection="column" paddingLeft={1}>
            {state.recentEvents.length === 0 && (
              <Text dimColor>Waiting for events...</Text>
            )}
            {state.recentEvents.slice(-3).map((ev, i) => (
              <Box key={i}>
                <Text dimColor>{"\u25B8"} </Text>
                <ScrollText text={ev.summary ?? ""} maxWidth={rightWidth - 4} tick={state.tick} dimColor />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
