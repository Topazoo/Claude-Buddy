import React from "react";
import { Text, Box } from "ink";

interface StatsBarProps {
  mood: string;
  totalXp: number;
}

const MOOD_COLOR: Record<string, string> = {
  happy: "#2ED573",
  excited: "#FFC312",
  focused: "#54A0FF",
  confused: "#FF6B81",
  bored: "#C8D6E5",
  sleepy: "#A29BFE",
};

const MOOD_ICON: Record<string, string> = {
  happy: ":)",
  excited: ":D",
  focused: ":|",
  confused: ":S",
  bored: ":/",
  sleepy: "zzZ",
};

export function StatsBar({ mood, totalXp }: StatsBarProps) {
  const color = MOOD_COLOR[mood] ?? "#C8D6E5";
  const icon = MOOD_ICON[mood] ?? mood;

  return (
    <Box paddingLeft={1}>
      <Text>
        <Text color={color}>{"█".repeat(2)} {mood}</Text>
        <Text> {icon}</Text>
      </Text>
    </Box>
  );
}
