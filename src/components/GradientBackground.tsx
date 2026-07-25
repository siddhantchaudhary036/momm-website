"use client";

import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";
import { theme } from "@/theme";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The blue→pink gradient, graded by page-scroll position: vivid at
 * the top, draining toward dread through the reckoning, bottoming out
 * dark/desaturated at the "32 years" gut-punch and through the pivot,
 * then blooming back brighter than before once "your mom was right"
 * resolves. Ties the emotional arc to color, not just copy.
 *
 * Purely a function of scroll position (no autoplay loop), so it's
 * left on under reduced motion — only the spring "chase" lag is
 * dropped in favor of a direct 1:1 mapping.
 */
export default function GradientBackground() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: reduced ? 1000 : 60,
    damping: reduced ? 100 : 20,
  });
  const p = reduced ? scrollYProgress : smooth;

  const stops = [0, 0.28, 0.45, 0.62, 0.78, 0.9, 0.95, 1];
  const saturate = useTransform(p, stops, [1, 0.85, 0.65, 0.32, 0.5, 0.35, 1.25, 1]);
  const brightness = useTransform(p, stops, [1, 0.94, 0.85, 0.6, 0.72, 0.62, 1.08, 1]);
  const contrast = useTransform(p, stops, [1, 1, 1.02, 1.12, 1.05, 1.08, 1, 1]);
  const filter = useMotionTemplate`saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 -z-10"
      style={{
        background: `linear-gradient(${theme.gradient.angle}, ${theme.gradient.from} 0%, ${theme.gradient.to} 100%)`,
        filter,
      }}
    />
  );
}
