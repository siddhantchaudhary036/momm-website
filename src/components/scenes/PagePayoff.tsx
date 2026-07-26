"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import Avatar from "../Avatar";
import Standing from "../Standing";
import WordReveal from "../WordReveal";
import Annotation from "../ink/Annotation";
import { PEN } from "../ink/Ink";
import LifeSheet from "../ink/LifeSheet";

/**
 * PAGE 06 — the payoff, and the whole reason this conceit beat the others.
 *
 * The fridge is where a mother displays what she's proud of. So the chart
 * stops being a chart and becomes the thing that got put up — which is
 * why this act is the one paper section with both its edges showing and
 * tape at the corners. You are looking at a sheet on a door, not at a
 * page background.
 *
 * The sheet is on its second and final appearance. It gets scratched out
 * in the reckoning and it heals here, and the healing runs the same pen
 * backwards: `stroke-dashoffset` is symmetric, so a year given back
 * un-scribbles itself stroke by stroke and gets ringed in green instead.
 * Watching a mark be *removed* is worth more than any recolouring could
 * be, because the loss was never a colour — it was something drawn on top
 * of you.
 */
export default function PagePayoff() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [healed, setHealed] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setHealed(Math.round(Math.min(6, Math.max(0, ((p - 0.14) / 0.52) * 6)))),
  );

  return (
    <section ref={ref} className="relative h-[200vh]">
      {/*
        Same fix as the reckoning's three beats, which share this exact
        shape: a mega-number block plus an h-vh/w-auto chart in a row that
        never wrapped. On a phone that produces a chart as wide as it is
        tall, which is wider than the screen — stack instead, and size the
        chart off viewport width there rather than height.
      */}
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-6 overflow-hidden px-6 md:flex-row md:gap-[3vw] md:px-[6vw]">
        <div className="flex shrink-0 flex-col text-center md:text-left">
          <span
            className="t-mega font-header tabular-nums"
            style={{ color: PEN.gain }}
          >
            +{healed}
          </span>
          <span
            className="font-sub text-2xl italic md:text-3xl"
            style={{ color: PEN.ink, opacity: 0.65 }}
          >
            years back
          </span>
          <p
            className="mt-6 font-hand text-3xl md:text-4xl"
            style={{ color: PEN.ink }}
          >
            <WordReveal text="Look what I made." />
          </p>
          <Annotation dir="down-right" seed="hers-to-give" className="mt-6 hidden lg:flex">
            she gave these back
          </Annotation>
        </div>

        <LifeSheet
          filled={32}
          healed={healed}
          canHeal
          className="h-auto w-[76vw] max-w-[22rem] shrink md:h-[64vh] md:w-auto md:max-w-[52vw]"
        />

        <Standing className="bottom-[4vh] right-[3vw] hidden xl:block">
          <Avatar
            name="kid-showing-mom-hobby-proud"
            enter
            className="h-56 xl:h-72"
            sizes="24vw"
          />
        </Standing>
      </div>
    </section>
  );
}
