import type { Metadata } from "next";
import { Bitter, Caveat, Instrument_Serif } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import PageBackground from "@/components/PageBackground";
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

/**
 * Absolute URLs for the social card. Vercel hands us the deployment host
 * for free; `NEXT_PUBLIC_SITE_URL` overrides it once there's a real
 * domain, and localhost keeps `next build` from warning in between.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const title = "momm — get off your phone.";
const description =
  "The screen-time app that nags like your mom, because she was right. Join the waitlist.";

/**
 * The icons and the social card aren't declared here: `favicon.ico`,
 * `icon.png`, `apple-icon.png`, `opengraph-image.jpg` and
 * `twitter-image.jpg` sit next to this file and Next picks them up by
 * name, tags, dimensions and all. All five are built from the originals
 * in `public/momm-images/` by `npm run brand` — edit those, not these.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: { title, description, url: "/", siteName: "momm", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${bitter.variable} ${instrument.variable} ${caveat.variable} font-header antialiased`}
      >
        <PageBackground />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
