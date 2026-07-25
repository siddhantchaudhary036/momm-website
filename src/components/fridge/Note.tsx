"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import Magnet from "./Magnet";
import Tape from "./Tape";
import { PAPER_SHADOW, RULE, TOOTH, paperBackground, type PaperKind } from "./paper";
import { INSTANT, PAPER } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { rngFrom } from "@/lib/prng";
import { theme } from "@/theme";

type Props = {
  children: ReactNode;
  /** stable identity — drives the tilt, so it never re-rolls */
  seed?: string;
  paper?: PaperKind;
  fasten?: "tape" | "tape-1" | "magnet" | "none";
  /** her voice, on the rules, in ballpoint */
  hand?: boolean;
  className?: string;
  /** lifts in on arrival like it's just been stuck up */
  enter?: boolean;
  delay?: number;
};

/**
 * A sheet of paper on the fridge door.
 *
 * This is what replaced the comic panel and the speech balloon at once.
 * A note doesn't need a border because it *is* an object, and it doesn't
 * need a tail because a note on the fridge is self-evidently from her —
 * attribution comes free with the metaphor, which is the whole reason the
 * frames and the connecting lines could go.
 *
 * Tilt is small and seeded: small because a big rotation reads as
 * amateur rather than handmade, and seeded so the server and the client
 * agree on the angle instead of hydrating into a different one.
 */
export default function Note({
  children,
  seed = "note",
  paper = "lined",
  fasten = "tape",
  hand = false,
  className = "",
  enter = true,
  delay = 0,
}: Props) {
  const reduced = useReducedMotion();
  const rand = rngFrom(seed);
  const tilt = (rand() - 0.5) * 2 * theme.fridge.tilt;
  /**
   * The same two strips at the same two corners on every sheet is
   * mechanical — the exact opposite of the handmade feel this is reaching
   * for. Each note draws its own arrangement from its seed, so the wall
   * looks stuck up over time rather than laid out in one pass.
   */
  const style = fasten === "tape" ? Math.floor(rand() * 3) : 0;
  const tapeRot = -38 + rand() * 18;
  const tapeRot2 = 38 - rand() * 18;
  const skew = (rand() - 0.5) * 26;

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ rotate: tilt }}
      initial={enter && !reduced ? { opacity: 0, y: -14, rotate: tilt * 2.2 } : false}
      whileInView={enter ? { opacity: 1, y: 0, rotate: tilt } : undefined}
      viewport={{ once: true, amount: 0.35 }}
      transition={
        reduced ? INSTANT : { ...PAPER, delay }
      }
    >
      <div
        className="relative"
        style={{
          background: theme.paper,
          borderRadius: 2,
          boxShadow: PAPER_SHADOW,
        }}
      >
        {paper !== "plain" && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: paperBackground(paper), borderRadius: 2 }}
          />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
          style={{ backgroundImage: TOOTH, borderRadius: 2 }}
        />
        <div
          className={`relative ${hand ? "font-hand" : ""}`}
          style={
            hand
              ? { color: theme.pen, lineHeight: `${RULE}px` }
              : { color: theme.ink }
          }
        >
          {children}
        </div>
      </div>

      {fasten === "tape" && style === 0 && (
        <>
          <Tape className="-left-5 -top-3" rotate={tapeRot} />
          <Tape className="-right-5 -top-3" rotate={tapeRot2} />
        </>
      )}
      {fasten === "tape" && style === 1 && (
        <Tape className="-top-4 left-[18%]" rotate={skew} width={90} />
      )}
      {fasten === "tape" && style === 2 && (
        <>
          <Tape className="-left-6 -top-2" rotate={tapeRot} width={68} />
          <Tape className="-bottom-2 -right-6" rotate={tapeRot2} width={62} />
        </>
      )}
      {fasten === "tape-1" && (
        <Tape className="left-1/2 -top-4 -translate-x-1/2" rotate={tapeRot / 6} />
      )}
      {fasten === "magnet" && (
        <>
          <Magnet className="-left-2 -top-2" />
          <Magnet className="-right-2 -top-2" color="#3D7BFF" />
          <Magnet className="-bottom-2 -left-2" color="#F2A93B" />
          <Magnet className="-bottom-2 -right-2" color="#12B981" />
        </>
      )}
    </motion.div>
  );
}
