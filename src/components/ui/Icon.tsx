"use client";

/**
 * One icon set, one weight, `currentColor` throughout.
 *
 * These replace the emoji that used to sit in the product UI. Emoji are
 * the loudest "made in an afternoon" signal an interface can carry: they
 * render as a different artwork on every platform, they never match the
 * weight or colour of the type around them, and they can't inherit a
 * theme. That was survivable while the screens were 138px wide and
 * nobody could see them; now the UI is shown at full size it wouldn't be.
 */

export type IconName =
  | "home"
  | "search"
  | "reels"
  | "shop"
  | "person"
  | "camera"
  | "music"
  | "play"
  | "flame"
  | "eye"
  | "lock"
  | "check"
  | "heart"
  | "chevronDown";

const PATHS: Record<IconName, React.ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  reels: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M8.5 3.5 11 8M14 3.5 16.5 8M3.5 8h17" />
      <path d="m10.5 12.5 4 2.2-4 2.2z" />
    </>
  ),
  shop: <path d="M4 8h16l-1.2 12H5.2zM8.5 8V6a3.5 3.5 0 0 1 7 0v2" />,
  person: (
    <>
      <circle cx="12" cy="8" r="3.75" />
      <path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6.5l10-2V16" />
      <circle cx="6.75" cy="18" r="2.4" />
      <circle cx="16.75" cy="16" r="2.4" />
    </>
  ),
  play: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="4.5" />
      <path d="m10.5 9.2 5 2.8-5 2.8z" fill="currentColor" stroke="none" />
    </>
  ),
  flame: (
    <path d="M12 3s5 4.2 5 8.6a5 5 0 0 1-10 0c0-1.7.8-3.1 1.7-4.2.3 1.2 1 2 1.9 2.3C11.2 8 11 5.4 12 3Z" />
  ),
  eye: (
    <>
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="3" />
      <path d="M8.25 10V7.5a3.75 3.75 0 0 1 7.5 0V10" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z" />
  ),
  chevronDown: <path d="m5.5 9 6.5 6.5L18.5 9" />,
};

export default function Icon({
  name,
  size = 20,
  className = "",
  strokeWidth = 1.6,
  style,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  /** the icon draws in `currentColor`, so this is how a theme token reaches it */
  style?: React.CSSProperties;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      style={style}
    >
      {PATHS[name]}
    </svg>
  );
}
