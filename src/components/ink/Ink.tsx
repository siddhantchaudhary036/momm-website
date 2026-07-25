"use client";

import { motion } from "framer-motion";
import { ReactNode, SVGProps } from "react";
import { theme } from "@/theme";

/**
 * The React side of the pen.
 *
 * Strokes draw themselves with `stroke-dashoffset`, and the length they
 * need for that comes from SVG's own `pathLength` attribute rather than
 * from `getTotalLength()`. That matters more than it sounds: measuring a
 * path requires the DOM, which would mean every chart on this site starts
 * life unmeasured on the server, flashes fully-drawn on hydration, and
 * only then animates. Normalising every path to `pathLength={1}` makes
 * "half drawn" a value we can render server-side.
 *
 * The draw itself is a CSS transition, not a framer animation. These
 * charts run 150+ strokes at once; handing 150 interpolations to the main
 * thread on every scroll frame is exactly the jank the reckoning was
 * rebuilt to avoid. React only ever flips a stroke between two states and
 * the browser does the in-between.
 */

export const PEN = {
  /** momm's ballpoint — the same blue she signs her notes in */
  ink: theme.pen,
  /** structural marks: rules, axes, the boxes she draws round things */
  rule: theme.pen + "66",
  /** what the phone has taken */
  loss: theme.danger,
  /** what she gives back */
  gain: theme.heal,
} as const;

type StrokeProps = Omit<SVGProps<SVGPathElement>, "ref"> & {
  d: string;
  /** false = retracted, true = drawn. Transitions between the two. */
  drawn?: boolean;
  /** ms for the pen to travel this stroke */
  speed?: number;
  /** ms to wait first — how a field of strokes gets its cascade */
  delay?: number;
};

export function Stroke({
  d,
  drawn = true,
  speed = 260,
  delay = 0,
  stroke = PEN.ink,
  strokeWidth = 2,
  style,
  ...rest
}: StrokeProps) {
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
      /* after the spread, and with the caller's style merged in rather
         than replacing: every chart here passes a `style` for opacity,
         and a spread that clobbered the dash offset would silently leave
         each of them fully drawn from the first frame */
      style={{
        ...style,
        strokeDasharray: 1,
        strokeDashoffset: drawn ? 0 : 1,
        transition: `stroke-dashoffset ${speed}ms ease-out`,
        transitionDelay: `${delay}ms`,
      }}
    />
  );
}

/**
 * A stroke that draws once when it scrolls into view.
 *
 * For the static sections, which have no scroll runway of their own to
 * scrub against.
 */
export function StrokeInView({
  d,
  speed = 700,
  delay = 0,
  stroke = PEN.ink,
  strokeWidth = 2,
  amount = 0.4,
  opacity,
  className,
}: {
  d: string;
  speed?: number;
  delay?: number;
  stroke?: string;
  strokeWidth?: number;
  /** how much of the stroke's own box must be visible before it draws */
  amount?: number;
  opacity?: number;
  className?: string;
}) {
  return (
    <motion.path
      d={d}
      pathLength={1}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      className={className}
      initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      whileInView={{ strokeDashoffset: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: speed / 1000, delay: delay / 1000, ease: "easeOut" }}
    />
  );
}

/**
 * An SVG that scales to its container and never crops.
 *
 * `preserveAspectRatio` is deliberate: a chart that letterboxes is fine,
 * a chart that clips its own annotations is not, and these all carry
 * marginalia that lives outside the plot area.
 */
export function Ink({
  w,
  h,
  children,
  className = "",
  style,
}: {
  w: number;
  h: number;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      style={style}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      focusable="false"
    >
      {children}
    </svg>
  );
}

/**
 * Where stroke `i` of `n` sits in a 0–1 scrub.
 *
 * `width` is how much of the runway a single stroke owns; the rest is
 * stagger. Wide windows overlap into a wash, narrow ones read as one
 * stroke at a time. Around 0.1 is where a field of tally marks starts
 * looking like someone counting rather than a loading bar.
 */
export function band(i: number, n: number, width = 0.1): [number, number] {
  const start = (i / Math.max(1, n - 1)) * (1 - width);
  return [start, start + width];
}
