"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { forwardRef } from "react";
import { AVATARS, type AvatarName } from "@/avatars";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CHARACTER, INSTANT } from "@/lib/motion";
import { rngFrom } from "@/lib/prng";

export type { AvatarName };

type Props = {
  name: AvatarName;
  /** height-driven, so every standing figure reads at the same scale */
  className?: string;
  /** the cast shadow — off only when the figure is seated or held */
  shadow?: boolean;
  /** the idle float */
  bob?: boolean;
  /** drain the colour — used once, on kid-sad at the bottom of the story */
  drained?: boolean;
  priority?: boolean;
  enter?: boolean;
  delay?: number;
  sizes?: string;
};

/**
 * A momm cast member, standing in the room rather than pasted on it.
 *
 * The shadow is a second copy of the artwork, flattened and sheared away
 * from the light and blurred — so it's the character's actual silhouette
 * on the floor, not a generic ellipse. That single change is what stops
 * high-key sticker art reading as a cutout: an ellipse says "an object is
 * here somewhere", a silhouette says "this person is standing there, and
 * the light is over there."
 *
 * Direction and softness are shared with `PageBackground`'s light
 * (`PAGE_LIGHT`), upper-left. If that ever moves, this has to move with it or
 * the whole page goes uncanny.
 */
const Avatar = forwardRef<HTMLDivElement, Props>(function Avatar(
  {
    name,
    className = "h-48",
    shadow = true,
    bob = true,
    drained = false,
    priority = false,
    enter = false,
    delay = 0,
    sizes = "(max-width: 768px) 45vw, 30vw",
  },
  ref,
) {
  const reduced = useReducedMotion();
  const meta = AVATARS[name];
  // stable per-avatar phase so a row of them never bobs in lockstep
  const phase = rngFrom(name)() * 2;
  const float = bob && !reduced;
  const DUR = 3.6;

  const bobT = {
    duration: DUR,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay: phase,
  };

  /**
   * Above-the-fold avatars don't animate in at all.
   *
   * `priority` means the figure is onscreen at load, and every mechanism
   * for entering it there has now stranded it invisible twice — with
   * `whileInView` it waits for a viewport crossing that can't happen, and
   * with `animate` framer resolves the transform but leaves opacity
   * pinned at the initial 0. The entrance was a nicety; a character who
   * silently fails to exist is not a trade worth making, so the first
   * thing you see is simply already there.
   *
   * Below the fold, `whileInView` is the correct and reliable mechanism —
   * and it's the only one passed, since supplying `animate` alongside it
   * is what causes the competing-target bug in the first place.
   */
  const hidden = { opacity: 0, scale: 0.82, y: 14 };
  const visible = { opacity: 1, scale: 1, y: 0 };
  const entrance =
    !enter || priority
      ? { initial: false as const }
      : { initial: hidden, whileInView: visible, viewport: { once: true, amount: 0.4 } };

  const art = (
    <Image
      src={`/avatars/${name}.webp`}
      alt=""
      width={meta.w}
      height={meta.h}
      priority={priority}
      sizes={sizes}
      className="h-full w-full object-contain"
    />
  );

  return (
    <motion.div
      ref={ref}
      className={`relative inline-block shrink-0 ${className}`}
      style={{ aspectRatio: `${meta.w} / ${meta.h}` }}
      {...entrance}
      transition={reduced ? INSTANT : { ...CHARACTER, delay }}
    >
      <motion.div
        className="relative h-full w-full"
        animate={float ? { y: [0, -6, 0] } : undefined}
        transition={bobT}
      >
        {shadow && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 origin-bottom"
            style={{
              transform: "skewX(-42deg) scaleY(0.24) translateX(14%)",
              filter: "brightness(0) blur(7px)",
              opacity: 0.3,
            }}
          >
            {art}
          </div>
        )}
        <div
          className="relative h-full w-full"
          style={{
            filter: drained
              ? "saturate(0.15) contrast(0.95) drop-shadow(3px 4px 4px rgba(38,30,24,0.18))"
              : "drop-shadow(3px 4px 4px rgba(38,30,24,0.18))",
            transition: "filter 900ms ease",
          }}
        >
          {art}
        </div>
      </motion.div>
    </motion.div>
  );
});

export default Avatar;
