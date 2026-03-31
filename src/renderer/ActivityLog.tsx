import React from "react";
import { Text, Box } from "ink";

interface ActivityEntry {
  tool: string;
  detail?: string;
  timestamp: number;
}

interface ActivityLogProps {
  events: ActivityEntry[];
}

export function ActivityLog({ events }: ActivityLogProps) {
  if (events.length === 0) {
    return (
      <Box paddingLeft={1}>
        <Text dimColor>No recent activity</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingLeft={1}>
      {events.slice(-5).map((event, i) => (
        <Text key={i} dimColor>
          {"▸"} {event.tool}
          {event.detail ? `: ${event.detail}` : ""}
        </Text>
      ))}
    </Box>
  );
}
