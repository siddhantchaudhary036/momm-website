"use client";

import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ReactNode, useRef, useState } from "react";
import PhoneFrame from "../phone/PhoneFrame";
import { BlockScreen, FocusScreen, TextsScreen } from "../phone/screens";
import Typewriter from "../Typewriter";

/** gentle idle float once the phones have settled */
function FloatWrap({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * SCENE 04 — "So we built you a new one." Three phones fly in from
 * different depths, twisting and turning with your scroll, then
 * settle into a fan. Sticky-scrubbed: the scroll IS the animation.
 */
export default function Scene04PhoneFan() {
  const ref = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const inView = useInView(stickyRef, { once: true, amount: 0.4 });
  const [signed, setSigned] = useState(false);

  // left phone — sweeps in from deep left, untwisting
  const lRy = useTransform(p, [0.05, 0.6], [-58, -16]);
  const lX = useTransform(p, [0.05, 0.6], [-420, 0]);
  const lZ = useTransform(p, [0.05, 0.6], [-480, 0]);
  const lRz = useTransform(p, [0.05, 0.6], [-14, -3]);
  const lO = useTransform(p, [0.05, 0.28], [0, 1]);
  // center phone — rises from below, tipping upright
  const cY = useTransform(p, [0.15, 0.7], [420, 0]);
  const cRx = useTransform(p, [0.15, 0.7], [48, 0]);
  const cS = useTransform(p, [0.15, 0.7], [0.55, 1]);
  const cO = useTransform(p, [0.15, 0.38], [0, 1]);
  // right phone — mirrors the left
  const rRy = useTransform(p, [0.25, 0.8], [58, 16]);
  const rX = useTransform(p, [0.25, 0.8], [420, 0]);
  const rZ = useTransform(p, [0.25, 0.8], [-480, 0]);
  const rRz = useTransform(p, [0.25, 0.8], [14, 3]);
  const rO = useTransform(p, [0.25, 0.48], [0, 1]);

  return (
    <section ref={ref} className="relative h-[320vh]">
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4"
      >
        <h2 className="text-center font-header text-2xl font-semibold md:text-4xl">
          <Typewriter
            text="So we built you a new one."
            start={inView}
            speed={60}
            keepCaret={!signed}
            onDone={() => setTimeout(() => setSigned(true), 350)}
          />
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={signed ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6 }}
          className="mt-2 font-sub text-xl italic text-white/80 md:text-2xl"
        >
          — momm
        </motion.p>

        <div
          className="mt-6 flex scale-[0.48] items-center justify-center gap-4 sm:scale-[0.65] md:mt-8 md:scale-[0.85] md:gap-8 lg:scale-100"
          style={{ perspective: 1200 }}
        >
          <motion.div
            style={{
              rotateY: lRy,
              x: lX,
              z: lZ,
              rotateZ: lRz,
              opacity: lO,
              transformStyle: "preserve-3d",
            }}
          >
            <FloatWrap delay={0}>
              <PhoneFrame width={225}>
                <BlockScreen />
              </PhoneFrame>
            </FloatWrap>
          </motion.div>

          <motion.div
            className="z-10"
            style={{
              y: cY,
              rotateX: cRx,
              scale: cS,
              opacity: cO,
              transformStyle: "preserve-3d",
            }}
          >
            <FloatWrap delay={0.6}>
              <PhoneFrame width={250}>
                <TextsScreen />
              </PhoneFrame>
            </FloatWrap>
          </motion.div>

          <motion.div
            style={{
              rotateY: rRy,
              x: rX,
              z: rZ,
              rotateZ: rRz,
              opacity: rO,
              transformStyle: "preserve-3d",
            }}
          >
            <FloatWrap delay={1.2}>
              <PhoneFrame width={225}>
                <FocusScreen />
              </PhoneFrame>
            </FloatWrap>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
