"use client";

import { useEffect, useState } from "react";

/**
 * True when the user has requested reduced motion at the OS level.
 * Every "drastic" effect (shake, scramble, magnetic pull, custom
 * cursor, liquid transitions, smooth-scroll inertia) must check this
 * and fall back to an instant/static equivalent — not a softened
 * version. Defaults to false during SSR, resolves on mount.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
