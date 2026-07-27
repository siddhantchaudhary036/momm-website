"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Avatar from "../Avatar";
import Standing from "../Standing";
import WordReveal from "../WordReveal";
import Annotation from "../ink/Annotation";
import ClockDial from "../ink/ClockDial";
import { PEN } from "../ink/Ink";
import LifeSheet from "../ink/LifeSheet";
import TallyField from "../ink/TallyField";

/**
 * PAGE 02 — the reckoning, on the paper we pushed into.
 *
 * The previous version had the right instinct and the wrong scale. It
 * knew the four consecutive scroll-scrubs had to become one canvas that
 * transforms, and it knew a donut was a quarterly report — but it then
 * put the result inside a 42rem note at `scale-90`, which is about seven
 * per cent of a laptop screen, under a sentence, as an illustration of
 * the sentence. The data was the argument and it was being rendered as
 * decoration for the copy.
 *
 * Three beats now, each the whole screen, each a different form, all of
 * them drawn rather than filled:
 *
 *   144   a tally. One stroke per pickup — not a mark standing for a
 *         pickup, the actual count, written the way a person writes a
 *         count they've stopped enjoying keeping.
 *   5:16  a dial, against your waking sixteen rather than a full day,
 *         because counting the hours you were asleep would be padding.
 *   32    the life sheet, ruled by hand, with a third of it scratched out.
 *
 * The copy has been demoted to caption, which is the correct rank for it
 * once the chart is big enough to make the point on its own — and the
 * marginalia carries her voice instead, because a number somebody has
 * scrawled next to is a number somebody has *reacted* to.
 */

const BEATS: [number, number][] = [
  [0.0, 0.38],
  [0.38, 0.66],
  [0.66, 1.0],
];

const LINES = [
  "You picked it up 144 times today.",
  "Five hours, sixteen minutes. Every day.",
  "Keep going, and that's 32 years of your one life.",
];

const N_PICKUPS = 144;
const YEARS_LOST = 32;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export default function PageReckoning() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [beat, setBeat] = useState(0);
  const [count, setCount] = useState(0);
  const [dial, setDial] = useState(0);
  const [rule, setRule] = useState(0);
  const [lost, setLost] = useState(0);
  const beatRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const b = p < BEATS[0][1] ? 0 : p < BEATS[1][1] ? 1 : 2;
    beatRef.current = b;
    setBeat(b);
    setCount(Math.round(span(p, 0.03, 0.3) * N_PICKUPS));
    setDial(span(p, 0.4, 0.63));
    setRule(span(p, 0.67, 0.75));
    setLost(Math.round(span(p, 0.77, 0.96) * YEARS_LOST));
  });

  /** the caption lights across its own beat's slice of the runway */
  const lineProgress = useTransform(scrollYProgress, (p) => {
    const [a, b] = BEATS[beatRef.current];
    return clamp01((p - a) / (b - a) / 0.7);
  });

  return (
    <section ref={ref} className="relative h-[420vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* the caption, top-left, in her hand — the copy is no longer the
            thing being illustrated, so it sits in the corner like a note
            written above the working-out */}
        <div className="absolute left-[6vw] right-[6vw] top-[6vh] z-20 md:left-[7vw] md:top-[8vh] md:max-w-[34rem]">
          <motion.p
            key={beat}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            className="font-hand text-[1.6rem] leading-tight md:text-[2.4rem]"
            style={{ color: PEN.ink }}
          >
            <WordReveal text={LINES[beat]} progress={lineProgress} />
          </motion.p>
        </div>

        <Beat on={beat === 0}>
          <Tally count={count} />
        </Beat>
        <Beat on={beat === 1}>
          <Dial p={dial} />
        </Beat>
        <Beat on={beat === 2}>
          <Life rule={rule} lost={lost} />
        </Beat>
      </div>
    </section>
  );
}

/**
 * Beats cross-fade rather than mount and unmount. Each chart builds a few
 * hundred seeded paths on first render, and rebuilding those every time
 * the reader scrubs back over a boundary is the one thing on this page
 * that would actually be felt.
 */
function Beat({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: on ? 1 : 0,
        visibility: on ? "visible" : "hidden",
        transition: "opacity 340ms ease-out, visibility 0s linear " + (on ? "0s" : "340ms"),
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ 144 */

function Tally({ count }: { count: number }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 px-6 pt-[8vh] md:flex-row md:gap-[4vw] md:px-[6vw] md:pt-[7vh]">
      {/* the count on the left, the marks on the right — the number is
          what the section is about and the tally is the evidence for it,
          so the number gets the reading position. Stacked on mobile, it
          keeps that position by simply coming first. */}
      <div className="flex shrink-0 flex-col text-center md:text-left">
        <span className="t-mega font-header tabular-nums" style={{ color: PEN.ink }}>
          {count}
        </span>
        <span
          className="mt-1 font-sub text-xl italic md:text-2xl"
          style={{ color: PEN.ink, opacity: 0.6 }}
        >
          times, today
        </span>
        {/* points down at the tally when stacked, across at it when beside */}
        <Annotation dir="down-right" seed="every-six-minutes" className="mt-4 md:mt-6">
          once every 6½ minutes
        </Annotation>
      </div>

      {/*
        Height-driven sizing (h-vh, w-auto) is right once the chart has a row
        to itself, but on a phone this square-ish field would rather be
        exactly as wide as the screen than as tall as the screen — sized off
        vh there, its auto width blows straight through the viewport, which
        is the clipped-donut bug this whole file was rewritten to fix.
      */}
      <TallyField
        count={count}
        className="h-auto w-[76vw] max-w-[22rem] shrink md:h-[62vh] md:w-auto md:max-w-[52vw]"
      />
    </div>
  );
}

/* ----------------------------------------------------------------- 5:16 */

function Dial({ p }: { p: number }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 px-6 pt-[8vh] md:flex-row md:gap-[3vw] md:px-[6vw] md:pt-[7vh]">
      {/*
        Width-capped at every breakpoint, because the dial is the one 1:1
        chart on the page and it sits next to the widest number on it.
        Sized off viewport height once there's a row to sit in, but the cap
        has to stay: at 768 an uncapped 52vh dial is 532px square beside a
        400px "5h 16m", and since both are shrink-0 the row simply hangs
        ~96px off each side rather than giving anywhere.
      */}
      <ClockDial
        p={p}
        className="h-auto w-[64vw] max-w-[19rem] shrink-0 md:h-[52vh] md:w-auto md:max-w-[38vw] lg:h-[68vh] lg:max-w-[34vw]"
      />

      <div className="flex shrink-0 flex-col text-center md:text-left">
        {/*
          Units set small rather than merely faded. The first pass stacked
          "5h" over "16m" at full display size with the h and the m turned
          down in opacity, which read as two mis-set lines with a
          rendering fault in them — a grey letter the same size as a black
          one looks broken, not subordinate. Scale is what makes something
          a unit; opacity on its own just makes it look wrong.
        */}
        <span className="t-mega font-header tabular-nums" style={{ color: PEN.ink }}>
          5<Unit>h</Unit> 16<Unit>m</Unit>
        </span>
        <span
          className="mt-2 font-sub text-xl italic md:text-2xl"
          style={{ color: PEN.ink, opacity: 0.6 }}
        >
          of your sixteen waking hours
        </span>
        {/* aims back up at the dial, which sits above this when stacked */}
        <Annotation dir="up-left" seed="waking-third" className="mt-4 md:mt-6">
          that&rsquo;s one waking hour in three
        </Annotation>
      </div>
    </div>
  );
}

function Unit({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: "0.4em", opacity: 0.5 }} className="font-sub italic">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------- 32 */

function Life({ rule, lost }: { rule: number; lost: number }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 px-6 pt-[8vh] md:flex-row md:gap-[3vw] md:px-[5vw] md:pt-[6vh]">
      {/* used to be `hidden md:flex` — hiding the number was covering for
          the same row-overflow bug as the other two beats, at the cost of
          mobile readers never seeing "32" at all. Stacking fixes the
          overflow properly, so the number can stay. */}
      <div className="flex shrink-0 flex-col text-center md:text-left">
        <span className="t-mega font-header tabular-nums" style={{ color: PEN.loss }}>
          {lost}
        </span>
        <span
          className="mt-1 font-sub text-xl italic md:text-2xl"
          style={{ color: PEN.ink, opacity: 0.6 }}
        >
          years of it, gone
        </span>
        <Annotation dir="down-right" seed="one-square-one-year" className="mt-4 md:mt-6">
          one square, one year
        </Annotation>
      </div>

      <LifeSheet
        rule={rule}
        filled={lost}
        className="h-auto w-[76vw] max-w-[22rem] shrink md:h-[64vh] md:w-auto md:max-w-[52vw]"
      />

      {/* he's been sitting in this grid the whole time — and she is
          deliberately still absent, which is what gives her return on the
          next page somewhere to land */}
      <Standing className="bottom-[4vh] right-[3vw] hidden xl:block">
        <Avatar name="kid-sad" drained bob={false} className="h-44" sizes="18vw" />
      </Standing>
    </div>
  );
}

