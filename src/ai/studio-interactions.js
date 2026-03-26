/**
 * @module craftmind-studio/ai/studio-interactions
 * @description Interaction types and resolver for studio NPCs.
 * Adapted from craftmind-fishing's interactions.js — proximity, schedule overlap,
 * creative conflicts, festival competition, on-set drama.
 */

import { STUDIO_NPC_CONFIGS } from './studio-agent-configs.js';

export const STUDIO_INTERACTION_TYPES = {
  CREATIVE_CLASH: { triggers: ['opinion_conflict', 'same_soundstage'], weight: 0.5 },
  METHOD_MELTDOWN: { triggers: ['actor_refuses', 'stunt_scene'], weight: 0.3 },
  BATTLE_OF_EGOS: { triggers: ['director_vs_producer', 'budget_cut'], weight: 0.4 },
  FESTIVAL_RIVALRY: { triggers: ['competing_films', 'awards_season'], weight: 0.3 },
  MENTORSHIP: { triggers: ['intern_asks', 'trust_high'], weight: 0.4 },
  TABLOID_DRAMA: { triggers: ['on_set_romance', 'scandal'], weight: 0.15 },
  ACCIDENTAL_GENIUS: { triggers: ['intern_suggestion', 'creative_block'], weight: 0.2 },
  CRITIC_REVIEW: { triggers: ['premiere', 'critic_present'], weight: 0.5 },
  GOSSIP: { triggers: ['idle', 'nearby_agent'], weight: 0.3 },
  GREETING: { triggers: ['proximity', 'morning'], weight: 0.7 },
};

export class StudioInteractionResolver {
  constructor() {
    this.activeInteractions = [];
    this.interactionHistory = [];
    this.npcStates = new Map();
  }

  /**
   * Initialize NPC states from configs.
   */
  initNPCs() {
    for (const npc of STUDIO_NPC_CONFIGS) {
      this.npcStates.set(npc.id, {
        ...npc,
        mood: { satisfaction: 0.5, frustration: 0, energy: 0.8 },
        currentLocation: npc.location,
        filmsWorkedOn: 0,
        relationships: {},
      });
    }
  }

  /**
   * Move an NPC to a location.
   */
  moveNPC(npcId, location) {
    const npc = this.npcStates.get(npcId);
    if (npc) npc.currentLocation = location;
  }

  /**
   * Get NPCs at a location.
   */
  getNPCsAt(location) {
    return Array.from(this.npcStates.values()).filter(n => n.currentLocation === location);
  }

  /**
   * Resolve all interactions between NPCs at the same location.
   * @returns {object[]} resolved interactions
   */
  resolve() {
    if (this.npcStates.size === 0) this.initNPCs();
    const resolved = [];
    const locations = new Set(Array.from(this.npcStates.values()).map(n => n.currentLocation));

    for (const location of locations) {
      const npcs = this.getNPCsAt(location);
      if (npcs.length < 2) continue;

      for (let i = 0; i < npcs.length; i++) {
        for (let j = i + 1; j < npcs.length; j++) {
          if (this._alreadyInteracting(npcs[i].id, npcs[j].id)) continue;
          const interaction = this._determineInteraction(npcs[i], npcs[j]);
          if (interaction) {
            resolved.push(interaction);
            this.activeInteractions.push({ agentA: npcs[i].id, agentB: npcs[j].id, type: interaction.type, startTime: Date.now() });
            this.interactionHistory.push({ ...interaction, timestamp: Date.now() });
          }
        }
      }
    }

    this.activeInteractions = this.activeInteractions.filter(i => Date.now() - i.startTime < 300000);
    if (this.interactionHistory.length > 500) this.interactionHistory = this.interactionHistory.slice(-500);
    return resolved;
  }

  _alreadyInteracting(a, b) {
    return this.activeInteractions.some(i => (i.agentA === a && i.agentB === b) || (i.agentA === b && i.agentB === a));
  }

  _determineInteraction(a, b) {
    const roles = [a.role, b.role].sort().join('+');
    const relKey = `${a.id}_${b.id}`;

    // Director + Writer = creative clash
    if (roles === 'director+writer' && Math.random() < 0.4) {
      return this._createInteraction('CREATIVE_CLASH', a, b, {
        message: this._pickDialogue(a, b, [
          `${a.name}: "This scene doesn't work on the page OR on camera. Rewrite it."`,
          `${b.name}: "I've rewritten it SEVEN TIMES. The problem is your direction!"`,
          `${a.name}: "Less dialogue. More visual storytelling."`,
          `${b.name}: "I will CUT you, Mabel."`,
        ]),
        relEffect: 'tension',
      });
    }

    // Director + Producer = battle of egos
    if (roles === 'director+producer' && Math.random() < 0.35) {
      return this._createInteraction('BATTLE_OF_EGOS', a, b, {
        message: this._pickDialogue(a, b, [
          `${b.name}: "Can we add an explosion here?"`,
          `${a.name}: "This is a period romance. There are no explosions."`,
          `${b.name}: "What if the romance IS the explosion? Emotionally?"`,
          `${a.name}: "..."`,
        ]),
        relEffect: 'frustration',
      });
    }

    // Intern + anyone = mentorship or accidental genius
    if ((a.id === 'zara' || b.id === 'zara') && Math.random() < 0.5) {
      const intern = a.id === 'zara' ? a : b;
      const mentor = a.id === 'zara' ? b : a;
      if (Math.random() < 0.3) {
        return this._createInteraction('ACCIDENTAL_GENIUS', intern, mentor, {
          message: `${intern.name}: "What if we... just don't cut there?" *everyone goes silent* ${mentor.name}: "...That's actually brilliant."`,
          relEffect: 'inspired',
        });
      }
      return this._createInteraction('MENTORSHIP', mentor, intern, {
        message: `${intern.name}: "So, um, why do we start with a wide shot?" ${mentor.name}: *sighs* "Pull up a chair."`,
        relEffect: 'teaching',
      });
    }

    // Critic + Director = critic review
    if (roles === 'critic+director' && Math.random() < 0.5) {
      return this._createInteraction('CRITIC_REVIEW', b, a, {
        message: this._pickDialogue(a, b, [
          `${a.name}: "The pacing was pedestrian at best."`,
          `${b.name}: "I've won three awards, Dorothy."`,
          `${a.name}: "And you've made five mediocre films. Math doesn't lie."`,
        ]),
        relEffect: 'stung',
      });
    }

    // Actor + Writer = method meltdown
    if (roles === 'actor+writer' && Math.random() < 0.3) {
      return this._createInteraction('METHOD_MELTDOWN', a, b, {
        message: this._pickDialogue(a, b, [
          `${a.name}: "My character wouldn't say this line."`,
          `${b.name}: "Your character is fictional. I MADE HIM UP."`,
          `${a.name}: "He has feelings, June. He has FEELINGS."`,
        ]),
        relEffect: 'tension',
      });
    }

    // Default
    return this._createInteraction('GOSSIP', a, b, {
      message: this._pickDialogue(a, b, [
        `${a.name}: "Did you see the dailies? Rough."`,
        `${b.name}: "Big Mike wants reshoots. Shocking."`,
        `${a.name}: "I heard Victor ate lunch in character again."`,
        `${b.name}: "June is on draft twelve."`,
      ]),
      relEffect: 'chat',
    });
  }

  _createInteraction(type, a, b, extra) {
    return { type, agents: [a.id, b.id], location: a.currentLocation, ...extra };
  }

  _pickDialogue(a, b, options) {
    return options[Math.floor(Math.random() * options.length)];
  }

  getRecentInteractions(sinceMs = 300000) {
    const cutoff = Date.now() - sinceMs;
    return this.interactionHistory.filter(i => i.timestamp > cutoff);
  }

  getInteractionHistory() {
    return [...this.interactionHistory];
  }
}

export default StudioInteractionResolver;
