"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Avatar from "../Avatar";
import Note from "../fridge/Note";
import Tape from "../fridge/Tape";
import WordReveal from "../WordReveal";
import { PAPER_SHADOW, RULE, TOOTH, paperBackground } from "../fridge/paper";
import { PAPER_LIGHT } from "../paper/surface";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { theme } from "@/theme";

/**
 * SCENE 00 — the open, and the door into the rest of the site.
 *
 * Two jobs. First the hero it always was: one note taped to the fridge,
 * her voice, no frame and no tail, because a note on the fridge is
 * self-evidently from mom and the metaphor does the attribution for free.
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

export default function Scene00Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /** 0 while she's just standing there, 1 when the sheet is everything */
  const zoom = useTransform(scrollYProgress, [PUSH, 1], [0, 1], { clamp: true });

  // exponential, so the approach accelerates the way moving toward
  // something does — linear scale reads as a shape being resized
  const scale = useTransform(zoom, (z) => Math.pow(MAX_SCALE, z));
  const rotate = useTransform(zoom, [0, 0.5], [-1.6, 0]);
  const writing = useTransform(zoom, [0, 0.3], [1, 0]);
  const rules = useTransform(zoom, [0.06, 0.5], [1, 0]);
  const shadow = useTransform(zoom, [0, 0.34], [1, 0]);
  const cast = useTransform(zoom, [0, 0.16], [1, 0]);
  const tooth = useTransform(zoom, [0.2, 0.75], [0.06, 0.085]);
  // hold the fibre at a constant apparent size, landing on PaperAct's 340px
  const toothSize = useTransform(scale, (s) => `${Math.min(140, 340 / s)}px`);
  /** how far through we are to being *on* the paper rather than at it */
  const land = useTransform(zoom, [0.25, 0.7], [0, 1]);
  /**
   * Function form, not the `[0, 0.12] -> [1, 0]` range form.
   *
   * The range form did not update here: measured against the live page,
   * this stayed pinned at 1 through the entire push-in while every other
   * derived value on the same `scrollYProgress` advanced correctly, so
   * the chevron sat on top of the fully-zoomed sheet. Whatever the cause,
   * the explicit function is unambiguous and verified — don't "simplify"
   * it back to a range without re-checking the value at scroll 400.
   */
  const hint = useTransform(scrollYProgress, (p) => Math.max(0, 1 - p / 0.12));
  /**
   * The note is vertically centred but momm hangs below it, so the group
   * reads bottom-heavy with a screen of dead air above. Lifting the sheet
   * optically centres the pair — and it has to come back to zero before
   * the push-in, or we'd be zooming toward a point that isn't the middle
   * of the screen and the sheet would slide as it grew.
   */
  const lift = useTransform(zoom, [0, 0.25], [-72, 0]);

  // she notices if you just stand there
  const [nudge, setNudge] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setNudge(true), 6500);
    const cancel = () => {
      clearTimeout(t);
      setNudge(false);
      window.removeEventListener("scroll", cancel);
    };
    window.addEventListener("scroll", cancel, { once: true, passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", cancel);
    };
  }, [reduced]);

  if (reduced) return <StaticHero nudge={false} />;

  return (
    <section ref={ref} className="relative h-[260vh]">
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

          {/* the sheet — the thing we go through */}
          <motion.div
            className="relative w-[min(88vw,30rem)] origin-center"
            style={{ scale, rotate, y: lift }}
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
                  <WordReveal text="Get off your phone!" delayMs={450} />
                </p>
                <p className="mt-3 text-right text-2xl opacity-80 md:text-3xl">— momm</p>
              </motion.div>
            </div>

            <motion.div style={{ opacity: writing }} aria-hidden>
              <Tape className="-left-5 -top-3" rotate={-31} />
              <Tape className="-right-5 -top-3" rotate={27} />
            </motion.div>
          </motion.div>

          {/* she stands in front of the door, not on it */}
          <motion.div
            /* she rides the same lift as the sheet, or she detaches from
               the note she's standing under */
            style={{ opacity: cast, y: lift }}
            /* margin rather than a second translate — two translate-x
               utilities on one element resolve to whichever wins the
               cascade, and the centring is the one that would lose */
            className="absolute left-1/2 top-1/2 z-20 ml-12 mt-[6.5rem] -translate-x-1/2 md:ml-20 md:mt-[8.5rem]"
          >
            <div className="relative">
              <Avatar
                name="momm-smirking"
                priority
                enter
                delay={1.1}
                className="h-44 sm:h-56 md:h-[17rem]"
                sizes="(max-width: 768px) 40vw, 20vw"
              />
              <AnimatePresence>
                {nudge && (
                  <motion.div
                    key="nudge"
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="absolute right-full top-6 mr-3 hidden sm:block"
                  >
                    <Note seed="im-waiting" paper="plain" fasten="tape-1" hand enter={false} className="w-36">
                      <p className="px-4 py-3 text-center text-xl leading-tight">
                        I&rsquo;m waiting.
                      </p>
                    </Note>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: hint, color: theme.onDoor }}
            className="absolute bottom-8 z-30 flex flex-col items-center gap-1 opacity-70"
          >
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="text-2xl"
              aria-hidden
            >
              ⌄
            </motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** no push-in when motion is unwelcome — just the hero, one screen tall */
function StaticHero({ nudge }: { nudge: boolean }) {
  void nudge;
  return (
    <section className="relative flex h-screen flex-col items-center justify-center px-6">
      <Note seed="get-off-your-phone" paper="lined" fasten="tape" hand enter={false} className="w-[min(88vw,30rem)]">
        <div className="px-8 py-7 md:px-10 md:py-9">
          <p className="text-[2.4rem] font-bold leading-[34px] md:text-[3.4rem] md:leading-[68px]">
            Get off your phone!
          </p>
          <p className="mt-3 text-right text-2xl opacity-80 md:text-3xl">— momm</p>
        </div>
      </Note>
      <div className="mt-8 md:mt-10">
        <Avatar name="momm-smirking" priority className="h-44 sm:h-56 md:h-[17rem]" sizes="40vw" />
      </div>
    </section>
  );
}
