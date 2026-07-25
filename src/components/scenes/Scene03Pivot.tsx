"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import LifeGrid from "../LifeGrid";
import Typewriter from "../Typewriter";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * SCENE 03 — the hinge. Dead quiet. The red life-grid lingers
 * faintly behind while mom types, slowly, one line at a time.
 * Each line racks into focus — blurred/oversized to sharp — before
 * it types, like a camera pulling focus. On the final word the red
 * cools toward white — the turn.
 */
export default function Scene03Pivot() {
  const stickyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stickyRef, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  // 0 = line one typing · 1 = line two typing · 2 = cooled
  const [stage, setStage] = useState(0);

  const focusIn = reduced
    ? { hidden: { opacity: 0 }, shown: { opacity: 1 } }
    : {
        hidden: { opacity: 0, filter: "blur(14px)", scale: 1.05 },
        shown: { opacity: 1, filter: "blur(0px)", scale: 1 },
      };

  return (
    <section className="relative h-[220vh]">
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-screen flex-col items-center justify-center gap-6 px-6"
      >
        {/* the frozen grid, ghosted behind */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.14]"
        >
          <LifeGrid filled={32} dim cooled={stage >= 2} />
        </div>

        <motion.h2
          initial={focusIn.hidden}
          animate={inView ? focusIn.shown : undefined}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative text-center font-header text-3xl font-bold md:text-5xl"
        >
          <Typewriter
            text="Your mom was right."
            start={inView}
            speed={115}
            keepCaret={stage < 1}
            onDone={() => setTimeout(() => setStage(1), 1300)}
          />
        </motion.h2>
        <h2 className="relative min-h-[1.4em] text-center font-header text-3xl font-bold md:text-5xl">
          {stage >= 1 && (
            <motion.span
              initial={focusIn.hidden}
              animate={focusIn.shown}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="inline-block"
            >
              <Typewriter
                text="The phone was the problem."
                speed={115}
                onDone={() => setTimeout(() => setStage(2), 700)}
              />
            </motion.span>
          )}
        </h2>
      </div>
    </section>
  );
}
