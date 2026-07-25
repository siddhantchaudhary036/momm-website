"use client";

import { useMemo } from "react";
import Avatar from "../Avatar";
import Standing from "../Standing";
import WordReveal from "../WordReveal";
import { Ink, PEN, StrokeInView } from "../ink/Ink";
import { inkLine } from "@/lib/ink";

/**
 * The landing, immediately after the push-in.
 *
 * This is what the old hook scene becomes. As a section on the door it
 * was a note and an avatar and thirty-six lines of code, and it repeated
 * the hero's move one screen after the hero made it. Here it has an
 * actual job: you have just travelled *through* a sheet of paper, and a
 * transition that big needs somewhere to land before the arithmetic
 * starts. One line, held, on the surface you arrived on.
 *
 * Set left rather than centred, which is the first thing on the site that
 * isn't. Everything used to be `items-center justify-center`, and nine
 * sections of perfect symmetry is most of why the page read as a template
 * — a composition with no axis to push against has no tension in it.
 */
export default function PaperOpen() {
  const underline = useMemo(
    () =>
      inkLine({ x: 0, y: 8 }, { x: 640, y: 8 }, {
        seed: "reason-underline",
        amp: 3,
        wavelength: 380,
        overshoot: 14,
      }),
    [],
  );

  return (
    <section className="relative flex min-h-[92vh] items-center px-[7vw] py-[12vh]">
      <div className="relative w-full max-w-[46rem]">
        <p
          className="t-display font-hand"
          style={{ color: PEN.ink, lineHeight: 1.05 }}
        >
          <WordReveal text="She was nagging for a reason." />
        </p>

        <Ink w={660} h={20} className="mt-2 h-4 w-full max-w-[36rem]">
          <StrokeInView
            d={underline}
            stroke={PEN.ink}
            strokeWidth={2.6}
            speed={900}
            delay={700}
          />
        </Ink>
      </div>

      <Standing className="bottom-[8vh] right-[8vw] hidden md:block">
        <Avatar name="kid-guilty" enter delay={0.35} className="h-40 lg:h-56" sizes="18vw" />
      </Standing>
    </section>
  );
}
