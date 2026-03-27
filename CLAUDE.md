# CraftMind Studio — AI-Powered Minecraft Filmmaking Engine

## Project Overview

CraftMind Studio is an AI-powered filmmaking engine for Minecraft that enables virtual movie production. Built as part of the CraftMind ecosystem, it combines autonomous AI agents, cinematic camera systems, virtual actors, and a complete production pipeline to create an interactive movie tycoon experience.

**Core Concept**: Become a virtual movie studio manager, directing AI-driven characters through pre-production, filming, post-production, and release. The system uses LLMs to generate scripts, dialogue, and shot compositions while managing studio facilities, star talent, and production finances.

**Key Capabilities**:
- Generate shot lists from creative briefs using Save the Cat beat sheet structure
- Position virtual actors (mineflayer bots) and capture cinematic footage
- Apply real cinematography rules (rule of thirds, 180-degree rule, depth of field)
- Manage studio lots with buildings, adjacency bonuses, and upgrade tiers
- Simulate star talent with mood, stress, relationships, and career arcs
- Run full production pipeline from script to release with quality scoring

## Architecture

### Core Systems

```
┌─────────────────────────────────────────────────────────────┐
│                    CraftMind Studio                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Director AI  │  │  Character   │  │   Camera        │   │
│  │  (LLM-driven) │→ │  System      │→ │   System        │   │
│  │  - Scripts    │  │  - Traits    │  │   - Composition │   │
│  │  - Dialogue   │  │  - Memory    │  │   - Moves       │   │
│  │  - Shot Lists │  │  - Relations │  │   - DOF         │   │
│  └───────────────┘  └──────────────┘  └─────────────────┘   │
│          ↓                  ↓                  ↓             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Production Pipeline                         │   │
│  │  Script → Casting → Sets → Shooting → Edit → Release │   │
│  └──────────────────────────────────────────────────────┘   │
│          ↓                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Studio Tycoon Layer                        │   │
│  │  - Studio Lot (buildings, adjacency)                 │   │
│  │  - Star System (mood, stress, careers)               │   │
│  │  - Finance (budgets, costs, revenue)                 │   │
│  │  - Awards & Competitors                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            AI Agent Layer                             │   │
│  │  - Stochastic Script Engine                          │   │
│  │  - 7 NPC personalities (Mabel, Victor, June...)       │   │
│  │  - Emergent story patterns                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Camera System (`src/camera.js`)

Implements professional camera movements for Minecraft cinematography:

- **Path Types**: Orbit, dolly, crane, and custom keyframed moves
- **Easing Functions**: Linear, ease-in, ease-out, ease-in-out
- **Keyframe System**: Time-based interpolation for smooth camera motion
- **Integration**: Designed for mineflayer-viewer's camera control API

**Key Functions**:
- `orbitPath(center, radius, heightOffset, durationSec, startAngleDeg, totalAngleDeg, easing)` - Circular camera movement
- `dollyPath(start, end, durationSec, lookAt, easing)` - Linear push-in/pull-out
- `cranePath(start, riseHeight, durationSec, lookAt, easing)` - Vertical rise/drop
- `getStateAt(move, timeSec)` - Get interpolated camera state at any time

### Virtual Actors (`src/character.js`, `src/simulation.js`)

**Character System** manages persistent character profiles:
- Personality traits, speaking style, voice configuration
- Relationship network with trust levels and shared history
- Scene memory tracking for continuity
- Integration with Star System for studio tycoon layer

**Simulation Orchestrator** handles Minecraft server integration:
- Spawns mineflayer bots as actors
- Positions actors for scenes using `/tp` commands
- Captures screenshots via mineflayer-viewer
- Manages take organization and frame recording

### Cinematic Direction (`src/director.js`, `src/composition.js`)

**Director AI** uses LLMs (ZAI API) to:
- Generate shot lists from creative briefs using Save the Cat beat sheet
- Create character-consistent dialogue with emotional context
- Suggest era-appropriate sets and check director blocks

**Composition Engine** implements real cinematography rules:
- **Rule of Thirds**: Scores subjects on power points
- **180-Degree Rule**: Enforces camera placement relative to action line
- **Leading Lines**: Uses environment geometry for dynamic framing
- **Depth of Field**: Calculates aperture settings based on shot type and mood
- **Smart Camera Positioning**: `composeShot()` generates optimal camera placement

## File Structure

```
craftmind-studio/
├── src/
│   ├── index.js                    # Main entry point, exports all modules
│   │
│   ├── Core Production:
│   ├── director.js                 # AI director (LLM integration)
│   ├── timeline.js                 # Shot sequence editor
│   ├── character.js                # Character profiles & relationships
│   ├── camera.js                   # Camera path generation
│   ├── composition.js              # Cinematography rules engine
│   ├── simulation.js               # Minecraft server orchestration
│   ├── renderer.js                 # Video rendering pipeline
│   ├── audio.js                    # Dialogue synthesis & music
│   │
│   ├── Extended Production:
│   ├── set-design.js               # Scene graph & set construction
│   ├── dialogue-beats.js           # Dialogue timing & subtitles
│   ├── storyboard.js               # Visual storyboard generation
│   ├── takes.js                    # Take management & selection
│   ├── post-production.js          # Transitions, titles, export
│   ├── sound-design.js             # Ambient audio & SFX planning
│   │
│   ├── Studio Tycoon:
│   ├── studio-lot.js               # Building placement & adjacency
│   ├── star-system.js              # Actor talent & careers
│   ├── production-pipeline.js      # Film production workflow
│   ├── finance.js                  # Budget & revenue
│   ├── awards.js                   # Award ceremonies
│   ├── era-progression.js          # Historical eras & tech unlock
│   ├── crisis-events.js            # Random production crises
│   ├── audience.js                 # Audience reception scoring
│   ├── competitor-studios.js       # Rival studios
│   ├── daily-routine.js            # Time phase management
│   │
│   ├── AI Systems:
│   ├── ai/studio-action-schema.js  # Action type definitions
│   ├── ai/studio-agent-configs.js  # NPC personalities
│   ├── ai/studio-interactions.js   # NPC interaction resolver
│   ├── ai/studio-story-generator.js# Emergent story patterns
│   ├── ai/directing-evaluator.js   # Comparative directing analysis
│   ├── ai/script-evolver-studio.js # Self-improving scripts
│   │
│   └── Script Engine:
│       └── scripts/
│           ├── script-engine.js    # Stochastic script runner
│           ├── v1-auteur.js        # Auteur director personality
│           ├── v1-hack.js          # Hack director personality
│           ├── v1-mentor.js        # Mentor director personality
│           └── v1-temperamental.js # Temperamental director personality
│
├── tests/                          # 134 tests across 12 files
├── examples/                       # Demo scripts
├── docs/                           # Design docs & research
├── scripts/                        # Playtest scripts
└── package.json

```

## Current State

**Version**: 0.1.0 (Active Development)

**Implemented Features**:
- ✅ Complete production pipeline (brief → video)
- ✅ AI director with Save the Cat beat sheet integration
- ✅ Camera system with cinematic movements
- ✅ Composition engine with cinematography rules
- ✅ Character system with relationships and memory
- ✅ Studio tycoon layer (buildings, stars, productions)
- ✅ Stochastic script engine for NPC behaviors
- ✅ 7 NPC personalities with distinct traits
- ✅ LLM integration for script/dialogue generation
- ✅ Timeline editor with JSON export
- ✅ Post-production (transitions, titles, export)
- ✅ Sound design planning
- ✅ Award ceremony system
- ✅ Era progression system
- ✅ Crisis events system
- ✅ Competitor studios
- ✅ Daily routine management

**Testing**: 134 tests covering all major modules

**Dependencies**:
- `mineflayer` ^4.23.0 — Minecraft bot framework
- `prismarine-viewer` ^1.29.0 — Minecraft world viewer
- `vec3` ^0.1.10 — 3D vector math

**Environment Variables**:
- `ZAI_API_KEY` — Required for LLM features (director dialogue generation)

## 5 Most Impactful Improvements

### 1. **Enhance LLM Integration**
**Current**: Uses single LLM provider (ZAI API) with hardcoded prompts
**Impact**: High — Enables all creative generation features
**Proposed**:
- Add support for multiple LLM providers (OpenAI, Anthropic, local models)
- Make prompts configurable per genre/style
- Add fallback/error handling for LLM failures
- Implement prompt caching to reduce costs
- Add streaming responses for faster feedback

### 2. **Complete Minecraft Server Integration**
**Current**: Simulation system exists but limited real-world testing
**Impact**: High — Core value proposition of Minecraft filmmaking
**Proposed**:
- Add robust server connection handling
- Implement real actor positioning and screenshot capture
- Add viewer integration for headless rendering
- Create test server setup for CI/CD
- Document server requirements and setup

### 3. **Expand AI Agent Personalities**
**Current**: 7 base NPCs with stochastic scripts
**Impact**: Medium-High — Drives engagement and replayability
**Proposed**:
- Add more personality types (experimental, genre-specialist, critic)
- Implement dynamic relationship evolution between NPCs
- Add learning from player actions (adaptive behavior)
- Create emergent story events based on NPC interactions
- Add NPC-NPC collaboration/conflict patterns

### 4. **Improve Composition Engine**
**Current**: Rule-based system with good fundamentals
**Impact**: Medium — Directly impacts output quality
**Proposed**:
- Add more shot types (Dutch angle, rack focus, tracking)
- Implement automatic coverage planning (master + coverage shots)
- Add lighting analysis for optimal camera placement
- Create shot sequence templates by genre
- Add visual feedback for composition scoring

### 5. **Add Web Dashboard**
**Current**: CLI-only interface
**Impact**: Medium — Improves accessibility and monitoring
**Proposed**:
- Real-time production monitoring
- Visual timeline editor
- Studio lot builder UI
- Star roster management
- Budget and finance dashboard
- Preview storyboard panels

## Integration with CraftMind Core Systems

### Plugin Registration

```javascript
import { registerWithCore } from 'craftmind-studio';

registerWithCore(core);
// Registers as 'studio' plugin with modules:
// - produce() — Full production pipeline
// - startServer() — Web UI server
// - generateShotList() — AI director
// - StudioLot, StarRegistry, Production — Tycoon classes
```

### Cross-Game Synergies

The design document (`docs/STUDIO_AI_REDESIGN.md`) outlines several ecosystem integrations:

**From CraftMind Fishing**:
- Record fish catches → Studio makes documentary
- Fishing skills unlock cinematography patience bonuses
- Shared AI agent architecture (stochastic scripts, mood systems)

**To CraftMind Researcher**:
- Film quality data analysis → Research papers on cinema trends
- Audience reception patterns → Academic studies

**To CraftMind Courses**:
- Film school courses → Players earn directing certificates
- Directing skill bonuses in Studio after completing courses

**To CraftMind Herding**:
- Livestock handling → Actor wrangling skill bonuses

### Shared Systems

**AI Agent Architecture** (adapted from craftmind-fishing):
- Stochastic script engine with mood-based behavior
- Personality-driven dialogue and action selection
- Self-improving scripts through comparative evaluation
- Emergent story generation from NPC interactions

**Data Persistence**:
- Character profiles sync with Star System
- Production history accessible across games
- Awards and achievements shared

**Event Bus Integration**:
- Studio releases trigger fishing news
- Research discoveries unlock new production techniques
- Course completion unlocks studio features

## Development Workflow

### Running Examples

```bash
# Basic demo
node examples/demo.js

# Advanced production
node examples/advanced-production.js

# Studio tycoon demo
node examples/studio-tycoon-demo.js

# Plugin playtest
node scripts/playtest.js
```

### Testing

```bash
npm test                    # Run all 134 tests
node --test tests/*.test.js # Direct test runner
```

### Development Server

```bash
npm start                   # Start CLI interface
npm run serve              # Start web UI on port 3456
```

## Key Design Decisions

1. **Save the Cat Beat Sheet**: Chosen for script generation because it provides predictable structure while allowing creative variation
2. **Mineflayer Integration**: Enables real Minecraft footage rather than just simulation
3. **Stochastic Scripts**: Adapted from fishing provenance for autonomous NPC behavior
4. **Modular Architecture**: Each system (camera, character, director) is independently testable and usable
5. **LLM for Creativity**: Uses AI for creative tasks (scripts, dialogue) but keeps game logic deterministic

## Future Roadmap

**v0.2 (Next)**:
- Real Minecraft server integration testing
- Web dashboard for monitoring
- Multiplayer support

**v1.0 (Future)**:
- Full production release
- Community course/challenge sharing
- Plugin marketplace integration

## Technical Notes

- **LLM API**: Currently uses ZAI API (glm-4.7-flash model). Requires `ZAI_API_KEY` environment variable.
- **Minecraft Version**: Designed for 1.20.4 but compatible across versions
- **Video Export**: Uses ffmpeg for post-production (transitions, titles, encoding)
- **Screenshot Format**: PNG frames at 24fps, assembled into video via renderer
- **Coordinate System**: Uses Minecraft's coordinate system (x=east, z=south, y=up)
