"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import Note from "../fridge/Note";
import Icon, { type IconName } from "./Icon";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { inkPolyline } from "@/lib/ink";
import { theme } from "@/theme";

/**
 * momm's interface, shown at full size with no device around it.
 *
 * A phone mockup is a container for a screenshot: it adds no information —
 * everyone knows what an app is — and it forces the UI down to a size where
 * nothing can be read. Dropping the frame lets these run at 1:1, which is
 * the only size at which an interface is worth showing.
 *
 * THESE USED TO BE DARK GLASS, and that was the single biggest lie on the
 * page. `momm-app/tailwind.config.js` says it outright — "There is no
 * `darkMode` key. The surface of this app is paper" — and
 * `momm-app/src/components/ui/card.tsx` is blunter still: "A card is a sheet
 * of paper. There is no separate card surface in this app — no lighter grey
 * box, no border, no elevation token. Grouping comes from the sheet being an
 * *object*." So the marketing site was showing a product that does not
 * exist, in a palette the app explicitly refuses, floating on her cream door.
 *
 * They are sheets now, and the app's own tokens carry over one-for-one:
 * `paper` for the sheet, `wash` for anything recessed into it, `ink` for
 * every non-text mark, `onDoorMuted` for secondary text. Depth comes from
 * the tilt, the shadow and the tape — never from a different fill.
 */

const CELL = 15;

/**
 * A day she's counted, ticked by hand.
 *
 * The chrome around it is CSS, but the *mark* is drawn — which is the split
 * the app keeps too: the sheet and its wells are material, and anything that
 * reads as her having been here is ink. A `✓` glyph set in a UI font would
 * be the one thing in the streak that nobody wrote.
 */
function tick(seed: string) {
  return inkPolyline(
    [
      { x: 3, y: CELL * 0.52 },
      { x: CELL * 0.42, y: CELL - 3.5 },
      { x: CELL - 2.5, y: 3.5 },
    ],
    { seed, amp: 0.6, wavelength: 18, overshoot: 1.2 },
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
        // her icon, and the one warm accent these three mockups share
        background: `linear-gradient(150deg, #FF8A6B 0%, ${theme.fridge.magnet} 100%)`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
      }}
    >
      <Icon name="heart" size={size * 0.5} strokeWidth={2} />
    </div>
  );
}

/**
 * A notification, as iOS actually draws one over a light wallpaper.
 *
 * The one card here that isn't paper, and the one that shouldn't be: this
 * surface belongs to the operating system, not to momm. The app's theme
 * makes the same distinction about the Screen Time shield — "the one surface
 * in this app whose background we don't own". So it stays translucent system
 * chrome rather than becoming a note, and only the tile inside it is hers.
 */
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
    <div
      className={`w-[min(84vw,23rem)] px-4 py-3.5 ${className}`}
      style={{
        borderRadius: 22,
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        border: `1px solid ${theme.ink}14`,
        boxShadow:
          "0 10px 28px rgba(56,46,38,0.10), 0 2px 6px rgba(56,46,38,0.06)",
      }}
    >
      <div className="flex items-start gap-3">
        <AppTile />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p
              className="text-[13px] font-bold tracking-wide"
              style={{ color: theme.ink }}
            >
              momm
            </p>
            <p className="shrink-0 text-[11px]" style={{ color: theme.onDoorMuted }}>
              {when}
            </p>
          </div>
          <p
            className="mt-0.5 text-[14px] leading-snug"
            style={{ color: theme.onDoor }}
          >
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

const RULES: { app: string; icon: IconName; limit: string; pct: number }[] = [
  { app: "Instagram", icon: "camera", limit: "30m", pct: 0.35 },
  { app: "TikTok", icon: "music", limit: "15m", pct: 0.18 },
  { app: "YouTube", icon: "play", limit: "45m", pct: 0.5 },
];

/** slider springs: quick, precise, a hair of overshoot */
const SPRING = { type: "spring" as const, stiffness: 260, damping: 20, mass: 0.7 };

/**
 * The rules sheet — the website's read of `momm-app`'s `RulesCard`.
 *
 * Each rule sits in its own `wash` well, which is the app's row treatment
 * (`rounded-2xl bg-secondary`) in the app's own recessed-surface colour. The
 * sliders stay, because a marketing page has to show what a limit *is* and
 * the app expresses that in a bottom sheet nobody can see from here.
 */
export function LimitsCard({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <Note seed="house-rules-card" paper="plain" fasten="tape" className={className}>
      <div className="w-[min(88vw,22rem)] px-6 py-6">
        <p className="font-header text-lg font-bold" style={{ color: theme.ink }}>
          House rules
        </p>
        <p
          className="mb-5 font-sub text-sm italic"
          style={{ color: theme.onDoorMuted }}
        >
          set once. momm enforces.
        </p>

        <div className="flex flex-col gap-3">
          {RULES.map((r, i) => (
            <div
              key={r.app}
              className="rounded-2xl px-4 py-3.5"
              style={{ background: theme.wash }}
            >
              <div className="mb-2.5 flex items-center gap-2.5 text-[13px]">
                <Icon name={r.icon} size={17} style={{ color: theme.ink }} />
                <span className="flex-1" style={{ color: theme.onDoor }}>
                  {r.app}
                </span>
                <span
                  className="tabular-nums"
                  style={{ color: theme.onDoorMuted }}
                >
                  {r.limit}/day
                </span>
              </div>

              {/* the sliders run to their setting on arrival, staggered, and
                  the thumb overshoots a touch — a limit being *set* rather
                  than a bar that was always that long */}
              <div
                className="relative h-1.5 rounded-full"
                style={{ background: `${theme.ink}1A` }}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: theme.ink }}
                  initial={reduced ? false : { width: 0 }}
                  whileInView={{ width: `${r.pct * 100}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ ...SPRING, delay: 0.15 + i * 0.12 }}
                />
                <motion.div
                  className="absolute top-1/2 h-3.5 w-3.5 rounded-full"
                  style={{
                    background: theme.ink,
                    // a paper ring, so the thumb reads as sitting above the
                    // track rather than punched out of it
                    boxShadow: `0 0 0 2.5px ${theme.paper}, 0 2px 5px ${theme.ink}40`,
                  }}
                  initial={reduced ? false : { left: -7, y: "-50%" }}
                  whileInView={{ left: `calc(${r.pct * 100}% - 7px)`, y: "-50%" }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ ...SPRING, delay: 0.15 + i * 0.12 }}
                />
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-5 text-center font-sub text-xs italic"
          style={{ color: theme.onDoorMuted }}
        >
          &ldquo;and I mean it.&rdquo; — momm
        </p>
      </div>
    </Note>
  );
}

const STREAK = 12;
const DAYS = 28;

export function StreakCard({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  // one hand per day, so no two ticks are the same tick
  const ticks = useMemo(
    () => Array.from({ length: STREAK }, (_, i) => tick(`streak-${i}`)),
    [],
  );

  return (
    <Note seed="streak-card" paper="plain" fasten="tape" className={className}>
      <div className="w-[min(88vw,20rem)] px-6 py-6">
        <div className="flex items-center gap-2.5">
          <Icon
            name="flame"
            size={26}
            strokeWidth={1.8}
            style={{ color: theme.fridge.magnet }}
          />
          <p className="font-header text-2xl font-black" style={{ color: theme.ink }}>
            {STREAK} days
          </p>
        </div>
        <p
          className="mb-5 font-sub text-sm italic"
          style={{ color: theme.onDoorMuted }}
        >
          make momm proud
        </p>

        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: DAYS }, (_, i) => {
            const done = i < STREAK;
            return (
              <motion.div
                key={i}
                className="flex aspect-square items-center justify-center rounded-md text-[10px]"
                style={{
                  background: done ? `${theme.fridge.magnet}1F` : theme.wash,
                  color: theme.onDoorMuted,
                }}
                /* the streak earns itself day by day instead of arriving done */
                initial={done && !reduced ? { opacity: 0, scale: 0.4 } : false}
                whileInView={done ? { opacity: 1, scale: 1 } : undefined}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ ...SPRING, delay: 0.2 + i * 0.055 }}
              >
                {done ? (
                  <svg
                    viewBox={`0 0 ${CELL} ${CELL}`}
                    className="h-3/4 w-3/4"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d={ticks[i]}
                      stroke={theme.fridge.magnet}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </Note>
  );
}
