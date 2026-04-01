# claude-buddy-cli

A Tamagotchi-style terminal companion for [Claude Code](https://claude.ai/code). Your buddy lives in your terminal, watches what Claude is doing in real time, narrates the action with personality, and evolves from your coding patterns.

```
┌──────────────────────────────┐
│ Snooping around state.ts     │
└──────────────────────────────┘
       ▄●▄
     ▄█████▄        Professor Chip 🤖 Lv.2
     █ ■  ■ █       Military Robot (Rare)
     █ ▀══▀ █       Mood: focused :|
     ▀█████▀
     █▌▐██▌▐█       XP ██████████░░░░░ 89
     █▀    ▀█       B:30 E:24 W:11 R:15 S:12
```

## How It Works

Your buddy watches every Claude Code tool call via a PostToolUse hook and reacts in real time:

- **Narrates the action** in a speech bubble with personality ("Snooping around state.ts", "SHELL GO BRRRR!", "Investigating handleAuth -- smart approach")
- **Tracks patterns** across your session (file revisits, error streaks, rapid bursts, context switching)
- **Evolves traits** from your coding habits (Adventurous, Night Owl, Speed Demon)
- **Multi-color sprites** with per-pet color palettes, 7 animation states, micro-animations

## Quick Start

```bash
git clone <repo-url> && cd buddy
npm install          # auto-builds
npm run setup        # registers with Claude Code, hatches pet, starts daemon
```

Then open the live side pane:

```bash
npx tsx src/index.ts pane
# or, if you've run `npm link`:
claude-buddy pane
```

The pane is a passive display -- it won't interfere with your terminal. It shows your buddy reacting to Claude's activity in real time.

## Requirements

- **Node.js 20+**
- **Claude Code** (the `claude` CLI)
- **tmux** (optional, for the side pane -- everything else works without it)

## Commands

| Command | Description |
|---------|-------------|
| `claude-buddy` | Show stats (or hatch if first run) |
| `claude-buddy hatch` | Hatch a new buddy (species roll + name) |
| `claude-buddy stats` | Full stats, sprite, traits, counters |
| `claude-buddy pane` | Open tmux side pane (auto-starts daemon) |
| `claude-buddy feed` | Feed your buddy (triggers reaction in pane) |
| `claude-buddy pet` | Pet your buddy |
| `claude-buddy install` | Register MCP + hook with Claude Code |
| `claude-buddy card` | Generate a shareable pet card (`--copy`, `--raw`) |
| `claude-buddy demo` | 30-second demo sequence |
| `claude-buddy daemon run` | Run daemon in foreground |
| `claude-buddy daemon stop` | Stop daemon |
| `claude-buddy daemon status` | Check daemon status |

## The Pane

The tmux pane shows a live view of your buddy:

- **Sprite** with multi-color rendering (7 animation states: idle, startled, excited, sleeping, thinking, confused, eating)
- **Speech bubble** narrating what Claude is doing, flavored by your pet's personality
- **Stats** (Debugging, Patience, Chaos, Wisdom, Snark)
- **XP bar** that fills as you code
- **Tool counters** (Bash, Edit, Write, Read, Search, Fetch)
- **Recent feed** of the last 3 tool calls

The pane is fully passive -- no keyboard input needed. Interact via CLI commands from your main terminal.

## Species & Palettes

Species is determined by seeded PRNG (username + hostname). Each species has multiple color palettes, also seeded -- so every buddy looks unique.

| Species | Rarity | Chance | Example Palettes |
|---------|--------|--------|-----------------|
| 🐱 Cat | Common | 35% | Orange Tabby, Tuxedo, Gray, Calico, Void |
| 🐦 Bird | Common | 35% | Blue Jay, Cardinal, Parrot, Sparrow, Robin |
| 🪱 Worm | Uncommon | 15% | Rose, Earthworm, Neon, Mint |
| 🤖 Robot | Rare | 8% | Cyan Chrome, Gold Plated, Gunmetal, Rust, Military |
| 🦎 Reptile | Epic | 5% | Emerald, Desert, Poison, Dragon |
| 👻 Ghost | Legendary | 2% | Lavender, Crimson, Ethereal, Void, Jade |

## Personality

### Stats (1-20, generated at hatch)

| Stat | Effect on narration |
|------|-----------|
| **Debugging** | Bug fix excitement |
| **Patience** | Tolerance for long sessions |
| **Chaos** | "SHELL GO BRRRR!" vs calm commentary |
| **Wisdom** | "Investigating carefully" vs "Ooh what's that?!" |
| **Snark** | "Back in state.ts, huh?" vs "Peeking at state.ts" |

Your pet's highest stat determines its voice. High-snark pets are sassy, high-wisdom pets are thoughtful, high-chaos pets are excitable.

### Traits (unlock from activity)

| Trait | Threshold | Effect |
|-------|-----------|--------|
| **Adventurous** | 200 bash calls | Shell command excitement |
| **Night Owl** | 10 midnight sessions | Time-aware personality |
| **Speed Demon** | 20 rapid edit bursts | Fast coding reactions |

### Pattern Detection

| Pattern | Trigger | Example reaction |
|---------|---------|-----------------|
| File revisit | Same file 5+ times | "Back to {file} again -- that's {n} times" |
| Error streak | 3/5/10 consecutive errors | "That's {n} in a row..." |
| Streak broken | Success after 3+ errors | "You got it! That was {n} errors deep." |
| Rapid burst | 10+ tools in 2 min | "You're on fire!" |
| Context switching | 6+ files in 5 min | "Jumping around a lot -- exploring?" |
| New territory | Unvisited directory | "Venturing into {dir}/" |
| Return from idle | 10+ min gap | "Oh, you're back!" |

## MCP Integration

| Tool | Purpose |
|------|---------|
| `buddy_chat` | Personality context for the pet |
| `buddy_status` | Quick status (name, mood, level) |
| `buddy_feed` | Feed the buddy |

## Architecture

```
Claude Code
  ├─ PostToolUse hook ──→ claude-buddy hook-event ──→ daemon socket
  └─ MCP client ────────→ claude-buddy mcp-serve ──→ daemon socket

Daemon (claude-buddy daemon run)
  ├─ Socket server (NDJSON over ~/.claude-buddy/buddy.sock)
  ├─ Pattern tracker (file visits, error streaks, bursts)
  ├─ Personality narrator (stats-flavored commentary)
  ├─ Ticker (60s: mood derivation, trait checks, state persistence)
  └─ Atomic state writer (state.json)

Tmux Pane (claude-buddy pane)
  └─ Ink renderer ──→ passive display from daemon socket
```

### Data

| Path | Purpose |
|------|---------|
| `~/.claude-buddy/global/state.json` | Pet state |
| `~/.claude-buddy/buddy.sock` | Daemon IPC socket |
| `~/.claude-buddy/daemon.log` | Daemon logs |
| `~/.claude/settings.json` | MCP + hook registration |

## Development

```bash
# Dev (no build needed)
npx tsx src/index.ts stats
npx tsx src/index.ts daemon run

# Build + link
npm run build          # ~15ms via tsup
npm link               # Global `claude-buddy` command

# Register with Claude Code
claude-buddy install

# Type check
npm run typecheck
```

### After code changes

```bash
npm run build                    # Rebuild dist/
pkill -f "claude-buddy.*daemon"  # Restart daemon (picks up new build)
claude-buddy daemon run &        # Start fresh daemon
```

The MCP server and hook are fresh processes per invocation, so they pick up changes automatically. Only the daemon needs a restart.

## Design Decisions

- **Pane is passive.** No keyboard input capture -- won't interfere with your terminal. Interact via CLI (`feed`, `pet`).
- **Mood is activity-derived.** No manual feeding required. Coding = happy pet. Errors = confused. Idle = sleepy.
- **Personality narrates everything.** Every tool call gets a speech bubble flavored by the pet's stats. Pattern reactions add extra commentary.
- **Multi-color sprites.** Per-character color tokens (body, eyes, accent, highlight) mapped to per-pet palettes. Two cats look different.
- **Hook gets rich stdin data.** PostToolUse hooks receive `{ tool_name, tool_input, tool_result }` -- the hook builds human-readable summaries from real context.
- **Seeded PRNG.** Same user gets same species/stats/palette. Deterministic but feels personal.

## Roadmap

- **Squad system** -- project-specific pets with specialized personalities
- **More species** -- Duck, Penguin, Axolotl, Dragon, Capybara
- **More traits** -- Scholar, Architect, Debugger, Chaos Gremlin (with 3 levels each)
- **Shiny variants** -- 1% sparkle overlay
- **API-powered reactions** -- LLM-generated commentary for notable patterns
- **Pane chat** -- Talk to your buddy from the side pane

## License

MIT
