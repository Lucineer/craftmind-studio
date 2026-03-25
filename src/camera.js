/**
 * @module camera
 * Camera system — smooth camera paths, orbit, follow, dolly, and crane movements.
 * Designed for mineflayer-viewer's camera control API.
 */

/**
 * @typedef {object} CameraKeyframe
 * @property {number} timeSec — Time offset from shot start
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {number} yaw   — Horizontal rotation in degrees
 * @property {number} pitch  — Vertical rotation in degrees
 * @property {string} [easing] — "linear" | "easeInOut" | "easeIn" | "easeOut"
 */

/**
 * @typedef {object} CameraMove
 * @property {CameraKeyframe[]} keyframes
 * @property {string} type — "orbit" | "follow" | "dolly" | "crane" | "custom"
 * @property {object} [target] — For follow/orbit: { id: string } (actor to track)
 */

// ── Easing Functions ──────────────────────────────────────────────────

/**
 * Interpolate between two values with easing.
 *
 * @param {number} a   — Start value
 * @param {number} b   — End value
 * @param {number} t   — Progress [0, 1]
 * @param {string} [easing="linear"]
 * @returns {number}
 */
export function ease(a, b, t, easing = 'linear') {
  switch (easing) {
    case 'easeIn':
      t = t * t;
      break;
    case 'easeOut':
      t = 1 - (1 - t) * (1 - t);
      break;
    case 'easeInOut':
      t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      break;
    default: // linear
      break;
  }
  return a + (b - a) * t;
}

// ── Path Generators ───────────────────────────────────────────────────

/**
 * Generate an orbit camera path around a center point.
 *
 * @param {object} center — { x, y, z }
 * @param {number} radius      — Distance from center
 * @param {number} heightOffset — Y offset above center
 * @param {number} durationSec  — Total orbit duration
 * @param {number} startAngleDeg — Starting angle in degrees (default 0)
 * @param {number} totalAngleDeg — How far to orbit (360 = full circle, default 180)
 * @param {string} [easing]     — Easing function name
 * @returns {CameraMove}
 */
export function orbitPath(center, radius, heightOffset, durationSec, startAngleDeg = 0, totalAngleDeg = 180, easing = 'linear') {
  const fps = 24;
  const totalFrames = Math.ceil(durationSec * fps);
  const keyframes = [];

  for (let i = 0; i <= totalFrames; i++) {
    const t = i / totalFrames;
    const angle = (startAngleDeg + ease(0, totalAngleDeg, t, easing)) * (Math.PI / 180);
    const x = center.x + Math.cos(angle) * radius;
    const z = center.z + Math.sin(angle) * radius;

    // Camera looks toward center (yaw toward center, pitch slightly down)
    const dx = center.x - x;
    const dz = center.z - z;
    const yaw = Math.atan2(-dx, dz) * (180 / Math.PI);
    const pitch = -Math.atan2(heightOffset, radius) * (180 / Math.PI);

    keyframes.push({
      timeSec: +(i / fps).toFixed(3),
      x: +x.toFixed(2),
      y: +(center.y + heightOffset).toFixed(2),
      z: +z.toFixed(2),
      yaw: +yaw.toFixed(2),
      pitch: +pitch.toFixed(2),
      easing,
    });
  }

  return { keyframes, type: 'orbit' };
}

/**
 * Generate a dolly (linear push-in or pull-out) camera path.
 *
 * @param {object} start  — { x, y, z }
 * @param {object} end    — { x, y, z }
 * @param {number} durationSec
 * @param {object} lookAt — Point the camera faces throughout: { x, y, z }
 * @param {string} [easing="easeInOut"]
 * @returns {CameraMove}
 */
export function dollyPath(start, end, durationSec, lookAt, easing = 'easeInOut') {
  const fps = 24;
  const totalFrames = Math.ceil(durationSec * fps);
  const keyframes = [];

  for (let i = 0; i <= totalFrames; i++) {
    const t = i / totalFrames;
    const x = ease(start.x, end.x, t, easing);
    const y = ease(start.y, end.y, t, easing);
    const z = ease(start.z, end.z, t, easing);

    const dx = lookAt.x - x;
    const dy = lookAt.y - y;
    const dz = lookAt.z - z;
    const yaw = Math.atan2(-dx, dz) * (180 / Math.PI);
    const pitch = -Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) * (180 / Math.PI);

    keyframes.push({
      timeSec: +(i / fps).toFixed(3),
      x: +x.toFixed(2),
      y: +y.toFixed(2),
      z: +z.toFixed(2),
      yaw: +yaw.toFixed(2),
      pitch: +pitch.toFixed(2),
      easing,
    });
  }

  return { keyframes, type: 'dolly' };
}

/**
 * Generate a crane (vertical rise/drop with optional lateral drift).
 *
 * @param {object} start     — { x, y, z }
 * @param {number} riseHeight — How far up/down to move
 * @param {number} durationSec
 * @param {object} lookAt    — Point to track
 * @param {string} [easing="easeInOut"]
 * @returns {CameraMove}
 */
export function cranePath(start, riseHeight, durationSec, lookAt, easing = 'easeInOut') {
  return dollyPath(
    start,
    { x: start.x, y: start.y + riseHeight, z: start.z },
    durationSec,
    lookAt,
    easing,
  );
}

/**
 * Get the interpolated camera state at a specific time.
 *
 * @param {CameraMove} move
 * @param {number} timeSec
 * @returns {{ x: number, y: number, z: number, yaw: number, pitch: number } | null}
 */
export function getStateAt(move, timeSec) {
  const kf = move.keyframes;
  if (kf.length === 0) return null;

  // Clamp to range
  if (timeSec <= kf[0].timeSec) return kf[0];
  if (timeSec >= kf[kf.length - 1].timeSec) return kf[kf.length - 1];

  // Find surrounding keyframes
  for (let i = 0; i < kf.length - 1; i++) {
    if (timeSec >= kf[i].timeSec && timeSec < kf[i + 1].timeSec) {
      const segDuration = kf[i + 1].timeSec - kf[i].timeSec;
      const t = segDuration > 0 ? (timeSec - kf[i].timeSec) / segDuration : 0;
      const easing = kf[i].easing || 'linear';

      return {
        x: ease(kf[i].x, kf[i + 1].x, t, easing),
        y: ease(kf[i].y, kf[i + 1].y, t, easing),
        z: ease(kf[i].z, kf[i + 1].z, t, easing),
        yaw: ease(kf[i].yaw, kf[i + 1].yaw, t, easing),
        pitch: ease(kf[i].pitch, kf[i + 1].pitch, t, easing),
      };
    }
  }

  return null;
}
