/**
 * v1-mentor.js — The Patient Teacher
 *
 * Nurtures young actors. Gives constructive feedback. Calm under pressure.
 * "Take your time. We'll get the shot."
 */

import { Script, Step } from './script-engine.js';

// ── Pitch ──────────────────────────────────────────────────────────────

export const pitchMovie = Script.define('pitch_movie', [
  Step.chat([
    'This is a story about people finding their way. I think audiences need that right now.',
    'I want to make something that makes people feel less alone.',
    'It\'s a small film but it has a big heart. That\'s what matters.',
    'I\'ve been thinking about this story for years. It finally feels right.',
    'Every great film starts with trust. I want to build that on set.',
    'The script isn\'t perfect yet, and that\'s okay. We\'ll find it together.',
    'I want to give first-time actors a real chance here.',
    'This film is about patience. Fitting, since that\'s all I have.',
  ]),
  Step.pitchMovie(),
  Step.chat([
    'If we get the right team, this will be something special.',
    'I\'m not asking for a huge budget. Just enough to tell the story right.',
  ]),
]);

// ── Direct ─────────────────────────────────────────────────────────────

export const directScene = Script.define('direct_scene', [
  Step.chat([
    'Take your time. We\'ll get the shot. There\'s no rush.',
    'That was really good. Can we try one more? Just to explore.',
    'I love what you\'re doing with the character. Trust your instincts.',
    'Don\'t worry about being perfect. Worry about being TRUE.',
    'The emotion was right. Let\'s protect that and do it again.',
    'You\'re doing amazing work. The camera sees it, I see it.',
    'Breathe. In through the nose, out through the performance.',
    'Everyone\'s here because they believe in this. Including me.',
    'That was beautiful. Seriously. I\'m not just saying that.',
  ]),
  Step.directScene(),
  Step.chat([
    'Wonderful work today, everyone. Get some rest.',
    'We found something special in that last take. Protect it.',
    'Thank you for trusting the process. It\'s paying off.',
  ]),
]);

// ── Review ─────────────────────────────────────────────────────────────

export const reviewFootage = Script.define('review_footage', [
  Step.chat([
    'There\'s a moment in take 14 where everything just... clicks.',
    'The dailies are better than I expected. The team is really coming together.',
    'I want everyone to see this scene. You all earned it.',
    'There are imperfections but they\'re beautiful imperfections.',
    'The performances are carrying this film. The script is just along for the ride.',
  ]),
  Step.reviewFootage(),
]);

// ── Hire ───────────────────────────────────────────────────────────────

export const hireActor = Script.define('hire_actor', [
  Step.chat([
    'I see real potential in you. Let\'s grow it together.',
    'This is your first big role? Even better. You\'ll bring something fresh.',
    'I hired you because you have something no one else does. Be yourself.',
    'Nervous? Good. Nervous means you care. I care too.',
    'Welcome to the team. We take care of each other here.',
  ]),
  Step.hireActor(),
]);

// ── Fire ───────────────────────────────────────────────────────────────

export const fireActor = Script.define('fire_actor', [
  Step.chat([
    'This isn\'t working out, and I think you know that too.',
    'It\'s not about talent. It\'s about the right fit for this particular story.',
    'I\'m sorry. You deserve honesty, and here it is.',
    'I hope you find the right project. This just isn\'t ours.',
  ]),
  Step.fireActor(),
  Step.chat([
    'I meant what I said. You have talent. Keep going.',
  ]),
]);

// ── Celebrate ──────────────────────────────────────────────────────────

export const celebrate = Script.define('celebrate', [
  Step.chat([
    'This belongs to ALL of us. Every single person on this set.',
    'The reviews are kind. But the real reward was the process.',
    'I\'m so proud of everyone. You grew so much during this film.',
    'To the actors who took a chance on me: thank you.',
    'We made something honest. That\'s the best any of us can do.',
    'First-time actors getting standing ovations. THAT\'S why I do this.',
    'Every award this film gets, I\'m sharing. Literally.',
    'The audience laughed in the right places and cried in the right places.',
  ]),
  Step.celebrate(),
]);

// ── Complain ───────────────────────────────────────────────────────────

export const complain = Script.define('complain', [
  Step.chat([
    'I wish the studio would trust us a little more. We\'re doing good work.',
    'The schedule is tight but we\'ll manage. We always do.',
    'I try not to complain, but the lack of rehearsal time worries me.',
    'Everyone deserves a proper lunch break. It\'s not too much to ask.',
    'I don\'t like raising my voice but the catering situation needs addressing.',
    'Can we please just give the actors more time to prepare? Please?',
  ]),
  Step.complain(),
]);

// ── Party ──────────────────────────────────────────────────────────────

export const throwParty = Script.define('throw_party', [
  Step.chat([
    'I want to thank every single person here. From the PAs to the leads.',
    'This party is for the crew. You all earned it and then some.',
    'If anyone feels like they didn\'t contribute — you\'re wrong.',
    'No speeches from me. Just enjoy yourselves. You\'re wonderful people.',
  ]),
  Step.throwParty(),
]);

// ── Reviews ────────────────────────────────────────────────────────────

export const readReviews = Script.define('read_reviews', [
  Step.chat([
    'They saw what we were trying to do. That means the world.',
    'Even the mixed reviews have kind things to say about the performances.',
    'I\'m reading this review to the whole cast. They need to hear it.',
    'Critics are people too. I appreciate their thoughtfulness.',
    'Not everyone will love it, and that\'s okay. We made it honestly.',
    'This review said the film has "heart." I think that\'s the best word.',
  ]),
  Step.readReviews(),
]);

// ── Register all ───────────────────────────────────────────────────────

export default {
  name: 'mentor',
  personality: 'The Patient Teacher',
  stats: { style: 'collaborative', boxOffice: 0.6, criticalAcclaim: 0.8 },
  scripts: [
    pitchMovie, directScene, reviewFootage, hireActor,
    fireActor, celebrate, complain, throwParty, readReviews,
  ],
};
