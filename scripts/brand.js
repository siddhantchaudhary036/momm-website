/**
 * Brand pipeline — everything the site shows of the logo, generated from
 * the five 2000px originals in `public/momm-images/`. Originals are left
 * untouched; nothing here should ever be edited by hand.
 *
 *   src/app/favicon.ico        16/32/48 — the "M", which is the only part
 *   src/app/icon.png           256      of the wordmark still legible in a
 *   src/app/apple-icon.png     180      browser tab
 *   src/app/opengraph-image.jpg  1200x630 — the lockup and her, on paper
 *   public/brand/wordmark.webp        "Momm." alone, transparent
 *   public/brand/wordmark-lockup.webp "Momm." + the tagline, transparent
 *   public/brand/momm.webp            the figure, cut off her paper
 *
 * WHY TRANSPARENT. The originals are ink printed on a photograph of
 * paper, and the site is already paper — dropping a cream rectangle onto
 * cream leaves a rectangle, because no two photographs of paper are the
 * same cream. So the ink is lifted off its background here rather than at
 * render time, and the site's own fibre shows through the counters of the
 * letters, which is the whole point of a paper site.
 *
 *   npm run brand
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "public/momm-images");
const BRAND = path.join(ROOT, "public/brand");
const APP = path.join(ROOT, "src/app");

const src = (f) => path.join(SRC, f);

/**
 * Ink-bearing boxes inside the 2000² `logo.png`, measured off the pixels
 * themselves: the two text lines occupy rows 789–1092 and 1154–1259, and
 * the M runs from column 232 to 576. Generous on every side — `trim()`
 * takes the slack back off once the paper is gone, so these only have to
 * contain the ink, not hug it.
 */
const WORDMARK = { left: 232, top: 780, width: 1524, height: 320 };
const TAGLINE = { left: 232, top: 780, width: 1524, height: 490 };
const M_GLYPH = { left: 232, top: 789, width: 345, height: 304 };

/** how much of an icon's width the mark occupies — the rest is margin */
const ICON_FILL = 0.62;

// ── lifting ink off paper ───────────────────────────────────────────────

const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** mean colour of a raw RGB(A) buffer's border, i.e. the paper it's on */
function paperColour({ data, info }) {
  const { width: W, height: H, channels: C } = info;
  let r = 0, g = 0, b = 0, n = 0;
  const edge = 12;
  for (let y = 0; y < H; y++) {
    const rim = y < edge || y >= H - edge;
    for (let x = 0; x < W; x++) {
      if (!rim && x >= edge && x < W - edge) continue;
      const i = (y * W + x) * C;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      n++;
    }
  }
  return [r / n, g / n, b / n];
}

/**
 * Flat type → RGBA, ink kept, paper thrown away.
 *
 * The wordmark is one solid colour on one light ground, so coverage is
 * just how far a pixel fell from the paper toward the ink, and the ink
 * itself can be replaced with its own average. That keeps every
 * antialiased edge — the alternative, a hard luminance threshold, gives
 * you a logo with jagged serifs at any size above a favicon.
 */
async function inkToAlpha(input) {
  const raw = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data, info } = raw;
  const { width: W, height: H, channels: C } = info;
  const paper = paperColour(raw);
  const paperL = lum(...paper);

  // the ink's own colour: the mean of everything solidly darker than paper
  let r = 0, g = 0, b = 0, n = 0;
  let darkest = 255;
  for (let i = 0; i < data.length; i += C) {
    const l = lum(data[i], data[i + 1], data[i + 2]);
    if (l < darkest) darkest = l;
    if (l < paperL - 140) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      n++;
    }
  }
  const ink = n ? [r / n, g / n, b / n] : [58, 42, 61];
  const inkL = lum(...ink);

  const out = Buffer.alloc(W * H * 4);
  for (let p = 0, i = 0; p < W * H; p++, i += C) {
    const l = lum(data[i], data[i + 1], data[i + 2]);
    // paper is noisy: a few luminance points of fibre must stay at zero
    // alpha or the logo ships with a grey haze around it
    const a = (paperL - 4 - l) / (paperL - 4 - inkL);
    out[p * 4] = Math.round(ink[0]);
    out[p * 4 + 1] = Math.round(ink[1]);
    out[p * 4 + 2] = Math.round(ink[2]);
    out[p * 4 + 3] = Math.max(0, Math.min(255, Math.round(a * 255)));
  }
  return {
    image: sharp(out, { raw: { width: W, height: H, channels: 4 } }),
    ink: `#${ink.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`,
  };
}

/**
 * Illustration → RGBA. Coverage can't come from luminance here: her shirt
 * is white and her paper is nearly white, so anything that thresholds on
 * brightness punches a hole through her chest. What actually separates
 * figure from ground is *connectivity* — the background is the paper you
 * can reach from the edge of the frame without crossing a line — so this
 * floods inward from the border and keeps everything it never reached.
 */
async function cutout(input, tolerance = 26) {
  const raw = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data, info } = raw;
  const { width: W, height: H, channels: C } = info;
  const [pr, pg, pb] = paperColour(raw);

  const isPaper = (p) => {
    const i = p * C;
    return (
      Math.abs(data[i] - pr) < tolerance &&
      Math.abs(data[i + 1] - pg) < tolerance &&
      Math.abs(data[i + 2] - pb) < tolerance
    );
  };

  const bg = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let head = 0;
  let tail = 0;
  const push = (p) => {
    if (!bg[p] && isPaper(p)) {
      bg[p] = 1;
      queue[tail++] = p;
    }
  };
  for (let x = 0; x < W; x++) {
    push(x);
    push((H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    push(y * W);
    push(y * W + W - 1);
  }
  while (head < tail) {
    const p = queue[head++];
    const x = p % W;
    const y = (p / W) | 0;
    if (x > 0) push(p - 1);
    if (x < W - 1) push(p + 1);
    if (y > 0) push(p - W);
    if (y < H - 1) push(p + W);
  }

  /**
   * Then throw away everything that isn't her.
   *
   * What's left after the flood is the figure *plus* every fleck of dust
   * in the photographed paper, because a speck is not paper-coloured and
   * a speck in open space is not reachable from the frame's edge either.
   * A handful of stray dark pixels are invisible in the original and
   * ruinous once it's an asset: they're scattered corner to corner, so the
   * drawing's bounding box becomes the whole 2000² frame and she ships at
   * a tenth of the size she should be, adrift in her own padding.
   *
   * She is one drawing, so she is one connected run of pixels — the
   * largest one. Everything else is dust.
   */
  const seen = new Uint8Array(W * H);
  let best = null;
  let bestSize = 0;
  for (let s = 0; s < W * H; s++) {
    if (bg[s] || seen[s]) continue;
    const component = [];
    seen[s] = 1;
    queue[0] = s;
    head = 0;
    tail = 1;
    while (head < tail) {
      const p = queue[head++];
      component.push(p);
      const x = p % W;
      const y = (p / W) | 0;
      const step = (q) => {
        if (!bg[q] && !seen[q]) {
          seen[q] = 1;
          queue[tail++] = q;
        }
      };
      if (x > 0) step(p - 1);
      if (x < W - 1) step(p + 1);
      if (y > 0) step(p - W);
      if (y < H - 1) step(p + W);
    }
    if (component.length > bestSize) {
      bestSize = component.length;
      best = component;
    }
  }
  const keep = new Uint8Array(W * H);
  for (const p of best) keep[p] = 1;

  const out = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    const i = p * C;
    out[p * 4] = data[i];
    out[p * 4 + 1] = data[i + 1];
    out[p * 4 + 2] = data[i + 2];
    out[p * 4 + 3] = keep[p] ? 255 : 0;
  }
  // the flood leaves a hard 1px edge; a hair of blur on alpha alone gives
  // the outline back the antialiasing the original drawing had
  const soft = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .blur(0.8)
    .raw()
    .toBuffer();
  for (let p = 0; p < W * H; p++) out[p * 4 + 3] = soft[p * 4 + 3];

  /**
   * Cropped here rather than by `trim()`, which cannot do it: trim keys off
   * the top-left pixel, and every transparent pixel in this buffer still
   * carries the paper's own RGB — noisy fibre, no two alike — so it finds
   * no uniform border and hands back the frame it was given.
   */
  let x0 = W, x1 = 0, y0 = H, y1 = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (out[(y * W + x) * 4 + 3] > 2) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }

  return sharp(out, { raw: { width: W, height: H, channels: 4 } }).extract({
    left: x0,
    top: y0,
    width: x1 - x0 + 1,
    height: y1 - y0 + 1,
  });
}

// ── the icon ────────────────────────────────────────────────────────────

/**
 * One square, cut once at 1024 and resized down from there — the tab icon,
 * the home-screen icon and the .ico frames are all the same picture, so
 * they are all the same file scaled, never three separate crops that drift.
 *
 * Only the M survives the reduction. "Momm." set across 16 pixels is four
 * grey smudges; the M alone is still a slab serif at 16, and a wordmark's
 * initial standing in for the wordmark is how every serif brand has ever
 * done this.
 */
async function iconMaster() {
  const SIDE = 1024;
  const { image: glyph } = await inkToAlpha(
    await sharp(src("logo.png")).extract(M_GLYPH).toBuffer(),
  );
  const inner = Math.round(SIDE * ICON_FILL);
  const mark = await glyph.resize({ width: inner, height: inner, fit: "inside" }).png().toBuffer();
  const { width, height } = await sharp(mark).metadata();

  return sharp(src("background-square.png"))
    // off-centre so the icon's paper isn't the same square of fibre as the
    // open-graph card's, which would read as a repeat if they're ever seen
    // together
    .extract({ left: 240, top: 300, width: 1400, height: 1400 })
    .resize(SIDE, SIDE)
    .composite([
      {
        input: mark,
        left: Math.round((SIDE - width) / 2),
        // optical rather than geometric: the M has no descender, so a
        // mathematically centred one sits low
        top: Math.round((SIDE - height) / 2) - Math.round(SIDE * 0.012),
      },
    ])
    .png()
    .toBuffer();
}

/**
 * ICO container. sharp has no encoder for it, but the format is a six-byte
 * header, a sixteen-byte directory entry per frame and then the frames —
 * and since Vista a frame is allowed to be a whole PNG, so the PNGs sharp
 * already made can be dropped in whole.
 */
function ico(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(frames.length, 4);

  let offset = 6 + frames.length * 16;
  const dir = frames.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette size — 0, it's truecolour
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...dir, ...frames.map((f) => f.data)]);
}

// ── the card ────────────────────────────────────────────────────────────

/**
 * The open-graph card — the only frame of this site most people will ever
 * see, since it's what a link to it looks like in a message. So it is the
 * site in one still: her paper, the lockup, and her standing at the edge
 * of it with her arms folded.
 */
async function ogCard() {
  const W = 1200;
  const H = 630;

  const { image: lockup } = await inkToAlpha(
    await sharp(src("logo.png")).extract(TAGLINE).toBuffer(),
  );
  /** equal air down both edges — the type and the figure are the content */
  const MARGIN = 110;

  const type = await lockup.trim({ threshold: 6 }).resize({ width: 620 }).png().toBuffer();
  const typeMeta = await sharp(type).metadata();

  const figure = await (await cutout(src("logo-momm.png")))
    .resize({ height: 500 })
    .png()
    .toBuffer();
  const figMeta = await sharp(figure).metadata();

  return sharp(src("background-landscape.png"))
    .resize(W, H)
    .composite([
      {
        input: type,
        left: MARGIN,
        top: Math.round((H - typeMeta.height) / 2) - 18,
      },
      {
        // standing on the bottom edge rather than floating above the middle
        // of it, which is the difference between a figure in a room and a
        // sticker on a card
        input: figure,
        left: W - figMeta.width - MARGIN,
        top: H - figMeta.height - 50,
      },
    ])
    // paper grain is the worst case for PNG — the same card costs 1.3MB
    // lossless and 180kb at q88, on an image nobody sees above 600px wide
    .jpeg({ quality: 88, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toBuffer();
}

// ── the run ─────────────────────────────────────────────────────────────

const kb = (n) => `${(n / 1024).toFixed(0)}kb`;

(async () => {
  fs.mkdirSync(BRAND, { recursive: true });
  const wrote = [];
  const write = (file, buf) => {
    fs.writeFileSync(file, buf);
    wrote.push([path.relative(ROOT, file).replace(/\\/g, "/"), buf.length]);
  };

  // 1 — the wordmark, twice: the name for the page, the lockup for the card
  for (const [name, box] of [
    ["wordmark", WORDMARK],
    ["wordmark-lockup", TAGLINE],
  ]) {
    const { image, ink } = await inkToAlpha(
      await sharp(src("logo.png")).extract(box).toBuffer(),
    );
    const buf = await image
      .trim({ threshold: 6 })
      .resize({ width: 900, withoutEnlargement: true })
      .webp({ quality: 92, effort: 6, alphaQuality: 100 })
      .toBuffer();
    write(path.join(BRAND, `${name}.webp`), buf);
    if (name === "wordmark") console.log(`ink ${ink}`);
  }

  // 2 — her, off her paper, for anywhere the drawing is wanted whole
  write(
    path.join(BRAND, "momm.webp"),
    await (await cutout(src("logo-momm.png")))
      .resize({ width: 720, withoutEnlargement: true })
      .webp({ quality: 90, effort: 6 })
      .toBuffer(),
  );

  // 3 — the icons, all from one master
  const master = await iconMaster();
  const at = (size) => sharp(master).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

  write(path.join(APP, "icon.png"), await at(256));
  write(path.join(APP, "apple-icon.png"), await at(180));
  write(
    path.join(APP, "favicon.ico"),
    ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await at(size) })))),
  );

  // 4 — the card, and the same card for twitter (which won't read the og one
  //     when a twitter-specific tag is absent on some clients)
  const card = await ogCard();
  write(path.join(APP, "opengraph-image.jpg"), card);
  write(path.join(APP, "twitter-image.jpg"), card);

  const pad = Math.max(...wrote.map(([f]) => f.length));
  for (const [file, size] of wrote) console.log(`${file.padEnd(pad)}  ${kb(size).padStart(6)}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
