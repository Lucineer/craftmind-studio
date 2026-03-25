/**
 * @module audio
 * Audio pipeline — ElevenLabs TTS for character dialogue, background music, and SFX.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const ELEVENLABS_API = 'https://api.elevenlabs.io/v1';

/**
 * @typedef {object} VoiceConfig
 * @property {string} voiceId    — ElevenLabs voice ID
 * @property {number} stability  — Voice stability (0-1)
 * @property {number} similarity — Similarity boost (0-1)
 * @property {string} modelId    — TTS model (default "eleven_multilingual_v2")
 */

// ── Text-to-Speech ─────────────────────────────────────────────────────

/**
 * Generate speech audio for a line of dialogue using ElevenLabs.
 *
 * @param {string} text           — The dialogue text
 * @param {VoiceConfig} voiceCfg  — Voice configuration
 * @param {string} outputPath     — Where to save the audio file (.mp3)
 * @param {object} [opts]
 * @param {string} [opts.emotion] — Optional emotion tag to influence delivery
 * @returns {Promise<string>}     — The output file path
 */
export async function synthesizeDialogue(text, voiceCfg, outputPath, opts = {}) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY environment variable is required');

  const modelId = voiceCfg.modelId || 'eleven_multilingual_v2';

  const body = {
    text,
    model_id: modelId,
    voice_settings: {
      stability: voiceCfg.stability ?? 0.5,
      similarity_boost: voiceCfg.similarity ?? 0.75,
    },
  };

  // Add emotion as a prefix hint (some models support style instructions)
  if (opts.emotion) {
    body.text = `[${opts.emotion}] ${text}`;
  }

  const res = await fetch(`${ELEVENLABS_API}/text-to-speech/${voiceCfg.voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ElevenLabs TTS ${res.status}: ${errText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  await fs.writeFile(outputPath, Buffer.from(arrayBuffer));
  return outputPath;
}

/**
 * Synthesize all dialogue lines for a scene and return ordered audio paths.
 *
 * @param {{characterId: string, line: string, emotion: string}[]} dialogueLines
 * @param {Map<string, VoiceConfig>} voiceMap — characterId → VoiceConfig
 * @param {string} outputDir
 * @returns {Promise<{characterId: string, audioPath: string}[]>}
 */
export async function synthesizeScene(dialogueLines, voiceMap, outputDir) {
  await fs.mkdir(outputDir, { recursive: true });
  const results = [];

  for (let i = 0; i < dialogueLines.length; i++) {
    const line = dialogueLines[i];
    const voiceCfg = voiceMap.get(line.characterId);
    if (!voiceCfg) throw new Error(`No voice config for character "${line.characterId}"`);

    const filename = `${String(i).padStart(3, '0')}_${line.characterId}.mp3`;
    const audioPath = path.join(outputDir, filename);
    await synthesizeDialogue(line.line, voiceCfg, audioPath, { emotion: line.emotion });
    results.push({ characterId: line.characterId, audioPath });
  }

  return results;
}

// ── Music & SFX ────────────────────────────────────────────────────────

/**
 * Generate or retrieve background music for a scene.
 * Currently a stub — in production, integrate with ElevenLabs Music API
 * or Suno for generative music.
 *
 * @param {string} mood          — e.g. "tension", "triumph", "melancholy"
 * @param {number} durationSec   — Desired duration
 * @param {string} outputPath    — Where to save (.mp3)
 * @returns {Promise<string>}
 */
export async function generateMusic(mood, durationSec, outputPath) {
  // Stub: in production, call AI music generation API
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    // Generate a silent placeholder
    const { execSync } = await import('node:child_process');
    execSync(`ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=mono -t ${durationSec} -q:a 9 -acodec libmp3lame ${outputPath}`, { stdio: 'ignore' });
    return outputPath;
  }

  // ElevenLabs Music API integration point
  // TODO: Implement when ElevenLabs Music API is available
  const { execSync } = await import('node:child_process');
  execSync(`ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=mono -t ${durationSec} -q:a 9 -acodec libmp3lame ${outputPath}`, { stdio: 'ignore' });
  return outputPath;
}

/**
 * Apply a Minecraft-style sound effect from a local SFX library.
 *
 * @param {string} effectName — e.g. "explosion", "door_open", "ambient_cave"
 * @param {string} sfxDir     — Directory containing .ogg or .mp3 SFX files
 * @returns {Promise<string | null>} — Path to the SFX file, or null if not found
 */
export async function getSoundEffect(effectName, sfxDir) {
  const extensions = ['.mp3', '.ogg', '.wav'];
  for (const ext of extensions) {
    const candidate = path.join(sfxDir, `${effectName}${ext}`);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {}
  }
  return null;
}
