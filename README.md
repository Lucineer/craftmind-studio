# 🎬 CraftMind Studio

> AI-powered filmmaking engine for Minecraft — become a virtual movie tycoon.

## Features

- **Timeline Editor** — Create shot lists with duration, type, and camera metadata
- **AI Director** — Generate scene breakdowns, dialogue, and shot compositions
- **Character System** — Register cast members with traits, relationships, and trust dynamics
- **Camera System** — Rule of thirds, DOF, 180° rule, composition scoring
- **Production Pipeline** — End-to-end from brief → storyboard → rendered output
- **Era System** — Genre-aware director blocks and era-specific set suggestions
- **Plugin Integration** — `registerWithCore()` for CraftMind Core compatibility

## Quick Start

```bash
npm install
node examples/demo.js    # Run standalone demo
node scripts/playtest.js # Simulated plugin test
npm test                 # Run test suite (134 tests)
```

## API Documentation

### Timeline (`src/timeline.js`)
| Function | Description |
|---|---|
| `createTimeline(title)` | Create a new timeline |
| `addShot(tl, shot)` | Append a shot {id, type, duration, description} |
| `insertShot(tl, index, shot)` | Insert shot at position |
| `getShotAt(tl, timeSec)` | Get shot playing at time |

### Director (`src/director.js`)
| Function | Description |
|---|---|
| `generateShotList(brief)` | AI-generated shot sequence |
| `generateDialogue(scene, cast)` | Generate character dialogue |
| `checkDirectorBlock(genre, era)` | Check if shooting is blocked |
| `getEraSuggestions(era)` | Get era-appropriate set ideas |

### Character (`src/character.js`)
| Function | Description |
|---|---|
| `registerCharacter(profile)` | Add cast member |
| `getCharacter(id)` | Look up character |
| `adjustTrust(from, to, delta)` | Modify trust relationship |

### Production (`src/index.js`)
| Function | Description |
|---|---|
| `produce(opts)` | Run full pipeline {brief, cast, simConfig} |
| `startServer(opts)` | Launch Minecraft-integrated server |
| `registerWithCore(core)` | Register as CraftMind plugin |

## Plugin Integration

```js
import { registerWithCore } from 'craftmind-studio';

// core needs registerPlugin(name, { name, version, modules, init, onChat })
registerWithCore(core);
// Registers as 'studio' plugin
```

## Architecture

```
┌──────────────────────────────────────────────────┐
│                  CraftMind Studio                │
├──────────────────────────────────────────────────┤
│  ┌─────────┐  ┌──────────┐  ┌───────────────┐  │
│  │Timeline │  │ Director │  │  Character    │  │
│  │ Editor  │→ │ (AI Gen) │→ │  System       │  │
│  └────┬────┘  └────┬─────┘  └───────┬───────┘  │
│       │            │                │           │
│       ▼            ▼                ▼           │
│  ┌──────────────────────────────────────────┐   │
│  │          Production Pipeline             │   │
│  │  Brief → Shots → Storyboard → Render     │   │
│  └──────────────────┬───────────────────────┘   │
│                     │                           │
│  ┌──────────┐  ┌────▼─────┐  ┌───────────┐    │
│  │ Camera   │  │Renderer  │  │ Compositor│    │
│  │ System   │  │          │  │           │    │
│  └──────────┘  └──────────┘  └───────────┘    │
├──────────────────────────────────────────────────┤
│              registerWithCore(core)              │
└──────────────────────────────────────────────────┘
```

## Testing

```bash
npm test          # 134 tests, 36 suites
node examples/demo.js
node scripts/playtest.js
```

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed plans.

## License

MIT
