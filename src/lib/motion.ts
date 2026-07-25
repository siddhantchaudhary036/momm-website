import type { Transition } from "framer-motion";

/**
 * Motion comes from the material.
 *
 * Almost everything on this site used to share one spring, and that
 * uniformity read cheaper than any missing effect did — a sheet of paper
 * and a cartoon character and a pane of glass were all arriving with the
 * same weight. These are the four behaviours everything on the page
 * belongs to. Nothing should invent a fifth without a reason.
 */

/** paper: heavy, settles, barely overshoots — it has mass and air resistance */
export const PAPER: Transition = {
  type: "spring",
  stiffness: 230,
  damping: 26,
  mass: 1.15,
};

/** glass: fast, precise, snaps into place and stops dead */
export const GLASS: Transition = {
  type: "spring",
  stiffness: 460,
  damping: 36,
  mass: 0.65,
};

/** characters: light, bouncy, a little squash — they're drawn, so they behave drawn */
export const CHARACTER: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 15,
  mass: 0.9,
};

/** data: no bounce at all. Numbers don't wobble — they resolve. */
export const DATA: Transition = {
  duration: 0.65,
  ease: [0.16, 1, 0.3, 1],
};

/** the same expo curve as a raw cubic-bezier, for CSS transitions */
export const DATA_CSS = "cubic-bezier(.16,1,.3,1)";

/** everything collapses to this when the user has asked for less motion */
export const INSTANT: Transition = { duration: 0 };
