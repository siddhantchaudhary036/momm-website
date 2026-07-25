"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import Typewriter from "../Typewriter";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * SCENE 00 — the open. Nothing but mom, typing.
 * "Get off your phone!" types out; "— your momm" signs itself in.
 * The whole thing recedes as you scroll away, with a touch of spring
 * lag so it feels like it's being pulled back rather than just fading.
 */
export default function Scene00Hero() {
  const [signed, setSigned] = useState(false);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const rawOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const rawY = useTransform(scrollY, [0, 600], [0, 140]);
  const rawScale = useTransform(scrollY, [0, 600], [1, 0.92]);
  const springCfg = reduced
    ? { stiffness: 1000, damping: 100 }
    : { stiffness: 120, damping: 20 };
  const opacity = useSpring(rawOpacity, springCfg);
  const y = useSpring(rawY, springCfg);
  const scale = useSpring(rawScale, springCfg);
  const hintOpacity = useTransform(scrollY, [0, 150], [1, 0]);

  return (
    <section className="relative flex h-screen flex-col items-center justify-center px-6">
      <motion.div
        style={{ opacity, y, scale }}
        className="flex flex-col items-center text-center"
      >
        <h1 className="font-header text-4xl font-black leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <Typewriter
            text="Get off your phone!"
            speed={70}
            startDelay={700}
            onDone={() => setTimeout(() => setSigned(true), 450)}
            keepCaret={!signed}
          />
        </h1>
        <motion.p
          initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0, y: 10 }}
          animate={
            signed
              ? { clipPath: "inset(0 -5% 0 0)", opacity: 1, y: 0 }
              : undefined
          }
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mt-5 font-sub text-2xl italic text-white/85 sm:text-3xl md:text-4xl"
        >
          — your momm
        </motion.p>
      </motion.div>

      <motion.div
        style={{ opacity: hintOpacity }}
        className="absolute bottom-8 flex flex-col items-center gap-1 text-white/80"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-2xl"
          aria-hidden
        >
          ⌄
        </motion.span>
      </motion.div>
    </section>
  );
}
