"use client";

import { useEffect, useState } from "react";

/**
 * A soft light that tracks the pointer — desktop only (pointer: fine),
 * direct 1:1 follow with no lag/spring, so it's no more "motion" than
 * the system cursor itself and needs no reduced-motion guard.
 */
export default function CursorSpotlight() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);

    const root = document.documentElement;
    const onMove = (e: PointerEvent) => {
      root.style.setProperty("--spot-x", `${e.clientX}px`);
      root.style.setProperty("--spot-y", `${e.clientY}px`);
    };
    if (mq.matches) window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[8] opacity-70 transition-opacity duration-300"
      style={{
        background:
          "radial-gradient(600px circle at var(--spot-x, 50%) var(--spot-y, 20%), rgba(255,255,255,0.22), transparent 65%)",
      }}
    />
  );
}
