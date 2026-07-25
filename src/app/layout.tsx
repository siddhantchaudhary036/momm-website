import type { Metadata } from "next";
import { Bitter, Caveat, Instrument_Serif } from "next/font/google";
import CursorSpotlight from "@/components/CursorSpotlight";
import CustomCursor from "@/components/CustomCursor";
import Kitchen from "@/components/Kitchen";
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

/**
 * momm's hand. Used for her voice and nothing else — never data labels,
 * never form chrome, never below 18px, where handwriting stops being
 * legible and starts being decoration.
 */
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-caveat",
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
        className={`${bitter.variable} ${instrument.variable} ${caveat.variable} font-header antialiased`}
      >
        <Kitchen />
        <CursorSpotlight />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
