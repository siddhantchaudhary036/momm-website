"use client";

import { motion, useInView } from "framer-motion";
import { useId, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { theme } from "@/theme";

/**
 * A liquid morph moment between two scenes — an organic blob shape,
 * warped by a static SVG turbulence/displacement filter, that blooms
 * in once as it scrolls into view. The filter itself is static (no
 * per-frame cost); only its entrance (scale/opacity) animates.
 *
 * Under reduced motion, collapses to a plain static hairline —
 * the liquid "reveal" is the part that's pure flourish.
 */
export default function LiquidDivider() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const filterId = useId();

  if (reduced) {
    return (
      <div className="mx-auto h-px w-24" style={{ backgroundColor: theme.ink + "33" }} />
    );
  }

  return (
    <div ref={ref} className="relative flex h-28 items-center justify-center overflow-hidden md:h-36">
      <svg width="100%" height="100%" viewBox="0 0 1200 140" preserveAspectRatio="none" className="absolute inset-0">
        <defs>
          <filter id={filterId} x="-20%" y="-60%" width="140%" height="220%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.045" numOctaves={2} seed={4} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={38} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <motion.ellipse
          cx="600"
          cy="70"
          rx="620"
          ry="3"
          fill={theme.ink}
          style={{ filter: `url(#${filterId})` }}
          initial={{ opacity: 0, scaleY: 0.2 }}
          animate={inView ? { opacity: 0.16, scaleY: 6 } : undefined}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}
