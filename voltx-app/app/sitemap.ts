import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import {
  getProblems,
  getGuides,
  getReviews,
  getComparisons,
  getBestCategories,
} from "@/lib/firebase/seed";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";
  const entries: MetadataRoute.Sitemap = [];

  // Static pages per locale
  const staticPaths = [
    "",          // homepage
    "/hub",
    "/problems",
    "/tools",
    "/diagnostic",
    "/about",
    "/privacy",
    "/terms",
  ];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  // Dynamic pages: problems
  const problems = getProblems();
  for (const locale of locales) {
    for (const problem of problems) {
      entries.push({
        url: `${siteUrl}/${locale}/problems/${problem.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Dynamic pages: guides
  const guides = getGuides();
  for (const locale of locales) {
    for (const guide of guides) {
      entries.push({
        url: `${siteUrl}/${locale}/guides/${guide.slug}`,
        lastModified: new Date(guide.updated_at),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Dynamic pages: reviews
  const reviews = getReviews();
  for (const locale of locales) {
    for (const review of reviews) {
      entries.push({
        url: `${siteUrl}/${locale}/reviews/${review.slug}`,
        lastModified: new Date(review.updated_at),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Dynamic pages: comparisons
  const comparisons = getComparisons();
  for (const locale of locales) {
    for (const comparison of comparisons) {
      entries.push({
        url: `${siteUrl}/${locale}/compare/${comparison.slug}`,
        lastModified: new Date(comparison.updated_at),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Dynamic pages: best-of categories
  const bestCategories = getBestCategories();
  for (const locale of locales) {
    for (const best of bestCategories) {
      entries.push({
        url: `${siteUrl}/${locale}/best/${best.slug}`,
        lastModified: new Date(best.updated_at),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // NOTE: Gated pages (diagnostic/result, campaigns) are intentionally
  // EXCLUDED from the sitemap — they should not be indexed by Google

  return entries;
}
