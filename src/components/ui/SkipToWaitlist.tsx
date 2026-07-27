"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { MouseEvent, useEffect, useState } from "react";
import Icon from "./Icon";
import { HERO_ID, WAITLIST_ID } from "@/lib/anchors";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { theme } from "@/theme";

/**
 * The one control that follows the reader down the page.
 *
 * The site is a long argument, and a long argument has to leave a door open
 * for whoever is already convinced — otherwise the only route to the form is
 * nine screens of being told about your own phone habits.
 *
 * It stays out of the way at both ends. Not on the hero, which is one note on
 * black and stays that way — a pill floating over it is the first thing you'd
 * see and it would undercut the whole open. Not on the ask either, where it
 * would sit on top of the form it points at with nothing left to skip to. It
 * exists for the long middle, which is exactly where it's wanted.
 */
export default function SkipToWaitlist() {
  const lenis = useLenis();
  const reduced = useReducedMotion();
  /** starts hidden — the hero is the first thing on screen */
  const [onHero, setOnHero] = useState(true);
  const [atWaitlist, setAtWaitlist] = useState(false);

  useEffect(() => {
    const watch = (id: string, set: (v: boolean) => void, threshold: number) => {
      const el = document.getElementById(id);
      if (el === null) return () => {};
      const io = new IntersectionObserver(([entry]) => set(entry.isIntersecting), {
        threshold,
      });
      io.observe(el);
      return () => io.disconnect();
    };

    // any sliver of the hero showing is still "the first view"
    const unwatchHero = watch(HERO_ID, setOnHero, 0);
    /* a third of the ask showing is enough to call it arrived — waiting for
       all of it keeps the pill up while the reader is already typing */
    const unwatchWaitlist = watch(WAITLIST_ID, setAtWaitlist, 0.34);
    return () => {
      unwatchHero();
      unwatchWaitlist();
    };
    /*
      Re-observe when the motion preference resolves. `useReducedMotion`
      reports false during SSR and settles on mount, and the hero swaps to a
      different element when it flips — so the observer set up on the first
      pass is left holding a node that's no longer in the document. A
      detached element reports `isIntersecting: false`, which reads here as
      "past the hero" and floats the pill over the opening screen, the one
      place it must never appear.
    */
  }, [reduced]);

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
      {!onHero && !atWaitlist && (
        <motion.div
          key="skip"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 sm:bottom-6"
        >
          <motion.a
            href={`#${WAITLIST_ID}`}
            onClick={jump}
            whileHover={reduced ? undefined : { scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 font-header text-[13px] font-bold text-white sm:px-6 sm:text-sm"
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
