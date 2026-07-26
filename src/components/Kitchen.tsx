"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { theme } from "@/theme";

/**
 * The room the fridge is in.
 *
 * The door was floating in a void — no floor, no light, nothing shared
 * between the characters and the space they stand in. That's the whole
 * reason the avatars read as cutouts. What fixes it isn't a colour, it's
 * a *light*: one warm source off-canvas to the upper left that everything
 * on the page casts away from, so a character, a sheet of paper and a
 * pane of glass all agree about where they are.
 *
 * The light is also the theme. Scrolling the page is one day in a
 * kitchen: morning at the open, flat hard midday through the reckoning,
 * dusk at the turn, warm lamplight at the payoff. That arc already
 * existed as an abstract luminance curve — every redesign kept it — and
 * giving it a literal reading finally explains why it's there. "Put it
 * down, dinner's ready" was always a time-of-day story.
 *
 * There's deliberately no drawn horizon. A fixed floor line can't line up
 * with where characters actually sit in each section, and a mismatched
 * one is worse than none — the cast shadows imply the floor instead.
 */
export default function Kitchen() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: reduced ? 1000 : 55,
    damping: reduced ? 100 : 22,
  });
  const p = reduced ? scrollYProgress : smooth;

  /** fractions of page height — tied to the running order in app/page.tsx */
  const STOPS = [0, 0.14, 0.3, 0.38, 0.5, 0.62, 0.78, 0.92, 1];

  // the colour of the light through the day
  const lightColor = useTransform(p, STOPS, [
    "#FFE7B8", // morning gold
    "#FFEDCF",
    "#FFFFFF", // flattening out
    "#EDF3F7", // hard midday
    "#F2EFF0",
    "#FFE6CE", // warming again
    "#FFD9A3", // late afternoon
    "#FFC98A", // lamplight
    "#FFDCAE",
  ]);
  const lightStrength = useTransform(p, STOPS, [
    0.9, 0.8, 0.5, 0.32, 0.42, 0.7, 0.92, 1, 0.9,
  ]);
  // a cold flatness that peaks exactly on "32 years"
  const chill = useTransform(p, STOPS, [0, 0.04, 0.3, 0.52, 0.36, 0.12, 0, 0, 0]);
  const window_ = useTransform(
    lightColor,
    (c) =>
      `radial-gradient(130% 100% at 8% -8%, ${c} 0%, ${c}66 26%, rgba(255,255,255,0) 68%)`,
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0" style={{ backgroundColor: theme.night }} />

      {/* the window, off-canvas upper left */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: lightStrength, background: window_ }}
      />

      {/* midday going hard and colourless */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: chill,
          background:
            "linear-gradient(180deg, #8FA3B4 0%, #A9B6C0 45%, #7E8E9C 100%)",
          mixBlendMode: "color",
        }}
      />

      {/* enamel tooth — fine, or it reads as compression artefact */}
      <div
        className="absolute inset-0 opacity-[0.5] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ambient occlusion into the corners and the floor */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 45% 30%, rgba(0,0,0,0) 40%, rgba(38,30,24,0.16) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[22vh]"
        style={{
          background: "linear-gradient(180deg, rgba(38,30,24,0) 0%, rgba(38,30,24,0.14) 100%)",
        }}
      />
    </div>
  );
}
