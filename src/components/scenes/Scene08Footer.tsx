"use client";

import { motion } from "framer-motion";

/* SCENE 08 — the footer. Minimal. */
export default function Scene08Footer() {
  return (
    <footer className="flex flex-col items-center gap-4 border-t border-[#2A0E4A]/15 px-6 py-14 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/logo.png"
        alt="momm"
        className="h-20 w-auto rounded-2xl object-contain"
        initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
      />
      <p className="font-sub text-lg italic text-white/85">
        momm — get off your phone.
      </p>
      <p className="text-xs text-white/40">
        © 2026 momm. made with ❤️ and nagging.
      </p>
      <p className="max-w-md text-[10px] leading-relaxed text-white/30">
        stats:{" "}
        <a
          href="https://sqmagazine.co.uk/smartphone-usage-statistics/"
          className="underline hover:text-white/60"
        >
          SQ Magazine
        </a>{" "}
        ·{" "}
        <a
          href="https://www.harmonyhit.com/phone-screen-time-statistics/"
          className="underline hover:text-white/60"
        >
          Harmony Healthcare IT
        </a>{" "}
        ·{" "}
        <a
          href="https://www.demandsage.com/average-time-spent-on-social-media/"
          className="underline hover:text-white/60"
        >
          DemandSage
        </a>{" "}
        ·{" "}
        <a
          href="https://opalapp.com/screentime"
          className="underline hover:text-white/60"
        >
          Opal
        </a>
      </p>
    </footer>
  );
}
