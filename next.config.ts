import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/geo-scanner',
  assetPrefix: '/geo-scanner',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/geo-scanner',
  },
};

export default nextConfig;
