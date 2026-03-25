# CraftMind Ecosystem Research Document

> A unified architecture for AI-powered Minecraft experiences across gaming, education, filmmaking, and research

---

## Executive Summary

**CraftMind** is an ecosystem of products built on a shared AI agent engine for Minecraft. The core insight: instead of building separate AI systems for gaming companions, educational tools, filmmaking assistants, and research agents, we build **one modular foundation** that powers all use cases.

This document defines the ecosystem architecture, identifies shared vs. product-specific components, establishes implementation priorities, and provides honest risk assessment.

### The Three Products

| Product | Purpose | Target Users |
|---------|---------|--------------|
| **CraftMind Core** | Foundation: AI bot engine with memory, personality, script learning | Developers, power users |
| **CraftMind Movie Studio** | AI-powered Minecraft filmmaking | YouTube creators, storytellers |
| **CraftMind Courses** | Gamified education inside Minecraft | Students, educators, learners |
| **CraftMind Researcher** | AI agents that improve through experimentation | AI/ML researchers, advanced users |

### Key Insight

**The core engine must be rock-solid before any product can shine.** Each product is only as good as the underlying agent behavior. A filmmaking tool with unconvincing AI actors, or an education platform with inconsistent AI teachers, fails regardless of UI polish.

---

## Part 1: The Shared Foundation — CraftMind Core

### What Core Provides

CraftMind Core is **not a product** — it's a platform that all products build upon. It provides:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CRAFTMIND CORE ENGINE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Agent Runtime Layer                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │  Mineflayer  │  │   World      │  │    Action        │   │   │
│  │  │  Protocol    │  │   Model      │  │    Executor      │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   Decision Engine Layer                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │  System 1    │  │   System 2   │  │   Personality    │   │   │
│  │  │  (Cached)    │  │   (LLM)      │  │   Module         │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     Memory Layer                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │  Working     │  │   Episodic   │  │    Semantic      │   │   │
│  │  │  Memory      │  │   Memory     │  │    Memory        │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │  Procedural  │  │   Knowledge  │  │    Lore          │   │   │
│  │  │  (Scripts)   │  │   Graph      │  │    Bible         │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   Communication Layer                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │   Voice      │  │    Chat      │  │     TTS/STT      │   │   │
│  │  │   Interface  │  │    API       │  │     Pipeline     │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Core Components Detailed

#### 1. Agent Runtime Layer
- **Mineflayer Protocol**: Full Minecraft 1.8-1.21+ protocol support
- **World Model**: Block map, entity tracking, inventory state, player positions
- **Action Executor**: Script execution with validation, error recovery, state monitoring

#### 2. Decision Engine Layer
- **System 1 (Fast)**: Pre-cached JavaScript scripts for common actions
- **System 2 (Slow)**: LLM-based reasoning for novel situations
- **Personality Module**: Big Five traits, emotional state, communication style

#### 3. Memory Layer
- **Working Memory**: Short-term buffer (50 items ring buffer)
- **Episodic Memory**: Timestamped events with vector embeddings
- **Semantic Memory**: Knowledge graph for facts and relationships
- **Procedural Memory**: Cached scripts with metadata
- **Knowledge Graph**: Entity relationships, lore bible

#### 4. Communication Layer
- **Voice Interface**: Push-to-talk, interruption handling
- **Chat API**: Text-based interaction, command parsing
- **TTS/STT Pipeline**: Whisper STT, Piper/ElevenLabs TTS

### Core API (What Products Consume)

```typescript
// The unified agent interface all products use
interface CraftMindAgent {
  // Identity
  id: string;
  name: string;
  personality: PersonalityProfile;
  
  // State
  emotionalState: EmotionalState;
  currentGoal: Goal | null;
  workingMemory: WorkingMemory;
  
  // Actions
  executeAction(action: Action): Promise<ActionResult>;
  speak(message: string, options?: SpeakOptions): Promise<void>;
  moveTo(position: Position): Promise<void>;
  interact(target: Entity | Block): Promise<void>;
  
  // Memory
  remember(query: string): Promise<Memory[]>;
  learn(script: Script, metadata: ScriptMetadata): Promise<void>;
  
  // Queries
  observe(): WorldObservation;
  status(): AgentStatus;
  
  // Events
  on(event: AgentEvent, handler: EventHandler): void;
}

// Configuration for different use cases
interface AgentConfig {
  mode: 'companion' | 'actor' | 'teacher' | 'researcher';
  personality: PersonalityTraits;
  capabilities: Capability[];
  memoryConfig: MemoryConfig;
  voiceConfig?: VoiceConfig;
}
```

---

## Part 2: CraftMind Courses (Education Platform)

### Concept: OpenMAIC Meets Minecraft

OpenMAIC (Open Multi-Agent Interactive Classroom) is Tsinghua University's open-source AI education platform. It transforms any topic into an interactive classroom with AI teachers and classmates. **CraftMind Courses brings this concept into Minecraft.**

### OpenMAIC Architecture (Reference)

From our research:

```
OpenMAIC Architecture:
├── Generation Pipeline (Two-Stage)
│   ├── Stage 1: Analyze input → Generate lesson outline
│   └── Stage 2: Transform outline → Rich scenes (slides, quizzes, simulations)
│
├── Multi-Agent Orchestration
│   ├── LangGraph state machine for agent turns
│   ├── AI Teachers (lecture, present)
│   ├── AI Teaching Assistants (supplementary help)
│   └── AI Classmates (participate, discuss, debate)
│
├── Scene Types
│   ├── Slides with voice narration
│   ├── Quizzes (single/multiple choice, short answer)
│   ├── Interactive HTML simulations
│   └── Project-Based Learning (PBL)
│
├── Interaction Modes
│   ├── Classroom Discussion
│   ├── Roundtable Debate
│   ├── Q&A Mode
│   └── Whiteboard collaboration
│
└── Technology Stack
    ├── Next.js + React + TypeScript
    ├── LangGraph for orchestration
    ├── Multiple LLM providers (OpenAI, Anthropic, Gemini, DeepSeek)
    └── TTS/ASR for voice interaction
```

### CraftMind Courses: The Minecraft Adaptation

**Key Innovation**: Instead of slides and web simulations, **the Minecraft world IS the lesson**.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CRAFTMIND COURSES                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  LESSON INPUT                    COURSE WORLD                       │
│  ┌──────────────────┐           ┌──────────────────────────────┐   │
│  │ Topic:           │           │   ┌─────────┐                │   │
│  │ "Medieval        │──────────►│   │ Castle  │  ← Historical  │   │
│  │  Castles"        │           │   │ Build   │    Recreation  │   │
│  │                  │           │   └────┬────┘                │   │
│  │ OR               │           │        │                     │   │
│  │                  │           │   ┌────▼────┐                │   │
│  │ Upload PDF       │           │   │ Village │  ← Society    │   │
│  │ textbook         │           │   │ Life    │    Simulation │   │
│  └──────────────────┘           │   └─────────┘                │   │
│                                 │                              │   │
│                                 │   ┌─────────┐                │   │
│                                 │   │ Siege   │  ← Physics    │   │
│                                 │   │ Engine  │    Mechanics  │   │
│                                 │   └─────────┘                │   │
│                                 └──────────────────────────────┘   │
│                                                                     │
│  AI CLASSMATES                  LESSON FLOW                         │
│  ┌──────────────────┐           ┌──────────────────────────────┐   │
│  │ 🧑‍🎓 Alex (Curious)  │           │ 1. Enter world (loading)    │   │
│  │ 🧑‍🎓 Sam (Skeptical)│──────────►│ 2. AI Teacher introduces    │   │
│  │ 🧑‍🎓 Jordan (Helper) │           │ 3. Explore with classmates  │   │
│  │ 👨‍🏫 Prof. Oak (Teacher)│        │ 4. Complete challenges      │   │
│  └──────────────────┘           │ 5. Quiz/assessment           │   │
│                                 │ 6. Debrief & next steps      │   │
│                                 └──────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Lesson Types Adapted for Minecraft

| OpenMAIC Scene | CraftMind Courses Equivalent |
|----------------|------------------------------|
| **Slides** | **Guided Tours**: NPC teacher walks you through a built environment, explaining as you go |
| **Quizzes** | **In-World Challenges**: Redstone puzzles, building challenges, item identification |
| **Interactive Simulations** | **Working Systems**: Functional redstone circuits, economy simulations, physics demos |
| **Project-Based Learning** | **Collaborative Builds**: Group projects with AI assistants and classmates |
| **Whiteboard** | **In-World Signs/Books**: AI agents place signs, write books, build diagrams with blocks |
| **Discussion** | **In-World Voice Chat**: AI classmates discuss topics while exploring together |

### AI Classmate Design

Classmates have different skill levels and personalities (inspired by OpenMAIC's multi-agent approach):

```yaml
# Example classmate profiles
classmates:
  - name: "Alex"
    role: "curious_learner"
    personality:
      openness: 0.9
      curiosity: 0.95
      speaking_style: "asks lots of questions"
    skill_level: "intermediate"
    purpose: "Models good questioning behavior"
    
  - name: "Sam"
    role: "skeptical_peer"
    personality:
      conscientiousness: 0.8
      critical_thinking: 0.9
      speaking_style: "challenges assumptions"
    skill_level: "advanced"
    purpose: "Promotes critical thinking through debate"
    
  - name: "Jordan"
    role: "helpful_assistant"
    personality:
      agreeableness: 0.9
      patience: 0.85
      speaking_style: "offers hints without solving"
    skill_level: "expert"
    purpose: "Provides scaffolding when student struggles"
    
  - name: "Prof. Oak"
    role: "teacher"
    personality:
      conscientiousness: 0.95
      expertise: 1.0
      speaking_style: "clear, structured explanations"
    skill_level: "master"
    purpose: "Delivers core content, assesses understanding"
```

### Course Generation Pipeline

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   LESSON     │────►│    WORLD     │────►│    NPC       │
│   ANALYZER   │     │    BUILDER   │     │    SPAWNER   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Extract:     │     │ Generate:    │     │ Create:      │
│ • Topics     │     │ • Terrain    │     │ • Teacher    │
│ • Concepts   │     │ • Structures │     │ • Classmates │
│ • Sequence   │     │ • Props      │     │ • Challenges │
│ • Assessment │     │ • Paths      │     │ • Dialogues  │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Example: History Lesson - "Life in a Medieval Village"

**Input**: "Teach me about daily life in a medieval European village"

**Generated Course**:
1. **Entry Point**: Student spawns in a historically-accurate medieval village
2. **AI Teacher** (Prof. Oak): Greets student, gives overview via voice
3. **Exploration Phase**: 
   - Walk through village with AI classmates (Alex, Sam, Jordan)
   - Visit blacksmith, farm, church, lord's manor
   - Each location has interactive elements ( chests with items, signs with info)
4. **Discussion**: Alex asks "Why were villages built near rivers?" - Sam offers hypothesis - Student can join conversation
5. **Challenge**: Help the blacksmith craft items using period-appropriate methods
6. **Quiz**: Identify social hierarchy by arranging NPCs in correct order
7. **Reflection**: Prof. Oak summarizes key learnings, suggests next lesson

### What Core Provides to Courses

| Core Component | Courses Usage |
|----------------|---------------|
| Agent Runtime | Controls AI teacher and classmates |
| Decision Engine | Classmates make contextual decisions during lessons |
| Personality Module | Different classmates have distinct personalities |
| Memory Layer | Remembers student's progress, struggles, preferences |
| Voice Interface | Teacher and classmates speak via TTS |
| Script Learning | Learns effective teaching patterns over time |

### Courses-Specific Components

| Component | Description |
|-----------|-------------|
| **Lesson Analyzer** | Parses topic/PDF into lesson structure (new) |
| **World Generator** | Builds Minecraft worlds matching lesson content (new) |
| **Curriculum Manager** | Tracks progress across multiple lessons (new) |
| **Assessment Engine** | Evaluates student performance in-world (new) |
| **Adaptive Difficulty** | Adjusts challenge based on student skill (new) |

---

## Part 3: CraftMind Researcher (AI Self-Improvement)

### Concept: AutoClaw Meets Minecraft

**AutoClaw** is an autonomous multi-agent knowledge system forked from Karpathy's **autoresearch**. It runs 24/7 crews of AI agents (Researchers, Teachers, Critics, Distillers) that build knowledge bases through autonomous research.

**CraftMind Researcher** gamifies AI self-improvement within Minecraft. Instead of research papers, agents discover crafting recipes, learn building techniques, and develop combat strategies through experimentation.

### AutoClaw Architecture (Reference)

```
AutoClaw Multi-Agent System:
├── Agent Roles
│   ├── Researcher: Web search + LLM synthesis
│   ├── Teacher: Q&A generation from knowledge
│   ├── Critic: Quality check, fact verification
│   └── Distiller: Knowledge synthesis, summarization
│
├── Message Bus
│   └── SQLite pub/sub for inter-agent communication
│
├── Knowledge Store (Hot/Warm/Cold Tiers)
│   ├── Hot: RAM cache, 1000 entries, 24h expiry
│   ├── Warm: SQLite DB, 100k entries, 30d age
│   └── Cold: Gzip files, 180d age, batch archive
│
├── VectorDB
│   └── Semantic search for knowledge retrieval
│
└── Wiki
    └── Markdown files with traceable sources
```

### Karpathy's autoresearch (Reference)

```
autoresearch Design Principles:
├── Single-file architecture: train.py is the only file agents modify
├── Fixed time budget: 5-minute training runs for fair comparison
├── Self-contained: No external dependencies beyond PyTorch
├── Metric-driven: val_bpb (validation bits per byte) as success metric
└── Autonomous loop: Modify → Train → Evaluate → Keep/Discard → Repeat
```

### CraftMind Researcher: The Minecraft Adaptation

**Key Innovation**: AI agents that discover and improve skills **inside Minecraft**, with the improvement process itself improving over time (meta-learning).

```
┌─────────────────────────────────────────────────────────────────────┐
│                   CRAFTMIND RESEARCHER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  RESEARCH LAB WORLD              AGENT ROLES                        │
│  ┌──────────────────────┐       ┌──────────────────────────────┐   │
│  │ ┌─────┐ ┌─────┐      │       │ 🔬 EXPLORER                  │   │
│  │ │Test │ │Test │      │       │    Discovers new mechanics   │   │
│  │ │Area │ │Area │      │       │    through experimentation   │   │
│  │ │  1  │ │  2  │      │       │                              │   │
│  │ └─────┘ └─────┘      │       │ 🧪 TESTER                    │   │
│  │                      │       │    Validates discoveries     │   │
│  │ ┌─────┐ ┌─────────┐  │       │    Reproduces results        │   │
│  │ │Combat│ │Building │  │       │                              │   │
│  │ │Arena │ │ Ground  │  │       │ ⚖️ CRITIC                    │   │
│  │ └─────┘ └─────────┘  │       │    Challenges assumptions    │   │
│  │                      │       │    Identifies edge cases     │   │
│  │ ┌─────────────────┐  │       │                              │   │
│  │ │  Knowledge      │  │       │ 🧠 DISTILLER                 │   │
│  │ │  Archive        │  │       │    Synthesizes patterns      │   │
│  │ │  (Chests/Books) │  │       │    Creates reusable scripts  │   │
│  │ └─────────────────┘  │       └──────────────────────────────┘   │
│  └──────────────────────┘                                          │
│                                                                     │
│  DISCOVERY CYCLE                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐              │   │
│  │  │ HYPOTHESIZE│───►│ EXPERIMENT│───►│ EVALUATE │              │   │
│  │  └──────────┘    └──────────┘    └────┬─────┘              │   │
│  │       ▲                               │                     │   │
│  │       │         ┌─────────────────────┼─────────────────┐   │   │
│  │       │         ▼                     ▼                 ▼   │   │
│  │       │   ┌──────────┐         ┌──────────┐      ┌──────────┐│   │
│  │       └───│DISCARD   │         │ REFINE   │      │PROMOTE   ││   │
│  │           └──────────┘         └────┬─────┘      └────┬─────┘│   │
│  │                                   │                 │       │   │
│  │                                   ▼                 ▼       │   │
│  │                           ┌──────────┐      ┌──────────┐    │   │
│  │                           │ Update   │      │Add to    │    │   │
│  │                           │ Hypothesis│     │Script Lib│    │   │
│  │                           └──────────┘      └──────────┘    │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Discovery Domains

**1. Crafting Discovery**
```
Goal: Discover optimal crafting sequences and unknown recipes
Method: Randomly combine items, observe results, record patterns
Example Discovery: "Dropping lava on blue ice creates obsidian faster than water"
```

**2. Building Techniques**
```
Goal: Learn efficient building patterns and aesthetic principles
Method: Generate structures, evaluate against criteria, iterate
Example Discovery: "Symmetrical builds with odd-width centers are rated higher"
```

**3. Combat Strategies**
```
Goal: Develop effective combat approaches for different enemies
Method: Fight mobs with various strategies, track success rates
Example Discovery: "Strafing right while shooting is 15% more effective vs skeletons"
```

**4. Resource Optimization**
```
Goal: Find optimal mining/farming patterns
Method: Try different approaches, measure yield per time
Example Discovery: "Branch mining at Y=-58 is 23% more efficient than Y=11"
```

### Meta-Learning: Learning How to Learn

The system doesn't just learn Minecraft skills — it learns **how to learn better**:

```
┌──────────────────────────────────────────────────────────────┐
│                    META-LEARNING LOOP                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Level 1: Skill Learning                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Learn specific Minecraft skills (crafting, combat)     │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ▼                                  │
│  Level 2: Strategy Learning                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Learn which discovery methods work best for which domains│
│  │ (e.g., "Random exploration works for crafting, but     │ │
│  │   structured experimentation works for combat")        │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ▼                                  │
│  Level 3: Process Learning                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Learn how to allocate resources (time, agents, tests)  │ │
│  │ across discovery domains for maximum overall progress  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Knowledge Representation

Following AutoClaw's tiered approach:

```yaml
# Knowledge tiers in Minecraft
knowledge_tiers:
  hot_tier:
    storage: "RAM + Agent working memory"
    content: "Recently discovered, high-confidence skills"
    examples:
      - "obsidian_farming_v2: success_rate 0.94"
      - "skeleton_combat_strafe: success_rate 0.87"
    expiry: "24 hours"
    
  warm_tier:
    storage: "In-world books + SQLite"
    content: "Validated skills with evidence"
    examples:
      - "efficient_mining_patterns.md"
      - "mob_weaknesses.json"
    expiry: "30 days"
    
  cold_tier:
    storage: "External files + export"
    content: "Archived discoveries, historical data"
    examples:
      - "combat_strategies_archive.json.gz"
      - "building_patterns_history.json.gz"
    expiry: "180 days"
    
  wiki:
    storage: "Markdown files with sources"
    content: "Human-readable knowledge base"
    examples:
      - "docs/combat/skeleton-strategies.md"
      - "docs/building/symmetry-principles.md"
```

### Integration with OpenMAIC-Style Teaching

**CraftMind Researcher can teach humans about AI/ML concepts through Minecraft simulations:**

```
┌─────────────────────────────────────────────────────────────────┐
│            TEACHING AI/ML THROUGH MINECRAFT                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Concept: "Reinforcement Learning"                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  Minecraft Demo:                                          │ │
│  │  • Agent learns to navigate maze through trial and error  │ │
│  │  • Student watches reward/punishment in real-time         │ │
│  │  • Can modify reward function to change behavior          │ │
│  │  • See how exploration vs exploitation trade-off works    │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Concept: "Neural Architecture Search"                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  Minecraft Demo:                                          │ │
│  │  • Multiple agent variants compete in building task       │ │
│  │  • "Fitness" = build quality score                        │ │
│  │  • Students see how "mutations" affect performance        │ │
│  │  • Visualizes evolutionary concepts                       │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Concept: "Curriculum Learning"                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  Minecraft Demo:                                          │ │
│  │  • Agent starts with simple tasks (break block)           │ │
│  │  • Progressively harder tasks (build house, fight mob)    │ │
│  │  • Students observe how curriculum affects learning speed │ │
│  │  • Can design their own curriculum                        │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### What Core Provides to Researcher

| Core Component | Researcher Usage |
|----------------|------------------|
| Agent Runtime | Controls explorer, tester, critic, distiller agents |
| Decision Engine | Agents make hypothesis-driven decisions |
| Script Learning | Discovered skills become cached scripts |
| Memory Layer | Stores discovered knowledge across tiers |
| Personality Module | Different agent roles have different personalities |

### Researcher-Specific Components

| Component | Description |
|-----------|-------------|
| **Hypothesis Generator** | Creates testable hypotheses about game mechanics (new) |
| **Experiment Runner** | Executes experiments in isolated test worlds (new) |
| **Evidence Collector** | Gathers data from experiments (new) |
| **Meta-Learner** | Improves the discovery process itself (new) |
| **Knowledge Distiller** | Converts raw discoveries into reusable scripts (extends Core) |

---

## Part 4: Player-as-Director (Movie Studio Feature)

### Concept

A key feature for CraftMind Movie Studio where the human can step into any AI actor's role to "puppeteer" the performance, then the AI synthesizes all performances into a coherent scene.

### The Problem

AI actors might not capture the exact emotional nuance or timing the director wants. Current solutions:
- Re-roll the scene (expensive, time-consuming)
- Edit dialogue manually (breaks immersion)
- Accept imperfect performance (quality loss)

### The Solution: Puppeteer Mode

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PLAYER-AS-DIRECTOR FLOW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  STEP 1: Initial AI Performance                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Director: "Alex and Jordan argue about the destroyed chest"  │  │
│  │                                                               │  │
│  │ AI generates scene → Takes 1-5 run in parallel               │  │
│  │                                                               │  │
│  │ Director reviews takes, selects best or                      │  │
│  │ identifies specific improvements needed                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  STEP 2: Puppeteer Mode (If AI performance insufficient)           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                                                               │  │
│  │ Director: "Let me perform Alex's part"                       │  │
│  │                                                               │  │
│  │ ┌─────────────────┐     ┌─────────────────┐                  │  │
│  │ │   Director      │     │   AI Jordan     │                  │  │
│  │ │   (as Alex)     │────►│   (reacting)    │                  │  │
│  │ │                 │     │                 │                  │  │
│  │ │ - Controls Alex │     │ - Responds to   │                  │  │
│  │ │ - Types/speaks  │     │   director's    │                  │  │
│  │ │   dialogue      │     │   performance   │                  │  │
│  │ │ - Moves/acts    │     │ - Stays in      │                  │  │
│  │ │                 │     │   character     │                  │  │
│  │ └─────────────────┘     └─────────────────┘                  │  │
│  │                                                               │  │
│  │ Recorded as "Alex Performance - Take 6"                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  STEP 3: Character-by-Character Performance                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                                                               │  │
│  │ Director performs each character they want to refine:        │  │
│  │                                                               │  │
│  │ Take 6: Director performs Alex                               │  │
│  │ Take 7: AI performs Jordan (reacting to Take 6)              │  │
│  │ Take 8: Director refines Jordan's response                   │  │
│  │                                                               │  │
│  │ Each take captured separately                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  STEP 4: AI Synthesis                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                                                               │  │
│  │ AI Director analyzes all performances:                       │  │
│  │                                                               │  │
│  │ 1. Timing alignment: Make dialogue flow naturally           │  │
│  │ 2. Emotional continuity: Ensure reactions match              │  │
│  │ 3. Spatial coherence: Position characters correctly          │  │
│  │ 4. Dialogue meshing: Smooth transitions between takes        │  │
│  │                                                               │  │
│  │ Output: Single coherent scene combining best moments         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  STEP 5: Fine-Tuning via Chat                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                                                               │  │
│  │ Director: "Jordan's apology at 1:30 feels rushed"           │  │
│  │                                                               │  │
│  │ AI: "I can:"                                                 │  │
│  │     "1. Extend pause before apology (+3 sec)"               │  │
│  │     "2. Add hesitation 'I... I'm sorry'"                    │  │
│  │     "3. Re-perform with different emotional tone"           │  │
│  │                                                               │  │
│  │ Director: "Do option 2"                                      │  │
│  │                                                               │  │
│  │ AI modifies dialogue, re-renders affected segment           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Technical Implementation

**Performance Capture**:
```
┌────────────────────────────────────────────────────────────┐
│                 PERFORMANCE RECORDING                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Input Sources:                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │   Voice      │  │   Keyboard   │  │   Mouse        │   │
│  │   (TTS/STT)  │  │   (Chat)     │  │   (Movement)   │   │
│  └──────┬───────┘  └──────┬───────┘  └───────┬────────┘   │
│         │                 │                  │            │
│         ▼                 ▼                  ▼            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              PERFORMANCE TIMELINE                    │  │
│  │                                                     │  │
│  │  0:00 ────┬───────┬───────┬───────┬───────┬─── 2:15 │  │
│  │           │       │       │       │       │         │  │
│  │         Voice   Chat   Move   Action  Emote         │  │
│  │                                                     │  │
│  │  All events timestamped for synthesis              │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**AI Synthesis Engine**:
```yaml
synthesis_engine:
  timing_alignment:
    - Detect natural pause points in dialogue
    - Align character reactions to triggers
    - Smooth transitions between take boundaries
    
  emotional_continuity:
    - Analyze emotional trajectory of each performance
    - Ensure AI reactions match human performance intensity
    - Detect and flag emotional discontinuities
    
  spatial_coherence:
    - Track character positions across takes
    - Maintain consistent blocking
    - Handle position mismatches through editing
    
  dialogue_meshing:
    - Blend dialogue at take boundaries
    - Generate bridging lines if needed
    - Maintain character voice consistency
```

### What Core Provides to Player-as-Director

| Core Component | Player-as-Director Usage |
|----------------|--------------------------|
| Agent Runtime | Controls AI actors during performance |
| Decision Engine | AI actors react to human performance in real-time |
| Personality Module | Ensures AI reactions match character personality |
| Memory Layer | AI actors remember earlier takes for consistency |
| Voice Interface | Captures human voice performance |
| Script Learning | Learns director's preferences over time |

### Player-as-Director Specific Components

| Component | Description |
|-----------|-------------|
| **Performance Recorder** | Captures human input with timestamps (new) |
| **AI Reactor** | AI actors respond to human performance in real-time (new) |
| **Synthesis Engine** | Combines multiple takes into coherent scene (new) |
| **Fine-Tuning Interface** | Chat-based scene refinement (extends Movie Studio) |
| **Preview Renderer** | Quick preview of synthesized scene (extends Movie Studio) |

---

## Part 5: Ecosystem Architecture

### Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CRAFTMIND ECOSYSTEM                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          CRAFTMIND CORE                                  │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │   Agent     │ │  Decision   │ │   Memory    │ │     Voice   │       │   │
│  │  │   Runtime   │ │   Engine    │ │   Layer     │ │   Layer     │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │ Personality │ │   Script    │ │  Knowledge  │ │     LLM     │       │   │
│  │  │   Module    │ │   Learning  │ │   Graph     │ │  Interface  │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│          ┌───────────────────────────┼───────────────────────────┐             │
│          │                           │                           │             │
│          ▼                           ▼                           ▼             │
│  ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐     │
│  │   CRAFTMIND       │    │   CRAFTMIND       │    │   CRAFTMIND       │     │
│  │   MOVIE STUDIO    │    │   COURSES         │    │   RESEARCHER      │     │
│  ├───────────────────┤    ├───────────────────┤    ├───────────────────┤     │
│  │                   │    │                   │    │                   │     │
│  │  Core Usage:      │    │  Core Usage:      │    │  Core Usage:      │     │
│  │  • Agent actors   │    │  • AI teachers    │    │  • Explorer agent │     │
│  │  • Director AI    │    │  • AI classmates  │    │  • Tester agent   │     │
│  │  • Memory for     │    │  • Memory for     │    │  • Critic agent   │     │
│  │    continuity     │    │    progress       │    │  • Distiller agent│     │
│  │  • Voice for      │    │  • Voice for      │    │  • Memory for     │     │
│  │    dialogue       │    │    lectures       │    │    discoveries    │     │
│  │                   │    │                   │    │                   │     │
│  │  Product-Specific:│    │  Product-Specific:│    │  Product-Specific:│     │
│  │  • Simulation     │    │  • Lesson         │    │  • Hypothesis     │     │
│  │    Orchestrator   │    │    Analyzer       │    │    Generator      │     │
│  │  • Parallel Takes │    │  • World          │    │  • Experiment     │     │
│  │  • Take Evaluator │    │    Generator      │    │    Runner         │     │
│  │  • Timeline       │    │  • Assessment     │    │  • Meta-Learner   │     │
│  │    Editor         │    │    Engine         │    │  • Knowledge      │     │
│  │  • Player-as-     │    │  • Curriculum     │    │    Distiller      │     │
│  │    Director       │    │    Manager        │    │                   │     │
│  │                   │    │                   │    │                   │     │
│  └───────────────────┘    └───────────────────┘    └───────────────────┘     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Shared vs Product-Specific Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMPONENT CLASSIFICATION                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CRAFTMIND CORE (Shared)          │  PRODUCT-SPECIFIC               │
│  ══════════════════════════════   │  ════════════════════════════   │
│                                    │                                 │
│  ✓ Agent Runtime (Mineflayer)     │  Movie Studio:                  │
│  ✓ Decision Engine (Sys1/Sys2)    │    • Simulation Orchestrator    │
│  ✓ Personality Module             │    • Take Management            │
│  ✓ Working Memory                 │    • Timeline Editor            │
│  ✓ Episodic Memory                │    • Render Pipeline            │
│  ✓ Semantic Memory                │    • Player-as-Director         │
│  ✓ Procedural Memory (Scripts)    │                                 │
│  ✓ Knowledge Graph                │  Courses:                       │
│  ✓ Voice Interface (STT/TTS)      │    • Lesson Analyzer            │
│  ✓ Chat API                       │    • World Generator            │
│  ✓ LLM Interface                  │    • Curriculum Manager         │
│  ✓ Script Learning System         │    • Assessment Engine          │
│  ✓ Error Recovery                 │    • Adaptive Difficulty        │
│  ✓ Goal Management                │                                 │
│  ✓ World Model                    │  Researcher:                    │
│  ✓ Action Executor                │    • Hypothesis Generator       │
│  ✓ Event System                   │    • Experiment Runner          │
│  ✓ Configuration Management       │    • Evidence Collector         │
│  ✓ Logging & Metrics              │    • Meta-Learner               │
│                                    │    • Knowledge Distiller       │
│                                    │                                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Feature Placement Decision Matrix

| Feature | Core | Movie Studio | Courses | Researcher |
|---------|:----:|:------------:|:-------:|:----------:|
| Basic movement/actions | ✓ | | | |
| Script caching (System 1) | ✓ | | | |
| LLM reasoning (System 2) | ✓ | | | |
| Personality traits | ✓ | | | |
| Emotional states | ✓ | | | |
| Voice synthesis | ✓ | | | |
| Working memory | ✓ | | | |
| Long-term memory | ✓ | | | |
| Relationship tracking | ✓ | | | |
| Lore bible | ✓ | | | |
| Parallel simulation | | ✓ | | |
| Take evaluation | | ✓ | | |
| Timeline editing | | ✓ | | |
| Video rendering | | ✓ | | |
| Player-as-Director | | ✓ | | |
| Lesson parsing | | | ✓ | |
| World generation for lessons | | | ✓ | |
| Quiz/challenge system | | | ✓ | |
| Progress tracking | | | ✓ | |
| Curriculum design | | | ✓ | |
| Hypothesis generation | | | | ✓ |
| Experiment execution | | | | ✓ |
| Meta-learning | | | | ✓ |
| Knowledge distillation | ✓ (base) | | | ✓ (extended) |

---

## Part 6: Implementation Priority

### Dependency Graph

```
                    ┌─────────────────┐
                    │  CRAFTMIND      │
                    │  CORE v1.0      │
                    │  (Foundation)   │
                    └────────┬────────┘
                             │
                             │ MUST BE COMPLETE
                             │ AND STABLE
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
    │   MOVIE       │ │   COURSES     │ │  RESEARCHER   │
    │   STUDIO v1.0 │ │   v1.0        │ │   v1.0        │
    └───────────────┘ └───────────────┘ └───────────────┘
```

### Phase 0: Core Foundation (Months 1-6)

**Goal**: Production-ready agent engine

**Milestones**:
```
Month 1-2: Basic Infrastructure
├── Mineflayer integration
├── Basic LLM control
├── Simple command parsing
└── Logging/metrics

Month 3-4: Decision System
├── System 1 (cached scripts)
├── System 2 (LLM reasoning)
├── Script generation
└── Script promotion

Month 5-6: Memory & Personality
├── Working memory
├── Episodic memory
├── Basic personality
└── Voice interface (MVP)
```

**Success Criteria**:
- Agent can follow voice commands
- Agent remembers past sessions
- Agent has consistent personality
- Script cache reduces LLM calls by 50%+

### Phase 1: Movie Studio (Months 7-12)

**Why First**: Direct revenue potential, leverages all Core features

**Milestones**:
```
Month 7-8: Basic Filmmaking
├── Single-server recording
├── Basic AI actors
├── Simple scene generation
└── Replay Mod integration

Month 9-10: Parallel Simulation
├── Multi-server orchestration
├── State snapshot/restore
├── Take comparison
└── Basic evaluation scoring

Month 11-12: Editor & Export
├── Timeline editor (MVP)
├── Take splicing
├── Voice synthesis
└── Video export
```

**Success Criteria**:
- Can generate 5-minute scenes from briefs
- Parallel takes provide meaningful variation
- Export quality acceptable for YouTube

### Phase 2: Courses MVP (Months 10-14)

**Why Parallel**: Shares development with Movie Studio (world building, agent control)

**Milestones**:
```
Month 10-11: Lesson System
├── Lesson parser
├── Basic world generation
├── AI teacher implementation
└── Simple challenges

Month 12-13: Classroom Dynamics
├── AI classmates
├── Discussion system
├── Quiz/challenge mechanics
└── Progress tracking

Month 14: Polish & Testing
├── Curriculum manager
├── Adaptive difficulty
└── Real student testing
```

**Success Criteria**:
- Can teach basic concepts (e.g., "how to craft")
- AI classmates add educational value
- Students show measurable learning

### Phase 3: Researcher MVP (Months 13-18)

**Why Last**: Requires stable Core and most complex meta-learning

**Milestones**:
```
Month 13-14: Discovery System
├── Hypothesis generator
├── Experiment runner
├── Basic evidence collection
└── Knowledge storage

Month 15-16: Multi-Agent Research
├── Explorer agent
├── Tester agent
├── Critic agent
├── Distiller agent
└── Message bus integration

Month 17-18: Meta-Learning
├── Learning strategy optimization
├── Resource allocation
├── Self-improvement loops
└── Knowledge distillation
```

**Success Criteria**:
- Agent discovers non-trivial game knowledge
- Meta-learning improves discovery rate over time
- Can teach humans AI/ML concepts through demos

### Phase 4: Advanced Features (Months 18-24)

**Movie Studio Advanced**:
- Player-as-Director feature
- Advanced timeline editing
- Preference learning
- Cloud rendering

**Courses Advanced**:
- Complex world generation
- Multi-subject curricula
- Student modeling
- Educator tools

**Researcher Advanced**:
- Full meta-learning
- Cross-domain discovery
- Research publication assistance
- Community knowledge sharing

---

## Part 7: Risk Assessment

### The "Spreading Too Thin" Risk

**Risk**: Building 4 products simultaneously with limited resources

**Symptoms**:
- Core engine feels rushed, buggy
- All products are mediocre instead of one being great
- Technical debt accumulates across codebase
- Team context-switching constantly

**Mitigation Strategy**:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RISK MITIGATION: PHASED APPROACH                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  RULE 1: Core is Non-Negotiable                                     │
│  ─────────────────────────────                                      │
│  • Core v1.0 must be COMPLETE before any product work               │
│  • "Complete" = stable, tested, documented, performant              │
│  • No shortcuts on memory, personality, script learning             │
│  • Estimated: 6 months, no overlap                                  │
│                                                                     │
│  RULE 2: One Product at a Time (After Core)                         │
│  ────────────────────────────────────────                           │
│  • Primary: Movie Studio (highest revenue potential)                │
│  • Secondary: Courses (parallel development, shared components)     │
│  • Tertiary: Researcher (after stable foundation)                   │
│  • Never start new product until previous has MVP users             │
│                                                                     │
│  RULE 3: Shared Components Get Extra Investment                     │
│  ─────────────────────────────────────────────                      │
│  • Any component used by 2+ products gets 2x review                 │
│  • Breaking changes require all product teams to sign off           │
│  • Shared components have dedicated owner                           │
│                                                                     │
│  RULE 4: Kill Your Darlings                                         │
│  ────────────────────────                                           │
│  • If a product isn't gaining traction after 3 months, pause it     │
│  • Focus resources on winning product                               │
│  • Can resume later when resources allow                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Core latency too high** | Medium | High | System 1 caching, streaming TTS, parallel processing |
| **Memory grows unbounded** | Medium | Medium | Tiered storage, forgetting mechanisms, compression |
| **Voice quality poor** | Medium | Medium | Multiple TTS providers, fallback to text, voice cloning |
| **Script quality inconsistent** | High | High | Validation pipelines, sandbox testing, human review |
| **Jetson performance insufficient** | Low | High | Cloud offload, model optimization, graceful degradation |
| **Minecraft protocol changes** | Low | Medium | Pin versions, follow Prismarine updates, abstraction layer |

### Product Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Movie Studio: AI actors unconvincing** | Medium | Critical | Core personality engine must be excellent, human override (Player-as-Director) |
| **Courses: Not engaging enough** | Medium | High | Game designers on team, student testing early, iterate on feedback |
| **Researcher: Discovers nothing useful** | Medium | Medium | Seed with known strategies, focus on incremental improvements first |
| **All: Users expect perfection** | High | Medium | Clear positioning as AI-assisted tools, human-in-the-loop design |

### Resource Allocation Recommendation

```
Team of 4-6 people, 24-month timeline:

Phase 0 (Months 1-6): Core Foundation
├── 4 engineers on Core
├── 1 designer on UX research
└── 1 product on market research

Phase 1 (Months 7-12): Movie Studio MVP
├── 2 engineers on Studio-specific
├── 2 engineers on Core enhancements
├── 1 designer on Studio UI
└── 1 product on creator outreach

Phase 2 (Months 10-14): Courses MVP (parallel)
├── 1-2 engineers on Courses-specific
├── Shared Core/Studio work
└── 1 educator consultant

Phase 3 (Months 13-18): Researcher MVP
├── 1-2 engineers on Researcher-specific
├── 1 researcher/ML engineer
└── Shared Core work

Phase 4 (Months 18-24): Polish & Scale
├── Distribute based on traction
├── Kill underperforming products
└── Double down on winners
```

---

## Part 8: Key Insights from Research

### From OpenMAIC

1. **Two-stage generation works**: Outline → Content pipeline produces better lessons than one-shot generation
2. **Multi-agent adds value**: Different AI personas (teacher, classmates) create realistic classroom dynamics
3. **LangGraph is proven**: State machine orchestration handles complex agent interactions well
4. **Voice matters**: TTS/ASR integration is expected for education platforms
5. **Export is essential**: Users want to take content out (PPTX, HTML)

**Application to CraftMind**:
- Courses: Adopt two-stage lesson generation
- All products: Use multi-agent orchestration patterns
- Core: LangGraph for agent state management
- Movie Studio: Export to standard video formats

### From autoresearch

1. **Single-file modification works**: Constraining agent edits to one file reduces complexity
2. **Fixed time budget is powerful**: 5-minute runs make experiments comparable
3. **Metric-driven iteration**: Clear success metric (val_bpb) guides improvement
4. **Autonomous loops scale**: ~100 experiments/night is feasible

**Application to CraftMind**:
- Researcher: Fixed experiment budgets for fair comparison
- Core: Script learning with clear success metrics
- All: Autonomous overnight improvement is viable

### From AutoClaw

1. **Tiered knowledge storage works**: Hot/Warm/Cold tiers balance access speed vs. capacity
2. **Message bus enables modularity**: SQLite pub/sub makes agents plug-and-play
3. **Multi-role agents are effective**: Researcher, Teacher, Critic, Distiller each add value
4. **Hardware adaptation matters**: Auto-detect and scale from Jetson Nano to Cloud
5. **Credit awareness prevents overages**: Cost-conscious design essential for cloud usage

**Application to CraftMind**:
- Core: Adopt tiered memory architecture
- Researcher: Use message bus for agent coordination
- All: Hardware-adaptive configuration
- Movie Studio: Cloud rendering with credit management

---

## Appendix A: Technology Stack Summary

### Core Stack (All Products)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Runtime** | Node.js 22+ (TypeScript) | Mineflayer ecosystem, async I/O |
| **Minecraft** | Mineflayer + PaperMC | Battle-tested, extensible |
| **LLM** | Ollama (local) + Cloud fallback | Edge-first with cloud option |
| **Orchestration** | LangGraph | Multi-agent state machine |
| **Memory** | SQLite + FAISS (vectors) | Embedded, no server needed |
| **Voice** | Whisper + Piper/ElevenLabs | Local STT, flexible TTS |
| **API** | Fastify | Fast, type-safe |

### Product-Specific Stack

| Product | Additional Tech |
|---------|-----------------|
| **Movie Studio** | Replay Mod, FFmpeg, Timeline editor (custom WebGL) |
| **Courses** | WorldEdit for generation, PDF parser (MinerU) |
| **Researcher** | Message bus (SQLite), Experiment runner |

---

## Appendix B: API Surface (Products → Core)

```typescript
// Core Agent API (what all products use)
interface CraftMindAgentAPI {
  // Lifecycle
  spawn(config: AgentConfig): Promise<Agent>;
  terminate(): Promise<void>;
  
  // Control
  setGoal(goal: Goal): void;
  executeAction(action: Action): Promise<ActionResult>;
  
  // Communication
  speak(text: string, options?: SpeakOptions): Promise<void>;
  listen(): Promise<string>; // STT
  
  // Memory
  remember(query: string): Promise<Memory[]>;
  memorize(event: Event): Promise<void>;
  
  // State
  getEmotionalState(): EmotionalState;
  getPersonality(): PersonalityProfile;
  
  // Events
  on(event: AgentEvent, handler: Handler): void;
}

// Product-specific extensions
interface MovieActorAgent extends CraftMindAgentAPI {
  performScene(scene: Scene): Promise<Take>;
  reactToPeer(action: Action): Promise<Action>;
}

interface TeacherAgent extends CraftMindAgentAPI {
  deliverLesson(lesson: Lesson): Promise<void>;
  assessStudent(response: StudentResponse): Promise<Assessment>;
  adaptDifficulty(performance: Performance): DifficultyLevel;
}

interface ResearcherAgent extends CraftMindAgentAPI {
  hypothesize(domain: Domain): Promise<Hypothesis>;
  test(hypothesis: Hypothesis): Promise<Result>;
  distill(discoveries: Discovery[]): Promise<Knowledge>;
}
```

---

## Conclusion

The CraftMind ecosystem is ambitious but achievable with disciplined execution:

1. **Core First**: 6 months dedicated to foundation. No shortcuts.
2. **Sequential Products**: Movie Studio → Courses → Researcher
3. **Shared Investment**: Core improvements benefit all products
4. **Kill Underperformers**: Don't spread resources across failing products
5. **Clear Metrics**: Each product needs measurable success criteria

The key insight from our research: **OpenMAIC proves multi-agent education works, autoresearch proves autonomous improvement works, AutoClaw proves knowledge systems scale.** CraftMind's innovation is bringing these patterns into Minecraft's interactive 3D environment.

If Core is solid, each product can shine. If Core is rushed, all products fail.

---

*Document Version: 1.0*
*Created: 2026-03-25*
*Author: CraftMind Ecosystem Research Subagent*
