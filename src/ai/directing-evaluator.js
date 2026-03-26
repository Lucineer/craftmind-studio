/**
 * @module craftmind-studio/ai/directing-evaluator
 * @description Comparative evaluation for directing approaches.
 * Adapted from craftmind-fishing's comparative-evaluator.js.
 * Evaluates directing decisions against historical film data to determine
 * what works best per genre, style, and conditions.
 */

export class DirectingEvaluator {
  constructor() {
    this.sessions = [];
  }

  /**
   * Score a film/session on 0-1 scale.
   * @param {object} session - { film, directingDecisions, results }
   * @returns {number}
   */
  scoreSession(session) {
    const reviews = session.results?.reviewScore ?? 0;
    const boxOffice = session.results?.boxOffice ?? 0;
    const audienceScore = session.results?.audienceScore ?? 0;
    const awards = session.results?.awards ?? 0;

    // Review score (out of 10, normalized to 0-0.4)
    let score = Math.min(0.4, reviews / 10 * 0.4);

    // Box office performance (10M+ is great)
    score += Math.min(0.3, (boxOffice / 10000000) * 0.3);

    // Audience score (out of 100)
    score += Math.min(0.2, audienceScore / 100 * 0.2);

    // Awards bonus
    score += Math.min(0.1, awards * 0.033);

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Record a film session.
   * @param {object} session
   */
  recordSession(session) {
    session.sessionScore = this.scoreSession(session);
    session.recordedAt = Date.now();
    this.sessions.push(session);
  }

  /**
   * Find sessions with similar conditions (genre, style, budget tier).
   * @param {object} conditions
   * @returns {object[]}
   */
  findSimilarSessions(conditions) {
    return this.sessions
      .map(s => ({ session: s, similarity: this._conditionSimilarity(conditions, s.directingDecisions || s.conditions || {}) }))
      .filter(({ similarity }) => similarity >= 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .map(({ session }) => session);
  }

  _conditionSimilarity(a, b) {
    if (!a || !b) return 0;
    let matches = 0, total = 0;
    const exact = ['genre', 'style', 'cameraAngle', 'lighting', 'editingPace'];
    for (const f of exact) {
      if (a[f] !== undefined || b[f] !== undefined) {
        total++;
        if (a[f] === b[f]) matches++;
      }
    }
    const numeric = [
      { key: 'budget', tolerance: 500000 },
      { key: 'duration', tolerance: 30 },
    ];
    for (const { key, tolerance } of numeric) {
      if (a[key] !== undefined && b[key] !== undefined) {
        total++;
        if (Math.abs(a[key] - b[key]) <= tolerance) matches++;
      }
    }
    return total > 0 ? matches / total : 0;
  }

  /**
   * Evaluate a session against all history.
   * @param {object} session
   * @returns {object}
   */
  evaluate(session) {
    const score = this.scoreSession(session);
    const similar = this.findSimilarSessions(session.directingDecisions || session.conditions || {});
    const scored = similar.map(s => ({ session: s, score: this.scoreSession(s) }));
    scored.push({ session, score });

    const rank = scored.filter(s => s.score > score).length + 1;

    // Compare directing approaches
    const approachStats = {};
    for (const s of scored) {
      const style = s.session.directingDecisions?.style || 'unknown';
      if (!approachStats[style]) approachStats[style] = { scores: [], count: 0 };
      approachStats[style].scores.push(s.score);
      approachStats[style].count++;
    }

    const approachRanking = {};
    let bestApproach = 'unknown';
    let bestAvg = 0;
    for (const [style, stats] of Object.entries(approachStats)) {
      const avg = stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
      approachRanking[style] = { avgScore: avg, count: stats.count };
      if (avg > bestAvg) { bestAvg = avg; bestApproach = style; }
    }

    // Generate insights
    const insights = this._generateInsights(scored, approachStats);

    return {
      sessionScore: score,
      rank,
      totalCompared: scored.length,
      bestApproach,
      approachRanking,
      insights,
    };
  }

  _generateInsights(scored, approachStats) {
    const insights = [];
    if (scored.length < 3) return insights;

    // Compare genres
    const genreGroups = {};
    for (const s of scored) {
      const genre = s.session.directingDecisions?.genre || 'unknown';
      if (!genreGroups[genre]) genreGroups[genre] = [];
      genreGroups[genre].push(s.score);
    }

    for (const [genre, scores] of Object.entries(genreGroups)) {
      if (scores.length < 2) continue;
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg > 0.7) insights.push(`${genre} films average ${Math.round(avg * 100)}% quality score`);
    }

    // Compare approaches
    const sorted = Object.entries(approachStats).sort((a, b) => {
      const avgA = a[1].scores.reduce((x, y) => x + y, 0) / a[1].scores.length;
      const avgB = b[1].scores.reduce((x, y) => x + y, 0) / b[1].scores.length;
      return avgB - avgA;
    });
    if (sorted.length >= 2) {
      const [best, worst] = [sorted[0], sorted[sorted.length - 1]];
      const avgBest = best[1].scores.reduce((a, b) => a + b, 0) / best[1].scores.length;
      const avgWorst = worst[1].scores.reduce((a, b) => a + b, 0) / worst[1].scores.length;
      if (avgBest / Math.max(0.01, avgWorst) >= 1.2) { // lowered from 1.3
        insights.push(`"${best[0]}" directing style outperforms "${worst[0]}" by ${((avgBest / avgWorst - 1) * 100).toFixed(0)}%`);
      }
      // Always report best approach when we have enough data
      if (best[1].scores.length >= 3) {
        insights.push(`Best approach: "${sorted[0][0]}" with avg ${(avgBest * 100).toFixed(0)}% quality (${sorted[0][1].scores.length} sessions)`);
      }
    }

    return insights.slice(0, 10);
  }

  /**
   * Get the best directing approach for given conditions.
   * @param {object} conditions
   * @returns {string|null}
   */
  getBestApproach(conditions) {
    const similar = this.findSimilarSessions(conditions);
    if (similar.length < 3) return null;

    const scores = similar.map(s => ({ style: s.directingDecisions?.style, score: this.scoreSession(s) }))
      .filter(s => s.style);

    if (scores.length === 0) return null;

    const byStyle = {};
    for (const s of scores) {
      if (!byStyle[s.style]) byStyle[s.style] = [];
      byStyle[s.style].push(s.score);
    }

    let best = null, bestAvg = 0;
    for (const [style, arr] of Object.entries(byStyle)) {
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      if (avg > bestAvg) { bestAvg = avg; best = style; }
    }
    return best;
  }
}

export default DirectingEvaluator;
