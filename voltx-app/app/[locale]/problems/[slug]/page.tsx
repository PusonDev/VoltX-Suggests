import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { useLocale } from "next-intl";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ProductCard from "@/components/shared/ProductCard";
import TranslationPending from "@/components/shared/TranslationPending";
import { getProblems, getProblemBySlug, getProductsForProblem } from "@/lib/firebase/seed";
import { breadcrumbSchema } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const problems = getProblems();
  return problems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const problem = getProblemBySlug(slug);
  if (!problem) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  return {
    title: problem.title,
    description: problem.short_description,
    alternates: {
      canonical: `${siteUrl}/${locale}/problems/${slug}`,
      languages: {
        en: `${siteUrl}/en/problems/${slug}`,
        ar: `${siteUrl}/ar/problems/${slug}`,
      },
    },
  };
}

export default async function ProblemPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const problem = getProblemBySlug(slug, locale);

  if (!problem) notFound();

  const tc = await getTranslations({ locale, namespace: "common" });
  const fittedProducts = getProductsForProblem(problem.id, locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  const breadcrumbs = breadcrumbSchema([
    { name: tc("home"), url: `${siteUrl}/${locale}` },
    { name: tc("challenges"), url: `${siteUrl}/${locale}/problems` },
    { name: problem.title, url: `${siteUrl}/${locale}/problems/${problem.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <section className="py-16">
        <Container size="narrow">
          {locale !== "en" && <TranslationPending />}

          <ScrollReveal>
            <nav className="text-sm text-text-muted mb-8">
              <a href={`/${locale}`} className="hover:text-primary transition-colors">{tc("home")}</a>
              <span className="mx-2">/</span>
              <a href={`/${locale}/problems`} className="hover:text-primary transition-colors">{tc("challenges")}</a>
              <span className="mx-2">/</span>
              <span className="text-text-secondary">{problem.title}</span>
            </nav>
          </ScrollReveal>

          <ScrollReveal>
            <h1 className="text-text-primary">{problem.title}</h1>
            <p className="mt-4 text-lg text-text-secondary leading-relaxed">
              {problem.short_description}
            </p>
          </ScrollReveal>

          {problem.long_description && (
            <ScrollReveal delay={100}>
              <div className="mt-8 prose prose-slate max-w-none">
                {problem.long_description.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-text-secondary leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollReveal>
          )}
        </Container>
      </section>

      {/* Recommended Products or Finalizing State */}
      <section className="py-16 bg-surface">
        <Container>
          {fittedProducts.length > 0 ? (
            <>
              <ScrollReveal>
                <h2 className="text-text-primary mb-2">{tc("recommendedSolutions")}</h2>
                <p className="text-text-secondary mb-8">
                  {tc("recommendedSolutionsSubtitle")}
                </p>
              </ScrollReveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {fittedProducts.map((product, i) => (
                  <ScrollReveal key={product.id} delay={i * 100}>
                    <ProductCard
                      product={product}
                      fitScore={product.fit_score_for_problem}
                      fitExplanation={product.fit_explanation}
                      recommendedBecause={product.recommended_because}
                      notIdealIf={product.not_ideal_if}
                      pageSlug={problem.slug}
                      placement="problem-page"
                    />
                  </ScrollReveal>
                ))}
              </div>
            </>
          ) : (
            <ScrollReveal>
              <div className="max-w-xl mx-auto text-center py-12 px-6 bg-card-bg rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-full bg-primary-tint flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-xl">🛡️</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {tc("finalizingRecommendation")}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {tc("finalizingRecommendationDesc")}
                </p>
              </div>
            </ScrollReveal>
          )}
        </Container>
      </section>
    </>
  );
}
