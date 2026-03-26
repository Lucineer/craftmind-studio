/**
 * @module craftmind-studio/ai/studio-story-generator
 * @description Detects emergent narrative patterns from studio NPC behavior.
 * Adapted from craftmind-fishing's story-generator.js — creative conflicts,
 * festival drama, on-set stories that arise from agent interactions.
 */

export class StudioStoryGenerator {
  constructor() {
    this.activeStories = new Map();
    this.storyCooldowns = new Map();
    this.storyCount = 0;
  }

  /**
   * Detect emergent story patterns from interaction history and NPC states.
   * @param {object[]} interactions - recent interactions from StudioInteractionResolver
   * @param {Map<string, object>} npcStates - NPC states from resolver
   * @param {object} [gameState] - { budget, day, filmInProgress }
   * @returns {object[]} detected stories
   */
  detectStories(interactions, npcStates, gameState = {}) {
    const stories = [];

    const creativeClash = this._detectCreativeClash(interactions, npcStates);
    if (creativeClash) stories.push(creativeClash);

    const budgetCrisis = this._detectBudgetCrisis(npcStates, gameState);
    if (budgetCrisis) stories.push(budgetCrisis);

    const festivalRivalry = this._detectFestivalRivalry(interactions, npcStates);
    if (festivalRivalry) stories.push(festivalRivalry);

    const methodMeltdown = this._detectMethodMeltdown(interactions, npcStates);
    if (methodMeltdown) stories.push(methodMeltdown);

    const tabloidDrama = this._detectTabloidDrama(interactions, npcStates);
    if (tabloidDrama) stories.push(tabloidDrama);

    const accidentalGenius = this._detectAccidentalGenius(interactions, npcStates);
    if (accidentalGenius) stories.push(accidentalGenius);

    const criticAttack = this._detectCriticAttack(interactions, npcStates);
    if (criticAttack) stories.push(criticAttack);

    const crewRevolt = this._detectCrewRevolt(interactions, npcStates, gameState);
    if (crewRevolt) stories.push(crewRevolt);

    return stories;
  }

  _detectCreativeClash(interactions, npcStates) {
    if (this._onCooldown('creative_clash')) return null;
    const clashes = interactions.filter(i => i.type === 'CREATIVE_CLASH');
    if (clashes.length < 2) return null;

    this._setCooldown('creative_clash', 300000);
    return {
      type: 'creative_clash',
      id: `clash_${this.storyCount++}`,
      title: 'Creative Clash on Set',
      description: `Director and writer have clashed ${clashes.length} times today. The crew is taking sides.`,
      agents: clashes[0].agents,
      outcome: 'tension_rising',
      dialogue: 'June threw her script at the wall. Mabel didn\'t flinch. The crew watched in silence.',
    };
  }

  _detectBudgetCrisis(npcStates, gameState) {
    if (this._onCooldown('budget_crisis')) return null;
    const budget = gameState.budget ?? 1000000;
    const spent = gameState.spent ?? 0;
    const overBudget = spent > budget * 0.9;

    if (!overBudget) return null;
    const mike = npcStates.get('mike');
    if (!mike) return null;

    this._setCooldown('budget_crisis', 600000);
    return {
      type: 'budget_crisis',
      id: `budget_${this.storyCount++}`,
      title: 'Budget Crisis!',
      description: `Production is ${Math.round((spent / budget) * 100)}% of budget with filming incomplete. Big Mike is panicking.`,
      agents: ['mike'],
      outcome: 'crisis',
      dialogue: `Big Mike: "We're ${Math.round(spent - budget)} over! I want CUTS. Every department. NOW."`,
      effect: { budgetPressure: true },
    };
  }

  _detectFestivalRivalry(interactions, npcStates) {
    if (this._onCooldown('festival_rivalry')) return null;
    const rivalries = interactions.filter(i => i.type === 'FESTIVAL_RIVALRY' || i.type === 'BATTLE_OF_EGOS');
    if (rivalries.length < 1) return null;

    this._setCooldown('festival_rivalry', 600000);
    return {
      type: 'festival_rivalry',
      id: `festival_${this.storyCount++}`,
      title: 'Festival Showdown',
      description: 'Tensions are high as competing films prepare for the Sitka Film Festival.',
      agents: rivalries[0].agents,
      outcome: 'competitive',
      dialogue: 'The Sitka Film Festival lineup was announced. Two studio films made the cut. Only one can win.',
    };
  }

  _detectMethodMeltdown(interactions, npcStates) {
    if (this._onCooldown('method_meltdown')) return null;
    const meltdowns = interactions.filter(i => i.type === 'METHOD_MELTDOWN');
    if (meltdowns.length < 1) return null;

    this._setCooldown('method_meltdown', 300000);
    return {
      type: 'method_meltdown',
      id: `method_${this.storyCount++}`,
      title: 'Method Actor Meltdown',
      description: 'Victor is refusing to break character and it\'s holding up production.',
      agents: ['victor'],
      outcome: 'chaos',
      dialogue: 'Victor has been in character for three days. He ordered craft services to call him "Captain Blackbeard." They complied.',
    };
  }

  _detectTabloidDrama(interactions, npcStates) {
    if (this._onCooldown('tabloid_drama')) return null;
    if (Math.random() > 0.1) return null; // rare

    this._setCooldown('tabloid_drama', 600000);
    return {
      type: 'tabloid_drama',
      id: `tabloid_${this.storyCount++}`,
      title: 'Tabloid Scandal!',
      description: 'A tabloid has published a sensational story about the production.',
      agents: [],
      outcome: 'scandal',
      dialogue: 'HEADLINE: "ON-SET ROMANCE? Star caught whispering to co-star between takes! Source: probably Zara."',
    };
  }

  _detectAccidentalGenius(interactions, npcStates) {
    if (this._onCooldown('accidental_genius')) return null;
    const accidents = interactions.filter(i => i.type === 'ACCIDENTAL_GENIUS');
    if (accidents.length < 1) return null;

    this._setCooldown('accidental_genius', 600000);
    return {
      type: 'accidental_genius',
      id: `genius_${this.storyCount++}`,
      title: 'Zara\'s Moment',
      description: 'The intern\'s offhand suggestion saved a scene that everyone had given up on.',
      agents: ['zara'],
      outcome: 'triumph',
      dialogue: 'Zara said "what if we don\'t cut there?" Three hours later, they\'d shot the best scene of the film.',
    };
  }

  _detectCriticAttack(interactions, npcStates) {
    if (this._onCooldown('critic_attack')) return null;
    const attacks = interactions.filter(i => i.type === 'CRITIC_REVIEW');
    if (attacks.length < 2) return null;

    this._setCooldown('critic_attack', 300000);
    const score = 1.5 + Math.random() * 2.5; // out of 5
    return {
      type: 'critic_attack',
      id: `critic_${this.storyCount++}`,
      title: `Dorothy's Review: ${score.toFixed(1)}/5`,
      description: `Critic Dorothy has published her review. "${score < 2.5 ? 'Scathing.' : 'Not entirely terrible.'}"`,
      agents: ['dorothy'],
      outcome: score >= 3 ? 'survived' : 'devastating',
      dialogue: score >= 3
        ? `Dorothy: "I didn't hate it. That's the nicest thing I've said all year."`
        : `Dorothy: "I've seen better performances at a middle school play. And I've been to middle school plays."`,
    };
  }

  _detectCrewRevolt(interactions, npcStates, gameState) {
    if (this._onCooldown('crew_revolt')) return null;
    const tensions = interactions.filter(i => ['CREATIVE_CLASH', 'BATTLE_OF_EGOS', 'METHOD_MELTDOWN'].includes(i.type));
    if (tensions.length < 4) return null;

    this._setCooldown('crew_revolt', 600000);
    return {
      type: 'crew_revolt',
      id: `revolt_${this.storyCount++}`,
      title: 'Crew on the Brink',
      description: `After ${tensions.length} on-set conflicts today, the crew is threatening to walk.`,
      agents: ['mabel', 'mike', 'victor'],
      outcome: 'breaking_point',
      dialogue: 'The crew chief handed Mabel an ultimatum: "Fix this or we\'re gone by noon." Big Mike is calculating severance costs.',
    };
  }

  _onCooldown(type) {
    const last = this.storyCooldowns.get(type) || 0;
    return Date.now() - last < 120000;
  }

  _setCooldown(type, ms) {
    this.storyCooldowns.set(type, Date.now() + (ms - 120000));
  }
}

export default StudioStoryGenerator;
