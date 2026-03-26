/**
 * v1-hack.js — The For-Hire Director
 *
 * Only cares about box office. Copies trends, sequels, franchises.
 * "The audience wants explosions? They GET explosions."
 * Surprisingly successful, critically panned.
 */

import { Script, Step } from './script-engine.js';

// ── Pitch ──────────────────────────────────────────────────────────────

export const pitchMovie = Script.define('pitch_movie', [
  Step.chat([
    'Fast franchise seven. The villain is back. AGAIN. The audience LOVES it.',
    'It\'s like Marvel meets Transformers meets a kitchen sink. It\'ll print money.',
    'Focus group says audiences want MORE explosions. So: three hours of explosions.',
    'We don\'t need a script. We need a TRAILER. The trailer IS the movie.',
    'Sequel, prequel, spinoff, reboot. Pick three, we\'re doing all of them.',
    'I call it... "Attack of the Giant Thing 2: The Re-Attackening."',
    'The CGI budget is $200 million. The script budget is... lunch.',
    'It\'s got a love story, a car chase, AND a robot. Something for everyone.',
  ]),
  Step.pitchMovie(),
  Step.chat([
    'The studio loves it. The studio is ALWAYS right.',
    'We\'re opening on 4,000 screens. We could show a blank screen and still profit.',
    'Chinese box office alone will cover the budget.',
  ]),
]);

// ── Direct ─────────────────────────────────────────────────────────────

export const directScene = Script.define('direct_scene', [
  Step.chat([
    'Just hit your mark and say the line. We\'ll fix it in post.',
    'More explosions. I don\'t care if it doesn\'t make sense.',
    'Action! ... CUT. That was fine. Moving on. We\'re behind schedule.',
    'The audience won\'t notice the plot hole. They\'re here for the CGI.',
    'You don\'t need to cry. We\'ll add tears in post-production.',
    'Can we add a drone shot? Everyone loves drone shots.',
    'That was great. Or terrible. Doesn\'t matter, the VFX team will save it.',
    'Faster. Louder. MORE.',
  ]),
  Step.directScene(),
  Step.chat([
    'Print. Next. We have fourteen more scenes before lunch.',
    'Good enough. "Good enough" opens to $100 million.',
    'Moving on. Time is money. Literally, it\'s my billing rate.',
  ]),
]);

// ── Review ─────────────────────────────────────────────────────────────

export const reviewFootage = Script.define('review_footage', [
  Step.chat([
    'The explosions look great. What\'s the plot again?',
    'That green screen looks fine. Nobody notices green screen anymore.',
    'Can we make the title font bigger? And add a bass drop?',
    'The test audience cheered at the explosion. Ship it.',
    'I don\'t need to watch all the footage. Just the explosion scenes.',
  ]),
  Step.reviewFootage(),
]);

// ── Hire ───────────────────────────────────────────────────────────────

export const hireActor = Script.define('hire_actor', [
  Step.chat([
    'You\'ve got 50 million followers. You\'re PERFECT for this role.',
    'Can you do your thing? You know, the face thing from your Instagram.',
    'We don\'t need a great actor. We need a BANKABLE face.',
    'Your last movie bombed but your Q score is great. You\'re in.',
    'How much? $20 million? Deal. The studio\'s paying.',
  ]),
  Step.hireActor(),
]);

// ── Fire ───────────────────────────────────────────────────────────────

export const fireActor = Script.define('fire_actor', [
  Step.chat([
    'Your agent is asking for too much. It\'s not personal, it\'s business.',
    'The focus group says you\'re "unrelatable." Their words, not mine.',
    'We\'re going in a different direction. By "different" I mean "cheaper."',
    'Your social media engagement dropped 12%. We need fresh blood.',
  ]),
  Step.fireActor(),
]);

// ── Celebrate ──────────────────────────────────────────────────────────

export const celebrate = Script.define('celebrate', [
  Step.chat([
    '$500 million worldwide opening weekend! WHO\'S THE HACK NOW?!',
    'The critics hated it. The audience LOVED it. I know who signs my checks.',
    'Number one at the box office for the third week running!',
    'Another franchise, another fortune. Same formula, different posters.',
    'We made back the budget in the first weekend. Mission accomplished.',
    'The audience wants explosions? They GET explosions.',
    'Sequel greenlit before the opening weekend numbers even came in.',
    'Critics: 23%. Box office: $800 million. I\'ll take those odds.',
  ]),
  Step.celebrate(),
]);

// ── Complain ───────────────────────────────────────────────────────────

export const complain = Script.define('complain', [
  Step.chat([
    'The critics are ELITISTS. They don\'t understand what PEOPLE want.',
    'Can we stop talking about "artistic integrity"? We have mortgages.',
    'The A-list actor wants "creative input." No. Just no.',
    'The studio wants us to cut the budget by 20%. Cut the WRITERS\' room.',
    'Why does everyone in this industry pretend they\'re not making products?',
    'The director\'s cut? There IS no director\'s cut. It\'s the STUDIO\'S cut.',
    'Someone said my film "has no soul." Box office says otherwise.',
  ]),
  Step.complain(),
]);

// ── Party ──────────────────────────────────────────────────────────────

export const throwParty = Script.define('throw_party', [
  Step.chat([
    'Open bar, red carpet, and a 60-foot poster of my face. Let\'s GO.',
    'This party is sponsored by the energy drink in our product placement.',
    'I invited every journalist in town. Coverage is king.',
    'The studio is paying for this. Which means I\'m paying for this. Sort of.',
  ]),
  Step.throwParty(),
]);

// ── Reviews ────────────────────────────────────────────────────────────

export const readReviews = Script.define('read_reviews', [
  Step.chat([
    'Rotten Tomatoes: 28%. Box office: $600 million. Which matters more?',
    'The critic from the Times called it "a symptom of cultural decline." I\'m buying a yacht.',
    'Audience score: 87%. Critics: 22%. The people have spoken.',
    'I don\'t read reviews. I read box office receipts.',
    'Bad reviews are just free marketing. CONTROVERSY SELLS.',
  ]),
  Step.readReviews(),
]);

// ── Register all ───────────────────────────────────────────────────────

export default {
  name: 'hack',
  personality: 'The For-Hire Director',
  stats: { style: 'commercial', boxOffice: 0.9, criticalAcclaim: 0.2 },
  scripts: [
    pitchMovie, directScene, reviewFootage, hireActor,
    fireActor, celebrate, complain, throwParty, readReviews,
  ],
};
