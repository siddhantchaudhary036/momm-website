"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { MouseEvent, useEffect, useState } from "react";
import Icon from "./Icon";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { theme } from "@/theme";

/** the section this jumps to — also its anchor, so it works without JS */
export const WAITLIST_ID = "waitlist";

/**
 * The one control that's always on screen.
 *
 * The site is a long argument, and a long argument has to leave a door open
 * for the reader who is already convinced — otherwise the only route to the
 * form is nine screens of being told about your own phone habits. This
 * replaced the scroll chevron on the hero, which pointed at something the
 * reader was going to do anyway.
 *
 * It stands down once the ask is actually on screen: a floating pill parked
 * over the form it points at is just an obstruction, and there is nothing
 * left to skip to.
 */
export default function SkipToWaitlist() {
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const [atWaitlist, setAtWaitlist] = useState(false);

  useEffect(() => {
    const target = document.getElementById(WAITLIST_ID);
    if (target === null) return;

    const io = new IntersectionObserver(
      ([entry]) => setAtWaitlist(entry.isIntersecting),
      /* a third of the ask showing is enough to call it arrived — waiting for
         all of it keeps the pill up while the reader is already typing */
      { threshold: 0.34 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  /**
   * Lenis owns the scroll, so a native anchor jump would fight it. The
   * `href` stays on the element anyway: it's the correct semantics, it works
   * before hydration, and under `prefers-reduced-motion` there is no Lenis
   * instance to hand off to.
   */
  const jump = (e: MouseEvent<HTMLAnchorElement>) => {
    if (lenis === undefined) return;
    const target = document.getElementById(WAITLIST_ID);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target, { duration: 1.6 });
  };

  return (
    <AnimatePresence>
      {!atWaitlist && (
        <motion.div
          key="skip"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
        >
          <motion.a
            href={`#${WAITLIST_ID}`}
            onClick={jump}
            whileHover={reduced ? undefined : { scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 rounded-full px-6 py-3 font-header text-sm font-bold text-white shadow-lg"
            style={{
              backgroundColor: theme.ink,
              boxShadow: `0 10px 24px ${theme.ink}59`,
            }}
          >
            Skip to the waitlist
            <Icon name="chevronDown" size={13} strokeWidth={2.8} />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
