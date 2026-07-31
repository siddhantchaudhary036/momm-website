"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "../Avatar";
import WordReveal from "../WordReveal";
import Annotation from "../ink/Annotation";
import { Ink, PEN, Stroke } from "../ink/Ink";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  hatchRect,
  inkArc,
  inkCircleAround,
  inkLine,
  inkRect,
  type Pt,
} from "@/lib/ink";

/**
 * The landing, immediately after the push-in — and the thesis of the site.
 *
 * You have just travelled *through* a sheet of paper, so this needs somewhere
 * to put you down; and what it puts down is the promise the product makes.
 * A phone gets doodled in and struck out. "proud." gets circled the way she'd
 * circle a grade. She arrives. The last mark is an arrow into the reckoning:
 * "but she counted every one" hands straight over to the 144.
 *
 * SCRUBBED, NOT TRIGGERED. This used to be a static section whose marks fired
 * on `whileInView` against wall-clock delays, and the effect was wrong in a
 * way no amount of retiming would fix: a fixed 4.6-second timeline either
 * finishes before a fast reader arrives or is still going after they've gone,
 * and the writing had no relationship to the hand doing the scrolling. It is
 * now built exactly like the reckoning's charts — one tall section, one
 * sticky screen, `useScroll` on the section, and every stroke's `drawn` state
 * derived from that progress. The reader's scroll *is* the pen; stop moving
 * and the ink stops with you.
 *
 * The other half of that fix is spatial. The old layout hung the copy in the
 * top-left and the figure in the far bottom-right with a screen of nothing
 * between them, which is why it read as mostly whitespace. Copy and figure
 * are one centred row now, and the line is set at `t-statement` — the step
 * that exists for the two or three lines on this site that are the argument
 * rather than a heading.
 */

const PHONE_W = 54;
const PHONE_H = 96;

/**
 * The scrub, as one table.
 *
 * Every beat is a window in section progress, so the whole 0→1 runway can be
 * read at a glance and a beat can be moved without re-deriving the ones after
 * it. Deliberately finishing by ~0.86: the last stretch is hold, so the
 * finished frame is legible for a moment before the reckoning takes over
 * rather than completing on the exact pixel the section leaves.
 */
const BEAT = {
  line1: [0.02, 0.14],
  phone: [0.14, 0.28],
  cross: [0.28, 0.36],
  line2: [0.38, 0.5],
  proud: [0.5, 0.55],
  ring: [0.55, 0.63],
  smile: [0.63, 0.69],
  momm: [0.66, 0.78],
  sparks: [0.76, 0.84],
  signOff: 0.86,
} as const;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const span = (p: number, [a, b]: readonly [number, number]) =>
  clamp01((p - a) / (b - a));

/** one drawn mark — geometry and weight only; *when* is the scroll's business */
type Mark = { d: string; stroke: string; strokeWidth: number; opacity?: number };

/**
 * The phone, drawn then struck out.
 *
 * Split into the two beats that draw it rather than returned flat: the body
 * is her sketching the thing, the cross-out is her verdict on it, and they
 * want their own windows on the runway.
 */
function phoneDoodle(): { base: Mark[]; cross: Mark[] } {
  const base: Mark[] = [
    ...inkRect(6, 4, PHONE_W - 12, PHONE_H - 8, {
      seed: "phone-body",
      amp: 1.1,
      overshoot: 2.5,
    }).map((d) => ({ d, stroke: PEN.ink, strokeWidth: 2.6 })),

    ...hatchRect(13, 13, PHONE_W - 26, PHONE_H - 32, {
      seed: "phone-screen",
      spacing: 4.5,
      angle: 42,
      amp: 0.8,
      wavelength: 46,
      overshoot: 2,
    }).map((d) => ({ d, stroke: PEN.ink, strokeWidth: 1.6, opacity: 0.5 })),

    {
      d: inkLine(
        { x: PHONE_W / 2 - 8, y: PHONE_H - 13 },
        { x: PHONE_W / 2 + 8, y: PHONE_H - 13 },
        { seed: "phone-home", amp: 0.5, wavelength: 30, overshoot: 1.5 },
      ),
      stroke: PEN.ink,
      strokeWidth: 2.2,
    },
  ];

  /**
   * In `PEN.loss` rather than her ink — the same red the reckoning uses for
   * what the phone has taken. Wobble past amp 3 is flagged in `lib/ink.ts` as
   * tipping from "a mother's notepad" into "a webcomic"; that is exactly the
   * register a fast cross-out wants, and it's the one place that earns it.
   *
   * Seeds stay the literal a/b/c they were tuned at — the wobble is a hash of
   * the seed, so renaming them would reshuffle a scribble already checked.
   */
  const strokes: [string, Pt, Pt, number, number, number][] = [
    ["a", { x: 1, y: 6 }, { x: PHONE_W - 1, y: PHONE_H - 4 }, 3.2, 55, 3.2],
    ["b", { x: PHONE_W - 3, y: 8 }, { x: 3, y: PHONE_H - 6 }, 3.2, 55, 3.2],
    ["c", { x: -1, y: PHONE_H * 0.56 }, { x: PHONE_W + 1, y: PHONE_H * 0.44 }, 3.6, 60, 3.4],
  ];
  const cross = strokes.map(([id, a, b, amp, wavelength, strokeWidth]) => ({
    d: inkLine(a, b, { seed: `phone-x-${id}`, amp, wavelength, overshoot: 6 }),
    stroke: PEN.loss,
    strokeWidth,
  }));

  return { base, cross };
}

/**
 * Two dots and a U — but the dots are strokes too. `hatchRect`'s docstring is
 * the rule: a pen cannot fill, only go back and forth. A filled `<circle>`
 * would be the one shape here that didn't come off a nib, so the eyes are
 * near-zero-length round-capped lines: a poke, not a fill.
 */
function smileyDoodle(): Mark[] {
  const eyes = ([["l", 12], ["r", 31]] as const).map(([id, x]) => ({
    d: inkLine({ x, y: 4 }, { x: x + 0.8, y: 4.6 }, {
      seed: `smile-eye-${id}`,
      amp: 0.2,
      wavelength: 16,
      overshoot: 0.4,
    }),
    stroke: PEN.ink,
    strokeWidth: 4,
  }));

  return [
    ...eyes,
    {
      d: inkArc(22, 9, 11, Math.PI, 0, {
        seed: "smile-mouth",
        amp: 1,
        wavelength: 60,
        overshoot: 3,
      }),
      stroke: PEN.ink,
      strokeWidth: 2.2,
    },
  ];
}

/** a small burst above her head — the one non-diegetic mark on the page */
function sparkBurst(seed: string, n = 6): string[] {
  const cx = 28;
  const cy = 28;
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + ((i * 37) % 11) / 40;
    return inkLine(
      { x: cx + Math.cos(a) * 5, y: cy + Math.sin(a) * 5 },
      { x: cx + Math.cos(a) * (15 + (i % 3) * 3), y: cy + Math.sin(a) * (15 + (i % 3) * 3) },
      { seed: `${seed}:${i}`, amp: 0.8, wavelength: 24, overshoot: 1.5 },
    );
  });
}

export default function PaperOpen() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const proudRef = useRef<HTMLSpanElement>(null);

  /**
   * Starts before the section pins, on purpose.
   *
   * The charts use `["start start", …]` because they have a screen to
   * themselves and nothing precedes them. This one lands directly under the
   * hero's push-in, and a pinned section's last 100vh is always its sticky
   * child scrolling away — cream over cream here, so with a `start start`
   * offset the reader got a screen of blank paper before the first word so
   * much as dimmed. Beginning at three-quarters up the viewport means the
   * line is already lighting while the hero hands over, and the seam between
   * the two sections has something happening in it.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end end"],
  });

  const phone = useMemo(phoneDoodle, []);
  const smile = useMemo(smileyDoodle, []);
  const sparks = useMemo(() => sparkBurst("momm-sparkle"), []);

  const [drawn, setDrawn] = useState({
    phone: 0,
    cross: 0,
    ring: 0,
    smile: 0,
    sparks: 0,
    signOff: false,
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setDrawn({
      phone: Math.round(span(p, BEAT.phone) * phone.base.length),
      cross: Math.round(span(p, BEAT.cross) * phone.cross.length),
      ring: Math.round(span(p, BEAT.ring) * 2),
      smile: Math.round(span(p, BEAT.smile) * smile.length),
      sparks: Math.round(span(p, BEAT.sparks) * sparks.length),
      signOff: p > BEAT.signOff,
    });
  });

  /* reduced motion gets the finished page, not a faster one — there is no
     scrub to run when the section isn't allowed to move under the reader */
  const on = reduced
    ? {
        phone: phone.base.length,
        cross: phone.cross.length,
        ring: 2,
        smile: smile.length,
        sparks: sparks.length,
        signOff: true,
      }
    : drawn;

  const line1P = useTransform(scrollYProgress, [...BEAT.line1], [0, 1], { clamp: true });
  const line2P = useTransform(scrollYProgress, [...BEAT.line2], [0, 1], { clamp: true });
  const proudO = useTransform(scrollYProgress, [...BEAT.proud], [0, 1], { clamp: true });
  const mommO = useTransform(scrollYProgress, [...BEAT.momm], [0, 1], { clamp: true });
  const mommY = useTransform(scrollYProgress, [...BEAT.momm], [26, 0], { clamp: true });

  const [circle, setCircle] = useState<{
    cx: number;
    cy: number;
    rx: number;
    ry: number;
  } | null>(null);

  /**
   * Measured, not guessed — a ring has to actually hug the word or it reads
   * as broken rather than as approval. Re-measured on resize and once
   * webfonts settle, since Caveat loads async and a metric shift after first
   * paint would strand the circle beside the word instead of around it.
   */
  useEffect(() => {
    const c = containerRef.current;
    if (c === null) return;

    const measure = () => {
      const t = proudRef.current;
      if (t === null) return;
      const cb = c.getBoundingClientRect();
      const tb = t.getBoundingClientRect();
      const next = {
        cx: tb.left - cb.left + tb.width / 2,
        cy: tb.top - cb.top + tb.height / 2,
        rx: tb.width / 2 + 10,
        ry: tb.height / 2 + 12,
      };
      /* bail when nothing moved: `measure` runs three times on a normal mount
         and then per frame for the whole of a window drag, and a fresh object
         each time is a re-render plus a rebuild of both splines */
      setCircle((prev) =>
        prev !== null &&
        Math.abs(prev.cx - next.cx) < 0.5 &&
        Math.abs(prev.cy - next.cy) < 0.5 &&
        Math.abs(prev.rx - next.rx) < 0.5 &&
        Math.abs(prev.ry - next.ry) < 0.5
          ? prev
          : next,
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(c);
    document.fonts?.ready?.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, []);

  const ringPaths = useMemo(
    () =>
      circle
        ? inkCircleAround(circle.cx, circle.cy, circle.rx, circle.ry, {
            seed: "proud-circle",
            amp: 2,
            wavelength: 130,
          })
        : [],
    [circle],
  );

  return (
    <section ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* copy and figure as one centred row — the old layout put them in
            opposite corners with a screen of nothing in between, which is
            most of what read as empty */}
        <div className="mx-auto flex h-full max-w-[88rem] flex-col items-start justify-center gap-6 px-[6vw] md:flex-row md:items-center md:gap-[3vw]">
          {/* `flex-1` only once there's a row to be one of. In the stacked
              column it made this block absorb all the free height, pinning
              the copy to the top and shoving her off the bottom edge with a
              screen of nothing between — `justify-center` can't centre two
              children when one of them is growing. */}
          <div ref={containerRef} className="relative w-full min-w-0 md:flex-1">
            <p className="t-statement font-hand" style={{ color: PEN.ink }}>
              <WordReveal text="Stay off your phone." progress={line1P} feather={2.5} dim={0.14} />
              <Ink
                w={PHONE_W}
                h={PHONE_H}
                className="ml-2 inline-block h-[0.8em] w-auto align-[-0.16em] md:ml-3 md:h-[0.95em] md:align-[-0.22em]"
              >
                {phone.base.map((m, i) => (
                  <Stroke
                    key={i}
                    d={m.d}
                    drawn={i < on.phone}
                    speed={170}
                    stroke={m.stroke}
                    strokeWidth={m.strokeWidth}
                    style={{ opacity: m.opacity }}
                  />
                ))}
                {phone.cross.map((m, i) => (
                  <Stroke
                    key={`x${i}`}
                    d={m.d}
                    drawn={i < on.cross}
                    speed={200}
                    stroke={m.stroke}
                    strokeWidth={m.strokeWidth}
                  />
                ))}
              </Ink>
            </p>

            <p className="mt-2 t-statement font-hand" style={{ color: PEN.ink }}>
              <WordReveal text="Make momm" progress={line2P} feather={2} dim={0.14} />{" "}
              <motion.span
                ref={proudRef}
                style={{ opacity: reduced ? 1 : proudO }}
                className="relative inline-block"
              >
                proud.
              </motion.span>
              <Ink w={44} h={30} className="ml-2 inline-block h-[0.42em] w-auto align-[0.02em]">
                {smile.map((m, i) => (
                  <Stroke
                    key={i}
                    d={m.d}
                    drawn={i < on.smile}
                    speed={200}
                    stroke={m.stroke}
                    strokeWidth={m.strokeWidth}
                  />
                ))}
              </Ink>
            </p>

            {circle && (
              <svg
                aria-hidden
                focusable="false"
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              >
                {ringPaths.map((d, i) => (
                  <Stroke
                    key={i}
                    d={d}
                    drawn={i < on.ring}
                    speed={340}
                    stroke={PEN.ink}
                    strokeWidth={2.6}
                  />
                ))}
              </svg>
            )}

            {/* mounted rather than faded: `Annotation` draws itself on view,
                and this section is in view for its whole pinned length — so
                the only way to hold its arrow back to its beat is to not put
                it on the page until the beat arrives */}
            {/* fixed height so the arrow arriving doesn't shift the lines
                above it; smaller on a phone, where 7.5rem of reserved space
                is a tenth of the screen held empty */}
            <div className="mt-5 h-[5rem] md:mt-10 md:h-[7.5rem]">
              {on.signOff && (
                <Annotation dir="down" seed="counted-every-one">
                  but she counted every one.
                </Annotation>
              )}
            </div>
          </div>

          <motion.div
            className="relative shrink-0 self-end md:self-center"
            style={reduced ? undefined : { opacity: mommO, y: mommY }}
          >
            <Avatar
              name="momm-proud"
              enter={false}
              className="h-48 md:h-[26rem] lg:h-[32rem]"
              sizes="(max-width: 768px) 40vw, 30vw"
            />
            {/* nested in a box sized to the avatar, so the burst tracks her
                head at every breakpoint instead of via four guessed offsets */}
            <div className="pointer-events-none absolute -top-2 left-[18%] md:-top-3">
              <Ink w={56} h={56} className="h-8 w-8 md:h-12 md:w-12">
                {sparks.map((d, i) => (
                  <Stroke
                    key={i}
                    d={d}
                    drawn={i < on.sparks}
                    speed={160}
                    stroke={PEN.ink}
                    strokeWidth={2}
                  />
                ))}
              </Ink>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
