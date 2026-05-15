import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path((?!en|zh-CN|zh-TW|ja|ko|es|fr|de|api|_next|_vercel|.*\\..*)/.*)?",
        destination: "/en/:path*",
      },
    ];
  },
};

export default withNextIntl(nextConfig);