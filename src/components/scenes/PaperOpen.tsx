"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "../Avatar";
import Standing from "../Standing";
import WordReveal from "../WordReveal";
import Annotation from "../ink/Annotation";
import { Ink, PEN, StrokeInView } from "../ink/Ink";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { hatchRect, inkArc, inkCircleAround, inkLine, inkRect } from "@/lib/ink";
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

function phoneDoodle() {
  return {
    body: inkRect(6, 4, PHONE_W - 12, PHONE_H - 8, {
      seed: "phone-body",
      amp: 1.1,
      overshoot: 2.5,
    }),
    screen: hatchRect(13, 13, PHONE_W - 26, PHONE_H - 32, {
      seed: "phone-screen",
      spacing: 4.5,
      angle: 42,
      amp: 0.8,
      wavelength: 46,
      overshoot: 2,
    }),
    home: inkLine(
      { x: PHONE_W / 2 - 8, y: PHONE_H - 13 },
      { x: PHONE_W / 2 + 8, y: PHONE_H - 13 },
      { seed: "phone-home", amp: 0.5, wavelength: 30, overshoot: 1.5 },
    ),
    /**
     * The cross-out, in `PEN.loss` rather than her ink — the same red the
     * reckoning uses for what the phone has taken. Wobble past amp 3 is
     * flagged in `lib/ink.ts` as tipping from "a mother's notepad" into
     * "a webcomic"; that's exactly the register a fast cross-out wants,
     * and it's the one place on the site that earns it.
     */
    scribble: [
      inkLine({ x: 1, y: 6 }, { x: PHONE_W - 1, y: PHONE_H - 4 }, {
        seed: "phone-x-a",
        amp: 3.2,
        wavelength: 55,
        overshoot: 6,
      }),
      inkLine({ x: PHONE_W - 3, y: 8 }, { x: 3, y: PHONE_H - 6 }, {
        seed: "phone-x-b",
        amp: 3.2,
        wavelength: 55,
        overshoot: 6,
      }),
      inkLine({ x: -1, y: PHONE_H * 0.56 }, { x: PHONE_W + 1, y: PHONE_H * 0.44 }, {
        seed: "phone-x-c",
        amp: 3.6,
        wavelength: 60,
        overshoot: 6,
      }),
    ],
  };
}

/**
 * Two dots and a U — but the dots are strokes too. `hatchRect`'s own
 * docstring is the rule: a pen cannot fill, only go back and forth. A
 * filled `<circle>` would be the one shape on the page that didn't come
 * off a nib, so the eyes are near-zero-length round-capped lines instead —
 * a poke, not a fill.
 */
function smileyDoodle() {
  return {
    mouth: inkArc(22, 9, 11, Math.PI, 0, {
      seed: "smile-mouth",
      amp: 1,
      wavelength: 60,
      overshoot: 3,
    }),
    eyeL: inkLine({ x: 12, y: 4 }, { x: 12.8, y: 4.6 }, {
      seed: "smile-eye-l",
      amp: 0.2,
      wavelength: 16,
      overshoot: 0.4,
    }),
    eyeR: inkLine({ x: 31, y: 4 }, { x: 31.8, y: 4.6 }, {
      seed: "smile-eye-r",
      amp: 0.2,
      wavelength: 16,
      overshoot: 0.4,
    }),
  };
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
    const measure = () => {
      const c = containerRef.current;
      const t = proudRef.current;
      if (c === null || t === null) return;
      const cb = c.getBoundingClientRect();
      const tb = t.getBoundingClientRect();
      setCircle({
        cx: tb.left - cb.left + tb.width / 2,
        cy: tb.top - cb.top + tb.height / 2,
        rx: tb.width / 2 + 8,
        ry: tb.height / 2 + 11,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current !== null) ro.observe(containerRef.current);
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
            <StrokeInView d={phone.body[0]} stroke={PEN.ink} strokeWidth={2.6} speed={260} delay={650} amount={0.2} />
            <StrokeInView d={phone.body[1]} stroke={PEN.ink} strokeWidth={2.6} speed={260} delay={710} amount={0.2} />
            <StrokeInView d={phone.body[2]} stroke={PEN.ink} strokeWidth={2.6} speed={260} delay={770} amount={0.2} />
            <StrokeInView d={phone.body[3]} stroke={PEN.ink} strokeWidth={2.6} speed={260} delay={830} amount={0.2} />
            {phone.screen.map((d, i) => (
              <StrokeInView
                key={i}
                d={d}
                stroke={PEN.ink}
                strokeWidth={1.6}
                speed={140}
                delay={1000 + i * 40}
                amount={0.2}
                opacity={0.5}
              />
            ))}
            <StrokeInView d={phone.home} stroke={PEN.ink} strokeWidth={2.2} speed={200} delay={1450} amount={0.2} />
            <StrokeInView d={phone.scribble[0]} stroke={PEN.loss} strokeWidth={3.2} speed={220} delay={1850} amount={0.2} />
            <StrokeInView d={phone.scribble[1]} stroke={PEN.loss} strokeWidth={3.2} speed={220} delay={2010} amount={0.2} />
            <StrokeInView d={phone.scribble[2]} stroke={PEN.loss} strokeWidth={3.4} speed={240} delay={2180} amount={0.2} />
          </Ink>
        </p>

        <p className="mt-4 t-display font-hand" style={{ color: PEN.ink, lineHeight: 1.08 }}>
          <WordReveal text="Make momm" sweepMs={650} delayMs={2450} />{" "}
          <motion.span
            ref={proudRef}
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, delay: reduced ? 0 : 2.9 }}
            className="relative inline-block"
          >
            proud.
          </motion.span>
          <Ink
            w={44}
            h={30}
            className="ml-2 inline-block h-8 w-auto align-[-0.1em] md:h-9"
          >
            <StrokeInView d={smile.mouth} stroke={PEN.ink} strokeWidth={2.2} speed={420} delay={3550} amount={0.2} />
            <StrokeInView d={smile.eyeL} stroke={PEN.ink} strokeWidth={4} speed={120} delay={3400} amount={0.2} />
            <StrokeInView d={smile.eyeR} stroke={PEN.ink} strokeWidth={4} speed={120} delay={3460} amount={0.2} />
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
                delay={3250 + i * 260}
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
            delay={3.5}
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
                  delay={3900 + i * 70}
                  amount={0.1}
                />
              ))}
            </Ink>
          </div>
        </div>
      </Standing>

      <Standing className="bottom-[3vh] left-[6vw] max-w-[15rem] md:left-[8vw]">
        {/*
          Annotation only staggers its arrow — the caption text itself has
          no delay of its own and renders at full opacity the instant it
          mounts. Left alone here, "but she counted every one." was the
          first thing legible on the screen, ahead of the headline it's
          supposed to close out. It needs to be the last mark on the page,
          so the fade-in is added here rather than in the shared component.
        */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, delay: reduced ? 0 : 4.5 }}
        >
          <Annotation dir="down" seed="counted-every-one" delay={4600}>
            but she counted every one.
          </Annotation>
        </motion.div>
      </Standing>
    </section>
  );
}
