import LiquidDivider from "@/components/LiquidDivider";
import Scene00Hero from "@/components/scenes/Scene00Hero";
import Scene01Hook from "@/components/scenes/Scene01Hook";
import {
  BeatHours,
  BeatLifeYears,
  BeatPickups,
  BeatSocialDonut,
} from "@/components/scenes/Scene02Reckoning";
import Scene03Pivot from "@/components/scenes/Scene03Pivot";
import Scene07Waitlist from "@/components/scenes/Scene07Waitlist";
import Scene08Footer from "@/components/scenes/Scene08Footer";

// Phone-mockup scenes (04 PhoneFan, 05 ScreenSwap) and the payoff
// scene (06) are parked in src/components/scenes/ — drop them back
// in here when ready.

/**
 * The ride: nag → proof → "mom was right" → join.
 */
export default function Home() {
  return (
    <main className="relative">
      <Scene00Hero />
      <Scene01Hook />
      <LiquidDivider />
      <BeatPickups />
      <BeatHours />
      <BeatLifeYears />
      <BeatSocialDonut />
      <LiquidDivider />
      <Scene03Pivot />
      <Scene07Waitlist />
      <Scene08Footer />
    </main>
  );
}
