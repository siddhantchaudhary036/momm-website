"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { FormEvent, useRef, useState } from "react";
import MagneticButton from "../MagneticButton";
import Typewriter from "../Typewriter";
import { theme } from "@/theme";

/**
 * SCENE 07 — the waitlist. Not wired to anything yet:
 * captures locally and mom types back her confirmation.
 */
export default function Scene07Waitlist() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [err, setErr] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErr(true);
      return;
    }
    // TODO: POST to Convex / API when the waitlist backend exists
    setJoined(true);
  };

  return (
    <section
      ref={ref}
      className="flex min-h-screen flex-col items-center justify-center gap-8 px-6"
    >
      <h2 className="text-center font-header text-3xl font-bold md:text-5xl">
        <Typewriter text="Ready to make momm proud?" start={inView} speed={65} />
      </h2>

      <AnimatePresence mode="wait">
        {!joined ? (
          <motion.form
            key="form"
            onSubmit={submit}
            exit={{ opacity: 0, y: -16 }}
            className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErr(false);
              }}
              placeholder="your email (mom already knows it)"
              aria-label="email address"
              className="flex-1 rounded-full border px-6 py-4 font-sub italic text-white placeholder-white/65 outline-none backdrop-blur transition-colors focus:border-white/70"
              style={{
                backgroundColor: theme.ink + "26",
                borderColor: err ? theme.danger : theme.ink + "59",
              }}
            />
            <MagneticButton className="shrink-0">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="w-full rounded-full px-8 py-4 font-header font-bold text-white"
                style={{ backgroundColor: theme.ink }}
              >
                Join the waitlist
              </motion.button>
            </MagneticButton>
          </motion.form>
        ) : (
          <motion.div
            key="joined"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="text-center"
          >
            <p className="font-header text-xl font-semibold md:text-2xl">
              <Typewriter text="You're on the list. momm's watching. 🎉" speed={45} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="font-sub italic text-white/60">
        {joined ? "1,241" : "1,240"} already ditching their phones.
      </p>
    </section>
  );
}
