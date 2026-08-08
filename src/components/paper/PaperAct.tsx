import { ReactNode } from "react";

/**
 * One act of the site.
 *
 * In the paper era this drew a torn-edged cream sheet lying on the one
 * before it, held with tape, over a fibre texture. Clay has none of that —
 * the ground is one continuous lit cream laid down globally by
 * `PageBackground`, and acts simply sit flush on it. So this is now just a
 * positioning wrapper that gives each act its own stacking context; the seam
 * between acts is the spacing and the clay panels, not a drawn edge.
 */
export default function PaperAct({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`relative ${className}`}>{children}</div>;
}
