"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { NotificationCard } from "./cards";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { rngFrom } from "@/lib/prng";
import { theme } from "@/theme";

const MESSAGES = [
  "Are you STILL on Instagram?",
  "It's been 15 minutes.",
  "I can see the screen time, you know.",
  "Dinner's ready. Phone down.",
  "I'm not asking again.",
];

/**
 * momm's messages piling up as you scroll.
 *
 * Four of her five behaviours are notification-shaped, so this isn't a
 * decorative use of a familiar UI — it's the product's actual surface.
 * And it shows something a screenshot can't: *volume*. One notification
 * is a feature; five stacking up while you scroll is a person who won't
 * let it go, which is the whole character.
 *
 * Newest arrives on top and shunts the rest down, each sitting a little
 * further back — the same read as a real lock screen.
 */
export default function NotificationStack() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });
  const [count, setCount] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setCount(Math.max(0, Math.min(MESSAGES.length, Math.round(p * (MESSAGES.length + 0.6))))),
  );

  const shown = reduced ? MESSAGES : MESSAGES.slice(0, count);
  const typing = !reduced && count > 0 && count < MESSAGES.length;

  return (
    <div ref={ref} className="flex min-h-[52vh] flex-col items-center justify-center gap-3">
      <AnimatePresence initial={false}>
        {shown.map((m, i) => {
          const depth = shown.length - 1 - i;
          const rot = (rngFrom(m)() - 0.5) * 2.2;
          return (
            <motion.div
              key={m}
              layout
              initial={reduced ? false : { opacity: 0, y: -26, scale: 0.94 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1 - Math.min(depth, 4) * 0.018,
                rotate: rot,
              }}
              exit={{ opacity: 0, y: -18, scale: 0.95 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 380, damping: 30, mass: 0.7 }
              }
              style={{ zIndex: MESSAGES.length - depth }}
            >
              <NotificationCard body={m} when={i === shown.length - 1 ? "now" : `${i + 1}m ago`} />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* she's still going. Three dots cost nothing and do more for the
          sense of a person on the other end than another message would. */}
      <AnimatePresence>
        {typing && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="mt-1 flex items-center gap-2 rounded-full px-4 py-2.5"
            style={{
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: `1px solid ${theme.ink}14`,
              boxShadow: "0 6px 18px rgba(56,46,38,0.08)",
            }}
          >
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="block h-1.5 w-1.5 rounded-full"
                style={{ background: theme.onDoorMuted }}
                animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: d * 0.16,
                }}
              />
            ))}
            <span className="ml-1 text-[11px]" style={{ color: theme.onDoorMuted }}>
              momm is typing…
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
