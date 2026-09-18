import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/services",
        destination: "/backlinks",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
