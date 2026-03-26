/**
 * @module craftmind-studio/ai/studio-action-schema
 * @description Structured action types for movie tycoon gameplay.
 * Modeled after craftmind-fishing's action-schema.js.
 */

export const STUDIO_ACTION_TYPES = {
  DIRECT: {
    params: ['scene', 'style'],
    optionalParams: ['notes', 'cameraAngle', 'duration'],
    timeout: 30000,
    description: 'Direct a scene with stylistic instructions',
    genres: ['drama', 'comedy', 'horror', 'action', 'romance', 'thriller', 'documentary'],
    styles: ['handheld', 'static', 'dolly', 'crane', 'steadicam', 'long_take', 'montage'],
  },
  CAST: {
    params: ['role'],
    optionalParams: ['traits', 'auditionId', 'budget'],
    timeout: 20000,
    description: 'Cast an actor for a role',
  },
  WRITE: {
    params: ['genre', 'premise'],
    optionalParams: ['elements', 'structure', 'actCount'],
    timeout: 60000,
    description: 'Write or revise a script',
  },
  EDIT: {
    params: ['scene'],
    optionalParams: ['cutType', 'notes', 'targetDuration'],
    timeout: 20000,
    description: 'Edit footage — trim, rearrange, or splice',
    cutTypes: ['trim', 'rearrange', 'splice', 'slow_mo', 'speed_up', 'crossfade'],
  },
  PROMOTE: {
    params: ['film'],
    optionalParams: ['channel', 'budget', 'targetAudience'],
    timeout: 15000,
    description: 'Market and promote a film',
    channels: ['social_media', 'tv_spot', 'billboard', 'word_of_mouth', 'premiere_event', 'film_festival'],
  },
  HIRE: {
    params: ['role'],
    optionalParams: ['criteria', 'budget'],
    timeout: 15000,
    description: 'Hire a crew member',
    roles: ['cinematographer', 'editor', 'sound_designer', 'vfx_artist', 'composer', 'stunt_coordinator', 'production_assistant'],
  },
  FIRE: {
    params: ['person'],
    optionalParams: ['reason'],
    timeout: 10000,
    description: 'Fire cast or crew member',
  },
  REVIEW: {
    params: ['take'],
    optionalParams: ['criteria', 'feedback'],
    timeout: 15000,
    description: 'Review dailies or a specific take',
  },
  SET_DESIGN: {
    params: ['scene', 'style'],
    optionalParams: ['budget', 'deadline'],
    timeout: 30000,
    description: 'Design and build a set',
  },
  VFX: {
    params: ['scene', 'effect'],
    optionalParams: ['intensity', 'params'],
    timeout: 25000,
    description: 'Add visual effects to a scene',
    effects: ['explosion', 'weather', 'particles', 'cgi_character', 'matte_painting', 'color_grade', 'day_for_night'],
  },
  SOUNDTRACK: {
    params: ['scene', 'mood'],
    optionalParams: ['style', 'instruments', 'tempo'],
    timeout: 20000,
    description: 'Compose or select music for a scene',
  },
  RELEASE: {
    params: ['film', 'venue'],
    optionalParams: ['date', 'distribution', 'premiere'],
    timeout: 10000,
    description: 'Premiere or distribute a film',
    venues: ['sitka_film_festival', 'theatrical', 'streaming', 'direct_to_video', 'film_circuit'],
  },
};

/**
 * Validate a studio action against the schema.
 * @param {{ type: string, params?: Object }} action
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateStudioAction(action) {
  const errors = [];
  if (!action || typeof action.type !== 'string') {
    return { valid: false, errors: ['Missing or invalid action type'] };
  }
  const schema = STUDIO_ACTION_TYPES[action.type.toUpperCase()];
  if (!schema) {
    return { valid: false, errors: [`Unknown studio action type: ${action.type}`] };
  }
  const params = action.params || {};
  for (const p of schema.params) {
    if (!params[p]) errors.push(`Missing required param: ${p}`);
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validate a plan (array of studio actions).
 * @param {{ actions: Array }} plan
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateStudioPlan(plan) {
  if (!plan || !Array.isArray(plan.actions)) {
    return { valid: false, errors: ['Plan must have an actions array'] };
  }
  const errors = [];
  for (let i = 0; i < plan.actions.length; i++) {
    const result = validateStudioAction(plan.actions[i]);
    errors.push(...result.errors.map(e => `Action ${i}: ${e}`));
  }
  return { valid: errors.length === 0, errors };
}

export default STUDIO_ACTION_TYPES;
