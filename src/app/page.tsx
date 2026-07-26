import PaperAct from "@/components/paper/PaperAct";
import PageMeetMomm from "@/components/scenes/PageMeetMomm";
import PagePayoff from "@/components/scenes/PagePayoff";
import PageReckoning from "@/components/scenes/PageReckoning";
import PaperOpen from "@/components/scenes/PaperOpen";
import Scene00Hero from "@/components/scenes/Scene00Hero";
import Scene07Waitlist from "@/components/scenes/Scene07Waitlist";
import Scene08Footer from "@/components/scenes/Scene08Footer";

/**
 * You go through the door once, and after that it's all her paper.
 *
 *   DOOR    the hero — one note taped to the fridge, in a dark kitchen
 *     ↓     the push-in: the sheet grows until it is everything
 *   PAPER   her arithmetic — the reckoning
 *   PAPER   the product — she notices, she sets the rules
 *   PAPER   the drawing she put up
 *   PAPER   the ask, and a phone with Instagram shut
 *   PAPER   the sign-off
 *
 * Only the first screen is the fridge itself. Everything after it happens on
 * the same cream, and the acts are separated the way sheets on a fridge
 * actually are: a torn edge with tape over it, one sheet lying on the next.
 * That reads calmer than a door/paper alternation — the reader never gets
 * pulled back into the room, just keeps reading her handwriting — and the
 * seams still mark where one act ends and the next begins.
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

      <PaperAct edges="top" fasten seed="drawing">
        <PagePayoff />
      </PaperAct>

      <PaperAct edges="top" fasten seed="ask">
        <Scene07Waitlist />
      </PaperAct>

      <PaperAct edges="top" fasten seed="signoff">
        <Scene08Footer />
      </PaperAct>
    </main>
  );
}
