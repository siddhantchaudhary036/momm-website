"use client";

import { theme } from "@/theme";

/**
 * A fridge magnet — the second and last fastener.
 *
 * Tape holds momm's notes; magnets hold the paperwork. Splitting them by
 * what they carry means the fastener itself tells you which kind of thing
 * you're looking at before you read a word.
 */
export default function Magnet({
  className = "",
  size = 20,
  color = theme.fridge.magnet,
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        /* Flat and graphic, not a glossy sphere. A radial highlight on a
           circle is a Web 2.0 button, and it was the one artifact here
           breaking the matte rule — nothing in this world is shiny. */
        background: color,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28), 2px 3px 6px rgba(0,0,0,0.5)`,
      }}
    />
  );
}
