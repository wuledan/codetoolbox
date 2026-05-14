import { MetadataRoute } from "next";
import tools from "@/lib/registry";
import { routing } from "@/i18n/navigation";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const prefix = locale === "en" ? "" : `/${locale}`;
    entries.push({
      url: `https://code-toolbox-two.vercel.app${prefix}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    });
    entries.push({
      url: `https://code-toolbox-two.vercel.app${prefix}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    });
    for (const tool of tools) {
      entries.push({
        url: `https://code-toolbox-two.vercel.app${prefix}${tool.path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
