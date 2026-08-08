import Image from "next/image";
import { theme } from "@/theme";

/**
 * PAGE 08 — the bottom of the sheet.
 *
 * Signed off in her hand, and nothing else. The cast used to be crowded
 * along here like photos on a fridge; without them this is just the sign-off,
 * which is what the last thing on a note from your mother should be.
 *
 * The one addition is the wordmark, which is the only place on the site the
 * name is set in type rather than written by her — a footer is where a
 * reader looks for whose site this was, and "— momm" in ballpoint answers
 * who wrote the note, not who made the thing. Above the rule, so the plate
 * reads as the mark and everything under it as the sign-off.
 *
 * It's shipped as artwork rather than reset in Bitter because the logo's
 * face isn't Bitter, and a wordmark redrawn in whatever the site happens to
 * load is a wordmark you no longer own. `public/brand/wordmark.webp` has had
 * its own background cut away by `npm run brand`, so what shows through the
 * counters is the cream page.
 *
 * Comfortable headroom above the sign-off so it reads as the last line on the
 * page rather than crowding the act above it.
 */
export default function Scene08Footer() {
  return (
    <footer className="flex flex-col items-center gap-6 px-6 pb-12 pt-14 text-center">
      <Image
        src="/brand/wordmark.webp"
        alt="momm"
        width={900}
        height={180}
        className="h-auto w-[9.5rem] opacity-90 md:w-[11rem]"
        sizes="(max-width: 768px) 152px, 176px"
      />

      <div
        className="h-px w-40"
        style={{ backgroundColor: theme.onDoor + "2E" }}
        aria-hidden
      />

      <p className="font-hand text-3xl" style={{ color: theme.pen }}>
        — momm
      </p>

      <p className="text-xs" style={{ color: theme.onDoor, opacity: 0.5 }}>
        © 2026 momm. made with ❤️ and nagging.
      </p>
    </footer>
  );
}
