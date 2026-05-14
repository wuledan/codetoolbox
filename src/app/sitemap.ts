import { MetadataRoute } from "next";
import tools from "@/lib/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolEntries = tools.map((tool) => ({
    url: `https://codetoolbox.dev${tool.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://codetoolbox.dev",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://codetoolbox.dev/tools",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...toolEntries,
  ];
}
