# claude-buddy-cli

A Tamagotchi-style terminal companion for [Claude Code](https://claude.ai/code). Your buddy lives in your terminal, watches what Claude is doing in real time, narrates the action with personality, and evolves from your coding patterns.

```
┌────────────────────────────────────────────────────┐
│ Returning to state.ts -- persistent debugging?     │
└────────────────────────────────────────────────────┘
 ╭──────────────────╮
 │      ☆●☆         │  ── Stats ──────────────
 │    ▄█████▄       │  DBG █░░░░░░░░ 2
 │    █ ◈  ◈ █      │  PAT ██░░░░░░░ 4
 │    █ ▀══▀ █      │  CHS ████████░ 16
 │    ▀█████▀       │  WIS ████████░ 16
 │    █▌▐██▌▐█      │  SNK ████████░ 16
 │    █▀    ▀█      │
 ╰──────────────────╯  ── Tools ──────────────
 Professor Chip         Bash   300  Read    482
 Lv.5 excited           Edit   150  Search  146
 XP ████░░░░░░          Write   46  Fetch     2

 Traits                 ── Recent ─────────────
  Adventurous Lv.1      ▸ Editing App.tsx
  "Let's see what       ▸ Ran `npm run build`
   happens!"            ▸ Reading state.ts
```

## Quick Start

```bash
git clone <repo-url> && cd buddy
npm install          # auto-builds via postinstall
npm run setup        # registers with Claude Code, hatches pet, starts daemon
```

Then open the live side pane:

```bash
claude-buddy pane
```

The pane is a passive display -- it won't interfere with your terminal. It shows your buddy reacting to Claude's activity in real time.

## Requirements

- **Node.js 20+**
- **Claude Code** (the `claude` CLI)
- **tmux** (for the side pane -- everything else works without it)

## Commands

| Command | Description |
|---------|-------------|
| `claude-buddy` | Show stats (or hatch if first run) |
| `claude-buddy hatch` | Hatch a new buddy (species roll + name) |
| `claude-buddy stats` | Full stats, sprite, traits, counters |
| `claude-buddy pane` | Open tmux side pane (auto-starts daemon) |
| `claude-buddy card` | Generate a shareable pet card (`--copy`, `--raw`) |
| `claude-buddy feed` | Feed your buddy (triggers reaction in pane) |
| `claude-buddy pet` | Pet your buddy |
| `claude-buddy install` | Register MCP + hook with Claude Code |
| `claude-buddy demo` | 30-second demo sequence |
| `claude-buddy daemon run` | Run daemon in foreground |
| `claude-buddy daemon stop` | Stop daemon |
| `claude-buddy daemon status` | Check daemon status |

## The Pane

The tmux pane shows a two-column live view of your buddy:

**Left column:**
- **Sprite** in a bordered frame with multi-color rendering, 7 animation states, and micro-animations
- **Particle effects** -- sparkles on level-up/trait unlock, error rain on error streaks
- **Pet info** -- name, level, mood, XP bar
- **Traits** with flavor text

**Right column:**
- **Stats** (Debugging, Patience, Chaos, Wisdom, Snark) with bar charts
- **Tool counters** in a two-column grid (Bash, Edit, Write, Read, Search, Fetch)
- **Recent events** with horizontal scrolling for long entries

**Speech bubble** spans the top with scrolling marquee for long text and highlighted dynamic values (filenames, commands, queries shown in yellow).

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

## Evolution

Sprites gain visual decorations as your pet levels up:

| Level | Evolution | Effect |
|-------|-----------|--------|
| 5 | **Crown** | Species-appropriate headgear (crown, crest, halo, etc.) |
| 10 | **Sparkle Eyes** | Eyes become ★ or ◈ |
| 15 | **Aura** | Glowing ░ effects on body edges |

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
| **Adventurous** | 200 bash calls | "Let's see what happens!" |
| **Night Owl** | 10 midnight sessions | Sleepy days, alert nights |
| **Speed Demon** | 20 rapid edit bursts | "Zoom zoom!" |

### Reactions

The buddy reacts to tool calls with personality-flavored speech. Reactions are rate-limited to one every 15 seconds to avoid spam.

**Git-specific reactions** (50% chance):
- `git commit` → "Committing! Bold move." / "COMMIT COMMIT COMMIT!"
- `git push --force` → "Force push?! Living dangerously."
- `git rebase` → "Rewriting history, are we?"

**Tool command reactions** (40% chance):
- `npm install` → "node_modules grows ever larger."
- `npm test` → "Let's see how many break."
- `docker build` → "CONTAINERS GO BRRRR!"

**Idle chatter** (after 5min of inactivity):
- "hello?", "anyone there?", "*yawns*", "zzz..."

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

## Pet Card

Generate a shareable ASCII art card with your pet's sprite, stats, and traits:

```bash
claude-buddy card          # ANSI-colored output
claude-buddy card --raw    # Plain text (no colors)
claude-buddy card --copy   # Copy to clipboard
```

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
  ├─ Reaction engine (git/tool/pattern reactions, rate-limited)
  ├─ Idle chatter (bored/sleepy after 5min inactivity)
  ├─ Ticker (60s: mood derivation, trait checks, level-up detection)
  └─ Atomic state writer (state.json)

Tmux Pane (claude-buddy pane)
  └─ Ink renderer ──→ two-column display from daemon socket
       ├─ Sprite with evolution decorations + particle effects
       ├─ Scrolling speech bubble with highlighted values
       └─ Scrolling recent events
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

# Type check
npm run typecheck
```

### After code changes

```bash
npm run build                    # Rebuild dist/
pkill -f "claude-buddy.*daemon"  # Restart daemon (picks up new build)
claude-buddy daemon run &        # Start fresh daemon
```

The MCP server and hook are fresh processes per invocation, so they pick up changes automatically. Only the daemon and pane need a restart.

## Roadmap

- **Squad system** -- project-specific pets with specialized personalities
- **More species** -- Duck, Penguin, Axolotl, Dragon, Capybara
- **More traits** -- Scholar, Architect, Debugger, Chaos Gremlin (with 3 levels each)
- **Shiny variants** -- 1% sparkle overlay
- **API-powered reactions** -- LLM-generated commentary for notable patterns
- **Pane chat** -- Talk to your buddy from the side pane

## License

MIT
