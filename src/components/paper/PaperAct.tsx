import { ReactNode } from "react";
import { TOOTH } from "../fridge/paper";
import Tape from "../fridge/Tape";
import { PAPER_LIGHT, PAPER_TOOTH_OPACITY, PAPER_TOOTH_SIZE } from "./surface";
import { inkLine } from "@/lib/ink";
import { theme } from "@/theme";

/**
 * One act of the site, on her paper.
 *
 * You go through the door exactly once — the hero pushes through the note
 * until the sheet is everything — and after that this is the only surface
 * there is. So an act boundary is no longer a change of material, it's the
 * next sheet lying on the last one: a torn edge, a shadow under it, tape
 * across the top.
 *
 * That's why the edge is drawn rather than faded. A background that
 * cross-dissolves between two creams is a gradient; a sheet whose torn edge
 * you can see, casting a shadow onto the sheet beneath, is an object — and
 * the object is the only reason a stack of these reads as one fridge door
 * instead of a sequence of coloured bands.
 *
 * There are no ruled lines here on purpose. The hero's note has them and
 * they fade out as the zoom pushes in, because at this distance you are
 * closer to the sheet than the ruling is useful at — what you'd actually
 * see is fibre, which is what's left.
 */

const EDGE_W = 1200;
const EDGE_H = 26;

/**
 * The torn edge of the sheet, and whatever it's lying on showing beneath.
 *
 * Deliberately no `useMemo` and no `"use client"`: this whole component
 * is a server component wrapping client children, which is the right way
 * round, and one seeded path per act is not worth giving that up for.
 */
function Edge({ side, seed }: { side: "top" | "bottom"; seed: string }) {
  const y = side === "bottom" ? EDGE_H * 0.45 : EDGE_H * 0.55;
  const line = inkLine({ x: 0, y }, { x: EDGE_W, y }, {
    seed,
    amp: 4.5,
    wavelength: 420,
  });
  // close the path back along the paper's side so it fills as a sheet
  const d =
    side === "bottom"
      ? `${line} L${EDGE_W},0 L0,0 Z`
      : `${line} L${EDGE_W},${EDGE_H} L0,${EDGE_H} Z`;

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-10 ${
        side === "bottom" ? "top-full" : "bottom-full"
      }`}
      style={{ height: EDGE_H }}
      aria-hidden
    >
      <svg
        viewBox={`0 0 ${EDGE_W} ${EDGE_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{
          filter:
            side === "bottom"
              ? "drop-shadow(0 6px 7px rgba(56,46,38,0.30))"
              : "drop-shadow(0 -5px 6px rgba(56,46,38,0.24))",
        }}
      >
        <path d={d} fill={theme.paper} />
      </svg>
    </div>
  );
}

export default function PaperAct({
  children,
  className = "",
  /**
   * Which torn edges of this sheet are visible. `"top"` is the usual one —
   * it's the seam where this act begins, laid over the act before it.
   */
  edges = "none",
  /** a sheet whose edge you can see is an object, so it needs holding up */
  fasten = false,
  seed = "sheet",
}: {
  children: ReactNode;
  className?: string;
  edges?: "none" | "top" | "bottom" | "both";
  fasten?: boolean;
  seed?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ background: theme.paper }}>
      {/* fibre. At this distance it's the only surface detail there is,
          so it runs heavier than it does on a note-sized sheet. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{
          backgroundImage: TOOTH,
          backgroundSize: PAPER_TOOTH_SIZE,
          opacity: PAPER_TOOTH_OPACITY,
        }}
      />
      {/*
        The sheet is lit from the same window as everything else — and the
        light is attached to the viewport, not to the act.

        A percentage-positioned gradient sizes itself to its own box, and
        these boxes are nothing alike: the hero's is one screen tall, this
        one is eight. Left to scroll with the act, the same declaration
        renders as a warm glow at the top of the hero and as flat vignette
        mid-act, which put a visible horizontal band across the screen at
        the exact frame the push-in hands over. Fixed attachment makes the
        gradient viewport-sized in both places, which is the only way the
        two creams are the same cream.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: PAPER_LIGHT, backgroundAttachment: "fixed" }}
      />

      {(edges === "top" || edges === "both") && (
        <Edge side="top" seed={`${seed}-top`} />
      )}
      {(edges === "bottom" || edges === "both") && (
        <Edge side="bottom" seed={`${seed}-bottom`} />
      )}

      {fasten && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-20">
          <Tape className="left-[6vw] -top-3" rotate={-34} width={104} />
          <Tape className="right-[6vw] -top-3" rotate={31} width={104} />
        </div>
      )}

      <div className="relative">{children}</div>
    </div>
  );
}
