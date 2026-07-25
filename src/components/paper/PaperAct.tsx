import { ReactNode } from "react";
import { TOOTH } from "../fridge/paper";
import Tape from "../fridge/Tape";
import { PAPER_LIGHT, PAPER_TOOTH_OPACITY, PAPER_TOOTH_SIZE } from "./surface";
import { inkLine } from "@/lib/ink";
import { theme } from "@/theme";

/**
 * A stretch of the site that happens *on* the paper rather than on the door.
 *
 * The site now has an inside and an outside, and this is the inside. The
 * door is the room — enamel, daylight, the product, other people. Paper is
 * her hand: her arithmetic, her margin notes, the drawing she kept. You
 * get in by the hero pushing through the note until the sheet is all
 * there is, and you get out by seeing the sheet's edge again.
 *
 * That last part is why the edge is drawn rather than faded. A background
 * that cross-dissolves from cream to blue-grey is two colours; a sheet of
 * paper whose bottom edge you can see, with the door showing under it, is
 * an object — and the object is the only reason any of this reads as one
 * place instead of a sequence of coloured bands.
 *
 * There are no ruled lines here on purpose. The hero's note has them and
 * they fade out as the zoom pushes in, because at this distance you are
 * closer to the sheet than the ruling is useful at — what you'd actually
 * see is fibre, which is what's left.
 */

const EDGE_W = 1200;
const EDGE_H = 26;

/**
 * The cut edge of the sheet, and the door showing beneath it.
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
  /** show the sheet's cut edge, and the door under it */
  edges = "none",
  /** a sheet with both edges visible is an object, so it needs holding up */
  fasten = false,
  seed = "sheet",
}: {
  children: ReactNode;
  className?: string;
  edges?: "none" | "bottom" | "both";
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
      {/* the sheet is lit from the same window as everything else */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: PAPER_LIGHT }}
      />

      {edges === "both" && <Edge side="top" seed={`${seed}-top`} />}
      {edges !== "none" && <Edge side="bottom" seed={`${seed}-bottom`} />}

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
