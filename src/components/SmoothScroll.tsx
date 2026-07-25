"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Global inertia scroll. `root` mode patches native window scroll
 * directly (no wrapper/content divs), so every existing Framer Motion
 * `useScroll` target still reads real scroll position — this just
 * makes the motion underneath it heavier and smoother.
 *
 * Skipped entirely under prefers-reduced-motion: lerped/inertia scroll
 * is itself a motion effect some users need off, not softened.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        touchMultiplier: 1.4,
      }}
    >
      {children}
    </ReactLenis>
  );
}
