import DustMotes from "./DustMotes";
import { inkLine, type PenOpts, type Pt } from "@/lib/ink";
import { hashString, rngFrom } from "@/lib/prng";
import {
  type Frame,
  intensity,
  rays,
  stipple,
  TALL,
  WARM,
  WIDE,
} from "@/lib/beam";
import { theme } from "@/theme";

/**
 * The kitchen, at 1am.
 *
 * This used to be a black div with grain on it, and that was the honest
 * description of the problem: the first screen wasn't a dark room, it was an
 * absence of one, and a note floating in an absence reads as a stamp on a
 * blank rather than a note on a fridge.
 *
 * So the room is drawn. A door is open somewhere off the top-left corner and
 * the light from the hallway falls across the appliance — which is the whole
 * story the site is telling, in one frame: it is the middle of the night,
 * somebody is up who shouldn't be, and there is a note waiting.
 *
 * DRAWN, NOT LIT. There is not a single blur or soft gradient in here. The
 * beam is a fan of hand-ruled strokes and a drift of stipple; the appliance
 * is six lines and a scribble. That's deliberate and it's the only version
 * that belongs to this site — a photographic shaft of light in a world where
 * every torn edge, tally mark and arrow is ballpoint would be the one object
 * on the page that came from somewhere else. White-on-black is just
 * ink-on-cream with the values inverted, which is what a scratchboard is.
 *
 * NOTHING IS DRAWN AT FULL STRENGTH. Every stroke's opacity comes from
 * `intensity()` at its own midpoint, floored at {@link AMBIENT}. The fridge
 * is therefore *revealed* by the doorway rather than outlined against the
 * wall: its near edge and lit face come up out of the dark, its far edge
 * stays at the floor and is barely there. If you can find where the fridge
 * ends without looking for it, GAIN is too high.
 *
 * The beam passes beside the note, never onto it. The note carries its own
 * light and stays the brightest thing on screen, because it's the subject
 * and this is only the room it's in.
 */

/**
 * The floor: what a stroke is worth with no light on it at all.
 *
 * Not zero. An appliance whose far side is *absent* isn't a dark room, it's
 * a half-drawn appliance — you need enough of the far edge to close the
 * shape, and then the beam decides how much of the rest you get.
 */
const AMBIENT = 0.085;
/** how hard the doorway writes onto a stroke it does reach */
const GAIN = 1.7;

/** the appliance, in WIDE coordinates — bottom deliberately runs off-frame */
const F = { x: 420, y: 96, w: 760, h: 1024 };
/** the seam between freezer and fridge, in the upper third of the door */
const SEAM = 322;
/** handles sit near the opening edge, which is the edge the doorway catches */
const HANDLE = { x: 480, w: 14 };

/**
 * Everything `inkLine` takes except the seed, plus the two lighting knobs.
 *
 * Derived from `PenOpts` rather than restated: when `step` was added to the
 * shared type, a hand-copied version of this needed the same edit or the
 * option would have silently type-checked and done nothing here. `Omit`
 * makes the next pen option available for free instead.
 */
type Pen = Omit<PenOpts, "seed"> & {
  ambient?: number;
  gain?: number;
};

/** named for what it is, so it doesn't read as the `Stroke` in `ink/Ink.tsx` */
type LitStroke = {
  id: string;
  d: string;
  a: Pt;
  b: Pt;
  stops: { at: number; o: number }[];
  width?: number;
};

/**
 * Generic rather than `LitStroke`-specific: the ray pass filters an array of
 * `LitStroke & { width: number }`, and a guard narrowing to plain `LitStroke`
 * fails `filter`'s `S extends T` constraint (the mapped `width` is required,
 * the field on `LitStroke` optional) — so TypeScript silently drops to the
 * non-narrowing overload and every use site stays nullable.
 */
const notNull = <T,>(v: T | null): v is T => v !== null;

/** how many places along a stroke the beam is asked about */
const SAMPLES = 6;

/**
 * One stroke, carrying the light along its own length as a gradient.
 *
 * This is the single rule the whole room is built on. A stroke can only
 * carry one opacity, and one opacity from end to end is exactly what makes
 * an edge read as an *outline* — a line someone drew — instead of as an edge
 * that happens to be catching light. Varying it along the stroke is what
 * turns a wireframe into an object standing in a room, and a bundle of
 * parallel lines into a shaft of light.
 *
 * The first version got this right and paid for it absurdly: it chopped
 * every stroke into a dozen pieces and drew each as its own `inkLine`, which
 * meant a dozen full wobble splines where one was wanted, and 1.7 MB of HTML
 * on the wire. A stroke-gradient does the same job with one path and one
 * `<linearGradient>` — and better, because the falloff is now continuous
 * rather than stepped in twelfths.
 */
function litStroke(f: Frame, a: Pt, b: Pt, seed: string, o: Pen = {}): LitStroke | null {
  const { ambient = AMBIENT, gain = GAIN } = o;

  const stops: { at: number; o: number }[] = [];
  let peak = 0;
  for (let i = 0; i < SAMPLES; i++) {
    const at = i / (SAMPLES - 1);
    const x = a.x + (b.x - a.x) * at;
    const y = a.y + (b.y - a.y) * at;
    const v = ambient + intensity(f, x, y) * gain;
    peak = Math.max(peak, v);
    stops.push({ at, o: Math.round(v * 1000) / 1000 });
  }
  // a stroke the light never reaches, on a surface with no ambient, is not a
  // dim stroke — it's one the page shouldn't be carrying at all
  if (peak < 0.006) return null;

  return {
    id: `k${hashString(seed).toString(36)}`,
    // spread rather than forwarded field by field: a hand-written forward
    // is the other place a new `PenOpts` option would go missing
    d: inkLine(a, b, { amp: 1.3, wavelength: 190, overshoot: 4, ...o, seed }),
    a,
    b,
    stops,
  };
}

/**
 * The door, rendered the way a pen renders a lit surface: by scribbling
 * across the part the light reaches and leaving the rest alone.
 *
 * Outlines alone gave a rectangle, and a rectangle on a wall is a rectangle
 * no matter how carefully its corners wobble. Hatching is what makes it a
 * *mass* — the strokes crowd against the lit edge and give out across the
 * face, and the eye reads the falloff as a surface turning away from a
 * light. Nothing else in this file does as much for as few strokes.
 */
function hatchDoor(y0: number, y1: number, seed: string): LitStroke[] {
  const out: LitStroke[] = [];
  const rand = rngFrom(`${seed}:hatch`);
  const spacing = 18;
  /**
   * How far across the door the hatching carries.
   *
   * A band hugging the lit edge, not a fill. Hatching the whole face gives a
   * picket fence that competes with the note for the reader's eye — and the
   * note has to win that every time. What's wanted is the amount of mark a
   * person makes when they're indicating that an edge caught the light and
   * then stopping, which is about eight strokes.
   */
  const reach = 155;
  const span = y1 - y0;

  for (let i = 0; 8 + i * spacing < reach; i++) {
    const x = F.x + 8 + i * spacing;
    const fade = Math.max(0, 1 - (x - F.x) / reach) ** 1.2;

    /**
     * Each column is two or three short strokes with gaps, not one long one.
     * A pen lifts. Full-height strokes at an even pitch are corduroy — the
     * broken, staggered version is the only one that reads as a hand rather
     * than as a `repeating-linear-gradient`.
     */
    const cuts = 2 + Math.floor(rand() * 2);
    let cursor = y0 + rand() * span * 0.1;
    for (let k = 0; k < cuts && cursor < y1; k++) {
      const len = (span / cuts) * (0.5 + rand() * 0.42);
      const s = litStroke(
        WIDE,
        { x: x + (rand() - 0.5) * 3.5, y: cursor },
        { x: x + (rand() - 0.5) * 3.5, y: Math.min(y1, cursor + len) },
        `${seed}:${i}:${k}`,
        {
          ambient: 0,
          // fast and loose next to a deliberate edge
          gain: 0.62 * fade,
          amp: 1.5,
          wavelength: 110,
          overshoot: 5,
          step: 22,
        },
      );
      if (s !== null) out.push(s);
      cursor += len + (span / cuts) * (0.14 + rand() * 0.26);
    }
  }
  return out;
}

/** every stroke the appliance is made of, in draw order. WIDE only. */
function appliance(): LitStroke[] {
  const right = F.x + F.w;
  const bottom = F.y + F.h;
  const hx = HANDLE.x;
  const hr = HANDLE.x + HANDLE.w;
  const chrome = { gain: 1.8, step: 22 };
  const edge = { step: 30 };
  const w = (a: Pt, b: Pt, seed: string, o?: Pen) => litStroke(WIDE, a, b, seed, o);

  return [
    // the face, before the edges that bound it
    ...hatchDoor(F.y + 10, SEAM - 6, "hatch:freezer"),
    ...hatchDoor(SEAM + 16, bottom, "hatch:door"),

    ...[
      // the box. The top edge matters more than it looks: without it the
      // fridge is a pair of verticals and could be a doorway or a wall.
      w({ x: F.x, y: F.y }, { x: right, y: F.y }, "fridge:top", edge),
      w({ x: F.x, y: F.y }, { x: F.x, y: bottom }, "fridge:near", edge),
      w({ x: right, y: F.y }, { x: right, y: bottom }, "fridge:far", edge),

      // the seam, twice — the shut line and the lip of the door below it.
      // Two lines a few units apart is a gap; one line is a scratch.
      w({ x: F.x, y: SEAM }, { x: right, y: SEAM }, "fridge:seam", edge),
      w({ x: F.x, y: SEAM + 7 }, { x: right, y: SEAM + 7 }, "fridge:lip", edge),

      // freezer handle, then the long one. Chrome, so they take the light
      // harder than the door does — hence the raised gain.
      w({ x: hx, y: 176 }, { x: hx, y: 268 }, "handle:f:a", chrome),
      w({ x: hr, y: 176 }, { x: hr, y: 268 }, "handle:f:b", chrome),
      w({ x: hx, y: 372 }, { x: hx, y: 706 }, "handle:m:a", chrome),
      w({ x: hr, y: 372 }, { x: hr, y: 706 }, "handle:m:b", chrome),
      w({ x: hx, y: 372 }, { x: hr, y: 372 }, "handle:m:cap", chrome),
      w({ x: hx, y: 706 }, { x: hr, y: 706 }, "handle:m:foot", chrome),
    ].filter(notNull),
  ];
}

/**
 * The phone's appliance: one shut line, and nothing else.
 *
 * At 84vw the note is most of the screen, so the fridge's edges and handles
 * are off-frame in every direction — drawing them would just push marks under
 * the note where nobody sees them. The seam is the one piece of fridge
 * anatomy still in shot, and sitting where it does, above the note and across
 * the whole width, it's enough: a horizontal shut line with a note taped
 * below it is legible as a fridge door in a way a lone rectangle never was.
 */
function seamOnly(): LitStroke[] {
  return [
    litStroke(TALL, { x: -80, y: 330 }, { x: 880, y: 330 }, "m:seam", { step: 30 }),
    litStroke(TALL, { x: -80, y: 337 }, { x: 880, y: 337 }, "m:lip", { step: 30 }),
  ].filter(notNull);
}

function Scene({
  frame,
  edges,
  seed,
  className,
}: {
  frame: Frame;
  edges: LitStroke[];
  seed: string;
  className: string;
}) {
  const specks = stipple(frame, seed);
  const beam = rays(frame, seed)
    .map((r) => {
      const s = litStroke(frame, r.a, r.b, r.seed, {
        // no floor: a ray outside the beam is not a dim ray, it is not a
        // ray. This is what lets the fan fray out into the dark instead of
        // ending on a line you can see.
        ambient: 0,
        gain: 0.62 * r.strength,
        // ruled fast and long — wanders less per unit than a deliberate
        // edge does, but travels much further, so it samples much coarser
        amp: 1.7,
        wavelength: 260,
        overshoot: 8,
        step: 45,
      });
      return s === null ? null : { ...s, width: r.width };
    })
    .filter(notNull);

  const all = [...edges, ...beam];

  return (
    <svg
      className={`absolute inset-0 h-full w-full ${className}`}
      viewBox={`0 0 ${frame.vb.w} ${frame.vb.h}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        {all.map((s) => (
          <linearGradient
            key={s.id}
            id={s.id}
            gradientUnits="userSpaceOnUse"
            x1={s.a.x}
            y1={s.a.y}
            x2={s.b.x}
            y2={s.b.y}
          >
            {s.stops.map((st, i) => (
              <stop
                key={i}
                offset={st.at}
                stopColor={`rgb(${WARM})`}
                stopOpacity={st.o}
              />
            ))}
          </linearGradient>
        ))}
      </defs>

      {/* the appliance first — the beam is light in the air between the
          reader and it, so it has to lie over the top */}
      <g strokeLinecap="round" strokeWidth={1.5}>
        {edges.map((s) => (
          <path key={s.id} d={s.d} stroke={`url(#${s.id})`} />
        ))}
      </g>

      {/* the doorway. Breathes, barely — a perfectly steady beam is the one
          thing that would give away that none of this is real. */}
      <g className="beam-breathe">
        <g fill={`rgb(${WARM})`}>
          {specks.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.opacity} />
          ))}
        </g>
        <g strokeLinecap="round">
          {beam.map((s) => (
            <path
              key={s.id}
              d={s.d}
              stroke={`url(#${s.id})`}
              strokeWidth={s.width}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}

export default function Kitchen() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: theme.night }}
    >
      {/* both are server-rendered and one is display:none — the swap has to
          survive a resize without a client round-trip, and neither costs
          anything to keep hidden */}
      <Scene frame={TALL} edges={seamOnly()} seed="momm-door-tall" className="md:hidden" />
      <Scene
        frame={WIDE}
        edges={appliance()}
        seed="momm-door-wide"
        className="hidden md:block"
      />

      <DustMotes />

      {/*
        Noise, in two grades, and it is doing more work here than anywhere
        else on the site.

        Fine dust alone is what the wall had before, and against drawn line
        work it reads as a clean black with a film over it. The coarse pass
        is the one that matters: low-frequency mottle is what a photocopy or
        a riso pull does to a flat area, and it's the difference between
        "black background" and "a dark surface something was printed on".
        Both screen rather than multiply — against black, multiply is a
        no-op, so the specks have to add light or they do nothing at all.
      */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: COARSE.image,
          backgroundSize: COARSE.size,
          opacity: 0.16,
          mixBlendMode: "screen",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: FINE.image,
          backgroundSize: FINE.size,
          opacity: 0.5,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}

/**
 * Turbulence, as a data-uri.
 *
 * The gamma curve on alpha is the only control that matters here, and it is
 * easy to get catastrophically wrong. `feTurbulence` puts out alpha centred
 * on ~0.5, so a gentle exponent leaves *every pixel* carrying mid-alpha —
 * which, screened over a near-black wall, is not noise at all. It's a flat
 * grey veil that lifts the black to charcoal and takes the drawing down with
 * it. A high exponent crushes the midtones to nothing and leaves only the
 * peaks, which is what makes specks rather than haze.
 *
 * Octaves is the other half: three octaves stacks higher frequencies on top
 * of whatever `freq` asks for, so a pass meant to be a slow blotch comes out
 * as medium speckle. The coarse pass runs two.
 */
function turbulence(tile: number, freq: number, gamma: number, octaves: number) {
  return {
    image:
      `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' ` +
      `width='${tile}' height='${tile}'%3E%3Cfilter id='g'%3E` +
      `%3CfeTurbulence type='fractalNoise' baseFrequency='${freq}' ` +
      `numOctaves='${octaves}' stitchTiles='stitch'/%3E` +
      `%3CfeColorMatrix type='saturate' values='0'/%3E` +
      `%3CfeComponentTransfer%3E%3CfeFuncA type='gamma' ` +
      `exponent='${gamma}' amplitude='1'/%3E%3C/feComponentTransfer%3E` +
      `%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E` +
      `%3C/svg%3E")`,
    /* the tile is the SVG's own width/height, so it has to be the CSS
       background-size too or the noise stops stitching — carried along here
       rather than restated at each use site, which is how the two drifted */
    size: `${tile}px ${tile}px`,
  };
}

/** dust on the lens — fine, sparse, and the layer that was always here */
const FINE = turbulence(200, 0.9, 3.4, 3);
/** the uneven pull of a photocopy — ~80px blotches, barely there */
const COARSE = turbulence(340, 0.012, 2.6, 2);
