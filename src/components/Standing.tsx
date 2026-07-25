import { ReactNode } from "react";

/**
 * A figure standing somewhere specific in the frame.
 *
 * `Avatar` puts `relative` on its own root and merges the caller's
 * className after it — but Tailwind emits `.relative` after `.absolute`
 * within the position group, so a caller passing `absolute` loses the
 * cascade no matter which order the two appear in the class string. The
 * avatar then lays out in flow, which is a silent failure and a
 * plausible-looking one: on the turn it parked the kid against momm's
 * shoulder instead of across the room from her, and on the reckoning it
 * shoved the chart sideways to make room for him.
 *
 * Position the wrapper, never the figure.
 */
export default function Standing({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`pointer-events-none absolute ${className}`}>{children}</div>;
}
