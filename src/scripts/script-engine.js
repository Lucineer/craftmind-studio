/**
 * Stochastic Script Engine for CraftMind Studio
 *
 * Adapted from the fishing script engine but for movie-making directors.
 * Instead of casting lines, directors pitch movies, direct scenes, and review footage.
 *
 * Actions: pitch_movie, direct_scene, review_footage, hire_actor, fire_actor,
 *          throw_party, read_reviews, complain, celebrate
 * Context: budget, reputation, project stage, actor morale
 * Mood: inspired, stressed, bored, vindicated
 */

export function weightedRandom(weights) {
  const entries = weights instanceof Map ? [...weights.entries()] : Object.entries(weights);
  const total = entries.reduce((s, [w]) => s + parseFloat(w), 0);
  if (total <= 0) return entries[0]?.[1] ?? null;
  let roll = Math.random() * total;
  for (const [w, outcome] of entries) {
    roll -= parseFloat(w);
    if (roll <= 0) return outcome;
  }
  return entries[entries.length - 1][1];
}

export class Step {
  static action(name, fn) {
    return { type: 'action', name, fn };
  }

  static chat(msgs) {
    return {
      type: 'chat',
      pick: () => {
        if (typeof msgs === 'string') return msgs;
        if (Array.isArray(msgs)) return msgs[Math.floor(Math.random() * msgs.length)];
        return weightedRandom(msgs);
      },
    };
  }

  static wait(ms) {
    return { type: 'wait', ms };
  }

  static branch(condition, ifTrue, ifFalse) {
    return { type: 'branch', condition, ifTrue, ifFalse };
  }

  static goto(scriptName) {
    return { type: 'goto', scriptName };
  }

  static noop() {
    return { type: 'noop' };
  }

  static set(key, value) {
    return { type: 'set', key, value };
  }

  // Movie-specific step types

  static pitchMovie() {
    return { type: 'pitch_movie' };
  }

  static directScene() {
    return { type: 'direct_scene' };
  }

  static reviewFootage() {
    return { type: 'review_footage' };
  }

  static hireActor() {
    return { type: 'hire_actor' };
  }

  static fireActor() {
    return { type: 'fire_actor' };
  }

  static throwParty() {
    return { type: 'throw_party' };
  }

  static readReviews() {
    return { type: 'read_reviews' };
  }

  static complain() {
    return { type: 'complain' };
  }

  static celebrate() {
    return { type: 'celebrate' };
  }
}

export const MOODS = {
  INSPIRED: 'inspired',
  STRESSED: 'stressed',
  BORED: 'bored',
  VINDICATED: 'vindicated',
  NEUTRAL: 'neutral',
};

export const STAGES = {
  PRE_PRODUCTION: 'pre_production',
  FILMING: 'filming',
  POST_PRODUCTION: 'post_production',
  RELEASE: 'release',
  BETWEEN_PROJECTS: 'between_projects',
};

export class StudioMoodSystem {
  constructor() {
    this.mood = MOODS.NEUTRAL;
    this.satisfaction = 0.5; // 0=miserable, 0.5=neutral, 1=elated
    this.energy = 1.0;
    this._moodTimer = null;
  }

  /**
   * Set mood directly. Use MOODS constants.
   */
  setMood(newMood) {
    this.mood = newMood;
  }

  /**
   * Shift satisfaction by amount. Clamped to 0-1.
   */
  shift(amount) {
    this.satisfaction = Math.max(0, Math.min(1, this.satisfaction + amount));
  }

  /**
   * Determine mood from context and events.
   * @param {object} ctx - { budget, reputation, stage, actorMorale, lastReviewsGood }
   */
  updateFromContext(ctx) {
    const { budget = 0.5, reputation = 0.5, stage, actorMorale = 0.5, lastReviewsGood } = ctx;

    if (lastReviewsGood === true) {
      this.mood = MOODS.VINDICATED;
      this.shift(0.1);
    } else if (lastReviewsGood === false) {
      this.mood = MOODS.STRESSED;
      this.shift(-0.1);
    } else if (stage === STAGES.BETWEEN_PROJECTS) {
      this.mood = MOODS.BORED;
    } else if (budget < 0.3) {
      this.mood = MOODS.STRESSED;
    } else if (reputation > 0.7 && actorMorale > 0.7) {
      this.mood = MOODS.INSPIRED;
    } else if (this.satisfaction > 0.6) {
      this.mood = MOODS.INSPIRED;
    } else {
      this.mood = MOODS.NEUTRAL;
    }
  }

  /** How chatty should the director be? 0-1 */
  get chattiness() {
    const base = { inspired: 0.8, stressed: 0.6, bored: 0.4, vindicated: 0.7, neutral: 0.5 };
    return Math.max(0.1, Math.min(0.9, (base[this.mood] || 0.5) * (0.5 + this.satisfaction * 0.5)));
  }

  /** Action speed multiplier */
  get speedMultiplier() {
    return 0.6 + this.energy * 0.8;
  }

  /** Natural drift toward neutral */
  tick() {
    this.satisfaction += (0.5 - this.satisfaction) * 0.01;
    this.energy = Math.max(0.1, this.energy - 0.0005);
  }
}

export class Script {
  constructor(name, steps) {
    this.name = name;
    this.steps = steps;
  }

  static define(name, steps) {
    return new Script(name, steps);
  }
}

export class DirectorScriptRunner {
  constructor(options = {}) {
    this.scripts = new Map();
    this.mood = options.mood || new StudioMoodSystem();
    this.context = {
      budget: 1.0,
      reputation: 0.5,
      stage: STAGES.BETWEEN_PROJECTS,
      actorMorale: 0.7,
      moviesCompleted: 0,
      lastReviewsGood: null,
      currentScript: null,
      interrupted: false,
    };
    this._running = false;
    this._currentScript = null;
    this._tickInterval = null;
    this._chatLog = [];

    // Hooks that personality scripts can override
    this.hooks = {
      onChat: (msg) => this._chatLog.push({ time: Date.now(), msg }),
      onPitch: () => {},
      onDirect: () => {},
      onReview: () => {},
      onHire: () => {},
      onFire: () => {},
      onParty: () => {},
      onReviews: () => {},
      onComplain: () => {},
      onCelebrate: () => {},
    };
  }

  register(script) {
    this.scripts.set(script.name, script);
    return this;
  }

  async run(scriptNameOrScript) {
    const script = typeof scriptNameOrScript === 'string'
      ? this.scripts.get(scriptNameOrScript)
      : scriptNameOrScript;

    if (!script) {
      console.error(`[DirectorScriptRunner] Script not found: ${scriptNameOrScript}`);
      return;
    }

    this._currentScript = script;
    this.context.currentScript = script.name;
    this._running = true;

    try {
      await this._executeSteps(script.steps);
    } catch (err) {
      if (err.message !== 'INTERRUPTED') {
        console.error(`[DirectorScriptRunner] Error in ${script.name}:`, err.message);
      }
    } finally {
      this._currentScript = null;
      this.context.currentScript = null;
      this._running = false;
    }
  }

  interrupt(reason) {
    this._running = false;
    this.context.interrupted = true;
    this.context.interruptedReason = reason;
  }

  get isRunning() {
    return this._running;
  }

  get currentScript() {
    return this._currentScript?.name;
  }

  get chatLog() {
    return this._chatLog;
  }

  /** Update context (called by game loop or tests) */
  updateContext(updates) {
    Object.assign(this.context, updates);
    this.mood.updateFromContext(this.context);
  }

  /** Start auto-running scripts based on context */
  startAutoRun(tickMs = 2000) {
    this._tickInterval = setInterval(() => {
      this.mood.tick();
      if (!this._running) this._pickNextScript();
    }, tickMs);
  }

  stopAutoRun() {
    if (this._tickInterval) {
      clearInterval(this._tickInterval);
      this._tickInterval = null;
    }
  }

  _pickNextScript() {
    const { stage, budget, moviesCompleted } = this.context;
    const choices = [];

    if (stage === STAGES.BETWEEN_PROJECTS) {
      choices.push({ w: 0.6, script: 'pitch_movie' });
      choices.push({ w: 0.2, script: 'throw_party' });
      choices.push({ w: 0.2, script: 'read_reviews' });
    } else if (stage === STAGES.PRE_PRODUCTION) {
      choices.push({ w: 0.5, script: 'hire_actor' });
      choices.push({ w: 0.3, script: 'direct_scene' });
      choices.push({ w: 0.2, script: 'complain' });
    } else if (stage === STAGES.FILMING) {
      choices.push({ w: 0.6, script: 'direct_scene' });
      choices.push({ w: 0.2, script: 'review_footage' });
      choices.push({ w: 0.2, script: 'complain' });
    } else if (stage === STAGES.POST_PRODUCTION) {
      choices.push({ w: 0.5, script: 'review_footage' });
      choices.push({ w: 0.3, script: 'celebrate' });
      choices.push({ w: 0.2, script: 'complain' });
    } else if (stage === STAGES.RELEASE) {
      choices.push({ w: 0.4, script: 'read_reviews' });
      choices.push({ w: 0.3, script: 'celebrate' });
      choices.push({ w: 0.3, script: 'complain' });
    }

    const total = choices.reduce((s, c) => s + c.w, 0);
    let roll = Math.random() * total;
    for (const c of choices) {
      roll -= c.w;
      if (roll <= 0) {
        this.run(c.script);
        return;
      }
    }
  }

  async _executeSteps(steps) {
    for (const step of steps) {
      if (!this._running) throw new Error('INTERRUPTED');
      await this._executeStep(step);
      await this._naturalDelay();
    }
  }

  async _executeStep(step) {
    if (!this._running) throw new Error('INTERRUPTED');

    switch (step.type) {
      case 'action':
        try { await step.fn(); } catch (e) {
          console.error(`[DirectorScriptRunner] Action "${step.name}" error:`, e.message);
        }
        break;

      case 'chat': {
        if (Math.random() > this.mood.chattiness) break;
        const msg = step.pick();
        if (msg && typeof msg === 'string') {
          this.hooks.onChat(msg);
        }
        break;
      }

      case 'wait':
        await this._wait(step.ms * (2 - this.mood.speedMultiplier));
        break;

      case 'branch': {
        const result = step.condition();
        const branch = result ? step.ifTrue : step.ifFalse;
        if (Array.isArray(branch)) await this._executeSteps(branch);
        else await this._executeStep(branch);
        break;
      }

      case 'goto': {
        const target = this.scripts.get(step.scriptName);
        if (target) {
          this._currentScript = target;
          this.context.currentScript = target.name;
          await this._executeSteps(target.steps);
        }
        break;
      }

      case 'set':
        this.context[step.key] = step.value;
        break;

      case 'noop':
        break;

      // Movie actions — delegate to hooks
      case 'pitch_movie':     this.hooks.onPitch(); break;
      case 'direct_scene':    this.hooks.onDirect(); break;
      case 'review_footage':  this.hooks.onReview(); break;
      case 'hire_actor':      this.hooks.onHire(); break;
      case 'fire_actor':      this.hooks.onFire(); break;
      case 'throw_party':     this.hooks.onParty(); break;
      case 'read_reviews':    this.hooks.onReviews(); break;
      case 'complain':        this.hooks.onComplain(); break;
      case 'celebrate':       this.hooks.onCelebrate(); break;
    }
  }

  _naturalDelay() {
    const base = 400;
    const variance = this.mood.speedMultiplier * 600;
    return this._wait(base + Math.random() * variance);
  }

  _wait(ms) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, ms);
      this._interruptReject = () => {
        clearTimeout(timeout);
        reject(new Error('INTERRUPTED'));
      };
    });
  }

  async switchScript(name, transitionChat = null) {
    const script = this.scripts.get(name);
    if (!script) return;

    this.interrupt('switch');
    if (transitionChat) this.hooks.onChat(transitionChat);
    await new Promise(r => setTimeout(r, 1500));
    this.context.interrupted = false;
    this.run(script);
  }

  async switchToV1(scriptData, transitionChat = null) {
    if (!scriptData?.steps) return;
    const name = scriptData.name || `v1_${Date.now()}`;
    if (!this.scripts.has(name)) {
      this.register(new Script(name, scriptData.steps));
    }
    await this.switchScript(name, transitionChat);
  }
}
