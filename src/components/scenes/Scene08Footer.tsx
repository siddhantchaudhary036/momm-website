"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { AVATARS, type AvatarName } from "@/avatars";
import { rngFrom } from "@/lib/prng";
import { theme } from "@/theme";

const NAMES = Object.keys(AVATARS) as AvatarName[];

/**
 * PAGE 08 — the bottom of the door.
 *
 * Where the whole cast finally gets shown off. Every other section holds
 * to two avatars at most, so this is the release valve — and photos
 * crowded along the bottom of a fridge is exactly where a family ends up
 * anyway. Signed off in her hand.
 */
export default function Scene08Footer() {
  return (
    <footer className="flex flex-col items-center gap-6 px-6 pb-12 pt-6 text-center">
      <div className="flex max-w-3xl flex-wrap items-end justify-center gap-x-1 gap-y-2">
        {NAMES.map((n, i) => {
          const r = rngFrom(n + "sheet");
          const rot = (r() - 0.5) * 14;
          return (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 14, rotate: rot }}
              whileInView={{ opacity: 1, y: 0, rotate: rot }}
              whileHover={{ y: -8, rotate: 0, scale: 1.15 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: i * 0.03 }}
              className="relative h-14 w-12 md:h-16 md:w-14"
              title={n.replace(/-/g, " ")}
            >
              <Image
                src={`/avatars/${n}.webp`}
                alt=""
                fill
                sizes="60px"
                className="object-contain"
              />
            </motion.div>
          );
        })}
      </div>

      <p className="font-sub text-lg italic" style={{ color: theme.onDoor, opacity: 0.75 }}>
        momm has a face for every one of your excuses.
      </p>

      <div
        className="mt-1 h-px w-40"
        style={{ backgroundColor: theme.onDoor + "2E" }}
        aria-hidden
      />

      <p className="font-hand text-3xl" style={{ color: theme.pen }}>
        — momm
      </p>

      <p className="text-xs" style={{ color: theme.onDoor, opacity: 0.5 }}>
        © 2026 momm. made with ❤️ and nagging.
      </p>
      <p
        className="max-w-md text-[10px] leading-relaxed"
        style={{ color: theme.onDoor, opacity: 0.45 }}
      >
        stats:{" "}
        <a
          href="https://sqmagazine.co.uk/smartphone-usage-statistics/"
          className="underline hover:opacity-80"
        >
          SQ Magazine
        </a>{" "}
        ·{" "}
        <a
          href="https://www.harmonyhit.com/phone-screen-time-statistics/"
          className="underline hover:opacity-80"
        >
          Harmony Healthcare IT
        </a>{" "}
        ·{" "}
        <a href="https://opalapp.com/screentime" className="underline hover:opacity-80">
          Opal
        </a>
      </p>
    </footer>
  );
}
