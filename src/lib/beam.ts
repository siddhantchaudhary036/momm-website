/**
 * The doorway — one light source for the whole opening screen.
 *
 * The kitchen is drawn, not lit. There is no gradient here and no blur:
 * a shaft of light in pen is a fan of ruled strokes and a drift of stipple,
 * denser at the mouth, thinning as it travels, and that is the entire
 * technique. It's the same hand that draws the torn edges and the tally
 * marks, working white-on-black instead of ink-on-cream — which is what a
 * scratchboard is, and why this reads as her world rather than as a
 * lighting rig someone bolted to the front of it.
 *
 * Everything below is geometry only, so it can be shared. The SVG draws the
 * rays and the stipple; the mote canvas asks {@link intensity} whether a
 * speck it's about to draw is standing in the light. One definition, or the
 * dust glows in places the beam never reaches — which is the single most
 * obvious way an effect like this falls apart.
 *
 * TWO FRAMES, because one cannot work. The scene is drawn at a fixed size
 * and *cropped* to the viewport — never stretched, since a hand-drawn stroke
 * scaled 1.4× in x and 0.9× in y stops looking like a pen and starts looking
 * like a pen someone sat on. But a desktop window is about 1.8 wide-to-tall
 * and a phone is about 0.46, and cropping a single wide drawing to a phone
 * throws away everything except a vertical strip up the middle — which is
 * the one part of this composition with nothing in it. So there are two
 * compositions and the right one is shown, which is also a chance to draw
 * far less on the device that can resolve far less.
 */
import type { Pt } from "./ink";
import { rngFrom } from "./prng";

/** trim a value to `dp` decimals — see the note in `stipple` on why */
const round = (n: number, dp: number) => {
  const k = 10 ** dp;
  return Math.round(n * k) / k;
};

export type Frame = {
  /** the drawing's own coordinate space */
  vb: { w: number; h: number };
  /** where the light comes from — a door standing open, off past the corner */
  source: Pt;
  /** the beam's axis in radians, and half its angular spread */
  axis: number;
  spread: number;
  /**
   * How far the light carries, in viewBox units.
   *
   * Generous — larger than the frame's diagonal on purpose. The falloff is
   * squared, so a reach that only just spans the viewport spends most of its
   * length already dim and the beam collapses into a bright smear near the
   * source with scratches trailing off it.
   */
  reach: number;
  rays: number;
  specks: number;
};

/**
 * Desktop. The whole appliance is in shot, so the light has to cover its
 * full height — hence a source pulled well back *above* the frame rather
 * than level with the middle of it. A source level with the middle throws a
 * beam that only ever finds the lower half, and the fridge emerges from the
 * waist down with its top half left as a floating outline: two unrelated
 * things, a patch of light and a drawn box, instead of one object being lit.
 */
export const WIDE: Frame = {
  vb: { w: 1600, h: 1000 },
  source: { x: -120, y: -420 },
  axis: 1.02,
  spread: 0.32,
  reach: 2800,
  rays: 15,
  specks: 320,
};

/**
 * Phone. You are much closer to the door — the note alone is 84vw — so the
 * appliance's edges and handles are off-frame and there is no point drawing
 * them. What's left is what you'd actually see standing this close: the shut
 * line between freezer and fridge, the light coming in past you, and the
 * dust in it. Fewer strokes, and every one of them lands.
 */
export const TALL: Frame = {
  vb: { w: 800, h: 1400 },
  source: { x: -40, y: -400 },
  /**
   * Steeper than the desktop beam, and that's forced by the aspect ratio
   * rather than chosen. A shaft raked at the desktop angle crosses a 0.46
   * frame and is out of the right-hand edge before it has passed the note,
   * which leaves the bottom half of a phone screen with nothing in it. Near
   * enough to vertical and the same fan travels the whole height.
   */
  axis: 1.2,
  spread: 0.26,
  /**
   * Longer than the desktop reach in absolute terms because a phone frame is
   * 1400 units tall against the desktop's 1000, and the squared falloff was
   * spending itself before the light got past the note — leaving the bottom
   * third of the screen empty, which is the most valuable third on a phone.
   */
  reach: 3200,
  rays: 16,
  specks: 260,
};

/** a hallway bulb at 1am — tungsten, not daylight */
export const WARM = "255, 214, 164";

/**
 * How lit a point is: 0 outside the beam, 1 at the mouth of it.
 *
 * Falls off as the square of distance, and as the square of the angle off
 * axis. Neither is physics — it's what makes the edge of the beam soft
 * without a blur filter, which is the whole trick, since a blurred anything
 * would break the drawn look this scene is built on.
 */
export function intensity(f: Frame, x: number, y: number): number {
  const dx = x - f.source.x;
  const dy = y - f.source.y;
  const t = Math.hypot(dx, dy);
  if (t < 1) return 1;

  let off = Math.atan2(dy, dx) - f.axis;
  while (off > Math.PI) off -= Math.PI * 2;
  while (off < -Math.PI) off += Math.PI * 2;

  const across = Math.max(0, 1 - (off / f.spread) ** 2);
  const along = Math.max(0, 1 - t / f.reach);
  return across * along * along;
}

/* -------------------------------------------------------------- the rays */

export type Ray = {
  a: Pt;
  b: Pt;
  seed: string;
  /** per-stroke variation, multiplied into the light it's standing in */
  strength: number;
  width: number;
};

/**
 * The fan of strokes that *is* the light.
 *
 * Two details carry it, and both are about refusing to be even. The rays are
 * jittered off their nominal spacing, because a fan of exactly-spaced lines
 * is a starburst from a clip-art library. And they start and stop at wildly
 * different depths — a bundle of strokes that all begin and end together
 * reads as a paper doily, where a bundle that frays out reads as light
 * running out of room.
 */
export function rays(f: Frame, seed: string): Ray[] {
  const rand = rngFrom(`${seed}:rays`);
  const out: Ray[] = [];

  for (let i = 0; i < f.rays; i++) {
    const u = (i + 0.5) / f.rays + (rand() - 0.5) * (0.9 / f.rays);
    const off = (u - 0.5) * 2;
    const ang = f.axis + off * f.spread;

    // well clear of the source: strokes converging on a visible point make
    // the light a lamp in shot, and the door is supposed to be off-screen
    const t0 = 190 + rand() * 320;
    const t1 = t0 + f.reach * (0.2 + rand() * 0.74);

    out.push({
      a: { x: f.source.x + Math.cos(ang) * t0, y: f.source.y + Math.sin(ang) * t0 },
      b: { x: f.source.x + Math.cos(ang) * t1, y: f.source.y + Math.sin(ang) * t1 },
      seed: `${seed}:ray:${i}`,
      /**
       * Per-stroke variation only — the *absolute* brightness of any piece
       * of this ray comes from `intensity()` at that piece, exactly like
       * every other stroke in the room.
       *
       * Which is the whole lesson of the first pass: a ray at one opacity
       * from end to end is a wire. Light has to run out, and a bundle of
       * strokes that don't is a hairbrush.
       */
      strength: 0.55 + rand() * 0.7,
      width: 0.8 + rand() * 1.5,
    });
  }
  return out;
}

/* ----------------------------------------------------------- the stipple */

export type Speck = { x: number; y: number; r: number; opacity: number };

/**
 * Dots, laid down where the light is.
 *
 * Rejection-sampled against {@link intensity} rather than scattered evenly
 * and faded: a dot that is *absent* outside the beam and *crowded* inside it
 * is how a pen renders illumination, and it's the reason this layer reads as
 * brightness instead of as noise. The grain layer is the noise; this is the
 * light. Keeping them separate is what stops the screen turning to mud.
 */
export function stipple(f: Frame, seed: string): Speck[] {
  const rand = rngFrom(`${seed}:stipple`);
  const out: Speck[] = [];

  // bounded: rejection sampling against a narrow beam can otherwise spin for
  // a long time on an unlucky seed, and this runs during a server render
  let guard = 0;
  while (out.length < f.specks && guard++ < f.specks * 40) {
    const x = f.source.x + rand() * (f.vb.w + 520);
    const y = f.source.y + rand() * (f.vb.h + 460);
    const lit = intensity(f, x, y);
    if (lit < 0.03 || rand() > lit * 1.3) continue;
    /**
     * Rounded, and it matters more than it looks. These land in the markup
     * as raw attributes, and a full float64 mantissa
     * (`cx="767.0407303329557"`) is maximum-entropy text — it doesn't just
     * cost its own characters, it defeats gzip across the whole run of ~580
     * circles. Two decimal places of a sub-pixel speck are invisible and
     * cut the compressed size of this layer by about three quarters.
     * `lib/ink.ts` rounds its path data for the same reason.
     */
    out.push({
      x: round(x, 1),
      y: round(y, 1),
      r: round(0.7 + rand() * 1.8, 2),
      opacity: round(0.07 + lit * 0.75 * rand(), 3),
    });
  }
  return out;
}

/* ------------------------------------------------------- canvas ↔ drawing */

/**
 * Viewport pixels → drawing coordinates, matching `xMidYMid slice` exactly.
 *
 * The mote canvas is sized in device pixels and the beam is defined in
 * viewBox units, so without this the dust drifts through a beam that is
 * somewhere else on screen. `slice` scales by the *larger* ratio and centres
 * the overflow, which is the arithmetic reproduced here.
 */
export function toViewBox(f: Frame, px: number, py: number, vw: number, vh: number): Pt {
  const s = Math.max(vw / f.vb.w, vh / f.vb.h);
  return {
    x: (px - (vw - f.vb.w * s) / 2) / s,
    y: (py - (vh - f.vb.h * s) / 2) / s,
  };
}

/**
 * Which composition is on screen.
 *
 * Expressed as the media query itself rather than as a pixel number,
 * because the other half of this decision is Tailwind's `md:` — and in
 * Tailwind v4 that is `48rem`, not `768px`. Against a browser whose default
 * font size isn't 16px (an accessibility setting, not an exotic one) a
 * `innerWidth >= 768` test and a `md:` class disagree, which puts the mote
 * canvas on one frame while the CSS is showing the other: dust glowing
 * where there is no beam, and a beam with no dust in it.
 *
 * Same string, same units, one decision.
 */
export const WIDE_QUERY = "(min-width: 48rem)";
