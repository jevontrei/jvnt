import type { NextConfig } from "next";

// NOTE: next.js turns on strict mode by default for development, even if you don't see it here

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "joel-public-photos-etc.s3.ap-southeast-2.amazonaws.com",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "http.cat",
      },
    ],
  },
};

// default export -- can import with any name
export default nextConfig;
