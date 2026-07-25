"use client";

import {
  MotionValue,
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import GlitchBurst from "../GlitchBurst";
import LifeGrid from "../LifeGrid";
import ScrambleNumber from "../ScrambleNumber";
import ScrollBeat from "../ScrollBeat";
import { theme } from "@/theme";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* ================================================================
   02a — PICKUPS: 144 dots ignite one-by-one as you scroll.
   ================================================================ */
export function BeatPickups() {
  return (
    <ScrollBeat heightClass="h-[260vh]" line="You picked me up 144 times today.">
      {(p) => <PickupsVisual p={p} />}
    </ScrollBeat>
  );
}

function PickupsVisual({ p }: { p: MotionValue<number> }) {
  const litMV = useTransform(p, [0.08, 0.85], [0, 144]);
  const [lit, setLit] = useState(0);
  const [locked, setLocked] = useState(false);
  useMotionValueEvent(litMV, "change", (v) => {
    const rounded = Math.round(Math.min(144, Math.max(0, v)));
    setLit(rounded);
    if (rounded >= 144) setLocked(true);
  });

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:gap-16">
      <div className="text-center md:text-right">
        <p className="font-header text-7xl font-black tabular-nums md:text-9xl">
          <ScrambleNumber value={String(lit)} active={locked} />
        </p>
        <p className="mt-1 font-sub text-lg italic text-white/70">
          once every 6½ minutes.
        </p>
      </div>
      <div className="grid grid-cols-12 gap-1.5 md:gap-2.5">
        {Array.from({ length: 144 }, (_, i) => (
          <div
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-200 md:h-4 md:w-4 ${
              i < lit ? "scale-100" : "scale-75"
            }`}
            style={{ backgroundColor: i < lit ? theme.ink : theme.ink + "1F" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   02b — THE HOURS: bar sweeps to 5h 16m past last year's ghost,
   then the "+14%" stamp slams in.
   ================================================================ */
const MINS_2025 = 316; // 5h 16m
const MINS_2024 = 277; // 4h 37m

export function BeatHours() {
  return (
    <ScrollBeat
      heightClass="h-[240vh]"
      line="That's 5 hours, 16 minutes. Every single day."
    >
      {(p) => <HoursVisual p={p} />}
    </ScrollBeat>
  );
}

function HoursVisual({ p }: { p: MotionValue<number> }) {
  const fill = useTransform(p, [0.08, 0.8], [0, 1]);
  const scaleY = useTransform(fill, clamp01);
  const [mins, setMins] = useState(0);
  const [locked, setLocked] = useState(false);
  useMotionValueEvent(fill, "change", (v) => {
    const rounded = Math.round(clamp01(v) * MINS_2025);
    setMins(rounded);
    if (rounded >= MINS_2025) setLocked(true);
  });
  const stamped = mins >= MINS_2025 - 6;
  const hoursStr = `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`;

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-header text-5xl font-black tabular-nums md:text-7xl">
        <ScrambleNumber value={hoursStr} active={locked} />
      </p>
      <div className="relative flex h-[38vh] items-end gap-10 md:h-[44vh]">
        {/* last year's ghost */}
        <div className="flex h-full flex-col justify-end text-center">
          <div
            className="w-16 rounded-t-xl border-2 border-dashed md:w-24"
            style={{
              height: `${(MINS_2024 / MINS_2025) * 100}%`,
              borderColor: theme.ink + "4D",
            }}
          />
          <p className="mt-2 text-xs text-white/85">2024 · 4h 37m</p>
        </div>
        {/* this year, filling with your scroll */}
        <div className="flex h-full flex-col justify-end text-center">
          <motion.div
            style={{ scaleY, transformOrigin: "bottom", backgroundColor: theme.ink }}
            className="h-full w-20 rounded-t-xl md:w-28"
          />
          <p className="mt-2 text-xs text-white">2025 · 5h 16m</p>
        </div>
      </div>
      {/* the insight, as a clean caption (no stamp) */}
      <motion.p
        initial={false}
        animate={{ opacity: stamped ? 1 : 0, y: stamped ? 0 : 8 }}
        transition={{ duration: 0.5 }}
        className="font-sub text-xl italic md:text-2xl"
      >
        ↑ 14% more, in just one year.
      </motion.p>
    </div>
  );
}

/* ================================================================
   02c — THE GUT-PUNCH: your life in years floods red to 32.
   ================================================================ */
export function BeatLifeYears() {
  return (
    <ScrollBeat
      heightClass="h-[300vh]"
      line="Keep this up and that's 32 years of your life. Gone."
      lineSpeed={60}
    >
      {(p) => <LifeYearsVisual p={p} />}
    </ScrollBeat>
  );
}

function LifeYearsVisual({ p }: { p: MotionValue<number> }) {
  const mv = useTransform(p, [0.08, 0.9], [0, 32]);
  const [filled, setFilled] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const firedRef = useRef(false);
  useMotionValueEvent(mv, "change", (v) => {
    const rounded = Math.round(Math.min(32, Math.max(0, v)));
    setFilled(rounded);
    if (rounded >= 32 && !firedRef.current) {
      firedRef.current = true;
      setBurstKey((k) => k + 1);
    }
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <p
        className="font-header text-6xl font-black tabular-nums transition-colors duration-500 md:text-8xl"
        style={{ color: filled > 0 ? theme.danger : "#fff" }}
      >
        <GlitchBurst key={burstKey} active={burstKey > 0}>
          <ScrambleNumber value={String(filled)} active={burstKey > 0} />
          <span className="text-3xl font-bold md:text-5xl"> years</span>
        </GlitchBurst>
      </p>
      <LifeGrid filled={filled} />
      <p className="font-sub text-lg italic text-white/70">
        each square is a year of your one life.
      </p>
    </div>
  );
}

/* ================================================================
   02d — THE TRAP: the social donut draws itself in.
   ================================================================ */
const SEGS = [
  { label: "TikTok", min: 95, color: theme.ink },
  { label: "Instagram", min: 32, color: theme.ink + "99" },
  { label: "everything else", min: 14, color: theme.ink + "4D" },
];
const TOTAL_MIN = SEGS.reduce((a, s) => a + s.min, 0); // 141 = 2h 21m

export function BeatSocialDonut() {
  return (
    <ScrollBeat
      heightClass="h-[240vh]"
      line="4 hours a day on apps built to keep you there."
    >
      {(p) => <DonutVisual p={p} />}
    </ScrollBeat>
  );
}

function DonutVisual({ p }: { p: MotionValue<number> }) {
  const reveal = useTransform(p, [0.08, 0.8], [0, 1]);
  const [mins, setMins] = useState(0);
  useMotionValueEvent(reveal, "change", (v) =>
    setMins(Math.round(clamp01(v) * TOTAL_MIN)),
  );
  const subShown = mins >= TOTAL_MIN - 4;

  // fixed 3 segments → hooks written out explicitly
  const f0 = SEGS[0].min / TOTAL_MIN;
  const f1 = SEGS[1].min / TOTAL_MIN;
  const f2 = SEGS[2].min / TOTAL_MIN;
  const s1 = f0;
  const s2 = f0 + f1;
  const GAP = 0.012;

  const len0 = useTransform(reveal, (v) => Math.max(0, Math.min(clamp01(v), f0) - GAP));
  const len1 = useTransform(reveal, (v) => Math.max(0, Math.min(clamp01(v) - s1, f1) - GAP));
  const len2 = useTransform(reveal, (v) => Math.max(0, Math.min(clamp01(v) - s2, f2) - GAP));
  const dash0 = useMotionTemplate`${len0} 1`;
  const dash1 = useMotionTemplate`${len1} 1`;
  const dash2 = useMotionTemplate`${len2} 1`;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <svg viewBox="0 0 200 200" className="h-[34vh] w-auto max-w-[80vw] md:h-[42vh]">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={theme.ink + "1F"}
            strokeWidth="26"
          />
          {[dash0, dash1, dash2].map((dash, i) => (
            <motion.circle
              key={i}
              cx="100"
              cy="100"
              r="80"
              fill="none"
              pathLength={1}
              stroke={SEGS[i].color}
              strokeWidth="26"
              strokeDashoffset={i === 0 ? 0 : i === 1 ? -s1 : -s2}
              style={{ strokeDasharray: dash }}
              transform="rotate(-90 100 100)"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-header text-3xl font-black tabular-nums md:text-5xl">
            {Math.floor(mins / 60)}h {String(mins % 60).padStart(2, "0")}m
          </p>
          <p className="font-sub text-sm italic text-white/60">social · every day</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-white/70">
        {SEGS.map((s) => (
          <span key={s.label} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label} {s.min}m
          </span>
        ))}
      </div>
      <motion.p
        animate={{ opacity: subShown ? 1 : 0, y: subShown ? 0 : 12 }}
        transition={{ duration: 0.5 }}
        className="font-header text-xl font-bold md:text-2xl"
      >
        Gen Z: 4 hours. <span className="font-sub italic">Every. Day.</span>
      </motion.p>
    </div>
  );
}
