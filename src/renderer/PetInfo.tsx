import React from "react";
import { Text, Box } from "ink";
import { SPECIES } from "../pet/species.js";
import type { Species } from "../pet/species.js";

interface TraitDisplay {
  name: string;
  level: number;
  effect: string;
}

interface PetInfoProps {
  name: string;
  species: Species;
  level: number;
  mood: string;
  traits: TraitDisplay[];
}

const MOOD_EMOJI: Record<string, string> = {
  happy: ":)",
  excited: ":D",
  focused: ":|",
  confused: ":S",
  bored: ":/",
  sleepy: "zzZ",
};

export function PetInfo({ name, species, level, mood, traits }: PetInfoProps) {
  const def = SPECIES[species];
  const moodDisplay = MOOD_EMOJI[mood] ?? mood;

  return (
    <Box flexDirection="column" paddingLeft={1}>
      <Text bold>
        {name} {def.emoji} Lv.{level} {moodDisplay}
      </Text>
      {traits.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text dimColor>Traits</Text>
          {traits.map((t, i) => (
            <Box key={i} flexDirection="column">
              <Text>  {t.name} <Text dimColor>Lv.{t.level}</Text></Text>
              <Text dimColor italic>  {t.effect}</Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
