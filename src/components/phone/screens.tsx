"use client";

import { theme } from "@/theme";

/* ----------------------------------------------------------------
   momm's phone screens. Every screen is mom doing something to you —
   not an app showing a feature.
   ---------------------------------------------------------------- */

const screenBase =
  "relative flex h-full w-full flex-col overflow-hidden bg-[#0B0714] text-white";

/** Scene 04 + 05 — the takeover when you try to open a blocked app */
export function BlockScreen() {
  return (
    <div className={`${screenBase} items-center justify-center gap-3 px-5 text-center`}>
      {/* pretend-TikTok glowing behind the block */}
      <div className="absolute inset-0 opacity-25 blur-2xl">
        <div className="absolute left-4 top-16 h-24 w-24 rounded-full bg-[#69C9D0]" />
        <div className="absolute bottom-20 right-4 h-28 w-28 rounded-full bg-[#EE1D52]" />
      </div>
      <p className="relative font-header text-5xl font-black">Nope.</p>
      <p className="relative font-sub italic text-white/80">
        Put it down. — momm
      </p>
      <div className="relative mt-4 rounded-full border border-white/25 px-5 py-2 text-xs text-white/50">
        ok, fine 😔
      </div>
    </div>
  );
}

/** Scene 04 — momm's texts + the streak banner */
export function TextsScreen() {
  return (
    <div className={screenBase}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 pb-3 pt-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm">
          💗
        </div>
        <div>
          <p className="text-sm font-bold leading-none">momm</p>
          <p className="text-[10px] text-white/50">always online</p>
        </div>
      </div>
      <div className="mx-3 mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
        <span>🔥</span>
        <p className="text-[11px] font-semibold">
          12-day streak <span className="font-normal text-white/60">— keep it up</span>
        </p>
      </div>
      <div className="flex flex-col gap-2 px-3 py-4">
        {[
          "Are you STILL on Instagram? 🙄",
          "It's been 15 minutes.",
          "Dinner's ready. Phone down.",
        ].map((m) => (
          <div
            key={m}
            className="max-w-[85%] self-start rounded-2xl rounded-bl-md bg-white/14 px-3 py-2 text-[12px] leading-snug"
          >
            {m}
          </div>
        ))}
        <p className="mt-1 self-start px-1 text-[9px] text-white/40">
          momm is typing…
        </p>
      </div>
    </div>
  );
}

/** timer ring used by both focus screens */
function FocusRing({ paused = false }: { paused?: boolean }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 140 140" className="h-40 w-40">
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="7" />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke={paused ? "rgba(255,255,255,0.35)" : "#fff"}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * 0.32}
        transform="rotate(-90 70 70)"
      />
      <text
        x="70"
        y="76"
        textAnchor="middle"
        fill={paused ? "rgba(255,255,255,0.5)" : "#fff"}
        fontSize="24"
        fontWeight="800"
      >
        18:42
      </text>
    </svg>
  );
}

/** Scene 04 — the calm focus session */
export function FocusScreen() {
  return (
    <div className={`${screenBase} items-center justify-center gap-3 text-center`}>
      <p className="font-sub italic text-white/70">focus with momm</p>
      <FocusRing />
      <div className="rounded-full bg-white/10 px-4 py-1.5 text-[10px] text-white/70">
        pauses if you walk away
      </div>
    </div>
  );
}

/** Scene 05 — Instagram with the Reels tab sealed */
export function ReelsLockedScreen() {
  return (
    <div className={screenBase}>
      <p className="px-4 pb-2 pt-4 font-sub text-lg italic">Instagram</p>
      <div className="flex flex-1 flex-col gap-2 px-3">
        <div className="h-24 rounded-xl bg-gradient-to-br from-white/15 to-white/5 blur-[1.5px]" />
        <div className="h-24 rounded-xl bg-gradient-to-br from-white/12 to-white/4 blur-[1.5px]" />
        <div className="mx-auto mt-2 rounded-full bg-white/12 px-4 py-1.5 text-[10px]">
          🔒 Reels sealed shut — momm
        </div>
      </div>
      <div className="flex items-center justify-around border-t border-white/10 py-3 text-lg">
        <span>🏠</span>
        <span className="opacity-60">🔍</span>
        <span className="relative">
          🎬
          <span
            className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px]"
            style={{ backgroundColor: theme.danger }}
          >
            🔒
          </span>
        </span>
        <span className="opacity-60">🛍️</span>
        <span className="opacity-60">👤</span>
      </div>
    </div>
  );
}

/** Scene 05 — momm tells on you */
export function SnitchScreen() {
  return (
    <div className={screenBase}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 pb-3 pt-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm">
          👩
        </div>
        <p className="text-sm font-bold">Mom ❤️</p>
      </div>
      <div className="flex flex-col gap-2 px-3 py-4">
        <div className="max-w-[88%] self-end rounded-2xl rounded-br-md bg-[#3D7BFF] px-3 py-2 text-[12px] leading-snug">
          FYI — 15 minutes straight on Instagram. Thought you should know. — momm 🤝
        </div>
        <div className="max-w-[70%] self-start rounded-2xl rounded-bl-md bg-white/14 px-3 py-2 text-[12px]">
          not for long. 😤
        </div>
        <p className="self-end px-1 text-[9px] text-white/40">delivered</p>
      </div>
    </div>
  );
}

/** Scene 05 — house rules: daily limits */
export function LimitsScreen() {
  const rows = [
    { app: "📸 Instagram", limit: "30m", pct: 0.35 },
    { app: "🎵 TikTok", limit: "15m", pct: 0.18 },
    { app: "▶️ YouTube", limit: "45m", pct: 0.5 },
  ];
  return (
    <div className={`${screenBase} px-4 pt-5`}>
      <p className="font-header text-lg font-bold">House rules</p>
      <p className="mb-4 font-sub text-xs italic text-white/60">
        set once. momm enforces.
      </p>
      <div className="flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.app}>
            <div className="mb-1.5 flex justify-between text-[12px]">
              <span>{r.app}</span>
              <span className="text-white/60">{r.limit}/day</span>
            </div>
            <div className="relative h-2 rounded-full bg-white/12">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white"
                style={{ width: `${r.pct * 100}%` }}
              />
              <div
                className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[#0B0714] bg-white"
                style={{ left: `calc(${r.pct * 100}% - 8px)` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-[10px] text-white/40">
        &ldquo;and I mean it.&rdquo; — momm
      </p>
    </div>
  );
}

/** Scene 05 — the streak calendar */
export function StreakScreen() {
  return (
    <div className={`${screenBase} items-center px-4 pt-5`}>
      <p className="font-header text-2xl font-black">🔥 12 days</p>
      <p className="mb-4 font-sub text-xs italic text-white/60">
        make momm proud
      </p>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 28 }, (_, i) => (
          <div
            key={i}
            className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] ${
              i < 12 ? "bg-white/18" : "bg-white/6 text-white/30"
            }`}
          >
            {i < 12 ? "🔥" : i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Scene 05 — focus, but you looked away */
export function FocusPausedScreen() {
  return (
    <div className={`${screenBase} items-center justify-center gap-3 text-center`}>
      <div className="rounded-full bg-[#FFB020]/20 px-4 py-1.5 text-[11px] text-[#FFCF70]">
        paused — you looked away 👀
      </div>
      <FocusRing paused />
      <p className="font-sub text-xs italic text-white/50">
        momm stopped the clock.
      </p>
    </div>
  );
}
