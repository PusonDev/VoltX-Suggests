import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { getGuides, getReviews, getProblems, getComparisons, getBestCategories } from "@/lib/firebase/seed";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hub" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `${siteUrl}/${locale}/hub`,
      languages: { en: `${siteUrl}/en/hub`, ar: `${siteUrl}/ar/hub` },
    },
  };
}

export default function HubPage() {
  const t = useTranslations("hub");
  const locale = useLocale();

  const guides = getGuides(locale);
  const reviews = getReviews(locale);
  const problems = getProblems(locale);
  const comparisons = getComparisons(locale);
  const bestCategories = getBestCategories(locale);

  const sections = [
    {
      key: "guides",
      title: t("guides"),
      items: guides.map((g) => ({
        slug: g.slug,
        title: g.title,
        excerpt: g.excerpt,
        href: `/${locale}/guides/${g.slug}`,
        badge: g.category,
      })),
    },
    {
      key: "reviews",
      title: t("reviews"),
      items: reviews.map((r) => ({
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        href: `/${locale}/reviews/${r.slug}`,
        badge: "Review",
      })),
    },
    {
      key: "problems",
      title: t("problems"),
      items: problems.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.short_description,
        href: `/${locale}/problems/${p.slug}`,
        badge: `Urgency: ${p.urgency_score}/10`,
      })),
    },
    {
      key: "comparisons",
      title: t("comparisons"),
      items: comparisons.map((c) => ({
        slug: c.slug,
        title: c.slug.replace(/-/g, " ").replace(/vs/g, "vs."),
        excerpt: c.comparison_content.substring(0, 150) + "...",
        href: `/${locale}/compare/${c.slug}`,
        badge: "Comparison",
      })),
    },
    {
      key: "bestPicks",
      title: t("bestPicks"),
      items: bestCategories.map((b) => ({
        slug: b.slug,
        title: b.title,
        excerpt: b.description,
        href: `/${locale}/best/${b.slug}`,
        badge: "Best Of",
      })),
    },
  ];

  return (
    <section className="py-16">
      <Container>
        <ScrollReveal>
          <h1 className="text-text-primary">{t("title")}</h1>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl">
            {t("subtitle")}
          </p>
        </ScrollReveal>

        {sections.map((section) => (
          <div key={section.key} className="mt-16">
            <ScrollReveal>
              <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
                <span className="w-1 h-6 bg-primary rounded-full" />
                {section.title}
              </h2>
            </ScrollReveal>

            {section.items.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {section.items.map((item, i) => (
                  <ScrollReveal key={item.slug} delay={i * 80}>
                    <Link href={item.href} className="block h-full">
                      <Card className="h-full group cursor-pointer">
                        <Badge variant="info" className="mb-3">
                          {item.badge}
                        </Badge>
                        <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-text-secondary line-clamp-3">
                          {item.excerpt}
                        </p>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm">No content yet.</p>
            )}
          </div>
        ))}
      </Container>
    </section>
  );
}
