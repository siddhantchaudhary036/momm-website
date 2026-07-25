"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * One-shot impact: a screen-shake jitter plus two color-split ghost
 * copies (red / cyan) that fly outward and burn off. Reserved for the
 * single biggest gut-punch moment (the 32-years lock-in) — using this
 * everywhere would cheapen it.
 *
 * `active` should flip false→true exactly once; re-mount with a new
 * `key` to replay. Fully disabled under prefers-reduced-motion.
 */
export default function GlitchBurst({
  active,
  children,
  className = "",
}: {
  active: boolean;
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced || !active) {
    return <span className={`relative inline-block ${className}`}>{children}</span>;
  }

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      animate={{ x: [0, -7, 6, -5, 4, -2, 0], y: [0, 3, -3, 2, -2, 0] }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none"
        style={{ color: "#FF2D55", mixBlendMode: "screen" }}
      >
        <motion.span
          className="block"
          initial={{ x: 9, opacity: 0.85 }}
          animate={{ x: 0, opacity: 0 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
        >
          {children}
        </motion.span>
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none"
        style={{ color: "#12E0FF", mixBlendMode: "screen" }}
      >
        <motion.span
          className="block"
          initial={{ x: -9, opacity: 0.85 }}
          animate={{ x: 0, opacity: 0 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
        >
          {children}
        </motion.span>
      </span>
      {children}
    </motion.span>
  );
}
