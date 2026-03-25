// ═══════════════════════════════════════════════════════════════
// CraftMind Studio — Demo
// ═══════════════════════════════════════════════════════════════
//
// Standalone demo — no Minecraft server needed.
// Creates a timeline, registers characters, and shows the production pipeline.
// ═══════════════════════════════════════════════════════════════

import { createTimeline, addShot, getShotAt } from '../src/timeline.js';
import { checkDirectorBlock, getEraSuggestions } from '../src/director.js';
import { registerCharacter, getCharacter, listCharacters } from '../src/character.js';
import { ruleOfThirdsScore, calculateDOF } from '../src/composition.js';
import { renderVideo, concatenateClips } from '../src/renderer.js';

console.log(`
🎬 CraftMind Studio — AI Filmmaking Demo
══════════════════════════════════════════
`);

// Timeline creation
const tl = createTimeline('The Hero Rises — Demo Reel');
addShot(tl, { id: 's1', type: 'wide', duration: 3.0, description: 'Castle at dawn — establishing shot' });
addShot(tl, { id: 's2', type: 'medium', duration: 2.0, description: 'Knight prepares for battle' });
addShot(tl, { id: 's3', type: 'closeup', duration: 1.5, description: 'Fear in the knight\'s eyes' });
addShot(tl, { id: 's4', type: 'tracking', duration: 4.0, description: 'Charge toward the dragon' });
addShot(tl, { id: 's5', type: 'wide', duration: 3.0, description: 'Dragon looms over the valley' });

console.log('📋 Timeline:');
console.log(`   Title: ${tl.title}`);
console.log(`   Shots: ${tl.shots.length}`);
console.log(`   Duration: ${tl.totalDurationSec.toFixed(1)}s`);
for (const s of tl.shots) {
  console.log(`   [${s.id}] ${s.type.padEnd(10)} — ${s.description} (${s.duration}s)`);
}

// Shot at specific time
const at2s = getShotAt(tl, 2.0);
console.log(`\n🎥 Shot at 2.0s: "${at2s?.description ?? 'none'}"`);

// Director checks
console.log('\n🎤 Director System:');
const block = checkDirectorBlock('action', { era: 'medieval' });
console.log(`   Block check: ${block.blocked ? '❌ ' + block.reason : '✅ Clear to shoot'}`);

const suggestions = getEraSuggestions({ era: 'medieval' });
if (suggestions?.length) {
  console.log('   Era suggestions:');
  for (const s of suggestions) console.log(`     • ${s}`);
}

// Composition scoring
console.log('\n📐 Composition Engine:');
const score = ruleOfThirdsScore({ subjectX: 0.33, subjectY: 0.33, frameWidth: 1920, frameHeight: 1080 });
console.log(`   Rule of thirds score: ${typeof score === 'number' ? (score * 100).toFixed(1) + '%' : score}`);
const dof = calculateDOF(2.8, 5, 50);
console.log(`   DOF at f/2.8: ${typeof dof === 'number' ? dof.toFixed(2) + ' units' : JSON.stringify(dof)}`);

// Characters
console.log('\n🎭 Character System:');
registerCharacter({ id: 'hero', name: 'Sir Blockalot', role: 'protagonist', traits: ['brave'] });
registerCharacter({ id: 'dragon', name: 'Inferno', role: 'antagonist', traits: ['fierce'] });
console.log(`   Registered: ${listCharacters().map(c => c.name).join(', ')}`);
const hero = getCharacter('hero');
console.log(`   ${hero.name}: ${hero.role} [${hero.traits.join(', ')}]`);

console.log('\n✨ Demo complete! Run "npm run demo" for the full production pipeline.');
