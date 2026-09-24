import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import ScrollReveal from "@/components/shared/ScrollReveal";
import TranslationPending from "@/components/shared/TranslationPending";
import { getGuides, getGuideBySlug } from "@/lib/firebase/seed";
import { breadcrumbSchema } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const guides = getGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: {
      canonical: `${siteUrl}/${locale}/guides/${slug}`,
      languages: {
        en: `${siteUrl}/en/guides/${slug}`,
        ar: `${siteUrl}/ar/guides/${slug}`,
      },
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const guide = getGuideBySlug(slug, locale);
  if (!guide) notFound();

  const tc = await getTranslations({ locale, namespace: "common" });
  const tn = await getTranslations({ locale, namespace: "nav" });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  const breadcrumbs = breadcrumbSchema([
    { name: tc("home"), url: `${siteUrl}/${locale}` },
    { name: tn("guides"), url: `${siteUrl}/${locale}/hub` },
    { name: guide.title, url: `${siteUrl}/${locale}/guides/${guide.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <article className="py-16">
        <Container size="narrow">
          {locale !== "en" && <TranslationPending />}

          <ScrollReveal>
            <nav className="text-sm text-text-muted mb-8">
              <a href={`/${locale}`} className="hover:text-primary transition-colors">{tc("home")}</a>
              <span className="mx-2">/</span>
              <a href={`/${locale}/hub`} className="hover:text-primary transition-colors">{tn("hub")}</a>
              <span className="mx-2">/</span>
              <span className="text-text-secondary">{guide.title}</span>
            </nav>
          </ScrollReveal>

          <ScrollReveal>
            <Badge variant="info" className="mb-4">{guide.category}</Badge>
            <h1 className="text-text-primary">{guide.title}</h1>
            <p className="mt-4 text-lg text-text-secondary leading-relaxed">
              {guide.excerpt}
            </p>
            <p className="mt-2 text-xs text-text-muted">
              {tc("lastUpdated")}: {new Date(guide.updated_at).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="mt-10 prose prose-slate max-w-none">
              {guide.content.split("\n\n").map((paragraph, i) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={i} className="text-xl font-bold text-text-primary mt-10 mb-4">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("- [ ] ") || paragraph.startsWith("1. ")) {
                  const items = paragraph.split("\n");
                  return (
                    <ul key={i} className="space-y-2 my-4">
                      {items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-text-secondary">
                          <span className="text-primary mt-1">•</span>
                          {item.replace(/^[-\d.[\] ]+/, "").trim()}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="text-text-secondary leading-relaxed mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </ScrollReveal>
        </Container>
      </article>
    </>
  );
}
