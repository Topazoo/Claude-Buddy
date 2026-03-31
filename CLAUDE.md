# CLAUDE.md — claude-buddy-cli

## What This Is

A Tamagotchi-style terminal companion for Claude Code. Global pet (squad leader) + manually hatched project pets. Evolving personality traits. Claude Code MCP integration (Claude responds in-character as the buddy). tmux side pane via Ink. Background daemon (launchd/systemd). Unix socket IPC.

**`claude-buddy-spec.md` is the source of truth.** Read it before building anything.

## Tech Stack

- **Runtime**: Node 20+ primary. Bun compatible but not tested.
- **Language**: TypeScript (strict)
- **Renderer**: Ink (React for terminals)
- **MCP**: `@modelcontextprotocol/sdk` (JSON-RPC 2.0 over stdio)
- **Schema**: Zod with `.default()` + `.passthrough()`
- **Daemon**: launchd (macOS) / systemd (Linux)
- **IPC**: Unix domain socket for real-time. Files for persistence.
- **Platform**: macOS + Linux only. No Windows/WSL in v1.

## Critical First Tasks (Before Writing Code)

### 1. Validate PostToolUse hook environment

```bash
# Create a test hook that dumps all available env vars
mkdir -p /tmp/buddy-test
cat > /tmp/buddy-test/dump-env.sh << 'EOF'
#!/bin/bash
env > /tmp/buddy-hook-env.txt
echo "$(date): hook fired" >> /tmp/buddy-hook-log.txt
EOF
chmod +x /tmp/buddy-test/dump-env.sh
```

Add to `~/.claude/settings.json`:
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "*",
      "hooks": [{ "type": "command", "command": "/tmp/buddy-test/dump-env.sh" }]
    }]
  }
}
```

Run Claude Code, use a tool, then inspect `/tmp/buddy-hook-env.txt`. Document exactly which variables are available (tool name, exit code, file path, etc.). Update `hook-event` command accordingly.

### 2. Validate JSONL log format

```bash
ls -laR ~/.claude/projects/ | head -100
# Find the most recent .jsonl file
# Inspect 20+ lines to determine real event shapes
```

The parser's enrichment logic must match real data. The spec has educated guesses — replace them with reality.

## Architecture: Non-Negotiable Decisions

1. **Hook is the sole event source.** JSONL watcher does session detection (file mtimes, new directories) + one-shot enrichment reads after hook fires. NOT continuous JSONL tailing.

2. **Unix socket for all real-time IPC.** Daemon broadcasts reactions, state updates, trait unlocks, reminders to all connected clients. Files are for persistence and fallback only.

3. **MCP buddy_chat: Claude becomes the buddy.** The tool returns personality context + guidance. Claude's next message IS the buddy talking in-character. The tool description is load-bearing — see spec §9 for exact text.

4. **Project pets are manual hatch only.** `claude-buddy hatch --project` from the project directory. No auto-hatch.

5. **Global pet gets 0.25x XP** when a project pet is active. Fractional accumulator in `xpAccumulators` field of state.json.

6. **Template + slot-filling reactions in v1.** No API calls for reactions. Pattern tracker feeds context into templates. API reactions deferred to Phase 4.

7. **No pane chat in v1.** No `c` keybinding, no `<ChatInput>` component. Phase 4.

8. **No API key required in v1.** All AI features work through MCP (Claude responds as buddy). Pane chat AI deferred.

9. **Demo is pane-only.** Pre-scripted reactions fed to Ink renderer. No daemon, no socket, no events.

10. **Daemon install requires explicit consent** (Y/n prompt showing exact paths). `--yes` flag overrides all prompts including consent.

## Implementation Notes: Assumption-Risks

These are decisions made without full validation. Document the assumption. If reality differs, adapt.

### Pattern tracker thresholds
- File revisit counts: **per session** (reset when sessionStart changes)
- Rapid burst: **sliding window** — maintain timestamps of last 20 events, check if 10+ fall within any 2-minute span
- Same command repeated: **within 5-minute window**, not necessarily consecutive
- Context switching: **fixed 5-minute window** — `uniqueFilesWindow` set clears every 5 min

### Socket broadcasting
- Daemon broadcasts to ALL connected clients on every reaction/state change
- No handshake, no client identification
- Clients that want specific data filter on message `type`
- If broadcast fails for one client (disconnected), skip it, don't fail others

### `--yes` flag
- Overrides daemon consent (Y/n → auto Y)
- Auto-generates pet name (no prompt)
- Still performs preflight checks (tmux, node version)

### XP fractional accumulator
- Stored in `state.json` under `xpAccumulators: Record<string, number>`
- Each counter has a float accumulator. On event: `accum += 0.25`. If `accum >= 1.0`: increment counter, `accum -= 1.0`
- Persists across daemon restarts

### MCP bridge reconnection
- `claude-buddy mcp-serve` connects to daemon socket on startup
- If daemon restarts: MCP bridge detects socket error, attempts reconnect with exponential backoff (1s, 2s, 4s, max 30s)
- During reconnect: MCP tools return `{ error: "Reconnecting to daemon..." }`

## Sprite Reference (Rough Example)

This is a **starting point**, not a final design. Claude Code should iterate until sprites look good.

**Constraints**: 7 lines tall, max 16 chars wide, heavy block characters (`█ ▄ ▀ ▌ ▐ ░ ▓`), expressions change in eyes/mouth only, body silhouette consistent across animation states per species.

```
=== CAT (rough reference — iterate from here) ===

IDLE frame 1:            IDLE frame 2:
  ▄▄█████▄▄               ▄▄█████▄▄
 ██▌█▌▐█▐██              ██▌█▌▐█▐██
 ███ ●  ● ██              ███ ◕  ◕ ██
 ██ ▄▀▀▄  ██              ██ ▄▀▀▄  ██
  ████████▀                ████████▀
   ██▄▄██                   ██▄▄██
   █▌  ▐█                   ▐█  █▌

STARTLED:                THINKING:
      ❗                  ▄▄█████▄▄ ·
  ▄▄█████▄▄              ██▌█▌▐█▐██·
 ██▌█▌▐█▐██              ███ ▄  ▄ ██·
 ███ ◉  ◉ ██              ██ ▄▀▀▄  ██
 ██  ▀▀▀  ██               ████████▀
  ████████▀                  ██▄▄██
   ██▄▄██                    █▌  ▐█
   █▌  ▐█

EATING frame 1:          EXCITED:
  ▄▄█████▄▄               ▄▄█████▄▄░░
 ██▌█▌▐█▐██              ██▌█▌▐█▐██░░
 ███ ◕  ◕ ██              ███ ▸  ▸ ██░
 ██ ▄██▄  ██              ██ ▄▀▀▄  ██
  ████████▀ ♨              ████████▀
   ██▄▄██                   ██▄▄██
   █▌  ▐█                   █▌  ▐█
```

Each species needs distinct silhouettes. Robot = boxy. Ghost = floaty/tapered. Worm = long/low. Bird = winged. Reptile = tailed/crested.

## Build & Run

```bash
npm install
npx tsx src/index.ts                    # Dev: auto-install on first run
npx tsx src/index.ts pane --render      # Dev: test Ink renderer
npx tsx src/index.ts daemon run         # Dev: test daemon foreground
npx tsx src/index.ts demo              # Dev: test demo
```

Production build: use esbuild or tsx for bundling. `package.json` `bin` field points to the bundle.

## Build Priority

### Phase 1: Core Pet + Persistence
`utils.ts` → `pet/species.ts` → `pet/sprites.ts` → `pet/state.ts` → `pet/names.ts` → `persistence.ts` → `squad.ts` → `commands/hatch.ts` → `commands/stats.ts`

**Milestone**: Hatch a pet, print stats, hatch a project pet.

### Phase 2: Daemon + Hook + Enrichment
Validate hook env vars → validate JSONL format → `daemon/parser.ts` → `daemon/watcher.ts` → `daemon/pattern-tracker.ts` → `daemon/traits.ts` → `daemon/reminders.ts` → `daemon/reactions.ts` → `daemon/ticker.ts` → `daemon/writer.ts` → `daemon/socket-server.ts` → `daemon/main.ts` → `commands/daemon-cmd.ts`

**Milestone**: Daemon runs, receives hooks, enriches events, tracks patterns, updates state.

### Phase 3: Renderer (Ink) + MCP
`renderer/*.tsx` → `socket-client.ts` → `renderer/App.tsx` → `commands/pane.ts` → `pet/personality.ts` → `daemon/mcp-server.ts` → MCP + hook registration

**Milestone**: Pane shows live pet. MCP buddy_chat works. Hook feeds events.

### Phase 4: Pane Chat + API Reactions (Deferred)
Validate AI backend options → `<ChatInput>` → API reactions → wire up

### Phase 5: Install + Demo + Polish
`platform/*.ts` → `commands/install.ts` → `commands/demo.ts` → remaining commands → `index.ts`

**Milestone**: `npx claude-buddy-cli` → full flow.
