"use client";

import { motion } from "framer-motion";
import { IPhoneMockup } from "react-device-mockup";
import Icon from "./Icon";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { theme } from "@/theme";

/**
 * Instagram, shielded — the product's one job, shown at real size.
 *
 * This is the only device frame on the site, and it earns the exception: the
 * shield is a *takeover*, and a takeover only reads as one if you can see the
 * edges of the thing being taken over. A floating glass card of the same UI
 * reads as a screenshot; a phone reads as your phone.
 *
 * The copy is not invented for the website — `title`, `subtitle` and the
 * button label are the real `MOMM_SHIELD` the app hands to Apple's Screen Time
 * (momm-app `src/lib/screen-time.ts`). If her voice changes there, change it
 * here too; a landing page promising words the product doesn't say is the
 * cheapest kind of lie.
 */

/** the feed underneath, out of focus and out of reach */
const POSTS = [72, 96, 64];

export default function BlockedPhone({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <IPhoneMockup
      className={className}
      screenWidth={252}
      screenType="island"
      frameColor={theme.ink}
      hideStatusBar
      transparentNavBar
    >
      <div
        className="relative flex w-full flex-col pb-7 pt-9"
        style={{ backgroundColor: theme.night }}
      >
        <div className="flex items-center justify-between px-4">
          <p className="font-sub text-lg italic text-white">Instagram</p>
          <Icon name="heart" size={15} className="text-white/35" />
        </div>

        <div className="mt-3 flex flex-1 flex-col gap-2 px-3">
          {POSTS.map((h) => (
            <div
              key={h}
              className="rounded-xl bg-white/[0.06] blur-[2px]"
              style={{ height: h }}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-around border-t border-white/10 px-3 pt-3 text-white/25">
          <Icon name="home" size={17} />
          <Icon name="search" size={17} />
          <Icon name="reels" size={17} />
          <Icon name="shop" size={17} />
          <Icon name="person" size={17} />
        </div>

        {/*
          Her shield covers the whole screen, because Apple's does. Frosted
          rather than opaque so the feed stays legible underneath — you can see
          exactly what she took, which is the entire point of the picture.
        */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-6 text-center backdrop-blur-md"
          style={{ backgroundColor: theme.night + "D9" }}
          initial={reduced ? false : { opacity: 0, scale: 1.06 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.35 }}
        >
          {/* Icon paints in currentColor, so her blue comes from the wrapper */}
          <span style={{ color: theme.gradient.from }}>
            <Icon name="lock" size={26} strokeWidth={1.5} />
          </span>
          <p className="font-header text-xl font-black leading-tight text-white">
            Momm says no.
          </p>
          <p className="text-[11px] leading-snug text-white/55">
            You told me you&apos;d stay off this. Put the phone down, sweetie.
          </p>
          <div
            className="mt-2 rounded-full px-5 py-2 text-[11px] font-bold"
            style={{ backgroundColor: theme.gradient.from, color: theme.ink }}
          >
            Okay, I&apos;ll stop
          </div>
        </motion.div>
      </div>
    </IPhoneMockup>
  );
}
