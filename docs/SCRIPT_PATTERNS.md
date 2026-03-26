# Cross-Game Script Patterns: Fishing ↔ Studio

How movie-making actions map to fishing in the CraftMind ecosystem.

## Core Loop Mapping

| Fishing (craftmind-fishing) | Studio (craftmind-studio) | Semantic Role |
|---|---|---|
| Cast line | Pitch movie | **Start attempt** — initiate a cycle of effort |
| Wait for bite | Film scene / Direct scene | **Sustained action** — the work happens here |
| Check catch | Review footage | **Evaluate result** — assess quality of output |
| Celebrate catch | Throw party / Celebrate | **React to success** — positive feedback loop |
| Complain about weather | Complain about budget | **React to adversity** — external factors beyond control |
| Equip rod | Hire actor | **Prepare resources** — set up for the action |
| Take break | Between projects | **Recovery** — energy/mood restoration |

## Mood System Mapping

| Fishing Mood | Studio Mood | Trigger |
|---|---|---|
| Elated (good catch) | Inspired (great art) | Positive outcome from core action |
| Frustrated (no bites) | Stressed (over budget) | Sustained negative conditions |
| Idle (no players) | Bored (between projects) | Low stimulation |
| Proud (rare fish) | Vindicated (good reviews) | External validation |

## Personality Transfer Patterns

Social scripts transfer **identically** across all games — chatting, greeting, reacting to others. The personality's *flavor* stays the same, only the *domain vocabulary* changes:

- **Fishing social** → "Nice weather for fishing!" → **Studio social** → "Great day on set!"
- **Fishing complaint** → "Fish aren't biting" → **Studio complaint** → "This scene isn't working"
- **Fishing celebration** → "Biggest catch yet!" → **Studio celebration** → "Best take of the shoot!"

## Architecture Notes

- `weightedRandom()` — shared utility, game-agnostic
- `Step.chat()` — identical in both engines
- `Step.branch()` / `Step.wait()` / `Step.noop()` — identical
- Game-specific steps (fish/pitch, review/review) follow the same pattern
- Mood system is structurally identical; only labels and triggers differ
- ScriptRunner auto-picks next action based on context — same pattern, different state
