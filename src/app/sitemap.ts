import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Static export builds require metadata routes to opt into static rendering.
export const dynamic = "force-static";

// The site is a single page, so the sitemap is a single entry. It exists
// because search consoles ask for one and it costs nothing to serve.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
