"use client";

import { theme } from "@/theme";

type Props = {
  /** total squares = your years (~80) */
  total?: number;
  /** how many are flooded red (lost to the phone) */
  filled: number;
  /** how many of the filled squares have been healed back (from the end) */
  healed?: number;
  /** background usage — smaller, quieter */
  dim?: boolean;
  /** cool the red down to soft white (the pivot's turn) */
  cooled?: boolean;
};

/**
 * "Your life in years" — an 8×10 grid of squares.
 * Red floods in during the reckoning, cools at the pivot,
 * heals green at the payoff. One component, three moods.
 */
export default function LifeGrid({
  total = 80,
  filled,
  healed = 0,
  dim = false,
  cooled = false,
}: Props) {
  return (
    <div
      className={`grid grid-cols-10 ${dim ? "gap-1.5 md:gap-2" : "gap-1.5 md:gap-2.5"}`}
      role="img"
      aria-label={`${filled} of ${total} years spent on a phone`}
    >
      {Array.from({ length: total }, (_, i) => {
        const isFilled = i < filled;
        const isHealed = isFilled && i >= filled - healed;
        let bg: string;
        if (isHealed) bg = theme.heal;
        else if (isFilled) bg = cooled ? theme.ink + "3B" : theme.danger;
        else bg = theme.ink + "1F";
        return (
          <div
            key={i}
            className={`aspect-square rounded-[3px] transition-colors duration-700 md:rounded-[5px] ${
              dim ? "w-4 md:w-6" : "w-6 sm:w-7 md:w-9"
            }`}
            style={{
              backgroundColor: bg,
              transitionDelay: `${(cooled || isHealed ? i * 18 : 0)}ms`,
              boxShadow: isHealed
                ? `0 0 14px ${theme.heal}55`
                : isFilled && !cooled && !dim
                  ? `0 0 10px ${theme.danger}55`
                  : "none",
            }}
          />
        );
      })}
    </div>
  );
}
