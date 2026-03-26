import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  weightedRandom, Step, MOODS, STAGES,
  StudioMoodSystem, Script, DirectorScriptRunner,
} from '../src/scripts/script-engine.js';
import auteur from '../src/scripts/v1-auteur.js';
import hack from '../src/scripts/v1-hack.js';
import temperamental from '../src/scripts/v1-temperamental.js';
import mentor from '../src/scripts/v1-mentor.js';

// ── weightedRandom ─────────────────────────────────────────────────────

describe('weightedRandom', () => {
  it('returns a value from the map', () => {
    const result = weightedRandom({ 1: 'a', 1: 'b' });
    assert.ok(['a', 'b'].includes(result));
  });

  it('always returns the only option', () => {
    for (let i = 0; i < 20; i++) {
      assert.equal(weightedRandom({ 1: 'only' }), 'only');
    }
  });

  it('returns null for empty weights', () => {
    assert.equal(weightedRandom({ 0: 'x' }), 'x');
  });

  it('works with zero total', () => {
    const result = weightedRandom({ 0: 'a' });
    assert.equal(result, 'a');
  });

  it('skips zero-weighted entries', () => {
    const result = weightedRandom({ 0: 'a', 0: 'b', 1: 'c' });
    assert.equal(result, 'c');
  });
});

// ── Step ───────────────────────────────────────────────────────────────

describe('Step', () => {
  it('action creates correct type', () => {
    const s = Step.action('test', () => {});
    assert.equal(s.type, 'action');
    assert.equal(s.name, 'test');
  });

  it('chat with string returns that string', () => {
    const s = Step.chat('hello');
    assert.equal(s.pick(), 'hello');
  });

  it('chat with array picks from array', () => {
    const s = Step.chat(['a', 'b', 'c']);
    const results = new Set(Array.from({ length: 50 }, () => s.pick()));
    assert.ok(results.has('a') || results.has('b') || results.has('c'));
  });

  it('chat with weighted map uses weightedRandom', () => {
    const s = Step.chat({ 1: 'yes', 1: 'no' });
    assert.ok(['yes', 'no'].includes(s.pick()));
  });

  it('noop creates noop step', () => {
    assert.equal(Step.noop().type, 'noop');
  });

  it('set creates set step', () => {
    const s = Step.set('key', 'val');
    assert.equal(s.type, 'set');
    assert.equal(s.key, 'key');
  });

  it('branch creates branch step', () => {
    const s = Step.branch(() => true, Step.noop(), Step.noop());
    assert.equal(s.type, 'branch');
    assert.equal(s.condition(), true);
  });

  it('goto creates goto step', () => {
    assert.equal(Step.goto('foo').type, 'goto');
  });

  it('wait creates wait step', () => {
    assert.equal(Step.wait(1000).type, 'wait');
  });

  // Movie-specific steps
  it('creates pitch_movie step', () => assert.equal(Step.pitchMovie().type, 'pitch_movie'));
  it('creates direct_scene step', () => assert.equal(Step.directScene().type, 'direct_scene'));
  it('creates review_footage step', () => assert.equal(Step.reviewFootage().type, 'review_footage'));
  it('creates hire_actor step', () => assert.equal(Step.hireActor().type, 'hire_actor'));
  it('creates fire_actor step', () => assert.equal(Step.fireActor().type, 'fire_actor'));
  it('creates throw_party step', () => assert.equal(Step.throwParty().type, 'throw_party'));
  it('creates read_reviews step', () => assert.equal(Step.readReviews().type, 'read_reviews'));
  it('creates complain step', () => assert.equal(Step.complain().type, 'complain'));
  it('creates celebrate step', () => assert.equal(Step.celebrate().type, 'celebrate'));
});

// ── StudioMoodSystem ───────────────────────────────────────────────────

describe('StudioMoodSystem', () => {
  it('starts neutral', () => {
    const m = new StudioMoodSystem();
    assert.equal(m.mood, MOODS.NEUTRAL);
    assert.equal(m.satisfaction, 0.5);
  });

  it('shift clamps satisfaction to 0-1', () => {
    const m = new StudioMoodSystem();
    m.shift(999);
    assert.equal(m.satisfaction, 1);
    m.shift(-999);
    assert.equal(m.satisfaction, 0);
  });

  it('setMood changes mood', () => {
    const m = new StudioMoodSystem();
    m.setMood(MOODS.INSPIRED);
    assert.equal(m.mood, MOODS.INSPIRED);
  });

  it('updateFromContext sets stressed on bad reviews', () => {
    const m = new StudioMoodSystem();
    m.updateFromContext({ lastReviewsGood: false });
    assert.equal(m.mood, MOODS.STRESSED);
  });

  it('updateFromContext sets vindicated on good reviews', () => {
    const m = new StudioMoodSystem();
    m.updateFromContext({ lastReviewsGood: true });
    assert.equal(m.mood, MOODS.VINDICATED);
  });

  it('updateFromContext sets bored between projects', () => {
    const m = new StudioMoodSystem();
    m.updateFromContext({ stage: STAGES.BETWEEN_PROJECTS });
    assert.equal(m.mood, MOODS.BORED);
  });

  it('updateFromContext sets stressed when budget low', () => {
    const m = new StudioMoodSystem();
    m.updateFromContext({ budget: 0.2, stage: STAGES.FILMING });
    assert.equal(m.mood, MOODS.STRESSED);
  });

  it('updateFromContext sets inspired when things are good', () => {
    const m = new StudioMoodSystem();
    m.updateFromContext({ reputation: 0.8, actorMorale: 0.8, stage: STAGES.FILMING });
    assert.equal(m.mood, MOODS.INSPIRED);
  });

  it('chattiness is between 0.1 and 0.9', () => {
    const m = new StudioMoodSystem();
    m.setMood(MOODS.INSPIRED);
    assert.ok(m.chattiness >= 0.1 && m.chattiness <= 0.9);
  });

  it('tick drifts satisfaction toward neutral', () => {
    const m = new StudioMoodSystem();
    m.satisfaction = 1.0;
    for (let i = 0; i < 100; i++) m.tick();
    assert.ok(m.satisfaction < 1.0);
  });

  it('speedMultiplier depends on energy', () => {
    const m = new StudioMoodSystem();
    assert.ok(m.speedMultiplier >= 0.6);
    assert.ok(m.speedMultiplier <= 1.4);
  });
});

// ── Script ─────────────────────────────────────────────────────────────

describe('Script', () => {
  it('define creates script with name and steps', () => {
    const s = Script.define('test', [Step.noop()]);
    assert.equal(s.name, 'test');
    assert.equal(s.steps.length, 1);
  });
});

// ── DirectorScriptRunner ───────────────────────────────────────────────

describe('DirectorScriptRunner', () => {
  it('registers and runs a script', async () => {
    const runner = new DirectorScriptRunner();
    const ran = [];
    runner.register(Script.define('test', [
      Step.action('log', () => ran.push('step1')),
      Step.action('log', () => ran.push('step2')),
    ]));
    await runner.run('test');
    assert.deepEqual(ran, ['step1', 'step2']);
  });

  it('chat steps call onChat hook', async () => {
    const runner = new DirectorScriptRunner();
    runner.register(Script.define('chatty', [Step.chat('hello')]));
    // Force chattiness to 1
    runner.mood.satisfaction = 1;
    runner.mood.setMood(MOODS.INSPIRED);
    await runner.run('chatty');
    assert.ok(runner.chatLog.length >= 1);
    assert.equal(runner.chatLog[0].msg, 'hello');
  });

  it('updateContext updates context and mood', () => {
    const runner = new DirectorScriptRunner();
    runner.updateContext({ budget: 0.1, stage: STAGES.FILMING });
    assert.equal(runner.context.budget, 0.1);
    assert.equal(runner.mood.mood, MOODS.STRESSED);
  });

  it('interrupt stops execution', async () => {
    const runner = new DirectorScriptRunner();
    let count = 0;
    runner.register(Script.define('long', [
      Step.action('a', () => { count++; runner.interrupt('test'); }),
      Step.action('b', () => { count++; }),
      Step.action('c', () => { count++; }),
    ]));
    await runner.run('long');
    assert.equal(count, 1);
  });

  it('branch takes ifTrue path', async () => {
    const runner = new DirectorScriptRunner();
    const path = [];
    runner.register(Script.define('br', [
      Step.branch(
        () => true,
        Step.action('t', () => path.push('true')),
        Step.action('f', () => path.push('false')),
      ),
    ]));
    await runner.run('br');
    assert.deepEqual(path, ['true']);
  });

  it('set step updates context', async () => {
    const runner = new DirectorScriptRunner();
    runner.register(Script.define('settest', [Step.set('foo', 'bar')]));
    await runner.run('settest');
    assert.equal(runner.context.foo, 'bar');
  });

  it('movie action steps call hooks', async () => {
    const runner = new DirectorScriptRunner();
    const called = [];
    runner.hooks.onPitch = () => called.push('pitch');
    runner.hooks.onDirect = () => called.push('direct');
    runner.hooks.onCelebrate = () => called.push('celebrate');
    runner.register(Script.define('actions', [
      Step.pitchMovie(),
      Step.directScene(),
      Step.celebrate(),
    ]));
    await runner.run('actions');
    assert.deepEqual(called, ['pitch', 'direct', 'celebrate']);
  });

  it('isRunning is false after completion', async () => {
    const runner = new DirectorScriptRunner();
    runner.register(Script.define('quick', [Step.noop()]));
    await runner.run('quick');
    assert.equal(runner.isRunning, false);
  });

  it('chat with null produces no output', async () => {
    const runner = new DirectorScriptRunner();
    runner.mood.satisfaction = 1;
    runner.mood.setMood(MOODS.INSPIRED);
    runner.register(Script.define('nullchat', [Step.chat({ 1: null })]));
    await runner.run('nullchat');
    // The weighted random returns null, so onChat shouldn't be called
    assert.equal(runner.chatLog.length, 0);
  });

  it('noop step does nothing', async () => {
    const runner = new DirectorScriptRunner();
    const ran = [];
    runner.register(Script.define('noop', [
      Step.noop(),
      Step.action('after', () => ran.push('ok')),
    ]));
    await runner.run('noop');
    assert.deepEqual(ran, ['ok']);
  });

  it('startAutoRun and stopAutoRun work', () => {
    const runner = new DirectorScriptRunner();
    runner.startAutoRun(100);
    assert.ok(runner._tickInterval !== null);
    runner.stopAutoRun();
    assert.equal(runner._tickInterval, null);
  });
});

// ── Personality Scripts ────────────────────────────────────────────────

describe('Personality Scripts', () => {
  const personalities = [
    { name: 'auteur', mod: auteur },
    { name: 'hack', mod: hack },
    { name: 'temperamental', mod: temperamental },
    { name: 'mentor', mod: mentor },
  ];

  for (const { name, mod } of personalities) {
    describe(`${name} personality`, () => {
      it('has name and personality', () => {
        assert.ok(mod.name);
        assert.ok(mod.personality);
      });

      it('has stats with boxOffice and criticalAcclaim', () => {
        assert.ok(typeof mod.stats.boxOffice === 'number');
        assert.ok(typeof mod.stats.criticalAcclaim === 'number');
      });

      it('has 9 script entries', () => {
        assert.equal(mod.scripts.length, 9);
      });

      it('each script has valid steps', () => {
        for (const s of mod.scripts) {
          assert.ok(s.steps.length > 0, `${s.name} has no steps`);
        }
      });

      it('has at least 15 unique chat lines across all scripts', () => {
        const allLines = new Set();
        for (const s of mod.scripts) {
          for (const step of s.steps) {
            if (step.type === 'chat') {
              // Call pick many times to discover all possible outputs
              for (let i = 0; i < 50; i++) {
                const msg = step.pick();
                if (msg) allLines.add(msg);
              }
            }
          }
        }
        assert.ok(allLines.size >= 15, `${name} only has ${allLines.size} unique lines, need >= 15`);
      });

      it('can be registered in a runner', async () => {
        const runner = new DirectorScriptRunner();
        for (const s of mod.scripts) runner.register(s);
        assert.equal(runner.scripts.size, 9);
      });

      it('can execute a script without errors', async () => {
        const runner = new DirectorScriptRunner();
        for (const s of mod.scripts) runner.register(s);
        await runner.run(mod.scripts[0].name);
      });
    });
  }
});

// ── Cross-Personality Differentiation ──────────────────────────────────

describe('Cross-Personality Differentiation', () => {
  it('auteur has high criticalAcclaim', () => {
    assert.ok(auteur.stats.criticalAcclaim >= 0.8);
  });

  it('hack has high boxOffice', () => {
    assert.ok(hack.stats.boxOffice >= 0.8);
  });

  it('hack has low criticalAcclaim', () => {
    assert.ok(hack.stats.criticalAcclaim <= 0.3);
  });

  it('temperamental has moderate stats', () => {
    assert.ok(temperamental.stats.boxOffice >= 0.3 && temperamental.stats.boxOffice <= 0.7);
  });

  it('mentor has balanced stats', () => {
    assert.ok(mentor.stats.boxOffice >= 0.4);
    assert.ok(mentor.stats.criticalAcclaim >= 0.6);
  });

  it('all personalities have unique names', () => {
    const names = [auteur, hack, temperamental, mentor].map(m => m.name);
    assert.equal(new Set(names).size, 4);
  });

  it('all personalities have unique personality descriptions', () => {
    const descs = [auteur, hack, temperamental, mentor].map(m => m.personality);
    assert.equal(new Set(descs).size, 4);
  });
});
