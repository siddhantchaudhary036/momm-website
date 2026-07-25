"use client";

import {
  MotionValue,
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

type Props = {
  text: string;
  /**
   * External driver — pass a scroll progress value and the line lights
   * word by word as the reader scrolls. Omit it and the line sweeps
   * itself once when it comes into view, so static sections get the
   * same effect without needing a scroll runway of their own.
   */
  progress?: MotionValue<number>;
  /** words mid-fade at any moment — the softness of the leading edge */
  feather?: number;
  /** opacity of a word that hasn't been reached yet */
  dim?: number;
  /** duration of the self-sweep, ms (ignored when `progress` is given) */
  sweepMs?: number;
  /** hold before the self-sweep starts, ms */
  delayMs?: number;
  className?: string;
};

/**
 * Text that lights up word by word.
 *
 * Replaces the typewriter: typing reveals at a speed the page chooses,
 * which means it can finish long before a reader arrives or still be
 * going after they've left. Tying the reveal to scroll hands the pace
 * back to them — the line is exactly as far along as they are.
 *
 * The leading edge is feathered across several words rather than
 * snapping one at a time, which is what keeps it reading as a wave of
 * attention instead of a progress bar.
 *
 * Every word renders at full opacity for a screen reader; only the
 * visual opacity moves, and the whole line is laid out up front, so
 * nothing reflows mid-reveal.
 */
export default function WordReveal({
  text,
  progress,
  feather = 4,
  dim = 0.2,
  sweepMs = 1100,
  delayMs = 0,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const local = useMotionValue(progress ? 1 : 0);
  const words = useMemo(() => text.split(/(\s+)/).filter(Boolean), [text]);

  useEffect(() => {
    if (progress) return;
    if (reduced) {
      local.set(1);
      return;
    }
    if (!inView) return;
    const controls = animate(local, 1, {
      duration: sweepMs / 1000,
      delay: delayMs / 1000,
      ease: "linear",
    });
    return () => controls.stop();
  }, [inView, progress, reduced, local, sweepMs, delayMs]);

  const p = progress ?? local;
  const n = words.filter((w) => w.trim()).length;

  // reduced motion gets the finished line, not a faster sweep
  if (reduced && progress) {
    return (
      <span ref={ref} className={className}>
        {text}
      </span>
    );
  }

  let wordIndex = -1;
  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => {
        if (!w.trim()) return <span key={i}>{w}</span>;
        wordIndex += 1;
        return (
          <Word key={i} p={p} i={wordIndex} n={n} feather={feather} dim={dim}>
            {w}
          </Word>
        );
      })}
    </span>
  );
}

function Word({
  p,
  i,
  n,
  feather,
  dim,
  children,
}: {
  p: MotionValue<number>;
  i: number;
  n: number;
  feather: number;
  dim: number;
  children: ReactNode;
}) {
  const opacity = useTransform(p, (v) => {
    // the wavefront runs a little past the end so the last word finishes
    const lead = v * (n + feather) - i;
    return dim + (1 - dim) * clamp01(lead / feather);
  });
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}
    </motion.span>
  );
}
