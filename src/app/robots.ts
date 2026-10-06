import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Static export builds require metadata routes to opt into static rendering.
export const dynamic = "force-static";

// Robots: the whole single-page site is public and indexable on purpose
// (a practice nobody can find on Google doesn't help anyone). The vCard
// download is a noindex-style resource: it isn't a page.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dr-kara-hokes.vcf"],
      },
    ],
    sitemap: `${SITE.siteUrl}/sitemap.xml`,
  };
}
