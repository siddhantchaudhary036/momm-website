"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import Icon, { type IconName } from "./Icon";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** slider springs: glass — quick, precise, a hair of overshoot */
const GLASS_SPRING = { type: "spring" as const, stiffness: 260, damping: 20, mass: 0.7 };

/**
 * momm's interface, shown at full size with no device around it.
 *
 * A phone mockup is a container for a screenshot: it adds no information
 * — everyone knows what an app is — and it forces the UI down to a size
 * where nothing can be read. Dropping the frame lets these run at 1:1,
 * which is the only size at which an interface is worth showing.
 *
 * These are the one place the matte rule is suspended. Everything in this
 * world is flat and unlit; screens are glass and get a sheen, a blur and
 * a hard shadow. The material difference is the argument: this is the
 * thing that doesn't belong on her door.
 */

export const GLASS = {
  background: "rgba(18,14,22,0.72)",
  backdropFilter: "blur(22px) saturate(140%)",
  WebkitBackdropFilter: "blur(22px) saturate(140%)",
  border: "1px solid rgba(255,255,255,0.13)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.16), 0 26px 60px rgba(0,0,0,0.6), 0 6px 16px rgba(0,0,0,0.45)",
} as const;

/**
 * Glass tilts toward the pointer.
 *
 * It's the one effect here that only works because the thing is glass:
 * a sheet of paper taped to a door has no business tracking your cursor,
 * but a pane held in front of you catching the light does. Kept small —
 * six degrees — because past that it stops reading as parallax and starts
 * reading as a novelty.
 */
export function Glass({
  children,
  className = "",
  radius = 26,
  tilt = true,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const cfg = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), cfg);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), cfg);
  const sheenX = useSpring(useTransform(px, [-0.5, 0.5], [16, 84]), cfg);
  // hoisted: a hook can't live inside the JSX behind a conditional
  const sheen = useTransform(
    sheenX,
    (x) =>
      `linear-gradient(105deg, rgba(255,255,255,0) ${x - 26}%, rgba(255,255,255,0.09) ${x}%, rgba(255,255,255,0) ${x + 26}%)`,
  );

  const live = tilt && !reduced;

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        ...GLASS,
        borderRadius: radius,
        rotateX: live ? rotX : 0,
        rotateY: live ? rotY : 0,
        transformPerspective: 900,
      }}
      onPointerMove={
        live
          ? (e) => {
              const r = ref.current?.getBoundingClientRect();
              if (!r) return;
              px.set((e.clientX - r.left) / r.width - 0.5);
              py.set((e.clientY - r.top) / r.height - 0.5);
            }
          : undefined
      }
      onPointerLeave={
        live
          ? () => {
              px.set(0);
              py.set(0);
            }
          : undefined
      }
    >
      {live && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ borderRadius: radius, background: sheen }}
        />
      )}
      {children}
    </motion.div>
  );
}

/** the momm app tile that heads every notification */
function AppTile({ size = 34 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center text-white"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: "linear-gradient(150deg, #FF8A6B 0%, #E8567A 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
      }}
    >
      <Icon name="heart" size={size * 0.5} strokeWidth={2} />
    </div>
  );
}

export function NotificationCard({
  body,
  when = "now",
  className = "",
}: {
  body: string;
  when?: string;
  className?: string;
}) {
  return (
    <Glass className={`w-[min(84vw,23rem)] px-4 py-3.5 ${className}`} radius={22}>
      <div className="flex items-start gap-3">
        <AppTile />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[13px] font-bold tracking-wide text-white">momm</p>
            <p className="shrink-0 text-[11px] text-white/45">{when}</p>
          </div>
          <p className="mt-0.5 text-[14px] leading-snug text-white/85">{body}</p>
        </div>
      </div>
    </Glass>
  );
}

const RULES: { app: string; icon: IconName; limit: string; pct: number }[] = [
  { app: "Instagram", icon: "camera", limit: "30m", pct: 0.35 },
  { app: "TikTok", icon: "music", limit: "15m", pct: 0.18 },
  { app: "YouTube", icon: "play", limit: "45m", pct: 0.5 },
];

export function LimitsCard({ className = "" }: { className?: string }) {
  return (
    <Glass className={`w-[min(88vw,22rem)] px-6 py-6 ${className}`}>
      <p className="font-header text-lg font-bold text-white">House rules</p>
      <p className="mb-5 font-sub text-sm italic text-white/50">
        set once. momm enforces.
      </p>
      <div className="flex flex-col gap-5">
        {RULES.map((r, i) => (
          <div key={r.app}>
            <div className="mb-2 flex items-center gap-2.5 text-[13px] text-white/90">
              <Icon name={r.icon} size={17} className="text-white/60" />
              <span className="flex-1">{r.app}</span>
              <span className="tabular-nums text-white/50">{r.limit}/day</span>
            </div>
            {/* the sliders run to their setting on arrival, staggered, and
                the thumb overshoots a touch — a limit being *set* rather
                than a bar that was always that long */}
            <div className="relative h-1.5 rounded-full bg-white/12">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-white"
                initial={{ width: 0 }}
                whileInView={{ width: `${r.pct * 100}%` }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ ...GLASS_SPRING, delay: 0.15 + i * 0.12 }}
              />
              <motion.div
                className="absolute top-1/2 h-3.5 w-3.5 rounded-full bg-white"
                initial={{ left: -7, y: "-50%" }}
                whileInView={{ left: `calc(${r.pct * 100}% - 7px)`, y: "-50%" }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ ...GLASS_SPRING, delay: 0.15 + i * 0.12 }}
                style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.5)" }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center font-sub text-xs italic text-white/40">
        &ldquo;and I mean it.&rdquo; — momm
      </p>
    </Glass>
  );
}

export function StreakCard({ className = "" }: { className?: string }) {
  return (
    <Glass className={`w-[min(88vw,20rem)] px-6 py-6 ${className}`}>
      <div className="flex items-center gap-2.5">
        <Icon name="flame" size={26} className="text-[#FF8A4C]" strokeWidth={1.8} />
        <p className="font-header text-2xl font-black text-white">12 days</p>
      </div>
      <p className="mb-5 font-sub text-sm italic text-white/50">make momm proud</p>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 28 }, (_, i) => (
          <motion.div
            key={i}
            className={`flex aspect-square items-center justify-center rounded-md text-[10px] ${
              i < 12 ? "text-[#FF8A4C]" : "text-white/25"
            }`}
            style={{
              background: i < 12 ? "rgba(255,138,76,0.16)" : "rgba(255,255,255,0.05)",
            }}
            /* the streak earns itself day by day instead of arriving done */
            initial={i < 12 ? { opacity: 0, scale: 0.4 } : false}
            whileInView={i < 12 ? { opacity: 1, scale: 1 } : undefined}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ ...GLASS_SPRING, delay: 0.2 + i * 0.055 }}
          >
            {i < 12 ? <Icon name="flame" size={12} strokeWidth={2} /> : i + 1}
          </motion.div>
        ))}
      </div>
    </Glass>
  );
}
