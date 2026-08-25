import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SR = 22050;

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(samples[i] * 32767))), i * 2);
  }
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SR, 24);
  header.writeUInt32LE(SR * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

const tone = (freq, dur, vol = 0.3, decay = true) => {
  const out = new Float32Array(Math.floor(SR * dur));
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    const env = decay ? 1 - i / out.length : 1;
    out[i] = Math.sin(2 * Math.PI * freq * t) * vol * env;
  }
  return out;
};

const silence = (dur) => new Float32Array(Math.floor(SR * dur));
const concat = (arrs) => {
  const total = arrs.reduce((s, a) => s + a.length, 0);
  const out = new Float32Array(total);
  let off = 0;
  for (const a of arrs) { out.set(a, off); off += a.length; }
  return out;
};

function write(name, samples) {
  const path = join(root, 'static/audio', name);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, wav(samples));
  console.log('wrote', path);
}

// UI select: rising two-tone blip
write('select.wav', concat([tone(660, 0.07), tone(880, 0.09)]));
// Modal open: soft chord
write('open.wav', concat([tone(523, 0.18, 0.22), tone(659, 0.18, 0.22), tone(784, 0.22, 0.22)]));
// Step: very short low click
write('step.wav', tone(160, 0.05, 0.25));
// BGM: simple 8s pastel arpeggio loop (C E G A), gentle
const notes = [261.6, 329.6, 392, 440, 392, 329.6];
const bgm = concat(notes.map((f) => tone(f, 1.2, 0.12, false)));
write('bgm.wav', bgm);
