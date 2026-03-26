/**
 * Tests for CraftMind Studio AI modules.
 * Target: 60+ tests.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { STUDIO_ACTION_TYPES, validateStudioAction, validateStudioPlan } from '../src/ai/studio-action-schema.js';
import { STUDIO_NPC_CONFIGS, STUDIO_TRAITS, getNPCConfig, getNPCsByRole } from '../src/ai/studio-agent-configs.js';
import { StudioInteractionResolver } from '../src/ai/studio-interactions.js';
import { StudioStoryGenerator } from '../src/ai/studio-story-generator.js';
import { DirectingEvaluator } from '../src/ai/directing-evaluator.js';
import { ScriptEvolverStudio } from '../src/ai/script-evolver-studio.js';

// ── Studio Action Schema ─────────────────────────────────────────────────────

describe('studio-action-schema', () => {
  it('has all 12 action types', () => {
    const types = Object.keys(STUDIO_ACTION_TYPES);
    assert.equal(types.length, 12);
    assert.ok(types.includes('DIRECT'));
    assert.ok(types.includes('CAST'));
    assert.ok(types.includes('WRITE'));
    assert.ok(types.includes('EDIT'));
    assert.ok(types.includes('PROMOTE'));
    assert.ok(types.includes('HIRE'));
    assert.ok(types.includes('FIRE'));
    assert.ok(types.includes('REVIEW'));
    assert.ok(types.includes('SET_DESIGN'));
    assert.ok(types.includes('VFX'));
    assert.ok(types.includes('SOUNDTRACK'));
    assert.ok(types.includes('RELEASE'));
  });

  it('DIRECT has required params', () => {
    const d = STUDIO_ACTION_TYPES.DIRECT;
    assert.ok(d.params.includes('scene'));
    assert.ok(d.params.includes('style'));
    assert.ok(d.styles.includes('handheld'));
    assert.ok(d.styles.includes('dolly'));
  });

  it('validates a correct action', () => {
    const result = validateStudioAction({ type: 'DIRECT', params: { scene: 'scene_1', style: 'handheld' } });
    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it('rejects missing action type', () => {
    const result = validateStudioAction({});
    assert.equal(result.valid, false);
    assert.ok(result.errors[0].includes('Missing'));
  });

  it('rejects unknown action type', () => {
    const result = validateStudioAction({ type: 'DANCE' });
    assert.equal(result.valid, false);
    assert.ok(result.errors[0].includes('Unknown'));
  });

  it('rejects missing required params', () => {
    const result = validateStudioAction({ type: 'WRITE', params: { premise: 'a story' } });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('genre')));
  });

  it('accepts action with optional params omitted', () => {
    const result = validateStudioAction({ type: 'PROMOTE', params: { film: 'my_movie' } });
    assert.equal(result.valid, true);
  });

  it('validates a plan with multiple actions', () => {
    const plan = {
      actions: [
        { type: 'WRITE', params: { genre: 'horror', premise: 'a haunted boat' } },
        { type: 'CAST', params: { role: 'lead' } },
        { type: 'DIRECT', params: { scene: 'scene_1', style: 'static' } },
      ],
    };
    const result = validateStudioPlan(plan);
    assert.equal(result.valid, true);
  });

  it('rejects plan without actions array', () => {
    const result = validateStudioPlan({});
    assert.equal(result.valid, false);
  });

  it('rejects plan with invalid action in sequence', () => {
    const plan = {
      actions: [
        { type: 'DIRECT', params: { scene: 's1', style: 'dolly' } },
        { type: 'INVALID', params: {} },
      ],
    };
    const result = validateStudioPlan(plan);
    assert.equal(result.valid, false);
  });

  it('null action is invalid', () => {
    const result = validateStudioAction(null);
    assert.equal(result.valid, false);
  });
});

// ── Studio Agent Configs ─────────────────────────────────────────────────────

describe('studio-agent-configs', () => {
  it('has 7 NPC configs', () => {
    assert.equal(STUDIO_NPC_CONFIGS.length, 7);
  });

  it('has all required NPCs', () => {
    const ids = STUDIO_NPC_CONFIGS.map(n => n.id);
    assert.ok(ids.includes('mabel'));
    assert.ok(ids.includes('victor'));
    assert.ok(ids.includes('june'));
    assert.ok(ids.includes('kai'));
    assert.ok(ids.includes('mike'));
    assert.ok(ids.includes('zara'));
    assert.ok(ids.includes('dorothy'));
  });

  it('getNPCConfig returns correct NPC', () => {
    const mabel = getNPCConfig('mabel');
    assert.equal(mabel.name, 'Director Mabel');
    assert.equal(mabel.role, 'director');
  });

  it('getNPCConfig returns undefined for unknown', () => {
    assert.equal(getNPCConfig('nonexistent'), undefined);
  });

  it('getNPCsByRole filters correctly', () => {
    const directors = getNPCsByRole('director');
    assert.equal(directors.length, 1);
    assert.equal(directors[0].id, 'mabel');
  });

  it('each NPC has a schedule', () => {
    for (const npc of STUDIO_NPC_CONFIGS) {
      assert.ok(npc.schedule);
      assert.ok(npc.schedule.morning);
      assert.ok(npc.schedule.afternoon);
      assert.ok(npc.schedule.evening);
    }
  });

  it('each NPC has greetings', () => {
    for (const npc of STUDIO_NPC_CONFIGS) {
      assert.ok(Array.isArray(npc.greeting));
      assert.ok(npc.greeting.length > 0);
    }
  });

  it('each NPC has dialogue pools', () => {
    for (const npc of STUDIO_NPC_CONFIGS) {
      assert.ok(npc.dialogue);
      assert.ok(Object.keys(npc.dialogue).length > 0);
    }
  });

  it('Mabel has strong leadership trait', () => {
    assert.ok(STUDIO_TRAITS.mabel.leadership > 0.8);
    assert.ok(STUDIO_TRAITS.mabel.stubbornness > 0.7);
  });

  it('Victor has method acting trait', () => {
    assert.ok(STUDIO_TRAITS.victor.method_acting > 0.9);
  });

  it('June has high anxiety and perfectionism', () => {
    assert.ok(STUDIO_TRAITS.june.anxiety > 0.8);
    assert.ok(STUDIO_TRAITS.june.perfectionism > 0.9);
  });

  it('Big Mike has high greed', () => {
    assert.ok(STUDIO_TRAITS.mike.greed > 0.8);
    assert.ok(STUDIO_TRAITS.mike.creativity < 0.3);
  });

  it('Zara has high curiosity', () => {
    assert.ok(STUDIO_TRAITS.zara.curiosity > 0.9);
    assert.ok(STUDIO_TRAITS.zara.eagerness > 0.9);
  });

  it('Dorothy has high critical eye', () => {
    assert.ok(STUDIO_TRAITS.dorothy.critical_eye > 0.9);
  });
});

// ── Studio Interactions ──────────────────────────────────────────────────────

describe('studio-interactions', () => {
  it('initializes NPC states', () => {
    const resolver = new StudioInteractionResolver();
    resolver.initNPCs();
    assert.equal(resolver.npcStates.size, 7);
  });

  it('getNPCsAt returns NPCs at a location', () => {
    const resolver = new StudioInteractionResolver();
    resolver.initNPCs();
    const atStage = resolver.getNPCsAt('soundstage_a');
    assert.ok(atStage.length >= 1); // Mabel is there
  });

  it('moveNPC changes location', () => {
    const resolver = new StudioInteractionResolver();
    resolver.initNPCs();
    resolver.moveNPC('zara', 'soundstage_a');
    assert.equal(resolver.npcStates.get('zara').currentLocation, 'soundstage_a');
  });

  it('resolve generates interactions when NPCs co-located', () => {
    const resolver = new StudioInteractionResolver();
    resolver.initNPCs();
    resolver.moveNPC('victor', 'soundstage_a');
    resolver.moveNPC('june', 'soundstage_a');
    const interactions = resolver.resolve();
    assert.ok(interactions.length >= 1);
  });

  it('resolve returns empty when NPCs are spread out', () => {
    const resolver = new StudioInteractionResolver();
    resolver.initNPCs();
    // Everyone at different locations
    resolver.moveNPC('mabel', 'soundstage_a');
    resolver.moveNPC('victor', 'trailer_1');
    resolver.moveNPC('june', 'writers_room');
    resolver.moveNPC('kai', 'equipment_room');
    resolver.moveNPC('mike', 'production_office');
    resolver.moveNPC('zara', 'craft_services');
    resolver.moveNPC('dorothy', 'press_room');
    const interactions = resolver.resolve();
    assert.equal(interactions.length, 0);
  });

  it('interaction has required fields', () => {
    const resolver = new StudioInteractionResolver();
    resolver.initNPCs();
    resolver.moveNPC('victor', 'soundstage_a');
    const interactions = resolver.resolve();
    const i = interactions[0];
    assert.ok(i.type);
    assert.ok(i.agents);
    assert.ok(i.message);
  });

  it('getRecentInteractions filters by time', () => {
    const resolver = new StudioInteractionResolver();
    const recent = resolver.getRecentInteractions(1000);
    assert.ok(Array.isArray(recent));
  });

  it('getInteractionHistory returns array', () => {
    const resolver = new StudioInteractionResolver();
    const history = resolver.getInteractionHistory();
    assert.ok(Array.isArray(history));
  });

  it('director-writer clash is possible', () => {
    const resolver = new StudioInteractionResolver();
    resolver.initNPCs();
    let foundClash = false;
    for (let i = 0; i < 100; i++) {
      resolver.activeInteractions = [];
      resolver.moveNPC('mabel', 'soundstage_a');
      resolver.moveNPC('june', 'soundstage_a');
      const interactions = resolver.resolve();
      if (interactions.some(ix => ix.type === 'CREATIVE_CLASH')) { foundClash = true; break; }
    }
    assert.ok(foundClash, 'Should eventually generate a creative clash');
  });
});

// ── Studio Story Generator ───────────────────────────────────────────────────

describe('studio-story-generator', () => {
  it('detects no stories from empty interactions', () => {
    const gen = new StudioStoryGenerator();
    const stories = gen.detectStories([], new Map());
    assert.equal(stories.length, 0);
  });

  it('detects creative clash from multiple clash interactions', () => {
    const gen = new StudioStoryGenerator();
    const interactions = [
      { type: 'CREATIVE_CLASH', agents: ['mabel', 'june'], timestamp: Date.now() },
      { type: 'CREATIVE_CLASH', agents: ['mabel', 'june'], timestamp: Date.now() },
    ];
    const npcStates = new Map([
      ['mabel', { id: 'mabel', name: 'Mabel', role: 'director' }],
      ['june', { id: 'june', name: 'June', role: 'writer' }],
    ]);
    const stories = gen.detectStories(interactions, npcStates);
    assert.ok(stories.some(s => s.type === 'creative_clash'));
  });

  it('detects budget crisis when over budget', () => {
    const gen = new StudioStoryGenerator();
    const npcStates = new Map([
      ['mike', { id: 'mike', name: 'Big Mike', role: 'producer' }],
    ]);
    const stories = gen.detectStories([], npcStates, { budget: 100000, spent: 95000 });
    assert.ok(stories.some(s => s.type === 'budget_crisis'));
  });

  it('no budget crisis when under budget', () => {
    const gen = new StudioStoryGenerator();
    const stories = gen.detectStories([], new Map(), { budget: 100000, spent: 50000 });
    assert.ok(!stories.some(s => s.type === 'budget_crisis'));
  });

  it('detects critic attack from multiple reviews', () => {
    const gen = new StudioStoryGenerator();
    const interactions = [
      { type: 'CRITIC_REVIEW', agents: ['dorothy'], timestamp: Date.now() },
      { type: 'CRITIC_REVIEW', agents: ['dorothy'], timestamp: Date.now() },
    ];
    const npcStates = new Map([
      ['dorothy', { id: 'dorothy', name: 'Dorothy', role: 'critic' }],
    ]);
    const stories = gen.detectStories(interactions, npcStates);
    assert.ok(stories.some(s => s.type === 'critic_attack'));
  });

  it('detects method meltdown', () => {
    const gen = new StudioStoryGenerator();
    const interactions = [
      { type: 'METHOD_MELTDOWN', agents: ['victor'], timestamp: Date.now() },
    ];
    const npcStates = new Map([
      ['victor', { id: 'victor', name: 'Victor', role: 'actor' }],
    ]);
    const stories = gen.detectStories(interactions, npcStates);
    assert.ok(stories.some(s => s.type === 'method_meltdown'));
  });

  it('detects accidental genius', () => {
    const gen = new StudioStoryGenerator();
    const interactions = [
      { type: 'ACCIDENTAL_GENIUS', agents: ['zara'], timestamp: Date.now() },
    ];
    const npcStates = new Map([
      ['zara', { id: 'zara', name: 'Zara', role: 'intern' }],
    ]);
    const stories = gen.detectStories(interactions, npcStates);
    assert.ok(stories.some(s => s.type === 'accidental_genius'));
  });

  it('detects crew revolt from many conflicts', () => {
    const gen = new StudioStoryGenerator();
    const interactions = [
      { type: 'CREATIVE_CLASH', timestamp: Date.now() },
      { type: 'BATTLE_OF_EGOS', timestamp: Date.now() },
      { type: 'METHOD_MELTDOWN', timestamp: Date.now() },
      { type: 'CREATIVE_CLASH', timestamp: Date.now() },
    ];
    const npcStates = new Map();
    const stories = gen.detectStories(interactions, npcStates);
    assert.ok(stories.some(s => s.type === 'crew_revolt'));
  });

  it('story has required fields', () => {
    const gen = new StudioStoryGenerator();
    const interactions = [
      { type: 'CREATIVE_CLASH', agents: ['a', 'b'], timestamp: Date.now() },
      { type: 'CREATIVE_CLASH', agents: ['a', 'b'], timestamp: Date.now() },
    ];
    const stories = gen.detectStories(interactions, new Map());
    const s = stories[0];
    assert.ok(s.type);
    assert.ok(s.id);
    assert.ok(s.title);
    assert.ok(s.description);
  });

  it('respects cooldown between same story types', () => {
    const gen = new StudioStoryGenerator();
    const interactions = [
      { type: 'CREATIVE_CLASH', agents: ['a', 'b'], timestamp: Date.now() },
      { type: 'CREATIVE_CLASH', agents: ['a', 'b'], timestamp: Date.now() },
    ];
    gen.detectStories(interactions, new Map());
    const stories2 = gen.detectStories(interactions, new Map());
    assert.ok(!stories2.some(s => s.type === 'creative_clash'));
  });
});

// ── Directing Evaluator ─────────────────────────────────────────────────────

describe('directing-evaluator', () => {
  it('scores a perfect session near 1.0', () => {
    const ev = new DirectingEvaluator();
    const score = ev.scoreSession({
      results: { reviewScore: 10, boxOffice: 10000000, audienceScore: 100, awards: 3 },
    });
    assert.ok(score > 0.9);
  });

  it('scores a terrible session near 0.0', () => {
    const ev = new DirectingEvaluator();
    const score = ev.scoreSession({
      results: { reviewScore: 1, boxOffice: 0, audienceScore: 10, awards: 0 },
    });
    assert.ok(score < 0.2);
  });

  it('records and scores sessions', () => {
    const ev = new DirectingEvaluator();
    ev.recordSession({
      film: 'test',
      directingDecisions: { genre: 'drama', style: 'static' },
      results: { reviewScore: 7, boxOffice: 5000000, audienceScore: 80, awards: 1 },
    });
    assert.equal(ev.sessions.length, 1);
    assert.ok(ev.sessions[0].sessionScore > 0.5);
  });

  it('finds similar sessions by genre', () => {
    const ev = new DirectingEvaluator();
    ev.recordSession({
      film: 'a', directingDecisions: { genre: 'horror', style: 'handheld' },
      results: { reviewScore: 6, boxOffice: 2000000, audienceScore: 70, awards: 0 },
    });
    ev.recordSession({
      film: 'b', directingDecisions: { genre: 'comedy', style: 'static' },
      results: { reviewScore: 8, boxOffice: 8000000, audienceScore: 90, awards: 2 },
    });
    const similar = ev.findSimilarSessions({ genre: 'horror' });
    assert.equal(similar.length, 1);
    assert.equal(similar[0].film, 'a');
  });

  it('evaluate returns session score and rank', () => {
    const ev = new DirectingEvaluator();
    for (let i = 0; i < 5; i++) {
      ev.recordSession({
        film: `film_${i}`,
        directingDecisions: { genre: 'drama', style: i % 2 === 0 ? 'static' : 'handheld' },
        results: { reviewScore: 3 + i, boxOffice: i * 2000000, audienceScore: 40 + i * 10, awards: 0 },
      });
    }
    const result = ev.evaluate(ev.sessions[4]);
    assert.ok(result.sessionScore > 0);
    assert.ok(typeof result.rank === 'number');
    assert.ok(result.approachRanking);
  });

  it('evaluate generates insights with enough data', () => {
    const ev = new DirectingEvaluator();
    for (let i = 0; i < 10; i++) {
      ev.recordSession({
        film: `film_${i}`,
        directingDecisions: { genre: 'drama', style: i % 2 === 0 ? 'static' : 'handheld' },
        results: { reviewScore: 3 + i, boxOffice: i * 2000000, audienceScore: 40 + i * 10, awards: 0 },
      });
    }
    const result = ev.evaluate(ev.sessions[9]);
    assert.ok(result.insights.length > 0);
  });

  it('getBestApproach returns best style for conditions', () => {
    const ev = new DirectingEvaluator();
    // Static style consistently better
    for (let i = 0; i < 8; i++) {
      ev.recordSession({
        film: `f${i}`,
        directingDecisions: { genre: 'drama', style: i % 2 === 0 ? 'static' : 'handheld' },
        results: { reviewScore: i % 2 === 0 ? 8 : 4, boxOffice: i % 2 === 0 ? 8000000 : 2000000, audienceScore: i % 2 === 0 ? 90 : 50, awards: i % 2 === 0 ? 2 : 0 },
      });
    }
    const best = ev.getBestApproach({ genre: 'drama' });
    assert.equal(best, 'static');
  });

  it('getBestApproach returns null with insufficient data', () => {
    const ev = new DirectingEvaluator();
    assert.equal(ev.getBestApproach({ genre: 'horror' }), null);
  });
});

// ── Script Evolver Studio ───────────────────────────────────────────────────

describe('script-evolver-studio', () => {
  it('registers and retrieves a script', () => {
    const evolver = new ScriptEvolverStudio();
    const code = '// Start with wide shot\nfunction direct(scene) { return "wide"; }';
    evolver.registerScript('directing-basic', code);
    assert.equal(evolver.getLatest('directing-basic'), code);
  });

  it('registers with version tracking', () => {
    const evolver = new ScriptEvolverStudio();
    evolver.registerScript('test', 'code v0');
    evolver.registerScript('test', 'code v1');
    const history = evolver.getHistory('test');
    assert.equal(history.length, 2);
    assert.equal(history[0].version, 'v0');
    assert.equal(history[1].version, 'v1');
  });

  it('evolves a script with low score', () => {
    const evolver = new ScriptEvolverStudio();
    evolver.registerScript('test-script', 'function direct(scene) { return "wide_shot"; }');
    const result = evolver.evolve('test-script', {
      sessionScore: 0.2,
      bestApproach: 'handheld',
      insights: ['handheld works better for horror'],
    });
    assert.equal(result.evolved, true);
    assert.ok(result.versionId);
    assert.ok(result.details);
  });

  it('does not evolve when score is acceptable and no insights', () => {
    const evolver = new ScriptEvolverStudio();
    evolver.registerScript('good-script', 'function direct() { return "perfect"; } // PREFERRED: static');
    const result = evolver.evolve('good-script', { sessionScore: 0.8, bestApproach: 'static', insights: [] });
    assert.equal(result.evolved, false);
  });

  it('returns error for unknown script', () => {
    const evolver = new ScriptEvolverStudio();
    const result = evolver.evolve('nonexistent', {});
    assert.equal(result.evolved, false);
    assert.ok(result.details.includes('No script'));
  });

  it('getHistory returns empty for unknown', () => {
    const evolver = new ScriptEvolverStudio();
    assert.equal(evolver.getHistory('unknown').length, 0);
  });

  it('getLatest returns null for unknown', () => {
    const evolver = new ScriptEvolverStudio();
    assert.equal(evolver.getLatest('unknown'), null);
  });

  it('validate rejects short code', () => {
    const evolver = new ScriptEvolverStudio();
    const result = evolver.validate('hi');
    assert.equal(result.valid, false);
  });

  it('validate accepts reasonable code', () => {
    const evolver = new ScriptEvolverStudio();
    const result = evolver.validate('function direct(scene) { return "wide_shot"; }');
    assert.equal(result.valid, true);
  });

  it('evolution adds data-driven insights to code', () => {
    const evolver = new ScriptEvolverStudio();
    const code = 'function direct() { return "static"; }';
    evolver.registerScript('evolving', code);
    evolver.evolve('evolving', {
      sessionScore: 0.3,
      bestApproach: 'handheld',
      insights: ['horror benefits from handheld', 'jump scares need close-ups'],
    });
    const latest = evolver.getLatest('evolving');
    assert.ok(latest.includes('DATA INSIGHT'));
    assert.ok(latest.includes('handheld'));
  });

  it('tracks improvement in changelog', () => {
    const evolver = new ScriptEvolverStudio();
    evolver.registerScript('track', 'function d() {}');
    evolver.evolve('track', { sessionScore: 0.2, bestApproach: 'dolly', insights: ['dolly is great'] });
    const history = evolver.getHistory('track');
    assert.ok(history.length >= 2);
    assert.ok(history[1].changelog);
  });
});
