import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // a stray lockfile in the user home dir confuses Next's root inference
  outputFileTracingRoot: path.join(__dirname),

  images: {
    /**
     * The avatars are already trimmed and capped at 512px by
     * scripts/optimize-avatars.js, and none of them render larger than
     * ~460px. Left at the defaults, next/image generates eleven srcset
     * widths per avatar — up to 3840px — which is a lot of work to
     * upscale a 512px source, and in dev it's slow enough that images
     * miss first paint. These two lists are all the sizes we can
     * actually use.
     */
    deviceSizes: [384, 640, 828, 1080],
    imageSizes: [96, 128, 256, 384],
    formats: ["image/webp"],
  },
};

export default nextConfig;
