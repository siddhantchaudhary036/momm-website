import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // a stray lockfile in the user home dir confuses Next's root inference
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
