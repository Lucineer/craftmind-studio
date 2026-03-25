/**
 * @module simulation
 * Simulation Orchestrator — manages Minecraft server instances, spawns bots as actors,
 * positions them for scenes, and captures screenshots via mineflayer-viewer.
 */

import { createBot } from 'mineflayer';
import path from 'node:path';
import fs from 'node:fs/promises';

/**
 * @typedef {object} SimConfig
 * @property {string} host          — MC server hostname
 * @property {number} port          — MC server port (default 25565)
 * @property {string} version       — MC version string
 * @property {string} screenshotDir — Directory for captured frames
 * @property {number} width         — Viewport width in pixels
 * @property {number} height        — Viewport height in pixels
 */

/**
 * @typedef {object} ActorBot
 * @property {string} id        — Character ID this bot represents
 * @property {object} bot       — mineflayer Bot instance
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {number} yaw
 * @property {number} pitch
 */

/** Active take ID for log prefixes. */
let activeTakeId = 'default';

// ── Bot Lifecycle ─────────────────────────────────────────────────────

/**
 * Spawn a bot actor on a Minecraft server.
 *
 * @param {string} characterId  — Used as both username and identifier
 * @param {SimConfig} config    — Server connection settings
 * @returns {Promise<ActorBot>}
 */
export async function spawnActor(characterId, config) {
  const bot = createBot({
    host: config.host,
    port: config.port,
    username: characterId,
    version: config.version,
  });

  // Wait until fully spawned in world
  await new Promise((resolve, reject) => {
    bot.once('spawn', resolve);
    bot.once('error', reject);
    setTimeout(() => reject(new Error('Spawn timeout')), 30_000);
  });

  const pos = bot.entity.position;

  return {
    id: characterId,
    bot,
    x: pos.x,
    y: pos.y,
    z: pos.z,
    yaw: bot.entity.yaw,
    pitch: bot.entity.pitch,
  };
}

/**
 * Disconnect and clean up an actor bot.
 * @param {ActorBot} actor
 */
export function despawnActor(actor) {
  actor.bot.quit();
}

// ── Positioning ───────────────────────────────────────────────────────

/**
 * Teleport an actor to specific coordinates.
 * Uses `/tp` command which works even without OP via vanilla mechanics.
 *
 * @param {ActorBot} actor
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} [yaw=0]
 * @param {number} [pitch=0]
 */
export async function positionActor(actor, x, y, z, yaw = 0, pitch = 0) {
  actor.bot.chat(`/tp ${actor.id} ${x} ${y} ${z} ${yaw} ${pitch}`);
  // Wait briefly for server to process
  await sleep(200);
  actor.x = x;
  actor.y = y;
  actor.z = z;
  actor.yaw = yaw;
  actor.pitch = pitch;
}

/**
 * Make an actor face toward a specific coordinate (used for looking at other actors).
 * @param {ActorBot} actor
 * @param {number} targetX
 * @param {number} targetY
 * @param {number} targetZ
 */
export function lookAt(actor, targetX, targetY, targetZ) {
  const dx = targetX - actor.x;
  const dy = targetY - actor.y;
  const dz = targetZ - actor.z;
  const yaw = Math.atan2(-dx, dz) * (180 / Math.PI);
  const pitch = -Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) * (180 / Math.PI);
  actor.bot.look(yaw, pitch, true);
  actor.yaw = yaw;
  actor.pitch = pitch;
}

// ── Screenshot Capture ────────────────────────────────────────────────

/**
 * Capture a screenshot from mineflayer-viewer at the current camera state.
 *
 * @param {object} viewerInstance — prismarine-viewer / mineflayer-viewer instance
 * @param {string} outputPath     — Full path to save the PNG
 * @returns {Promise<string>}     — The output path
 */
export async function captureFrame(viewerInstance, outputPath) {
  // mineflayer-viewer exposes a `viewer` property on the bot when attached.
  // For headless capture we render one frame to a canvas.
  // In production, use `viewer.renderer.domElement` to read pixels.
  //
  // This is the integration point — the viewer must be initialized with
  // `mineflayer-viewer` or `prismarine-viewer` in "none" view distance mode.
  //
  // Headless rendering via node-canvas or gl:
  if (viewerInstance?.renderer?.domElement) {
    // Browser-based: extract from canvas
    const canvas = viewerInstance.renderer.domElement;
    const buf = canvas.toBuffer('image/png');
    await fs.writeFile(outputPath, buf);
    return outputPath;
  }

  // Fallback: no-op stub (replace with headless GL implementation)
  await fs.writeFile(outputPath, Buffer.alloc(0));
  return outputPath;
}

/**
 * Record a sequence of frames for a scene.
 *
 * @param {object} viewerInstance
 * @param {SimConfig} config
 * @param {import('./timeline.js').Shot} shot
 * @param {Function} [onFrame] — Optional callback per frame: (frameIndex, path) => void
 * @returns {Promise<string[]>} — Array of screenshot file paths
 */
export async function recordScene(viewerInstance, config, shot, onFrame) {
  const dir = path.join(config.screenshotDir, activeTakeId, `scene-${shot.sceneNumber}`);
  await fs.mkdir(dir, { recursive: true });

  const fps = 24;
  const totalFrames = Math.ceil(shot.durationSec * fps);
  const framePaths = [];

  for (let i = 0; i < totalFrames; i++) {
    const padded = String(i).padStart(6, '0');
    const filePath = path.join(dir, `frame_${padded}.png`);
    await captureFrame(viewerInstance, filePath);
    framePaths.push(filePath);
    onFrame?.(i, filePath);
  }

  return framePaths;
}

// ── Take Management ───────────────────────────────────────────────────

/**
 * Set the active take ID (used for screenshot directory organization).
 * @param {string} takeId
 */
export function setActiveTake(takeId) {
  activeTakeId = takeId;
}

// ── Utilities ─────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
