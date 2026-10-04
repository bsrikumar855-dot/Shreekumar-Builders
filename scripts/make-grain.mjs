/**
 * Generates public/textures/grain.png — a 96×96 tiling grain plate.
 *
 * The design system's film grain used to be an inline SVG `feTurbulence`
 * filter, which the browser has to re-rasterise for every `.grain` surface on
 * the page — expensive, and it delayed first paint. This produces a static
 * tile instead: rasterised once, cached, and cheap to repeat.
 *
 * Run: node scripts/make-grain.mjs
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const SIZE = 96;
const OUT = path.join(process.cwd(), "public", "textures", "grain.png");

/** Deterministic value noise so the tile is stable across builds. */
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0x5342);

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

/* Greyscale+alpha PNG: dark speckle, mostly transparent. */
const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1));
let p = 0;
for (let y = 0; y < SIZE; y++) {
  raw[p++] = 0; // filter: none
  for (let x = 0; x < SIZE; x++) {
    const n = rand();
    // Bias toward transparent, with a few darker grains.
    const v = n > 0.86 ? 0 : Math.round(40 + n * 90);
    const a = n > 0.86 ? Math.round(28 + rand() * 46) : 0;
    raw[p++] = v;
    raw[p++] = v;
    raw[p++] = v;
    raw[p++] = a;
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // colour type: RGBA
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, png);
console.log(`wrote ${OUT} — ${png.length} bytes, ${SIZE}×${SIZE}`);