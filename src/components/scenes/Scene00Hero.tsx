"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Note from "../fridge/Note";
import Tape from "../fridge/Tape";
import WordReveal from "../WordReveal";
import { PAPER_SHADOW, RULE, TOOTH, paperBackground } from "../fridge/paper";
import { PAPER_LIGHT } from "../paper/surface";
import { HERO_ID } from "@/lib/anchors";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { theme } from "@/theme";

/**
 * SCENE 00 — the open, and the door into the rest of the site.
 *
 * Two jobs. First the hero it always was: one note taped to a black wall,
 * her voice, no frame and no tail, because a note on the fridge is
 * self-evidently from mom and the metaphor does the attribution for free.
 * Nothing else is in shot — no cast, no scroll cue. One sheet, lit, on
 * matte black, which is as much as a first screen ever needed.
 *
 * Then the transition the site was missing. Everything below this used to
 * be the same size as everything above it — notes at 30rem, avatars at
 * 12rem, charts at 340px, all centred, forever. A page where nothing is
 * ever very big or very small reads as assembled from parts. So the note
 * you have been reading gets pushed *through*: the sheet grows until it is
 * the whole screen, and the rest of the argument happens on it.
 *
 * The details that sell it are the ones that admit what getting closer to
 * paper actually does. The rules fade — at this distance ruling is no
 * longer the scale of thing you'd notice. The tape and the writing go
 * first, because they're objects on the sheet and we've moved past them.
 * The tilt straightens, since a sheet you're square-on to has no tilt.
 * And the fibre counter-scales so it lands at the same size PaperAct
 * renders it at, which is what makes the hand-off invisible rather than a
 * cross-fade between two creams.
 */

/** how far in we end up — enough for the sheet to over-fill any viewport */
const MAX_SCALE = 13;
/** where the hold ends and the push-in starts, in section progress */
const PUSH = 0.36;
/**
 * Where her line finishes lighting up, in section progress.
 *
 * Comfortably inside {@link PUSH}: the words have to be fully lit *before*
 * the sheet starts moving, or the reader is being asked to read something
 * that's simultaneously receding and still arriving.
 */
const LINE_LIT = 0.28;

export default function Scene00Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /** 0 while the sheet is just hanging there, 1 when it is everything */
  const zoom = useTransform(scrollYProgress, [PUSH, 1], [0, 1], { clamp: true });

  // exponential, so the approach accelerates the way moving toward
  // something does — linear scale reads as a shape being resized
  const scale = useTransform(zoom, (z) => Math.pow(MAX_SCALE, z));
  const rotate = useTransform(zoom, [0, 0.5], [-1.6, 0]);
  const writing = useTransform(zoom, [0, 0.3], [1, 0]);
  const rules = useTransform(zoom, [0.06, 0.5], [1, 0]);
  const shadow = useTransform(zoom, [0, 0.34], [1, 0]);
  const tooth = useTransform(zoom, [0.2, 0.75], [0.06, 0.085]);
  // hold the fibre at a constant apparent size, landing on PaperAct's 340px
  const toothSize = useTransform(scale, (s) => `${Math.min(140, 340 / s)}px`);
  /** how far through we are to being *on* the paper rather than at it */
  const land = useTransform(zoom, [0.25, 0.7], [0, 1]);
  /**
   * Her line lights word by word against the reader's own scrolling, the
   * same way every other line on the site does.
   *
   * It starts partway along rather than at zero. A reveal that begins at
   * zero has its whole line sitting at the dim floor before the first
   * scroll — fine mid-page, where you've arrived reading, but this is the
   * first thing anyone sees, and a headline that faint on load reads as a
   * font that failed rather than an effect that hasn't started. The head
   * start puts the wavefront on the first word immediately; see also the
   * raised `dim` on the reveal itself, which keeps the words that haven't
   * been reached yet legible instead of nearly invisible.
   */
  const lineP = useTransform(scrollYProgress, [0, LINE_LIT], [0.12, 1], {
    clamp: true,
  });

  if (reduced) return <StaticHero />;

  return (
    <section ref={ref} id={HERO_ID} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative flex h-full items-center justify-center px-6">
          {/* The window light, applied in viewport space rather than inside
              the sheet — a gradient living on a element scaled thirteen
              times would be thirteen times too large by the end, which is
              exactly the mismatch that put a visible seam across the
              hand-off. Same declaration PaperAct uses, fading in so the
              two surfaces are identical by the time either is visible. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            /* fixed attachment for the same reason PaperAct uses it: this
               box stops being viewport-sized the moment the sticky
               releases, and a vignette that reaches full strength 160px
               early is exactly the residual step at the hand-over */
            style={{ opacity: land, background: PAPER_LIGHT, backgroundAttachment: "fixed" }}
          />

          {/* The sheet — the thing we go through. 84vw rather than 88: the
              tape strips hang up to 24px past each edge, and at 88 they run
              off the sides of a 320px phone. */}
          <motion.div
            className="relative w-[min(84vw,30rem)] origin-center"
            style={{ scale, rotate }}
          >
            <motion.div
              aria-hidden
              className="absolute inset-0"
              style={{ opacity: shadow, borderRadius: 2, boxShadow: PAPER_SHADOW }}
            />
            <div
              className="relative"
              style={{ background: theme.paper, borderRadius: 2 }}
            >
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ opacity: rules, background: paperBackground("lined") }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-multiply"
                style={{
                  opacity: tooth,
                  backgroundImage: TOOTH,
                  backgroundSize: toothSize,
                }}
              />
              <motion.div
                className="relative px-8 py-7 font-hand md:px-10 md:py-9"
                style={{ opacity: writing, color: theme.pen, lineHeight: `${RULE}px` }}
              >
                <p className="text-[2.4rem] font-bold leading-[34px] md:text-[3.4rem] md:leading-[68px]">
                  {/* a tighter leading edge and a much higher floor than the
                      body copy uses: four words is too short a line for a
                      four-word feather, and a hero has to be readable before
                      it's been scrolled */}
                  <WordReveal
                    text="Get off your phone!"
                    progress={lineP}
                    feather={2.5}
                    dim={0.4}
                  />
                </p>
                <p className="mt-3 text-right text-2xl opacity-80 md:text-3xl">— momm</p>
              </motion.div>
            </div>

            <motion.div style={{ opacity: writing }} aria-hidden>
              <Tape className="-left-5 -top-3" rotate={-31} />
              <Tape className="-right-5 -top-3" rotate={27} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** no push-in when motion is unwelcome — just the hero, one screen tall */
function StaticHero() {
  return (
    <section
      id={HERO_ID}
      className="relative flex h-screen flex-col items-center justify-center px-6"
    >
      <Note seed="get-off-your-phone" paper="lined" fasten="tape" hand enter={false} className="w-[min(84vw,30rem)]">
        <div className="px-8 py-7 md:px-10 md:py-9">
          <p className="text-[2.4rem] font-bold leading-[34px] md:text-[3.4rem] md:leading-[68px]">
            Get off your phone!
          </p>
          <p className="mt-3 text-right text-2xl opacity-80 md:text-3xl">— momm</p>
        </div>
      </Note>
    </section>
  );
}
