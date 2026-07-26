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
  | "camera"
  | "music"
  | "play"
  | "flame"
  | "eye"
  | "check"
  | "heart";

const PATHS: Record<IconName, React.ReactNode> = {
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
  check: <path d="m4.5 12.5 5 5 10-11" />,
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z" />
  ),
};

export default function Icon({
  name,
  size = 20,
  className = "",
  strokeWidth = 1.6,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
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
    >
      {PATHS[name]}
    </svg>
  );
}
