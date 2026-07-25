"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import Typewriter from "../Typewriter";

/** SCENE 01 — the hook. One line, near-empty screen, pulls you into the data. */
export default function Scene01Hook() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <section
      ref={ref}
      className="flex min-h-[75vh] items-center justify-center px-6"
    >
      <p className="text-center font-header text-2xl font-semibold text-white/90 md:text-4xl">
        <Typewriter text="She was nagging for a reason." start={inView} speed={65} />
      </p>
    </section>
  );
}
