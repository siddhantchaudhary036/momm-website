import PaperAct from "@/components/paper/PaperAct";
import PageMeetMomm from "@/components/scenes/PageMeetMomm";
import PagePayoff from "@/components/scenes/PagePayoff";
import PageReckoning from "@/components/scenes/PageReckoning";
import PaperOpen from "@/components/scenes/PaperOpen";
import Scene00Hero from "@/components/scenes/Scene00Hero";
import Scene07Waitlist from "@/components/scenes/Scene07Waitlist";
import Scene08Footer from "@/components/scenes/Scene08Footer";
import SkipToWaitlist from "@/components/ui/SkipToWaitlist";

/**
 * You go through the door once, and after that it's all her paper.
 *
 *   DOOR    the hero — one note taped to the fridge, in a room
 *     ↓     the push-in: the sheet grows until it is everything
 *   PAPER   her arithmetic — the reckoning
 *   PAPER   the product — she notices, she sets the rules
 *   PAPER   the drawing she put up
 *   NIGHT   the ask — lights down to her note and a shut phone
 *   PAPER   the sign-off
 *
 * Only the first screen is enamel. Everything after it happens on the same
 * cream, and the acts are separated the way sheets on a fridge actually are:
 * a torn edge with tape over it, one sheet lying on the next. That reads
 * calmer than the door/paper alternation this used to make — the reader stops
 * being moved between two rooms and just keeps reading her handwriting — and
 * the seams still do the work the changes of material were there for.
 *
 * Pacing alternates deliberately. Static sections read fast and cheap;
 * pinned scrubs are expensive and reserved for the beats that earn them.
 */
export default function Home() {
  return (
    <main className="relative">
      <Scene00Hero />

      {/* no top edge: the hero's push-in has already put you on this sheet */}
      <PaperAct seed="reckoning">
        <PaperOpen />
        <PageReckoning />
      </PaperAct>

      <PaperAct edges="top" fasten seed="product">
        <PageMeetMomm />
      </PaperAct>

      {/* both edges: this is the last sheet, so its torn bottom is where the
          paper runs out and the dark underneath it shows */}
      <PaperAct edges="both" fasten seed="drawing">
        <PagePayoff />
      </PaperAct>

      <Scene07Waitlist />

      <PaperAct edges="top" fasten seed="signoff">
        <Scene08Footer />
      </PaperAct>

      <SkipToWaitlist />
    </main>
  );
}
