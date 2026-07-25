"use client";

import { MotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { useState } from "react";
import LifeGrid from "../LifeGrid";
import ScrollBeat from "../ScrollBeat";
import { theme } from "@/theme";

/**
 * SCENE 06 — the payoff. The same life-grid that flooded red
 * heals green as you scroll: six years, handed back.
 */
export default function Scene06Payoff() {
  return (
    <ScrollBeat
      heightClass="h-[240vh]"
      line="Put it down, and get 6 years of your life back."
    >
      {(p) => <PayoffVisual p={p} />}
    </ScrollBeat>
  );
}

function PayoffVisual({ p }: { p: MotionValue<number> }) {
  const mv = useTransform(p, [0.1, 0.85], [0, 6]);
  const [healed, setHealed] = useState(0);
  useMotionValueEvent(mv, "change", (v) =>
    setHealed(Math.round(Math.min(6, Math.max(0, v)))),
  );

  return (
    <div className="flex flex-col items-center gap-5">
      <p
        className="font-header text-6xl font-black tabular-nums md:text-8xl"
        style={{ color: theme.heal }}
      >
        +{healed}
        <span className="text-3xl font-bold md:text-5xl"> years</span>
      </p>
      <LifeGrid filled={32} healed={healed} />
      <p className="font-sub text-lg italic text-white/70">
        six years, back in your pocket. — momm
      </p>
    </div>
  );
}
