"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import Avatar from "../Avatar";
import Standing from "../Standing";
import WordReveal from "../WordReveal";
import { PEN } from "../ink/Ink";
import { theme } from "@/theme";

/**
 * PAGE 03 — the hinge, and the reason the rest of the site is allowed
 * to be warm.
 *
 * The old pivot read "Your mom was right. The phone was the problem."
 * That closes the data argument but opens nothing — it's a verdict. The
 * turn this site needs is the one that reframes every nag the visitor has
 * ever received as worry, because that's the feeling the product trades on.
 *
 * Two things land on the same scroll frame and neither is written down:
 * momm steps in and overlaps the line, and the colour comes back into the
 * kid. `kid-sad` is the only desaturated asset in the set, so the drain
 * and its reversal were already drawn for us.
 *
 * The lines used to sit on notes. That was right on the door and is wrong
 * here — we're already on her paper, and a sheet of cream taped to a sheet
 * of cream is a material contradiction, not a layer. So the words go
 * straight onto the surface at display size, which is also the only way
 * this beat can hold a whole screen without a chart to carry it.
 */
export default function PageTurn() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const s = p < 0.24 ? 0 : p < 0.58 ? 1 : 2;
    stageRef.current = s;
    setStage(s);
  });

  /** the three lines the site turns on, lit at exactly the reader's pace */
  const lineProgress = useTransform(scrollYProgress, (p) => {
    const [a, b] = BANDS[stageRef.current];
    return Math.min(1, Math.max(0, (p - a) / (b - a) / 0.72));
  });

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-[7vw]">
        <div className="relative z-10 w-full max-w-[52rem]">
          <AnimatePresence mode="wait">
            <motion.p
              key={stage}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.34 }}
              className="t-display font-hand"
              style={{ color: PEN.ink, lineHeight: 1.04 }}
            >
              <WordReveal text={LINES[stage]} progress={lineProgress} />
            </motion.p>
          </AnimatePresence>
        </div>

        <Standing className="bottom-[6vh] left-[6vw]">
          <Avatar
            name={stage >= 2 ? "kid-neutral" : "kid-sad"}
            drained={stage < 2}
            bob={stage >= 2}
            className="h-28 sm:h-36 md:h-44"
            sizes="(max-width: 768px) 26vw, 14vw"
          />
        </Standing>

        {/* she steps in from the right and overlaps the words — the same
            "too big for its box" move the comic made by breaking a frame,
            except there's no box here, just depth */}
        <AnimatePresence>
          {stage >= 1 && (
            <motion.div
              key="momm"
              initial={{ opacity: 0, x: 120 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 84, damping: 18 }}
              className="pointer-events-none absolute bottom-0 right-[2vw] z-20"
              style={{ filter: `drop-shadow(-16px 18px 20px ${theme.ink}26)` }}
            >
              <Avatar
                name="momm-offering-a-hand"
                bob={false}
                shadow={false}
                className="h-64 sm:h-80 md:h-[30rem] lg:h-[38rem]"
                sizes="(max-width: 768px) 52vw, 34vw"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

const LINES = [
  "You know what she'd say.",
  "She was never nagging.",
  "She just wanted you back.",
];

/** stage boundaries in section progress — the reveal maps onto these */
const BANDS: [number, number][] = [
  [0.0, 0.24],
  [0.24, 0.58],
  [0.58, 1.0],
];
