"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";
import Avatar from "../Avatar";
import MagneticButton from "../MagneticButton";
import WordReveal from "../WordReveal";
import ClayButton from "../ui/ClayButton";
import ClayPanel from "../ui/ClayPanel";
import BlockedPhone from "../ui/BlockedPhone";
import { WAITLIST_ID } from "@/lib/anchors";
import { theme } from "@/theme";

/**
 * PAGE 07 — the ask, on her clay panel.
 *
 * The email field is a pressed clay groove scooped into the panel rather than
 * a pill floating over it — the same raised/pressed grammar the rest of the
 * site uses, so writing your address reads as filling in the one recessed
 * spot on her card. Her lines stay handwritten.
 *
 * The confirmation used to read "momm's watching 🎉", which framed the
 * product as surveillance at the exact moment it needed to feel like love —
 * and surveillance is what every other app in this category already sells.
 * She hugs you instead.
 *
 * `BlockedPhone` stays dark inside its own frame: a phone screenshot with a
 * dark UI sitting on the cream page is completely ordinary, and `theme.night`
 * is still allowed for a genuinely-shut device screen.
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
      /* a deep-link anchor, and what the floating skip control watches for */
      id={WAITLIST_ID}
      className="flex min-h-screen flex-col items-center justify-center gap-14 px-6 py-20 xl:flex-row xl:gap-20"
    >
      {/*
        The note wants a whole phone's width to itself, so she cannot stand
        beside it until there's genuinely room for the pair — 84vw of paper
        plus a ~220px avatar is 804px of content, which still doesn't fit a
        768px tablet. She goes underneath until `lg`; the row used to hang
        off both edges rather than give, since both items are shrink-0.
      */}
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-end lg:gap-10">
        <ClayPanel className="w-[min(88vw,34rem)]">
          <div className="px-8 py-8 md:px-11 md:py-10">
            {/* the ask is the loudest thing on the page, in her hand */}
            <p
              className="font-hand text-4xl leading-tight md:text-5xl"
              style={{ color: theme.pen }}
            >
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
                  className="mt-6"
                >
                  {/* a pressed clay groove scooped into the panel — the one
                      recessed spot on her card, which is where you write */}
                  <div
                    className="px-5 py-3"
                    style={{
                      background: theme.clay.well,
                      borderRadius: theme.clay.radiusSm,
                      boxShadow: theme.clay.pressed,
                    }}
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
                      className="w-full bg-transparent font-hand text-3xl leading-tight outline-none placeholder:opacity-40 md:text-4xl"
                      style={{ color: err !== null ? theme.danger : theme.pen }}
                    />
                  </div>
                  {err === "failed" && (
                    <p
                      role="alert"
                      className="mt-2 font-hand text-2xl leading-tight"
                      style={{ color: theme.danger }}
                    >
                      momm didn&apos;t catch that. try again?
                    </p>
                  )}
                  <MagneticButton className="mt-5 inline-block">
                    <ClayButton type="submit" disabled={pending} className="px-9 py-4">
                      {pending ? "Telling momm…" : "Join the waitlist"}
                    </ClayButton>
                  </MagneticButton>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </ClayPanel>

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
