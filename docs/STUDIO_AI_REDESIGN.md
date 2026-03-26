# Studio AI Redesign — Architecture Document

> Adapting CraftMind Fishing's breakthrough AI systems for a movie tycoon game.

## Overview

CraftMind Fishing demonstrated that autonomous agents with personality, self-improving scripts, comparative evaluation, and emergent storytelling create deeply engaging gameplay. This document maps those same patterns onto CraftMind Studio's movie tycoon domain.

## A. Studio Action Schema

Actions a movie tycoon can take, modeled after fishing's `ACTION_TYPES`:

| Action | Params | Description |
|--------|--------|-------------|
| DIRECT | scene, style, notes | Direct a scene with stylistic instructions |
| CAST | role, traits, audition | Cast an actor for a role |
| WRITE | genre, premise, elements | Write or revise a script |
| EDIT | scene, cutType, notes | Edit footage (trim, rearrange, splice) |
| PROMOTE | film, channel, budget | Market a film |
| HIRE | role, criteria | Hire crew member |
| FIRE | person, reason | Fire cast/crew |
| REVIEW | take, criteria | Review dailies or takes |
| SET_DESIGN | scene, style, budget | Design/build a set |
| VFX | scene, effect, params | Add visual effects |
| SOUNDTRACK | scene, mood, style | Compose or select music |
| RELEASE | film, venue, date | Premiere or distribute film |

## B. Studio Agents (NPCs)

Seven NPCs with distinct personalities, adapted from Sitka's fishing NPCs:

- **Director Mabel** — opinionated veteran, "Wide shot. Always start with the wide shot."
- **Actor Victor** — method actor, takes roles too seriously, won't break character
- **Writer June** — anxious screenwriter, "It needs one more draft."
- **Cinematographer Kai** — technical genius, speaks in focal lengths, "We need an 85mm."
- **Producer Big Mike** — money-obsessed, "Can we add an explosion?"
- **Intern Zara** — eager learner, asks the player's questions
- **Critic Dorothy** — reviews films brutally at premieres

## C. Emergent Story Patterns

Adapted from fishing's story-generator patterns:
- **Creative Clash** — Mabel and June fight over creative vision
- **Method Meltdown** — Victor refuses a stunt, stays in character off-set
- **Budget Crisis** — Big Mike's cuts spark crew revolt
- **Festival Rivalry** — Competing films at the Sitka Film Festival
- **Tabloid Drama** — Victor falls for co-star, tabloids run wild
- **Accidental Genius** — Zara's suggestion creates a masterpiece
- **Critic Attack** — Dorothy's review tanks morale

## D. Comparative Evaluation

Like fishing's evaluator but for film:
- Which directing style gets best reviews? (handheld vs static, long takes vs montage)
- Which casting choices work best per genre?
- Which script structures get highest ratings?
- Self-improving: AI rewrites directing approach based on box office data

## E. Script Evolution

Self-improving writing/directing scripts:
- "Start with wide shot" → "Start with wide shot BUT skip for intimate scenes"
- Horror scripts evolve better jump scares
- Marketing strategies evolve: "social media blitz" vs "organic word of mouth"

## F. Player Teaches Through Directing

Natural language direction interpreted by Mabel in her style. Over time, Mabel learns the player's preferences — same pattern as Cody learning from the fisher's habits.

## G. Cross-Game Synergy

- Fishing catches record fish → Studio makes documentary
- Studio film about fishing → unlocks secret spot in Fishing
- Researcher analyzes film quality data → writes papers
- Courses teaches film school → players get directing skills
