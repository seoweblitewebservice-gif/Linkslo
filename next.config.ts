import type { NextConfig } from "next";

const nextConfig: NextConfig = {\n  async headers() {\n    return [\n      {\n        source: "/((?!api/|admin/|dashboard(?:/|$)|order(?:/|$)).*)",\n        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],\n      },\n      {\n        source: "/api/:path*",\n        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],\n      },\n      {\n        source: "/admin/:path*",\n        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],\n      },\n    ];\n  },
  async redirects() {
    return [
      {
        source: "/services",
        destination: "/backlinks",
        permanent: true,
      },
      {
        source: "/login/:path*",
        destination: "/track-order",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/track-order",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
