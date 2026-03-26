/**
 * @module craftmind-studio/ai/script-evolver-studio
 * @description Self-improving system for writing/directing scripts.
 * Adapted from craftmind-fishing's script-evolver.js.
 * Directing approaches, writing templates, and marketing strategies
 * evolve based on box office and review data.
 */

export class ScriptEvolverStudio {
  constructor() {
    this.versions = new Map(); // scriptName -> [{ version, code, changelog, timestamp }]
  }

  /**
   * Register the current version of a script.
   * @param {string} scriptName
   * @param {string} code
   */
  registerScript(scriptName, code) {
    if (!this.versions.has(scriptName)) {
      this.versions.set(scriptName, []);
    }
    const history = this.versions.get(scriptName);
    const versionId = `v${history.length}`;
    history.push({
      version: versionId,
      code,
      changelog: 'Initial version',
      timestamp: Date.now(),
    });
    return versionId;
  }

  /**
   * Evolve a script based on evaluation data.
   * Without an LLM, uses rule-based heuristic improvements.
   * @param {string} scriptName
   * @param {object} evaluation - from DirectingEvaluator
   * @returns {{ evolved: boolean, versionId?: string, details?: string }}
   */
  evolve(scriptName, evaluation) {
    const history = this.versions.get(scriptName);
    if (!history || history.length === 0) {
      return { evolved: false, details: `No script registered: ${scriptName}` };
    }

    const current = history[history.length - 1];
    const oldCode = current.code;
    const insights = evaluation.insights || [];
    const bestApproach = evaluation.bestApproach || 'unknown';
    const score = evaluation.sessionScore ?? 0.5;

    // Heuristic modifications
    let newCode = oldCode;
    const changes = [];

    // If score is low, add conditional refinement
    if (score < 0.5) {
      if (!newCode.includes('// EXCEPTION') && !newCode.includes('// ADAPT')) {
        newCode += '\n// ADAPT: Based on low performance, add genre-specific adjustments\n';
        newCode += '// Consider: varying camera style based on scene emotional intensity\n';
        changes.push('Added adaptive genre adjustments');
      }
    }

    // If we have insights, embed them
    if (insights.length > 0 && !newCode.includes('// DATA INSIGHT')) {
      const insightBlock = insights.slice(0, 3).map(i => `// DATA INSIGHT: ${i}`).join('\n');
      newCode += '\n' + insightBlock + '\n';
      changes.push(`Embedded ${insights.length} data-driven insights`);
    }

    // If best approach changed, update
    if (bestApproach !== 'unknown' && !newCode.includes(`// PREFERRED: ${bestApproach}`)) {
      newCode += `\n// PREFERRED: ${bestApproach} (based on comparative evaluation)\n`;
      changes.push(`Updated preferred approach to "${bestApproach}"`);
    }

    // If no changes, don't create a new version
    if (changes.length === 0) {
      return { evolved: false, details: 'No significant improvements to make' };
    }

    // Validate: not empty, not same
    if (newCode.trim() === oldCode.trim()) {
      return { evolved: false, details: 'No code changes' };
    }

    // Save new version
    const versionId = `v${history.length}`;
    history.push({
      version: versionId,
      code: newCode,
      changelog: changes.join('; '),
      improvement: score - (history.length > 1 ? 0.5 : 0),
      timestamp: Date.now(),
    });

    return { evolved: true, versionId, details: changes.join('; ') };
  }

  /**
   * Get evolution history for a script.
   * @param {string} scriptName
   * @returns {object[]}
   */
  getHistory(scriptName) {
    return this.versions.get(scriptName) || [];
  }

  /**
   * Get the latest version of a script.
   * @param {string} scriptName
   * @returns {string|null}
   */
  getLatest(scriptName) {
    const history = this.versions.get(scriptName);
    if (!history || history.length === 0) return null;
    return history[history.length - 1].code;
  }

  /**
   * Validate that evolved code is reasonable.
   * @param {string} code
   * @returns {{ valid: boolean, errors: string[] }}
   */
  validate(code) {
    const errors = [];
    if (!code || code.trim().length < 20) errors.push('Code is too short');
    return { valid: errors.length === 0, errors };
  }
}

export default ScriptEvolverStudio;
