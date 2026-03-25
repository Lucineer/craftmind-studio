/**
 * @module renderer
 * Video pipeline — stitches screenshots into video using ffmpeg.
 * Handles frame rate, resolution, audio mixdown, and encoding.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs/promises';

/**
 * @typedef {object} RenderConfig
 * @property {number}  fps       — Output frame rate (default 24)
 * @property {number}  width     — Output width in pixels (default 1920)
 * @property {number}  height    — Output height in pixels (default 1080)
 * @property {string}  codec     — Video codec (default "libx264")
 * @property {string}  preset    — Encoding preset (default "medium")
 * @property {number}  crf       — Constant Rate Factor quality (default 18)
 * @property {string}  [audioFile] — Optional audio track to mux in
 */

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Render a sequence of image frames into a video file.
 *
 * @param {string[]} frames     — Ordered paths to PNG frames
 * @param {string}   outputPath — Output video file path (.mp4)
 * @param {RenderConfig} [config]
 * @param {Function} [onProgress] — Called with (percent: number)
 * @returns {Promise<string>} — The output file path
 */
export async function renderVideo(frames, outputPath, config = {}, onProgress) {
  const cfg = {
    fps: 24, width: 1920, height: 1080,
    codec: 'libx264', preset: 'medium', crf: 18,
    ...config,
  };

  if (frames.length === 0) throw new Error('No frames provided');

  // ffmpeg expects a pattern: %06d.png from an image sequence directory.
  // We write a concat-style approach or symlink frames to a temp dir.
  const workDir = path.dirname(outputPath);
  const framesDir = path.join(workDir, '_render_frames');
  await fs.mkdir(framesDir, { recursive: true });

  // Symlink frames sequentially
  for (let i = 0; i < frames.length; i++) {
    const padded = String(i + 1).padStart(6, '0');
    const link = path.join(framesDir, `frame_${padded}.png`);
    try { await fs.unlink(link); } catch {}
    await fs.symlink(path.resolve(frames[i]), link);
  }

  const args = [
    '-y',
    '-framerate', String(cfg.fps),
    '-i', path.join(framesDir, 'frame_%06d.png'),
    '-c:v', cfg.codec,
    '-preset', cfg.preset,
    '-crf', String(cfg.crf),
    '-pix_fmt', 'yuv420p',
    '-vf', `scale=${cfg.width}:${cfg.height}:force_original_aspect_ratio=decrease,pad=${cfg.width}:${cfg.height}:(ow-iw)/2:(oh-ih)/2`,
  ];

  if (cfg.audioFile) {
    args.push('-i', cfg.audioFile, '-c:a', 'aac', '-b:a', '192k', '-shortest');
  }

  args.push(outputPath);

  await runFFmpeg(args, onProgress);

  // Cleanup
  await fs.rm(framesDir, { recursive: true, force: true });

  return outputPath;
}

/**
 * Add an audio track to an existing video.
 *
 * @param {string} videoPath
 * @param {string} audioPath
 * @param {string} outputPath
 * @returns {Promise<string>}
 */
export async function muxAudio(videoPath, audioPath, outputPath) {
  const args = [
    '-y',
    '-i', videoPath,
    '-i', audioPath,
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    outputPath,
  ];
  await runFFmpeg(args);
  return outputPath;
}

/**
 * Concatenate multiple video clips into one.
 *
 * @param {string[]} clipPaths
 * @param {string} outputPath
 * @param {object} [opts]
 * @param {string} [opts.transition="cut"] — "cut" | "fade" (fade adds 0.5s crossfade)
 * @returns {Promise<string>}
 */
export async function concatenateClips(clipPaths, outputPath, opts = {}) {
  // Use concat demuxer for clean concatenation
  const listFile = path.join(path.dirname(outputPath), '_concat_list.txt');
  const content = clipPaths.map(p => `file '${path.resolve(p)}'`).join('\n');
  await fs.writeFile(listFile, content);

  const args = [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', listFile,
    '-c', 'copy',
    outputPath,
  ];

  await runFFmpeg(args);
  await fs.unlink(listFile);
  return outputPath;
}

// ── Internal ───────────────────────────────────────────────────────────

/**
 * Run an ffmpeg child process and resolve when done.
 * @param {string[]} args
 * @param {Function} [onProgress]
 * @returns {Promise<void>}
 */
function runFFmpeg(args, onProgress) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });

    let stderr = '';
    proc.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      stderr += text;

      // Parse progress from ffmpeg stderr (e.g. "time=00:01:23.45")
      if (onProgress) {
        const timeMatch = stderr.match(/time=(\d+:\d+:\d+\.\d+)/);
        if (timeMatch) {
          const parts = timeMatch[1].split(':').map(Number);
          const seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
          onProgress(seconds);
        }
      }
    });

    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderr.slice(-500)}`));
    });

    proc.on('error', (err) => {
      reject(new Error(`ffmpeg spawn error: ${err.message}`));
    });
  });
}
