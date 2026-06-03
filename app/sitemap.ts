import type { MetadataRoute } from "next";
import { projects } from "@/src/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ysphotography.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1
    },
    ...projects.map((project) => ({
      url: `${baseUrl}/work/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
