/**
 * @module timeline
 * Timeline Editor — represents a sequence of shots with metadata.
 * Can export as JSON timeline for downstream rendering.
 */

import fs from 'node:fs/promises';

/**
 * @typedef {object} Shot
 * @property {number}  sceneNumber
 * @property {string}  description
 * @property {string}  cameraAngle   — "wide" | "medium" | "close-up" | "over-shoulder" | "low-angle" | "high-angle" | "crane" | "dolly"
 * @property {number}  durationSec
 * @property {string}  dialogueHint
 * @property {string}  mood
 * @property {string[]} characters
 * @property {string}  transition    — "cut" | "fade" | "dissolve" | "match-cut"
 * @property {string}  beat          — Save the Cat beat name
 * @property {object}  [cameraPath]  — Keyframe data for complex camera moves
 * @property {number}  [startOffset] — Auto-calculated absolute offset in seconds
 */

/**
 * @typedef {object} Timeline
 * @property {string}  title
 * @property {Shot[]}  shots
 * @property {number}  totalDurationSec
 */

/**
 * Create a new empty Timeline.
 *
 * @param {string} title — Project or episode title
 * @returns {Timeline}
 */
export function createTimeline(title) {
  return { title, shots: [], totalDurationSec: 0 };
}

/**
 * Add a shot to the timeline. Start offset is auto-calculated.
 *
 * @param {Timeline} tl
 * @param {Shot} shot
 */
export function addShot(tl, shot) {
  shot.startOffset = tl.totalDurationSec;
  tl.shots.push(shot);
  tl.totalDurationSec += shot.durationSec;
}

/**
 * Insert a shot at a specific index.
 *
 * @param {Timeline} tl
 * @param {number} index
 * @param {Shot} shot
 */
export function insertShot(tl, index, shot) {
  tl.shots.splice(index, 0, shot);
  recalculateOffsets(tl);
}

/**
 * Remove a shot by index.
 *
 * @param {Timeline} tl
 * @param {number} index
 */
export function removeShot(tl, index) {
  tl.shots.splice(index, 1);
  recalculateOffsets(tl);
}

/**
 * Reorder shots by moving a shot from one index to another.
 *
 * @param {Timeline} tl
 * @param {number} fromIndex
 * @param {number} toIndex
 */
export function moveShot(tl, fromIndex, toIndex) {
  const [shot] = tl.shots.splice(fromIndex, 1);
  tl.shots.splice(toIndex, 0, shot);
  recalculateOffsets(tl);
}

/**
 * Get the shot that is playing at a given time offset.
 *
 * @param {Timeline} tl
 * @param {number} timeSec
 * @returns {Shot | undefined}
 */
export function getShotAt(tl, timeSec) {
  return tl.shots.find(s =>
    timeSec >= s.startOffset && timeSec < s.startOffset + s.durationSec
  );
}

/**
 * Export the timeline as a JSON file.
 *
 * @param {Timeline} tl
 * @param {string} filePath
 */
export async function exportJSON(tl, filePath) {
  await fs.writeFile(filePath, JSON.stringify(tl, null, 2));
}

/**
 * Import a timeline from a JSON file.
 *
 * @param {string} filePath
 * @returns {Promise<Timeline>}
 */
export async function importJSON(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Recalculate all shot start offsets (internal helper).
 * @param {Timeline} tl
 */
function recalculateOffsets(tl) {
  let offset = 0;
  for (const shot of tl.shots) {
    shot.startOffset = offset;
    offset += shot.durationSec;
  }
  tl.totalDurationSec = offset;
}
