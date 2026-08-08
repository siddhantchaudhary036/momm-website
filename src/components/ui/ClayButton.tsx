"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { theme } from "@/theme";

/**
 * The primary button, in clay.
 *
 * A raised pill filled with the logo's blue→pink sweep — the one loud thing
 * on a screen. Clay is squishy, so a press should look like a press: on
 * pointer-down it swaps from the `raised` recipe to `pressed` and scales down
 * a hair, then releases. That physical give is the whole reason a clay button
 * reads as pressable where a flat one just changes colour.
 *
 * Label is `theme.ink`, not white — white on periwinkle is the contrast
 * problem the palette already solved this way (see `theme.ts`). Reduced motion
 * keeps the shadow swap (it's state, not animation) but drops the scale.
 */
export default function ClayButton({
  children,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}: {
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [pressed, setPressed] = useState(false);

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      animate={reduced ? undefined : { scale: pressed ? 0.96 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`font-header text-base font-bold disabled:opacity-60 md:text-lg ${className}`}
      style={{
        color: theme.ink,
        borderRadius: theme.clay.radius,
        background: `linear-gradient(${theme.gradient.angle}, ${theme.gradient.from}, ${theme.gradient.to})`,
        boxShadow: pressed ? theme.clay.pressed : theme.clay.raised,
      }}
    >
      {children}
    </motion.button>
  );
}
