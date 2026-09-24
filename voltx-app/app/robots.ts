import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/*/diagnostic/result",
          "/*/campaigns/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
