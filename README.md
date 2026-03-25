# 🎬 CraftMind Studio

**AI-Powered Minecraft Filmmaking Studio**

CraftMind Studio transforms Minecraft into a virtual film set where AI agents serve as actors, directors, and crew. Give it a creative brief, and it generates cinematic content — shot lists, character dialogue, camera movements, voice synthesis, and rendered video.

> This is NOT a simple screen recorder. It's an AI director that understands storytelling, controls Minecraft bots as actors, and produces cinematic content.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CRAFTMIND STUDIO                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────┐   ┌────────────┐   ┌────────────┐                   │
│  │  CREATIVE  │──▶│  DIRECTOR   │──▶│   TIMELINE  │                  │
│  │   BRIEF    │   │   AI        │   │   EDITOR    │                  │
│  └───────────┘   └─────┬──────┘   └─────┬──────┘                   │
│                        │                 │                           │
│  ┌───────────┐        │    ┌────────────┴──────────┐                │
│  │ CHARACTER  │◀──────┤    │    CAMERA SYSTEM       │                │
│  │  SYSTEM    │        │    │  orbit · dolly · crane │                │
│  └─────┬─────┘        │    └───────────────────────┘                │
│        │              │                 │                            │
│        │    ┌─────────┴──────────┐     │                            │
│        │    │   SIMULATION        │     │                            │
│        │    │   ORCHESTRATOR      │─────┘                            │
│        │    │  ┌─────┐ ┌─────┐   │                                  │
│        └────│──▶│Bot 1│ │Bot N│   │                                  │
│             │   └──┬──┘ └──┬──┘   │                                  │
│             │      │       │      │                                  │
│             │      ▼       ▼      │                                  │
│             │   ┌──────────────┐   │                                  │
│             │   │   RENDERER    │◀──┘                                  │
│             │   │  (ffmpeg)     │                                      │
│             │   └──────┬───────┘                                      │
│             │          │                                              │
│             │   ┌──────┴───────┐                                      │
│             │   │    AUDIO      │                                      │
│             │   │  (ElevenLabs) │                                      │
│             │   └──────────────┘                                      │
│             │                                                         │
│             └──────▶ 🎬 Final Video                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Core Modules

| Module | Purpose |
|--------|---------|
| `director.js` | AI director — generates shot lists from creative briefs using LLM & Save the Cat beat sheets |
| `character.js` | Character profiles with personality, voice, memory, and relationship tracking |
| `simulation.js` | Spawns Minecraft bots as actors, positions them, captures frames |
| `timeline.js` | Non-linear timeline editor — shots, transitions, metadata |
| `camera.js` | Cinematic camera math — orbit, dolly, crane, easing interpolation |
| `renderer.js` | Video pipeline — stitches frames into video via ffmpeg |
| `audio.js` | Audio pipeline — ElevenLabs TTS, music generation, SFX |
| `index.js` | Main entry point — ties everything into a production pipeline |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Minecraft server (PaperMC recommended) running locally
- [ffmpeg](https://ffmpeg.org/) installed and on PATH
- ElevenLabs API key (for voice synthesis)

### Installation

```bash
git clone https://github.com/CedarBeach2019/craftmind-studio.git
cd craftmind-studio
npm install
```

### Configuration

Create a `.env` file in the project root:

```env
ZAI_API_KEY=your_zai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### Quick Start

```bash
node src/index.js \
  --brief "Alex discovers an abandoned village at sunset. Strange sounds come from the well." \
  --characters "Alex" \
  --mood "mysterious" \
  --output ./my-film
```

### Programmatic Usage

```javascript
import { produce } from './src/index.js';
import { registerCharacter } from './src/character.js';

registerCharacter({
  id: 'alex',
  name: 'Alex',
  personality: ['brave', 'curious', 'impulsive'],
  speakingStyle: 'short exclamations, asks lots of questions',
  voice: { elevenLabsVoiceId: 'your-voice-id', emotionStyle: 'dramatic', stability: 0.6 },
  catchphrases: ['What was that?!'],
  avoids: ['staying still'],
  backstory: ['Woke up in a strange world with no memories'],
  relationships: {},
  currentMood: 'curious',
});

await produce({
  brief: {
    premise: 'Alex discovers an abandoned village at sunset.',
    characters: ['alex'],
    mood: 'mysterious',
    targetDurationSec: 120,
  },
  cast: [/* character profiles */],
  simConfig: { host: 'localhost', port: 25565, version: '1.20.4', screenshotDir: './screenshots' },
  renderConfig: { fps: 24, width: 1920, height: 1080 },
  outputDir: './my-film',
});
```

---

## Storytelling Framework

CraftMind uses the **Save the Cat** beat sheet system for narrative structure:

1. **Opening Image** — Establish the world
2. **Theme Stated** — The core question
3. **Setup** — Meet the characters
4. **Catalyst** — The inciting incident
5. **Debate** — Should they act?
6. **Break into Two** — Commitment to the journey
7. **Fun and Games** — The promise of the premise
8. **Midpoint** — False victory or defeat
9. **Bad Guys Close In** — Stakes escalate
10. **All Is Lost** — The lowest point
11. **Dark Night of Soul** — Despair
12. **Break into Three** — The answer emerges
13. **Finale** — Climax and resolution
14. **Final Image** — The new normal

---

## License

MIT
