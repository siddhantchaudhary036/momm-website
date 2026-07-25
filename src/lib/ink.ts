/**
 * Ballpoint.
 *
 * wobble.ts draws *closed* shapes — balloons, bursts, frames. Charts need
 * the other half of the vocabulary: open strokes that start somewhere and
 * stop somewhere, and a way to fill an area with a pen. A pen cannot fill.
 * It can only go back and forth across a region, and that fact is the
 * entire reason hatching reads as drawn where a flat `fill` reads as CSS.
 *
 * The hand modelled here is deliberately restrained: one weight, a wander
 * of a pixel or two, and a few px of overshoot where the stroke runs past
 * where it should have stopped. That last detail does more work than the
 * wobble does — a machine stops exactly on the corner, a person doesn't.
 * Crank `amp` past ~3 and this stops looking like a mother's notepad and
 * starts looking like a webcomic, which is a different and much worse site.
 *
 * Everything is seeded (see prng.ts) because it all runs on the server too.
 */
import { rngFrom } from "./prng";

export type Pt = { x: number; y: number };

export type PenOpts = {
  /** stable identity — same seed, same stroke, forever, on both sides of the wire */
  seed: string | number;
  /** peak wander off the true path, px. 1–2 is a biro; 5 is a cartoon. */
  amp?: number;
  /** how far the hand travels between wobbles, px */
  wavelength?: number;
  /** px the pen runs past each end */
  overshoot?: number;
};

const f = (n: number) => (Math.round(n * 10) / 10).toString();

/* ---------------------------------------------------------------- wander */

/**
 * Three sine harmonics at fixed *wavelengths* rather than fixed
 * frequencies. Wavelength is the property a hand actually has — the same
 * hand wobbles every ~170px whether the line is short or long — so a
 * 40px tally mark comes out nearly straight and a 900px axis develops a
 * lazy curve, from one set of numbers and with no per-caller tuning.
 */
const HARMONICS = [1, 2.3, 4.7];
const FALLOFF = [1, 0.38, 0.15];
const NORM = FALLOFF.reduce((a, b) => a + b, 0);

function wander(seed: string | number, wavelength: number) {
  const rand = rngFrom(seed);
  const phase = HARMONICS.map(() => rand() * Math.PI * 2);
  return (s: number) => {
    let v = 0;
    for (let i = 0; i < HARMONICS.length; i++) {
      v += FALLOFF[i] * Math.sin((2 * Math.PI * HARMONICS[i] * s) / wavelength + phase[i]);
    }
    return v / NORM;
  };
}

/* ---------------------------------------------------- open Catmull-Rom */

/** Open spline. wobble.ts's closedSpline wraps; an open stroke must not. */
function openSpline(pts: Pt[]): string {
  const n = pts.length;
  if (n < 2) return "";
  const at = (i: number) => pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f(pts[0].x)},${f(pts[0].y)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += `C${f(c1.x)},${f(c1.y)} ${f(c2.x)},${f(c2.y)} ${f(p2.x)},${f(p2.y)}`;
  }
  return d;
}

/** one sample per ~11px, which is where more points stop changing the curve */
function stepsFor(len: number) {
  return Math.max(2, Math.min(160, Math.round(len / 11)));
}

/* ----------------------------------------------------------- primitives */

/** A straight-ish line from a to b. */
export function inkLine(a: Pt, b: Pt, o: PenOpts): string {
  const { amp = 1.4, wavelength = 170, overshoot = 0 } = o;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  // normal, for pushing the stroke sideways
  const nx = -uy;
  const ny = ux;

  const rand = rngFrom(`${o.seed}:ends`);
  const head = overshoot * rand();
  const tail = overshoot * rand();
  const total = len + head + tail;
  const w = wander(o.seed, wavelength);

  const steps = stepsFor(total);
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const s = (i / steps) * total - head;
    const k = w(s) * amp;
    pts.push({ x: a.x + ux * s + nx * k, y: a.y + uy * s + ny * k });
  }
  return openSpline(pts);
}

/** A polyline through points — the line chart, the ruled edge, anything. */
export function inkPolyline(pts: Pt[], o: PenOpts): string {
  if (pts.length < 2) return "";
  const { amp = 1.4, wavelength = 170 } = o;

  // cumulative arc length, so the wander advances with distance travelled
  // rather than with index — otherwise dense corners wobble harder
  const seg: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    seg.push(seg[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  const total = seg[seg.length - 1] || 1;
  const w = wander(o.seed, wavelength);

  const at = (s: number): { p: Pt; n: Pt } => {
    let i = 1;
    while (i < seg.length - 1 && seg[i] < s) i++;
    const t = (s - seg[i - 1]) / (seg[i] - seg[i - 1] || 1);
    const a = pts[i - 1];
    const b = pts[i];
    const len = seg[i] - seg[i - 1] || 1;
    return {
      p: { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t },
      n: { x: -(b.y - a.y) / len, y: (b.x - a.x) / len },
    };
  };

  const steps = stepsFor(total);
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const s = (i / steps) * total;
    const { p, n } = at(s);
    const k = w(s) * amp;
    out.push({ x: p.x + n.x * k, y: p.y + n.y * k });
  }
  return openSpline(out);
}

/** An arc, wandering radially. Angles in radians, 0 = 3 o'clock. */
export function inkArc(
  cx: number,
  cy: number,
  r: number,
  a0: number,
  a1: number,
  o: PenOpts,
): string {
  const { amp = 1.4, wavelength = 170, overshoot = 0 } = o;
  const rand = rngFrom(`${o.seed}:ends`);
  const spanLen = Math.abs(a1 - a0) * r;
  // overshoot is an arc-length quantity everywhere else; convert
  const head = (overshoot * rand()) / r;
  const tail = (overshoot * rand()) / r;
  const w = wander(o.seed, wavelength);

  const steps = stepsFor(spanLen + overshoot * 2);
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = a0 - head + t * (a1 - a0 + head + tail);
    const rr = r + w((a - a0) * r) * amp;
    pts.push({ x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a) });
  }
  return openSpline(pts);
}

/**
 * A closed-ish rectangle drawn as four separate strokes.
 *
 * Four strokes rather than one path on purpose: a person lifts the pen at
 * the corners, and the tiny gaps and crossings that leaves are the whole
 * signature of a hand-ruled box. One continuous rounded path reads as a
 * `border`, which is what we're trying to get away from.
 */
export function inkRect(
  x: number,
  y: number,
  w: number,
  h: number,
  o: PenOpts,
): string[] {
  const c = { ...o, overshoot: o.overshoot ?? 2.5 };
  return [
    inkLine({ x, y }, { x: x + w, y }, { ...c, seed: `${o.seed}:t` }),
    inkLine({ x: x + w, y }, { x: x + w, y: y + h }, { ...c, seed: `${o.seed}:r` }),
    inkLine({ x: x + w, y: y + h }, { x, y: y + h }, { ...c, seed: `${o.seed}:b` }),
    inkLine({ x, y: y + h }, { x, y }, { ...c, seed: `${o.seed}:l` }),
  ];
}

/* -------------------------------------------------------------- hatching */

export type HatchOpts = PenOpts & {
  /** px between strokes. Tighter than ~4 turns to mud at small sizes. */
  spacing?: number;
  /** hatch direction in degrees; 45 is the natural angle for a right hand */
  angle?: number;
  /** lay a second pass at the mirrored angle — cross-hatch, for emphasis */
  cross?: boolean;
};

/**
 * Fill a rectangle by scribbling across it.
 *
 * Returns one `d` per stroke rather than a single path so each can be
 * drawn in independently — a region that hatches itself in stroke by
 * stroke is worth the extra nodes.
 *
 * The strokes deliberately run past the region: `overshoot` is doubled
 * here relative to a rule line, because that ragged edge is the only
 * thing distinguishing hatching from a striped background-image.
 */
export function hatchRect(
  x: number,
  y: number,
  w: number,
  h: number,
  o: HatchOpts,
): string[] {
  const { spacing = 5, angle = 45, cross = false } = o;
  const out = pass(angle, `${o.seed}:a`);
  if (cross) out.push(...pass(-angle, `${o.seed}:b`));
  return out;

  function pass(deg: number, seed: string): string[] {
    const th = (deg * Math.PI) / 180;
    const ux = Math.cos(th);
    const uy = Math.sin(th);
    const nx = -uy;
    const ny = ux;

    // project the corners onto the normal to find the band to sweep
    const corners: Pt[] = [
      { x, y },
      { x: x + w, y },
      { x, y: y + h },
      { x: x + w, y: y + h },
    ];
    const proj = corners.map((p) => p.x * nx + p.y * ny);
    const lo = Math.min(...proj);
    const hi = Math.max(...proj);

    const rand = rngFrom(seed);
    const lines: string[] = [];
    let i = 0;
    // start half a step in so the first stroke isn't welded to the edge
    for (let d = lo + spacing * 0.5; d < hi; d += spacing, i++) {
      const span = clipToRect(d, { ux, uy, nx, ny }, x, y, w, h);
      if (!span) continue;
      const [t0, t1] = span;
      if (t1 - t0 < 1.5) continue;
      const a = { x: nx * d + ux * t0, y: ny * d + uy * t0 };
      const b = { x: nx * d + ux * t1, y: ny * d + uy * t1 };
      lines.push(
        inkLine(a, b, {
          seed: `${seed}:${i}`,
          // a hatch stroke is fast and loose — it wanders more than a rule
          amp: o.amp ?? 1.1,
          wavelength: o.wavelength ?? 90,
          overshoot: (o.overshoot ?? 3) * (0.5 + rand()),
        }),
      );
    }
    return lines;
  }
}

/**
 * Where the line { p : p·n = d } enters and leaves the rect, as a range of
 * t along the direction vector. Standard slab clip; returns null if the
 * line misses (which happens at the corners of every sweep).
 */
function clipToRect(
  d: number,
  v: { ux: number; uy: number; nx: number; ny: number },
  x: number,
  y: number,
  w: number,
  h: number,
): [number, number] | null {
  // a point on the line, and where it goes
  const px = v.nx * d;
  const py = v.ny * d;
  let t0 = -Infinity;
  let t1 = Infinity;

  for (const [p, dir, lo, hi] of [
    [px, v.ux, x, x + w],
    [py, v.uy, y, y + h],
  ] as const) {
    if (Math.abs(dir) < 1e-9) {
      if (p < lo || p > hi) return null;
      continue;
    }
    const a = (lo - p) / dir;
    const b = (hi - p) / dir;
    t0 = Math.max(t0, Math.min(a, b));
    t1 = Math.min(t1, Math.max(a, b));
  }
  return t1 > t0 ? [t0, t1] : null;
}

/* ----------------------------------------------------------------- tally */

/**
 * The five-bar gate — four uprights and one struck through.
 *
 * This is what a person actually writes when they are counting something
 * and have run out of patience with it, which is the exact register the
 * reckoning wants. It also has a property no dot grid has: it is *already*
 * grouped in fives, so 144 of them can be read at a glance without a
 * single axis label.
 */
export function tallyGate(
  x: number,
  y: number,
  h: number,
  n: number,
  o: PenOpts & { pitch?: number },
): string[] {
  const { pitch = 7 } = o;
  const rand = rngFrom(`${o.seed}:gate`);
  const out: string[] = [];
  const bars = Math.min(n, 4);

  for (let i = 0; i < bars; i++) {
    // uprights lean a little, and not all the same way
    const lean = (rand() - 0.5) * 4;
    out.push(
      inkLine({ x: x + i * pitch + lean, y }, { x: x + i * pitch - lean, y: y + h }, {
        seed: `${o.seed}:${i}`,
        amp: o.amp ?? 0.9,
        wavelength: o.wavelength ?? 60,
        overshoot: o.overshoot ?? 1.5,
      }),
    );
  }

  if (n >= 5) {
    // the strike runs past both ends — that's how you know it's a five
    out.push(
      inkLine(
        { x: x - pitch * 0.45, y: y + h * 0.78 },
        { x: x + pitch * 3.45, y: y + h * 0.22 },
        {
          seed: `${o.seed}:strike`,
          amp: o.amp ?? 1.1,
          wavelength: 120,
          overshoot: 2.5,
        },
      ),
    );
  }
  return out;
}

/** how many strokes a gate of `n` costs — 4 uprights + the strike */
export const gateStrokes = (n: number) => Math.min(n, 4) + (n >= 5 ? 1 : 0);

/* ------------------------------------------------------------ annotation */

/**
 * The arrow that points from a margin note at the thing it's about.
 *
 * Annotation is the cheapest thing that makes a page of data look
 * *authored* rather than generated — someone went back over it and had
 * opinions. Two strokes: the shaft, and a single V for the head, because
 * a filled triangle is a diagram and a V is a pen.
 */
export function inkArrow(from: Pt, to: Pt, o: PenOpts & { curve?: number }): string[] {
  const { curve = 0.22 } = o;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  const lean = (rngFrom(`${o.seed}:lean`)() - 0.5) * 0.6 + 1;

  const mid = {
    x: from.x + dx * 0.5 + px * curve * len * lean,
    y: from.y + dy * 0.5 + py * curve * len * lean,
  };
  const shaft = inkPolyline([from, mid, to], {
    seed: `${o.seed}:shaft`,
    amp: o.amp ?? 1.2,
    wavelength: o.wavelength ?? 200,
  });

  // the head takes its bearing from the approach, not from the straight line
  const a = Math.atan2(to.y - mid.y, to.x - mid.x);
  const head = Math.min(13, len * 0.22);
  const wing = (s: number) => ({
    x: to.x - head * Math.cos(a + s),
    y: to.y - head * Math.sin(a + s),
  });

  return [
    shaft,
    inkPolyline([wing(0.42), to, wing(-0.42)], {
      seed: `${o.seed}:head`,
      amp: 0.7,
      wavelength: 40,
    }),
  ];
}

/**
 * A ring scrawled round something that matters. Two laps, because nobody
 * circles a number once.
 */
export function inkCircleAround(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  o: PenOpts,
): string[] {
  const rand = rngFrom(`${o.seed}:laps`);
  return [0, 1].map((i) => {
    /**
     * The two laps have to *disagree*. At a few per cent apart they land
     * on top of each other and the pair renders as one clean ellipse —
     * which is worse than drawing a clean ellipse on purpose, because it
     * costs two paths to look machine-made. Eighteen per cent is where
     * the second lap reads as a second pass by the same hand.
     */
    const k = 1 + (rand() - 0.5) * 0.18;
    // each lap starts and ends somewhere different, and overshoots the close
    const a0 = -1.9 + rand() * 0.9;
    const a1 = a0 + Math.PI * 2 + 0.3 + rand() * 0.5;
    const steps = 64;
    const pts: Pt[] = [];
    const w = wander(`${o.seed}:${i}`, o.wavelength ?? 220);
    for (let s = 0; s <= steps; s++) {
      const a = a0 + (s / steps) * (a1 - a0);
      const d = w(a * ((rx + ry) / 2)) * (o.amp ?? 2);
      pts.push({
        x: cx + (rx * k + d) * Math.cos(a),
        y: cy + (ry * k + d) * Math.sin(a),
      });
    }
    return openSpline(pts);
  });
}
