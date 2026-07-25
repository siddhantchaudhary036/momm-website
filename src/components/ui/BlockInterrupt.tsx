"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Icon from "./Icon";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The block, performed instead of depicted.
 *
 * Every other site in this category shows you a photograph of an app
 * blocking something. This one does it to you: the page goes dark, momm
 * says no, and you have to get past her to keep reading. Enacting the
 * product is the most memorable thing a landing page can do, and it costs
 * one section.
 *
 * It deliberately stops short of actually trapping anyone — scroll is
 * never hijacked and nothing is disabled. The panel is sticky, so it
 * *covers* rather than *captures*, and normal scrolling carries you
 * through it. A page that genuinely blocks its reader is a page people
 * leave, and being hostile isn't the same as being firm — which is the
 * distinction momm herself is built on.
 */
export default function BlockInterrupt() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // snaps shut fast, holds, then lets go — the snap is what sells it
  const cover = useTransform(scrollYProgress, [0.18, 0.3, 0.72, 0.86], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.18, 0.32], [1.08, 1]);
  const textY = useTransform(scrollYProgress, [0.28, 0.4], [18, 0]);

  return (
    <section ref={ref} className="relative h-[150vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
          style={{
            opacity: reduced ? 1 : cover,
            scale: reduced ? 1 : scale,
            background:
              "radial-gradient(90% 70% at 50% 40%, #16101B 0%, #08050C 60%, #050308 100%)",
          }}
        >
          <motion.div style={{ y: reduced ? 0 : textY }} className="flex flex-col items-center gap-4">
            <Icon name="lock" size={34} className="text-white/35" strokeWidth={1.5} />
            <p className="font-header text-6xl font-black text-white md:text-8xl">Nope.</p>
            <p className="font-sub text-2xl italic text-white/70 md:text-3xl">
              Put it down. — momm
            </p>
            <div className="mt-3 rounded-full border border-white/20 px-6 py-2.5 text-sm text-white/45">
              ok, fine
            </div>
            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-white/25">
              keep scrolling
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
