import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/api/login',
        permanent: true
      }
    ]
  }
};

export default nextConfig;
