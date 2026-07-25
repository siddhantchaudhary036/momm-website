"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";
import Avatar from "../Avatar";
import Note from "../fridge/Note";
import MagneticButton from "../MagneticButton";
import WordReveal from "../WordReveal";
import { RULE } from "../fridge/paper";
import { theme } from "@/theme";

/**
 * PAGE 07 — the ask, written on her note.
 *
 * The email field is a ruled line on the paper rather than a pill floating
 * over it: you're writing your address on mom's note, which is a far more
 * natural thing to be asked to do than filling in a form.
 *
 * The confirmation used to read "momm's watching 🎉", which framed the
 * product as surveillance at the exact moment it needed to feel like love —
 * and surveillance is what every other app in this category already sells.
 * She hugs you instead.
 *
 * Not wired to a backend yet: captures locally.
 */
export default function Scene07Waitlist() {
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
    <section className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="flex items-end gap-3 md:gap-8">
        <Note
          seed="make-momm-proud"
          paper="lined"
          fasten="tape"
          hand
          enter={false}
          className="w-[min(88vw,28rem)]"
        >
          <div className="px-7 py-6 md:px-9 md:py-7">
            <p className="text-3xl leading-[34px] md:text-4xl" style={{ color: theme.pen }}>
              <WordReveal
                key={joined ? "joined" : "ask"}
                text={joined ? "That's my kid." : "Ready to make momm proud?"}
              />
            </p>

            <AnimatePresence mode="wait">
              {!joined && (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErr(false);
                    }}
                    placeholder="your email here"
                    aria-label="email address"
                    className="w-full bg-transparent font-hand text-2xl outline-none placeholder:opacity-40 md:text-3xl"
                    style={{
                      color: err ? theme.danger : theme.pen,
                      height: RULE,
                      lineHeight: `${RULE}px`,
                    }}
                  />
                  <MagneticButton className="mt-3 inline-block">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      className="rounded-full px-7 py-3 font-header text-sm font-bold text-white"
                      style={{ backgroundColor: theme.ink }}
                    >
                      Join the waitlist
                    </motion.button>
                  </MagneticButton>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Note>

        <AnimatePresence mode="wait">
          <motion.div
            key={joined ? "hug" : "ask"}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="shrink-0"
          >
            <Avatar
              name={joined ? "momm-kid-hugging" : "momm-encouraging"}
              bob={!joined}
              className="h-36 sm:h-44 md:h-56"
              sizes="(max-width: 768px) 40vw, 22vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="font-sub text-lg italic" style={{ color: theme.onDoor, opacity: 0.7 }}>
        {joined ? "1,241" : "1,240"} already ditching their phones.
      </p>
    </section>
  );
}
