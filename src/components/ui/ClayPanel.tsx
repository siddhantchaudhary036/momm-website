"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PAPER } from "@/lib/motion";
import { theme } from "@/theme";

/**
 * CLAYMORPHISM PROTOTYPE — the clay counterpart to `fridge/Note`.
 *
 * Where a Note is a flat sheet held on with tape at a slight tilt, a clay
 * panel is an inflated, rounded blob that floats off the page. So the two
 * paper tells are gone on purpose: no tilt (a clay blob sits square) and no
 * fasteners (clay doesn't tape). Depth comes entirely from the shadow recipe
 * in `theme.clay`, never from a border or a different fill.
 *
 * It still lifts in on arrival, reusing the site's `PAPER` spring, so the
 * motion language is unchanged — only the surface it happens to is.
 */
export default function ClayPanel({
  children,
  className = "",
  /** an optional wash of colour under the surface — the logo pastels */
  tint,
  enter = true,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  tint?: string;
  enter?: boolean;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={{
        background: tint ?? theme.clay.surface,
        borderRadius: theme.clay.radius,
        boxShadow: theme.clay.raised,
      }}
      initial={enter && !reduced ? { opacity: 0, y: 16, scale: 0.97 } : false}
      whileInView={enter ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={{ once: true, amount: 0.35 }}
      transition={reduced ? { duration: 0 } : { ...PAPER, delay }}
    >
      {children}
    </motion.div>
  );
}
