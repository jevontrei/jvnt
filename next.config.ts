import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
