"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "../Avatar";
import Standing from "../Standing";
import WordReveal from "../WordReveal";
import Annotation from "../ink/Annotation";
import { Ink, PEN, StrokeInView } from "../ink/Ink";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  hatchRect,
  inkArc,
  inkCircleAround,
  inkLine,
  inkRect,
  type Pt,
} from "@/lib/ink";
import { DATA, INSTANT } from "@/lib/motion";
import { rngFrom } from "@/lib/prng";

/**
 * The landing, immediately after the push-in.
 *
 * This used to be a held sentence — "She was nagging for a reason." — a
 * kid in the corner, and nothing else happening. Correct instinct (you've
 * just travelled *through* a sheet of paper and need somewhere calm to
 * land) but too calm: the copy was an accusation with no argument behind
 * it yet, and the frame had one small figure in 92vh.
 *
 * The line is now the promise instead of the accusation — "Make momm
 * proud" — and the screen earns it by *doing* something with the pen
 * rather than just holding it. A phone gets doodled in and crossed out
 * as the first line lands. "proud." gets circled the way she'd circle a
 * grade. She arrives, sized like she means it. And the last mark on the
 * screen is an arrow aimed at the sentence that follows: "but she
 * counted every one" hands off directly into the reckoning's 144.
 *
 * Nothing here is a scroll-scrub. The hero already pinned once and the
 * reckoning pins for 420vh right after this — a third pin back to back
 * would make the opening feel sticky. Every mark instead self-triggers
 * on `whileInView` with a staggered `delay`, the same mechanism
 * `Annotation` already uses, so the whole scene "writes itself" once on
 * arrival and never again.
 */

const PHONE_W = 54;
const PHONE_H = 96;

/**
 * The whole 4.6-second choreography, in one place and one unit.
 *
 * These numbers were originally spread across ~19 JSX attributes in two
 * unit systems — milliseconds on the stroke components, seconds on the
 * framer transitions — with adjacent beats straddling the split (she
 * arrives at `3.5`, her sparks at `3900`). Every value was derived by hand
 * from the one before it, so inserting a beat meant re-deriving the tail
 * and a unit slip was a 1000× error you could only catch by watching.
 *
 * Milliseconds throughout; `secs()` converts at the two framer call sites.
 */
const BEAT = {
  phoneBody: 650,
  phoneScreen: 1000,
  phoneHome: 1450,
  crossOut: 1850,
  secondLine: 2450,
  proud: 2900,
  ring: 3250,
  smileEyes: 3400,
  smileMouth: 3550,
  mommArrives: 3500,
  sparks: 3900,
  signOff: 4500,
} as const;

const secs = (ms: number) => ms / 1000;

/** one drawn mark: geometry plus where it lands in the timeline */
type Mark = {
  d: string;
  stroke: string;
  strokeWidth: number;
  speed: number;
  delay: number;
  opacity?: number;
};

/**
 * The phone, drawn then struck out.
 *
 * Returned as a flat list rather than a `{body, screen, home, scribble}`
 * record: the keys were only ever used to feed four adjacent call sites in
 * order, and unrolling them cost twelve near-identical `<StrokeInView>`
 * lines whose only real variable was a hand-computed delay.
 */
function phoneDoodle(): Mark[] {
  const body = inkRect(6, 4, PHONE_W - 12, PHONE_H - 8, {
    seed: "phone-body",
    amp: 1.1,
    overshoot: 2.5,
  }).map((d, i) => ({
    d,
    stroke: PEN.ink,
    strokeWidth: 2.6,
    speed: 260,
    delay: BEAT.phoneBody + i * 60,
  }));

  const screen = hatchRect(13, 13, PHONE_W - 26, PHONE_H - 32, {
    seed: "phone-screen",
    spacing: 4.5,
    angle: 42,
    amp: 0.8,
    wavelength: 46,
    overshoot: 2,
  }).map((d, i) => ({
    d,
    stroke: PEN.ink,
    strokeWidth: 1.6,
    speed: 140,
    delay: BEAT.phoneScreen + i * 40,
    opacity: 0.5,
  }));

  const home = {
    d: inkLine(
      { x: PHONE_W / 2 - 8, y: PHONE_H - 13 },
      { x: PHONE_W / 2 + 8, y: PHONE_H - 13 },
      { seed: "phone-home", amp: 0.5, wavelength: 30, overshoot: 1.5 },
    ),
    stroke: PEN.ink,
    strokeWidth: 2.2,
    speed: 200,
    delay: BEAT.phoneHome,
  };

  /**
   * The cross-out, in `PEN.loss` rather than her ink — the same red the
   * reckoning uses for what the phone has taken. Wobble past amp 3 is
   * flagged in `lib/ink.ts` as tipping from "a mother's notepad" into
   * "a webcomic"; that's exactly the register a fast cross-out wants,
   * and it's the one place on the site that earns it.
   *
   * Seeds stay the literal `a`/`b`/`c` they were tuned at — the wobble is
   * a hash of the seed, so renaming them to indices would reshuffle a
   * scribble that was already checked on screen.
   */
  const strokes: [string, Pt, Pt, number, number, number, number][] = [
    ["a", { x: 1, y: 6 }, { x: PHONE_W - 1, y: PHONE_H - 4 }, 3.2, 55, 3.2, 220],
    ["b", { x: PHONE_W - 3, y: 8 }, { x: 3, y: PHONE_H - 6 }, 3.2, 55, 3.2, 220],
    ["c", { x: -1, y: PHONE_H * 0.56 }, { x: PHONE_W + 1, y: PHONE_H * 0.44 }, 3.6, 60, 3.4, 240],
  ];
  const scribble = strokes.map(([id, a, b, amp, wavelength, strokeWidth, speed], i) => ({
    d: inkLine(a, b, { seed: `phone-x-${id}`, amp, wavelength, overshoot: 6 }),
    stroke: PEN.loss,
    strokeWidth,
    speed,
    delay: BEAT.crossOut + i * 165,
  }));

  return [...body, ...screen, home, ...scribble];
}

/**
 * Two dots and a U — but the dots are strokes too. `hatchRect`'s own
 * docstring is the rule: a pen cannot fill, only go back and forth. A
 * filled `<circle>` would be the one shape on the page that didn't come
 * off a nib, so the eyes are near-zero-length round-capped lines instead —
 * a poke, not a fill.
 */
function smileyDoodle(): Mark[] {
  // the eyes differ only in x, so they're generated; the mouth genuinely
  // differs and stays written out
  const eyes = ([["l", 12], ["r", 31]] as const).map(([id, x], i) => ({
    d: inkLine({ x, y: 4 }, { x: x + 0.8, y: 4.6 }, {
      seed: `smile-eye-${id}`,
      amp: 0.2,
      wavelength: 16,
      overshoot: 0.4,
    }),
    stroke: PEN.ink,
    strokeWidth: 4,
    speed: 120,
    delay: BEAT.smileEyes + i * 60,
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
      speed: 420,
      delay: BEAT.smileMouth,
    },
  ];
}

/** a small burst above her head — the one non-diegetic mark on the page */
function sparkBurst(seed: string, n = 6) {
  const cx = 28;
  const cy = 28;
  return Array.from({ length: n }, (_, i) => {
    const rand = rngFrom(`${seed}:${i}`);
    const a = (i / n) * Math.PI * 2 + (rand() - 0.5) * 0.4;
    const r0 = 5;
    const r1 = 14 + rand() * 8;
    return inkLine(
      { x: cx + Math.cos(a) * r0, y: cy + Math.sin(a) * r0 },
      { x: cx + Math.cos(a) * r1, y: cy + Math.sin(a) * r1 },
      { seed: `${seed}:${i}`, amp: 0.8, wavelength: 24, overshoot: 1.5 },
    );
  });
}

export default function PaperOpen() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const proudRef = useRef<HTMLSpanElement>(null);
  const [circle, setCircle] = useState<{
    cx: number;
    cy: number;
    rx: number;
    ry: number;
  } | null>(null);

  /**
   * Measured, not guessed — unlike the underline this section used to draw,
   * a ring has to actually hug the word or it reads as broken rather than
   * as approval. Re-measured on resize and once webfonts settle, since
   * Caveat is loaded async and a metric shift after first paint would leave
   * the circle stranded next to the word instead of around it.
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
        rx: tb.width / 2 + 8,
        ry: tb.height / 2 + 11,
      };
      /*
        Bail out when nothing moved. `measure` runs three times on a normal
        mount — directly, from the observer's initial delivery, and again
        once webfonts settle — and ResizeObserver then fires per frame for
        the whole of a window drag. Setting a fresh object each time made
        every one of those a re-render *and* a rebuild of both circle
        splines (~130µs of sine each). Returning `prev` keeps the identity
        stable, so React skips the render and the memo below actually holds.
      */
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

  const phone = useMemo(phoneDoodle, []);
  const smile = useMemo(smileyDoodle, []);
  const sparks = useMemo(() => sparkBurst("momm-sparkle"), []);
  const circlePaths = useMemo(
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
    <section className="relative flex min-h-[100vh] items-center px-[7vw] py-[12vh]">
      <div ref={containerRef} className="relative w-full max-w-[42rem]">
        <p className="t-display font-hand" style={{ color: PEN.ink, lineHeight: 1.08 }}>
          <WordReveal text="Stay off your phone." sweepMs={800} />
          <Ink
            w={PHONE_W}
            h={PHONE_H}
            className="ml-3 inline-block h-16 w-auto align-[-0.32em] md:h-20"
          >
            {phone.map((m, i) => (
              <StrokeInView key={i} amount={0.2} {...m} />
            ))}
          </Ink>
        </p>

        <p className="mt-4 t-display font-hand" style={{ color: PEN.ink, lineHeight: 1.08 }}>
          <WordReveal text="Make momm" sweepMs={650} delayMs={BEAT.secondLine} />{" "}
          <motion.span
            ref={proudRef}
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={reduced ? INSTANT : { ...DATA, delay: secs(BEAT.proud) }}
            className="relative inline-block"
          >
            proud.
          </motion.span>
          <Ink
            w={44}
            h={30}
            className="ml-2 inline-block h-8 w-auto align-[-0.1em] md:h-9"
          >
            {smile.map((m, i) => (
              <StrokeInView key={i} amount={0.2} {...m} />
            ))}
          </Ink>
        </p>

        {circle && (
          <svg
            aria-hidden
            focusable="false"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            {circlePaths.map((d, i) => (
              <StrokeInView
                key={i}
                d={d}
                stroke={PEN.ink}
                strokeWidth={2.4}
                speed={480}
                delay={BEAT.ring + i * 260}
                amount={0}
              />
            ))}
          </svg>
        )}
      </div>

      <Standing className="bottom-[1vh] right-[4vw] md:right-[7vw]">
        {/*
          The sparks used to be a second `Standing` with its own guessed
          vh/vw offset, tuned against one breakpoint and wrong at every
          other one — visibly adrift from her head in the first pass. Nested
          inside a wrapper sized to the avatar itself, `-top` and `left`
          are fractions of *her* box, so the burst tracks her head at every
          breakpoint by construction instead of by four separate guesses.
        */}
        <div className="relative inline-block">
          <Avatar
            name="momm-proud"
            enter
            delay={secs(BEAT.mommArrives)}
            className="h-40 md:h-64 lg:h-[22rem]"
            sizes="26vw"
          />
          <div className="pointer-events-none absolute -top-3 left-[8%] md:-top-4">
            <Ink w={56} h={56} className="h-9 w-9 md:h-12 md:w-12">
              {sparks.map((d, i) => (
                <StrokeInView
                  key={i}
                  d={d}
                  stroke={PEN.ink}
                  strokeWidth={2}
                  speed={200}
                  delay={BEAT.sparks + i * 70}
                  amount={0.1}
                />
              ))}
            </Ink>
          </div>
        </div>
      </Standing>

      <Standing className="bottom-[3vh] left-[6vw] md:left-[8vw]">
        {/*
          Annotation only staggers its arrow — the caption text itself has
          no delay of its own and renders at full opacity the instant it
          mounts. Left alone here, "but she counted every one." was the
          first thing legible on the screen, ahead of the headline it's
          supposed to close out. It needs to be the last mark on the page,
          so the fade-in is added here rather than in the shared component.

          Both halves read from `BEAT.signOff` so the text and its arrow
          can't drift apart — they were previously 4.5 (seconds) and 4600
          (ms), two constants in two units that had to be kept in step by
          hand.
        */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={reduced ? INSTANT : { ...DATA, delay: secs(BEAT.signOff) }}
        >
          <Annotation dir="down" seed="counted-every-one" delay={BEAT.signOff + 100}>
            but she counted every one.
          </Annotation>
        </motion.div>
      </Standing>
    </section>
  );
}
