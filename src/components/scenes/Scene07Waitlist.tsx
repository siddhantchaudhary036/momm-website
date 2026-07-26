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
 * Signups go to `/api/waitlist`, which proxies to Convex server-side.
 */
export default function Scene07Waitlist() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [pending, setPending] = useState(false);
  /**
   * Two failures that deserve different words: a malformed address is the
   * visitor's to fix, a dead request is ours. Reddening the line and saying
   * nothing would blame them for our outage.
   */
  const [err, setErr] = useState<null | "format" | "failed">(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    // Instant feedback only — Convex is what actually decides what it'll store.
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErr("format");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        throw new Error(`/api/waitlist responded ${res.status}`);
      }
      setJoined(true);
    } catch (cause) {
      console.error("waitlist signup failed", cause);
      setErr("failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
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
                      setErr(null);
                    }}
                    placeholder="your email here"
                    aria-label="email address"
                    aria-invalid={err !== null}
                    className="w-full bg-transparent font-hand text-2xl outline-none placeholder:opacity-40 md:text-3xl"
                    style={{
                      color: err !== null ? theme.danger : theme.pen,
                      height: RULE,
                      lineHeight: `${RULE}px`,
                    }}
                  />
                  {err === "failed" && (
                    <p
                      role="alert"
                      className="font-hand text-xl"
                      style={{ color: theme.danger, lineHeight: `${RULE}px` }}
                    >
                      momm didn&apos;t catch that. try again?
                    </p>
                  )}
                  <MagneticButton className="mt-3 inline-block">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={pending}
                      className="rounded-full px-7 py-3 font-header text-sm font-bold text-white disabled:opacity-60"
                      style={{ backgroundColor: theme.ink }}
                    >
                      {pending ? "Telling momm…" : "Join the waitlist"}
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
    </section>
  );
}
