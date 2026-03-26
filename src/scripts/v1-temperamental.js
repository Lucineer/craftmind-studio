/**
 * v1-temperamental.js — The Drama Magnet
 *
 * Feuds with everyone. Demands ridiculous things on set.
 * Throws tantrums, then apologizes. 
 * "I CAN'T WORK UNDER THESE CONDITIONS!"
 */

import { Script, Step } from './script-engine.js';

// ── Pitch ──────────────────────────────────────────────────────────────

export const pitchMovie = Script.define('pitch_movie', [
  Step.chat([
    'I have a VISION. And if you don\'t like it, find another director.',
    'This film will CHANGE EVERYTHING or I\'ll burn this studio to the ground.',
    'Don\'t look at me like that. I know what I\'m doing. Mostly.',
    'I pitched this to three studios. They all passed. FOOLS.',
    'If the producer says ONE word during my pitch, I walk.',
    'This movie is about ME. Indirectly. But still about me.',
    'I need a $100 million budget for a character study set in ONE ROOM.',
    'Everyone who doubted me will be SORRY.',
  ]),
  Step.pitchMovie(),
  Step.chat([
    'If they change ONE THING about my pitch, I\'m gone.',
    'The producer is taking notes. I can FEEL them taking notes.',
  ]),
]);

// ── Direct ─────────────────────────────────────────────────────────────

export const directScene = Script.define('direct_scene', [
  Step.chat([
    'I CAN\'T WORK UNDER THESE CONDITIONS! The craft services has NO artisanal cheese!',
    'WHO MOVED MY CHAIR?! I had it at EXACTLY 37 degrees.',
    'The actor is looking at me. STOP LOOKING AT ME. Feel the EMOTION.',
    'Forty-seventh take! This is YOUR fault, not mine!',
    'Everyone STOP BREATHING so loud! I can\'t hear the SUBTEXT!',
    'I need a live horse on set. NOW. For... artistic reasons.',
    'The lighting is INCREASING MY ANXIETY. Change it. ALL of it.',
    'No, I will NOT explain what I want. If you don\'t understand, you\'re not an artist.',
    'This take was ALMOST perfect except for EVERYTHING about it.',
    '*storms off set* ...*comes back two minutes later* Okay let\'s try again.',
  ]),
  Step.directScene(),
  Step.chat([
    'THAT was perfect. Don\'t let it go to your head.',
    'I\'m sorry I yelled. It\'s because I CARE. Too much.',
    'We\'re all going to be friends after this. I PROMISE. ...probably.',
  ]),
]);

// ── Review ─────────────────────────────────────────────────────────────

export const reviewFootage = Script.define('review_footage', [
  Step.chat([
    'WHO authorized this editing?! The pacing is... actually okay but WHO AUTHORIZED IT.',
    'I look terrible in the behind-the-scenes footage. DELETE IT.',
    'This footage is fine but I\'m in a BAD MOOD so it\'s TERRIBLE.',
    'Every time I watch dailies I remember why I chose this career. The hatred.',
    'The DP shot it too pretty. Make it UGLIER. Life is ugly.',
  ]),
  Step.reviewFootage(),
]);

// ── Hire ───────────────────────────────────────────────────────────────

export const hireActor = Script.define('hire_actor', [
  Step.chat([
    'You remind me of me when I was younger. Before the world crushed me.',
    'You\'re going to love working with me. I\'m a DIFFERENT person onset. ...ish.',
    'I hired you over twelve other people. Don\'t make me regret it.',
    'Your agent is annoying but YOU have potential.',
    'Welcome to the family. We fight, we cry, we make art. In that order.',
  ]),
  Step.hireActor(),
]);

// ── Fire ───────────────────────────────────────────────────────────────

export const fireActor = Script.define('fire_actor', [
  Step.chat([
    'You and I both know this isn\'t working. It\'s not you, it\'s... actually it\'s you.',
    'I gave you EVERYTHING and you gave me... adequate performances. UNACCEPTABLE.',
    'This is the hardest thing I\'ve ever done. Which is saying something.',
    'I CAN\'T WORK UNDER THESE CONDITIONS! And by conditions, I mean you.',
  ]),
  Step.fireActor(),
  Step.chat([
    'I feel terrible about that. ...No I don\'t. Yes I do. I\'m conflicted.',
  ]),
]);

// ── Celebrate ──────────────────────────────────────────────────────────

export const celebrate = Script.define('celebrate', [
  Step.chat([
    'I TOLD YOU ALL! I TOLD EVERY SINGLE ONE OF YOU!',
    'This award means NOTHING to me... give me the award, I want to hold it.',
    'All the people who said I was "difficult to work with" — look at my OSCAR.',
    'I\'m crying. These are tears of JOY. And EXHAUSTION. Mostly exhaustion.',
    'We did it! WE DID IT! Now let\'s never speak of the nightmare production.',
    'Success! Now everyone who was mean to me has to pretend they liked me all along.',
    'I\'d like to thank... actually, I\'d like to NOT thank several people.',
    'This is the best day of my life! Until something goes wrong. Which it will.',
  ]),
  Step.celebrate(),
]);

// ── Complain ───────────────────────────────────────────────────────────

export const complain = Script.define('complain', [
  Step.chat([
    'I CAN\'T WORK UNDER THESE CONDITIONS! The trailer is too small!',
    'Everyone is out to get me. EVERYONE. Including you, probably.',
    'My therapist says I should express my feelings. My feelings are RAGE.',
    'The craft services AGAIN. Why is there never any good hummus?',
    'I\'ve been wronged by every person in this industry. A LIST.',
    'Nobody understands the PRESSURE I\'m under. NOBODY.',
    'The AC is two degrees too cold. I\'m calling my lawyer.',
    'Why does everyone on this set walk so LOUDLY?',
  ]),
  Step.complain(),
]);

// ── Party ──────────────────────────────────────────────────────────────

export const throwParty = Script.define('throw_party', [
  Step.chat([
    'I RSVP\'d "maybe" to my own premiere. Keep them guessing.',
    '*arrives dramatically late to own party*',
    'This party is fine but it\'d be better without the producer.',
    'I\'m having a wonderful time. DON\'T talk to me.',
    'Open bar? OPEN BAR? Finally, someone understands art.',
  ]),
  Step.throwParty(),
]);

// ── Reviews ────────────────────────────────────────────────────────────

export const readReviews = Script.define('read_reviews', [
  Step.chat([
    'Good review? Obviously. Bad review? The critic has a PERSONAL VENDETTA.',
    'This reviewer clearly doesn\'t understand GENIUS.',
    'Mixed review means they\'re COWARDS who can\'t commit to an opinion.',
    'Two stars? TWO STARS?! I\'m calling the editor.',
    'The positive reviews are the ONLY ones that matter. The rest are INVALID.',
  ]),
  Step.readReviews(),
]);

// ── Register all ───────────────────────────────────────────────────────

export default {
  name: 'temperamental',
  personality: 'The Drama Magnet',
  stats: { style: 'chaotic', boxOffice: 0.5, criticalAcclaim: 0.6 },
  scripts: [
    pitchMovie, directScene, reviewFootage, hireActor,
    fireActor, celebrate, complain, throwParty, readReviews,
  ],
};
