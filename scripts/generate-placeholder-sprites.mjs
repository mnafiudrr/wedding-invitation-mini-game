import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const CRC_TABLE = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function writePng(path, width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0))
  ]);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, png);
  console.log('wrote', path);
}

// --- pixel-art helpers ---
function blank(w, h) {
  return Buffer.alloc(w * h * 4);
}
function px(buf, w, x, y, hex) {
  if (x < 0 || y < 0 || x >= w) return;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const i = (y * w + x) * 4;
  buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
}
function rect(buf, w, x, y, rw, rh, hex) {
  for (let yy = y; yy < y + rh; yy++) for (let xx = x; xx < x + rw; xx++) px(buf, w, xx, yy, hex);
}

// 48x48 character, feet at bottom
const OUTLINE = '#333333';
const SKIN = '#ffd9b3';
const BRIDE_DRESS = '#ffb3ba';
const GROOM_SUIT = '#bae1ff';
const HAIR_BRIDE = '#8b5a2b';
const HAIR_GROOM = '#222222';

function drawCharacter(frameW, opts) {
  // opts: { facing: 'front'|'right', walkFrame: 0..5|null, dress, hair }
  const h = 48;
  const b = blank(frameW, h);
  const cx = Math.floor(frameW / 2);

  // legs (walk cycle alternates)
  if (opts.walkFrame === null) {
    rect(b, frameW, cx - 5, 38, 3, 9, OUTLINE); // standing
    rect(b, frameW, cx + 2, 38, 3, 9, OUTLINE);
  } else {
    const swing = [0, 2, 4, 0, -2, -4][opts.walkFrame];
    rect(b, frameW, cx - 5, 38, 3, 9 - Math.abs(swing), OUTLINE);
    rect(b, frameW, cx - 5 + (swing > 0 ? 2 : 0), 38, 3, 9, OUTLINE);
    rect(b, frameW, cx + 2, 38, 3, 9, OUTLINE);
    rect(b, frameW, cx + 2 + (swing < 0 ? -2 : 0), 38, 3, 9 - Math.abs(swing) / 2 | 0, OUTLINE);
  }

  // body / dress
  rect(b, frameW, cx - 7, 24, 14, 15, opts.dress);
  rect(b, frameW, cx - 7, 24, 14, 1, OUTLINE);
  if (opts.facing === 'front') {
    rect(b, frameW, cx - 9, 33, 18, 6, opts.dress); // skirt flare
    rect(b, frameW, cx - 9, 39, 18, 1, OUTLINE);
  }

  // arms
  rect(b, frameW, cx - 9, 26, 2, 8, SKIN);
  rect(b, frameW, cx + 7, 26, 2, 8, SKIN);

  // head
  rect(b, frameW, cx - 6, 10, 12, 12, SKIN);
  rect(b, frameW, cx - 6, 10, 12, 1, OUTLINE);
  rect(b, frameW, cx - 7, 11, 1, 10, OUTLINE);
  rect(b, frameW, cx + 6, 11, 1, 10, OUTLINE);

  // hair
  rect(b, frameW, cx - 6, 8, 12, 3, opts.hair);
  if (opts.facing === 'front') {
    rect(b, frameW, cx - 7, 10, 2, 6, opts.hair);
    rect(b, frameW, cx + 5, 10, 2, 6, opts.hair);
    // veil for bride front
    if (opts.dress === BRIDE_DRESS) rect(b, frameW, cx + 7, 12, 3, 16, '#ffffff');
  } else {
    rect(b, frameW, cx - 6, 10, 3, 4, opts.hair); // back of head hair (facing right)
  }

  // face
  if (opts.facing === 'front') {
    const eyeY = opts.blink ? 17 : 16;
    rect(b, frameW, cx - 3, eyeY, 2, 2, OUTLINE);
    rect(b, frameW, cx + 1, eyeY, 2, 2, OUTLINE);
    rect(b, frameW, cx - 1, 19, 2, 1, '#e58fa1'); // mouth
  } else {
    rect(b, frameW, cx + 2, 16, 2, 2, OUTLINE); // single visible eye
    rect(b, frameW, cx + 4, 19, 2, 1, '#e58fa1');
  }

  return b;
}

function concat(buffers) {
  return Buffer.concat(buffers);
}

const FRAME = 48;

for (const who of ['bride', 'groom']) {
  const dress = who === 'bride' ? BRIDE_DRESS : GROOM_SUIT;
  const hair = who === 'bride' ? HAIR_BRIDE : HAIR_GROOM;

  // front idle: 2 frames (open eyes / blink)
  const front = concat([drawCharacter(FRAME, { facing: 'front', walkFrame: null, dress, hair, blink: false }),
                        drawCharacter(FRAME, { facing: 'front', walkFrame: null, dress, hair, blink: true })]);
  writePng(join(root, `static/sprites/char-${who}-front.png`), FRAME * 2, FRAME, front);

  // right-facing walk: 6 frames
  const walkFrames = [];
  for (let f = 0; f < 6; f++) {
    walkFrames.push(drawCharacter(FRAME, { facing: 'right', walkFrame: f, dress, hair }));
  }
  writePng(join(root, `static/sprites/char-${who}-walk.png`), FRAME * 6, FRAME, concat(walkFrames));
}
console.log('done');
