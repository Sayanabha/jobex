import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  serverExternalPackages: ["mammoth", "pdf-parse"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
