"use client";

import { theme } from "@/theme";

/**
 * A torn strip of tape.
 *
 * Translucent so the paper and the door both read through it, with the
 * ragged edges cut by a mask rather than drawn — a straight-edged
 * rectangle reads as a sticker, and the tear is most of what sells it as
 * tape. Deliberately the only fastener besides the magnet.
 */
export default function Tape({
  className = "",
  rotate = -32,
  width = 76,
  height = 26,
}: {
  className?: string;
  rotate?: number;
  width?: number;
  height?: number;
}) {
  const torn =
    "repeating-linear-gradient(to bottom, #000 0 3px, transparent 3px 4px)";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      style={{
        width,
        height,
        transform: `rotate(${rotate}deg)`,
        background: `linear-gradient(160deg, ${theme.fridge.tape}D9 0%, #FFFFFFB8 45%, ${theme.fridge.tape}CC 100%)`,
        boxShadow: `0 1px 2px ${theme.ink}1A`,
        // ragged left and right ends only — the long edges stay clean
        WebkitMaskImage: `${torn}, linear-gradient(#000, #000)`,
        maskImage: `${torn}, linear-gradient(#000, #000)`,
        WebkitMaskSize: "6px 100%, calc(100% - 12px) 100%",
        maskSize: "6px 100%, calc(100% - 12px) 100%",
        WebkitMaskPosition: "left center, center",
        maskPosition: "left center, center",
        WebkitMaskRepeat: "repeat-y, no-repeat",
        maskRepeat: "repeat-y, no-repeat",
      }}
    />
  );
}
