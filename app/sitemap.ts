import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";
import { serviceSlugs } from "@/lib/data/services";
import { projectSlugs } from "@/lib/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/services", "/projects", "/process", "/about", "/contact"];

  return [
    ...routes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified: now,
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.8,
    })),
    ...serviceSlugs.map((slug) => ({
      url: `${site.url}/services/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...projectSlugs.map((slug) => ({
      url: `${site.url}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}