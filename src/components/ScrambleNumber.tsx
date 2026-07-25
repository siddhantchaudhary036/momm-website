"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Props = {
  /** the live/final value to display */
  value: string;
  /** flip true once, at the moment the number "locks in" */
  active: boolean;
  /** ms for the scramble-to-lock flourish */
  duration?: number;
  className?: string;
};

/**
 * Renders `value` plainly (so it can ride a live count-up) until
 * `active` flips true once — then runs a one-shot decrypt-style
 * scramble that resolves left-to-right into the final value.
 * Reduced-motion: skips the flourish, always shows `value` directly.
 */
export default function ScrambleNumber({
  value,
  active,
  duration = 650,
  className = "",
}: Props) {
  const reduced = useReducedMotion();
  const [scrambling, setScrambling] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reduced || !active || startedRef.current) return;
    startedRef.current = true;

    const chars = Array.from(value);
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const revealCount = Math.floor(t * chars.length);
      setScrambling(
        chars
          .map((c, i) =>
            c === " " || i < revealCount
              ? c
              : CHARSET[(Math.random() * CHARSET.length) | 0],
          )
          .join(""),
      );
      if (t < 1) raf = requestAnimationFrame(tick);
      else setScrambling(null);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, active, value, duration]);

  return <span className={className}>{scrambling ?? value}</span>;
}
