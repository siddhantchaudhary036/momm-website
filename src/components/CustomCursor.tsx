"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { theme } from "@/theme";

/**
 * Replaces the system cursor with a small dot + trailing ring that
 * grows over interactive elements — "momm is watching." Desktop only
 * (pointer: fine); fully disabled under reduced motion rather than
 * just de-animated, since a chasing ring is exactly the kind of motion
 * some users need off.
 *
 * Drawn white through `mix-blend-mode: difference` rather than in a fixed
 * colour. The site is matte black for its first screen and cream for the
 * rest, and a single ink-coloured cursor is invisible on the black half —
 * which, since we've hidden the real cursor, means no cursor at all.
 * Difference inverts against whatever is behind it: white over black, near
 * ink over paper, correct on both without having to know which act the
 * pointer is over.
 */
export default function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (reduced) {
      setEnabled(false);
      return;
    }
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor-active");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest(
        "a, button, input, textarea, [role='button']",
      );
      setHovering(!!el);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s",
        mixBlendMode: "difference",
      }}
    >
      {/* the dot — no lag */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x,
          y,
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          backgroundColor: theme.text,
        }}
      />
      {/* the ring — trails slightly, blooms over clickables */}
      <motion.div
        className="absolute rounded-full border"
        animate={{
          width: hovering ? 52 : 30,
          height: hovering ? 52 : 30,
          marginLeft: hovering ? -26 : -15,
          marginTop: hovering ? -26 : -15,
          borderColor: hovering ? theme.text : theme.text + "88",
          /* `theme.text + "00"` rather than the keyword: framer can't
             interpolate to `transparent`, and animating to it logs a warning
             and snaps instead of fading. Same colour, as an animatable one. */
          backgroundColor: hovering ? theme.text + "14" : theme.text + "00",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={{ x: ringX, y: ringY }}
      />
    </div>
  );
}
