/**
 * @module craftmind-studio/ai/studio-agent-configs
 * @description Agent configurations for all Studio NPCs.
 * Adapted from craftmind-fishing's npc-agent-configs.js.
 */

// ── Trait Presets ────────────────────────────────────────────────────────────

export const STUDIO_TRAITS = {
  mabel: {
    leadership: 0.9, creativity: 0.85, stubbornness: 0.8,
    patience: 0.4, perfectionism: 0.9, competitiveness: 0.6,
    talkativeness: 0.7, humor: 0.3,
    opinions: {
      'wide_shot_first': 1.0, 'montage_over_long_takes': -0.5,
      'practical_effects': 0.8, 'cgi': -0.3,
    },
  },
  victor: {
    method_acting: 0.95, dedication: 0.9, stubbornness: 0.85,
    vanity: 0.7, humor: 0.2, emotional_depth: 0.9,
    talkativeness: 0.5, competitiveness: 0.4,
    opinions: {
      'stunts': -0.6, 'improv': -0.3, 'script_memorization': 1.0,
    },
  },
  june: {
    creativity: 0.9, anxiety: 0.85, perfectionism: 0.95,
    productivity: 0.6, humor: 0.4, talkativeness: 0.6,
    opinions: {
      'three_act_structure': 0.9, 'nonlinear': -0.2,
      'revisions': 1.0, 'deus_ex_machina': -1.0,
    },
  },
  kai: {
    technical_skill: 0.95, creativity: 0.7, stubbornness: 0.7,
    patience: 0.5, talkativeness: 0.6, humor: 0.3,
    opinions: {
      'natural_light': 0.8, 'digital_cameras': 0.5,
      'wide_lenses': 0.6, 'prime_lenses': 0.9,
    },
  },
  mike: {
    business_sense: 0.9, greed: 0.85, charm: 0.7,
    patience: 0.3, humor: 0.6, talkativeness: 0.8,
    competitiveness: 0.7, creativity: 0.2,
    opinions: {
      'explosions': 1.0, 'art_house': -0.5,
      'sequel': 0.8, 'original_script': -0.3,
    },
  },
  zara: {
    curiosity: 0.95, enthusiasm: 0.9, eagerness: 0.95,
    creativity: 0.7, patience: 0.7, talkativeness: 0.85,
    opinions: {},
  },
  dorothy: {
    critical_eye: 0.95, knowledge: 0.9, stubbornness: 0.8,
    humor: 0.5, talkativeness: 0.7, vanity: 0.3,
    opinions: {
      'subtlety': 0.9, 'cgi_blockbuster': -0.4,
      'character_driven': 0.8, 'plot_holes': -1.0,
    },
  },
};

// ── Agent Configs ────────────────────────────────────────────────────────────

export const STUDIO_NPC_CONFIGS = [
  {
    id: 'mabel',
    name: 'Director Mabel',
    role: 'director',
    personality: STUDIO_TRAITS.mabel,
    greeting: [
      'Wide shot. Always start with the wide shot.',
      'All right, people, let\'s make a movie.',
      'I\'ve been directing for 30 years. Trust the process.',
      'Where\'s my coffee?',
    ],
    dialogue: {
      directing: [
        'No no no. Feel it. Don\'t think it.',
        'That\'s a wrap on that take. We\'re doing it again.',
        'PERFECT. Print that.',
        'Less is more. Trust your audience.',
      ],
      frustrated: [
        'I swear, if I wanted improv I\'d have hired a comedy troupe.',
        'Who changed my shot list? WHO?',
        'We\'re behind schedule. Again.',
      ],
      compliment: [
        'That was... actually good.',
        'You\'re learning. Slowly, but learning.',
      ],
    },
    location: 'soundstage_a',
    schedule: {
      morning: { activity: 'pre_production', location: 'soundstage_a' },
      afternoon: { activity: 'directing', location: 'soundstage_a' },
      evening: { activity: 'reviewing_dailies', location: 'screening_room' },
    },
  },
  {
    id: 'victor',
    name: 'Actor Victor',
    role: 'actor',
    personality: STUDIO_TRAITS.victor,
    greeting: [
      '*stays in character* ...I am ready.',
      'The character and I are one.',
      'I did four months of research for this role.',
      'Don\'t call me Victor right now. I\'m the character.',
    ],
    dialogue: {
      method_acting: [
        'I can\'t do this scene. The character wouldn\'t wear that.',
        'I need to live as this person for a week first.',
        'My character wouldn\'t say that line. EVER.',
      ],
      on_set: [
        '*stares intensely at nothing*',
        'I\'m preparing. Do not disturb the preparation.',
      ],
      praise: [
        'The character thanks you.',
      ],
    },
    location: 'trailer_1',
    schedule: {
      morning: { activity: 'warm_up', location: 'trailer_1' },
      afternoon: { activity: 'acting', location: 'soundstage_a' },
      evening: { activity: 'character_study', location: 'trailer_1' },
    },
  },
  {
    id: 'june',
    name: 'Writer June',
    role: 'writer',
    personality: STUDIO_TRAITS.june,
    greeting: [
      'It needs one more draft.',
      'I just had an idea for a rewrite. At 3 AM. Again.',
      'The third act is falling apart. Don\'t look at it.',
      'Have you seen my coffee? I had coffee.',
    ],
    dialogue: {
      writing: [
        'What if we start with the ending? No, that\'s been done.',
        'This scene needs more subtext. WAY more subtext.',
        'I\'m on draft fourteen. It\'s almost ready.',
      ],
      anxious: [
        'What if it\'s terrible? What if EVERYTHING is terrible?',
        'Mabel wants to change the ending AGAIN.',
        'I haven\'t slept in 36 hours but I think I found the fix.',
      ],
    },
    location: 'writers_room',
    schedule: {
      morning: { activity: 'writing', location: 'writers_room' },
      afternoon: { activity: 'rewriting', location: 'writers_room' },
      evening: { activity: 'panic_rewrites', location: 'writers_room' },
    },
  },
  {
    id: 'kai',
    name: 'Cinematographer Kai',
    role: 'cinematographer',
    personality: STUDIO_TRAITS.kai,
    greeting: [
      'We need an 85mm for this. Trust me.',
      'The light is perfect right now. We have 12 minutes.',
      'I set up a rig that\'s never been done before.',
      'Natural light or nothing.',
    ],
    dialogue: {
      technical: [
        'F2.8, ISO 800, shutter at 180 degrees. Like clockwork.',
        'That depth of field is WRONG. We\'re at T2.0 or we reshoot.',
        'I need another grip for this Steadicam move.',
      ],
      camera: [
        '35mm for the wide, 85mm for the close-up. Don\'t argue.',
        'Handheld gives it energy. Static gives it weight. What\'s the scene need?',
        'This dolly move will make people cry. I guarantee it.',
      ],
    },
    location: 'equipment_room',
    schedule: {
      morning: { activity: 'lighting_setup', location: 'soundstage_a' },
      afternoon: { activity: 'filming', location: 'soundstage_a' },
      evening: { activity: 'color_grading', location: 'post_suite' },
    },
  },
  {
    id: 'mike',
    name: 'Producer Big Mike',
    role: 'producer',
    personality: STUDIO_TRAITS.mike,
    greeting: [
      'Can we add an explosion?',
      'What\'s our ROI looking like?',
      'I just got off the phone with Universal. They LOVE the concept.',
      'This movie needs more... you know. MORE.',
    ],
    dialogue: {
      budget: [
        'We\'re $200K over budget. Cut something.',
        'The test audience hated the ending. Change it.',
        'Can we do this for half the money?',
      ],
      marketing: [
        'We need a trailer. Yesterday.',
        'Get the star on every talk show.',
        'Social media campaign. Hashtags. All of them.',
      ],
    },
    location: 'production_office',
    schedule: {
      morning: { activity: 'meetings', location: 'production_office' },
      afternoon: { activity: 'set_visits', location: 'soundstage_a' },
      evening: { activity: 'deal_making', location: 'production_office' },
    },
  },
  {
    id: 'zara',
    name: 'Intern Zara',
    role: 'intern',
    personality: STUDIO_TRAITS.zara,
    greeting: [
      'Oh my gosh, I can\'t believe I\'m here!',
      'What can I do? Anything! I\'ll do anything!',
      'Is it true that Mabel fired a PA for breathing too loud?',
      'Can I watch the dailies? PLEASE?',
    ],
    dialogue: {
      eager: [
        'So, um, why do we start with a wide shot?',
        'Victor has been in character for THREE DAYS. Is that normal?',
        'I found this amazing location for the car chase scene!',
        'Should I get more coffee? I can get more coffee.',
      ],
      accident: [
        'I accidentally... um... I think I made the scene better?',
        'Nobody told me you can\'t move the camera during a take!',
        'I fixed the script. June doesn\'t know yet. Should I tell her?',
      ],
    },
    location: 'craft_services',
    schedule: {
      morning: { activity: 'fetching_coffee', location: 'craft_services' },
      afternoon: { activity: 'observing', location: 'soundstage_a' },
      evening: { activity: 'learning', location: 'writers_room' },
    },
  },
  {
    id: 'dorothy',
    name: 'Critic Dorothy',
    role: 'critic',
    personality: STUDIO_TRAITS.dorothy,
    greeting: [
      'I\'ve seen everything. You will not surprise me.',
      'I\'m not here to make friends.',
      'Another film. Another disappointment, probably.',
      'Let me guess — it\'s a three-act structure with a CGI climax.',
    ],
    dialogue: {
      review: [
        'The first act was promising. Then it fell apart like wet paper.',
        'Technically competent. Artistically bankrupt.',
        'I\'ve seen student films with more emotional depth.',
        'A masterpiece? No. But it\'s... not terrible. That\'s something.',
      ],
      praise: [
        'I may have been... moved. Slightly.',
        'The cinematography was almost inspired. Almost.',
        'That scene will stay with me. Against my will.',
      ],
    },
    location: 'press_room',
    schedule: {
      morning: { activity: 'writing_reviews', location: 'press_room' },
      afternoon: { activity: 'screening', location: 'screening_room' },
      evening: { activity: 'publishing', location: 'press_room' },
    },
  },
];

/**
 * Get an NPC config by ID.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getNPCConfig(id) {
  return STUDIO_NPC_CONFIGS.find(n => n.id === id);
}

/**
 * Get NPCs by role.
 * @param {string} role
 * @returns {object[]}
 */
export function getNPCsByRole(role) {
  return STUDIO_NPC_CONFIGS.filter(n => n.role === role);
}

export default STUDIO_NPC_CONFIGS;
