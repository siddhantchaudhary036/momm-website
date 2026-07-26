import { theme } from "@/theme";

/**
 * PAGE 08 — the bottom of the sheet.
 *
 * Signed off in her hand, and nothing else. The cast used to be crowded
 * along here like photos on a fridge; without them this is just the sign-off,
 * which is what the last thing on a note from your mother should be.
 *
 * Extra headroom because this sheet is taped down: the strips hang above the
 * act's top edge, and the divider shouldn't collide with them.
 */
export default function Scene08Footer() {
  return (
    <footer className="flex flex-col items-center gap-6 px-6 pb-12 pt-14 text-center">
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
