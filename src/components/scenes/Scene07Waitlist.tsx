"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";
import Avatar from "../Avatar";
import Note from "../fridge/Note";
import MagneticButton from "../MagneticButton";
import WordReveal from "../WordReveal";
import { RULE } from "../fridge/paper";
import BlockedPhone from "../ui/BlockedPhone";
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
 * On the same paper as every other act now — `page.tsx` wraps this in
 * `PaperAct` for the fibre, the light and the taped seam, same as the
 * sections either side. `BlockedPhone` stays dark inside its own frame
 * regardless: a phone screenshot with a dark UI sitting on a light page is
 * completely ordinary, the same way it would be on paper under glass.
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
    <section
      /* kept as a deep-link anchor — /#waitlist still lands here */
      id="waitlist"
      className="flex min-h-screen flex-col items-center justify-center gap-14 px-6 py-20 xl:flex-row xl:gap-20"
    >
      {/*
        The note wants the full width of a phone all by itself, so she cannot
        stand beside it there — 88vw of paper plus a 134px avatar is 490px of
        content in a 390px viewport, and the row used to just hang 50px off
        both edges. She goes underneath until there's room for the pair.
      */}
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-end md:gap-10">
        <Note
          seed="make-momm-proud"
          paper="lined"
          fasten="tape"
          hand
          enter={false}
          /* 84vw, not 88: the tape strips hang 20px past each edge of the
             sheet, and at 88vw they clip on the narrowest phones */
          className="w-[min(84vw,34rem)]"
        >
          <div className="px-8 py-7 md:px-11 md:py-9">
            {/* the ask is the loudest thing on the page, so it writes across
                two rules at a time rather than one — bigger, still sitting on
                the ruling, because 68px is 2 × RULE */}
            <p className="text-4xl leading-[68px] md:text-5xl" style={{ color: theme.pen }}>
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
                  className="mt-5"
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
                    className="w-full bg-transparent font-hand text-3xl outline-none placeholder:opacity-40 md:text-4xl"
                    style={{
                      color: err !== null ? theme.danger : theme.pen,
                      height: RULE * 2,
                      lineHeight: `${RULE * 2}px`,
                    }}
                  />
                  {err === "failed" && (
                    <p
                      role="alert"
                      className="font-hand text-2xl"
                      style={{ color: theme.danger, lineHeight: `${RULE}px` }}
                    >
                      momm didn&apos;t catch that. try again?
                    </p>
                  )}
                  <MagneticButton className="mt-4 inline-block">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={pending}
                      className="rounded-full px-9 py-4 font-header text-base font-bold text-white disabled:opacity-60 md:text-lg"
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
              className="h-44 sm:h-52 md:h-72"
              sizes="(max-width: 768px) 40vw, 26vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* what she did about it, at real size */}
      <BlockedPhone className="shrink-0" />
    </section>
  );
}
