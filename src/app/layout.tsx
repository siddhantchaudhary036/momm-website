import type { Metadata } from "next";
import { Bitter, Instrument_Serif } from "next/font/google";
import CursorSpotlight from "@/components/CursorSpotlight";
import CustomCursor from "@/components/CustomCursor";
import GradientBackground from "@/components/GradientBackground";
import GrainOverlay from "@/components/GrainOverlay";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const bitter = Bitter({
  subsets: ["latin"],
  variable: "--font-bitter",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "momm — get off your phone.",
  description:
    "The screen-time app that nags like your mom, because she was right. Join the waitlist.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${bitter.variable} ${instrument.variable} font-header antialiased`}
      >
        <GradientBackground />
        <CursorSpotlight />
        <GrainOverlay />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
