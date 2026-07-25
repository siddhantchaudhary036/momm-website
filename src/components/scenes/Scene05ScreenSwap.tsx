"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { ReactNode, useRef, useState } from "react";
import PhoneFrame from "../phone/PhoneFrame";
import {
  BlockScreen,
  FocusPausedScreen,
  LimitsScreen,
  ReelsLockedScreen,
  SnitchScreen,
  StreakScreen,
} from "../phone/screens";
import Typewriter from "../Typewriter";
import { theme } from "@/theme";

/** every step is mom doing something to you — never a "feature" */
const STEPS: { line: string; screen: ReactNode }[] = [
  { line: "momm sealed the Reels tab shut.", screen: <ReelsLockedScreen /> },
  { line: "15 minutes in? momm tells on you.", screen: <SnitchScreen /> },
  { line: "Try to open it. momm says no.", screen: <BlockScreen /> },
  { line: "momm sets your limits. And means it.", screen: <LimitsScreen /> },
  { line: "Keep the streak. Make momm proud.", screen: <StreakScreen /> },
  { line: "Look away, and momm stops the clock.", screen: <FocusPausedScreen /> },
];

/**
 * SCENE 05 — one phone pinned center; its screen morphs through
 * momm's behaviors as you scroll. One typed line rides alongside.
 */
export default function Scene05ScreenSwap() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [step, setStep] = useState(0);
  const stepMV = useTransform(scrollYProgress, [0.02, 0.98], [0, STEPS.length - 0.001]);
  useMotionValueEvent(stepMV, "change", (v) =>
    setStep(Math.min(STEPS.length - 1, Math.max(0, Math.floor(v)))),
  );

  return (
    <section ref={ref} className="relative h-[600vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-4 px-6 md:flex-row md:gap-24">
        <div className="flex flex-col items-center gap-5 text-center md:w-[26rem] md:items-start md:text-left">
          <h2 className="min-h-[2.8em] font-header text-2xl font-semibold leading-snug md:text-4xl">
            <Typewriter key={step} text={STEPS[step].line} speed={42} />
          </h2>
          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-8" : "w-1.5"
                }`}
                style={{ backgroundColor: i === step ? theme.ink : theme.ink + "40" }}
              />
            ))}
          </div>
        </div>

        <div className="scale-[0.62] sm:scale-[0.8] md:scale-100">
          <PhoneFrame width={270}>
            <div className="relative h-full w-full bg-[#0B0714]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={step}
                  className="absolute inset-0"
                  initial={{ opacity: 0, y: 48, rotateY: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -48, rotateY: -18, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  {STEPS[step].screen}
                </motion.div>
              </AnimatePresence>
            </div>
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}
