/**
 * v1-auteur.js — The Visionary Director
 *
 * Has grand artistic vision, won't compromise.
 * Feuds with producers over budget. Celebrates critical acclaim, ignores box office.
 * "Art isn't about money. It's about TRUTH."
 */

import { Script, Step, MOODS, STAGES } from './script-engine.js';

export const auteurScript = {
  name: 'auteur',
  steps: [],
  stats: { style: 'artistic', boxOffice: 0.3, criticalAcclaim: 0.9 },
};

// ── Pitch ──────────────────────────────────────────────────────────────

export const pitchMovie = Script.define('pitch_movie', [
  Step.chat([
    'I see it in my mind already. A three-hour meditation on solitude.',
    'Picture this: silence. Then more silence. Then — a single tear.',
    'We open on an empty field. The camera doesn\'t move for fourteen minutes.',
    'It\'s not a movie. It\'s an EXPERIENCE. The studio won\'t understand.',
    'I\'ve been dreaming about this shot since I was twelve.',
    'Black and white. Obviously. Color is a compromise.',
    'No, the dog dies. That\'s the whole point.',
    'We\'re not making a sequel. We\'re making a STATEMENT.',
  ]),
  Step.pitchMovie(),
  Step.chat([
    'The producers want explosions. I want TRUTH.',
    'They keep asking "what\'s the genre?" As if art has genres.',
    'Budget? I don\'t care about budget. I care about VISION.',
    'If they cut my seven-minute tracking shot, I walk.',
  ]),
]);

// ── Direct ─────────────────────────────────────────────────────────────

export const directScene = Script.define('direct_scene', [
  Step.chat([
    'Again. The emotion was wrong. It was DEAD. I need ALIVE.',
    'No no no. You\'re acting. I need you to STOP acting and just BE.',
    'The lighting is all wrong. This scene needs more... existential dread.',
    'CLOSE-UP. I want to see every pore of their existential crisis.',
    'No, you\'re smiling. This is a tragedy. Tragedies don\'t smile.',
    'Everyone off set except the lead. I need silence.',
    'The camera angle is pedestrian. We need SUBVERSION.',
    'That take was... adequate. Which is to say, try again.',
    'This is the most important scene in cinema history. No pressure.',
  ]),
  Step.directScene(),
  Step.chat([
    'YES. That was ALIVE. I felt it. Print that. PRINT THAT.',
    'Finally. FINALLY you understand the character.',
    'One more. I need one more to be sure. Art requires certainty.',
    'Good. Now do the exact opposite of what you just did.',
  ]),
]);

// ── Review ─────────────────────────────────────────────────────────────

export const reviewFootage = Script.define('review_footage', [
  Step.chat([
    '*watches the dailies in silence for forty minutes*',
    'The composition is almost there. Almost.',
    'I see what I was going for. The audience might not, but I do.',
    'This is the best footage I\'ve ever shot. Or the worst. I can\'t tell anymore.',
    'The third act needs to be twenty minutes longer. At minimum.',
    'Something\'s missing. I\'ll know what when I see it. Keep it rolling.',
  ]),
  Step.reviewFootage(),
]);

// ── Hire ───────────────────────────────────────────────────────────────

export const hireActor = Script.define('hire_actor', [
  Step.chat([
    'I saw your last film. You cried in the rain scene. REAL tears. You\'re hired.',
    'You have the eyes of someone who has SUFFERED. Perfect for the lead.',
    'I don\'t care about your resume. I care about your SOUL.',
    'Method actor? Good. You\'ll need it. This role will destroy you.',
    'Your range is... adequate. We\'ll fix the rest in editing.',
  ]),
  Step.hireActor(),
]);

// ── Fire ───────────────────────────────────────────────────────────────

export const fireActor = Script.define('fire_actor', [
  Step.chat([
    'You smiled during the death scene. We\'re done.',
    'Your performance has... commercial energy. We need something else.',
    'I\'m sorry. Actually no, I\'m not. Art demands sacrifice.',
    'You keep asking "what\'s my motivation?" You\'re not right for this.',
  ]),
  Step.fireActor(),
]);

// ── Celebrate ──────────────────────────────────────────────────────────

export const celebrate = Script.define('celebrate', [
  Step.chat([
    'Cannes is going to LOVE this.',
    'They gave us four stars. They don\'t UNDERSTAND. It\'s a FIVE star film.',
    'The audience walked out. That means it WORKED.',
    'Ignore the box office. The CRITICS understand.',
    'I dedicate this film to everyone who told me I was crazy.',
    'The New York Times called it "challenging." That\'s the highest compliment.',
    'Art isn\'t about money. It\'s about TRUTH.',
  ]),
  Step.celebrate(),
]);

// ── Complain ───────────────────────────────────────────────────────────

export const complain = Script.define('complain', [
  Step.chat([
    'They want me to add a love interest. There IS no love. Only DREAD.',
    'The studio wants to cut forty minutes. They\'d cut the Mona Lisa to fit a smaller frame.',
    'Test audiences are the DEATH of cinema.',
    'The producer said "can the protagonist be more likeable?" MORE LIKEABLE.',
    'Nobody understands my vision. That\'s fine. Nobody understood Van Gogh either.',
    'Marketing wants a trailer that "spoils the vibe." THE VIBE IS THE WHOLE FILM.',
    'I\'m surrounded by MBAs. Not a single artist among them.',
    'They asked me to add a post-credits scene. It\'s not a MARVEL MOVIE.',
  ]),
  Step.complain(),
]);

// ── Party ──────────────────────────────────────────────────────────────

export const throwParty = Script.define('throw_party', [
  Step.chat([
    'I\'ll attend the premiere but I won\'t enjoy it. Art doesn\'t celebrate.',
    '*arrives at the party, immediately cornered by producers*',
    'If someone asks me about a sequel, I\'m leaving.',
    'A party? For ART? How vulgar. ...what kind of champagne?',
    'I\'ll toast to the film, not to commerce.',
  ]),
  Step.throwParty(),
]);

// ── Reviews ────────────────────────────────────────────────────────────

export const readReviews = Script.define('read_reviews', [
  Step.chat([
    '*reads reviews with a magnifying glass*',
    'This critic called it "self-indulgent." I call it "brave."',
    'Five stars from Cahiers du Cinéma. The only review that matters.',
    'The audience reviews on Rotten Tomatoes are... hurtful. But art is pain.',
    'One critic said it changed their life. That makes the rest bearable.',
    'A bad review just means you\'re ahead of your time.',
  ]),
  Step.readReviews(),
]);

// ── Register all ───────────────────────────────────────────────────────

export default {
  name: 'auteur',
  personality: 'The Visionary Director',
  stats: { style: 'artistic', boxOffice: 0.3, criticalAcclaim: 0.9 },
  scripts: [
    pitchMovie, directScene, reviewFootage, hireActor,
    fireActor, celebrate, complain, throwParty, readReviews,
  ],
};
