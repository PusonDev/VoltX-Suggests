import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ProductCard from "@/components/shared/ProductCard";
import { getComparisons, getComparisonBySlug, getProducts } from "@/lib/firebase/seed";
import type { Product } from "@/lib/firebase/types";
import { breadcrumbSchema } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ locale: string; pair: string }>;
}

export function generateStaticParams() {
  const comparisons = getComparisons();
  return comparisons.map((c) => ({ pair: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, pair } = await params;
  const comparison = getComparisonBySlug(pair, locale);
  if (!comparison) return {};

  const localizedProducts: Product[] = getProducts(locale);
  const p1 = localizedProducts.find((p: Product) => p.id === comparison.product1_id);
  const p2 = localizedProducts.find((p: Product) => p.id === comparison.product2_id);
  const title = `${p1?.name || "Product"} vs ${p2?.name || "Product"} — Full Comparison`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  return {
    title,
    description: comparison.comparison_content.substring(0, 160),
    alternates: {
      canonical: `${siteUrl}/${locale}/compare/${pair}`,
      languages: {
        en: `${siteUrl}/en/compare/${pair}`,
        ar: `${siteUrl}/ar/compare/${pair}`,
      },
    },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ locale: string; pair: string }> }) {
  const { locale, pair } = await params;
  const comparison = getComparisonBySlug(pair, locale);
  if (!comparison) notFound();

  const tc = await getTranslations({ locale, namespace: "common" });
  const tcomp = await getTranslations({ locale, namespace: "compare" });

  const localizedProducts: Product[] = getProducts(locale);
  const product1 = localizedProducts.find((p: Product) => p.id === comparison.product1_id);
  const product2 = localizedProducts.find((p: Product) => p.id === comparison.product2_id);
  if (!product1 || !product2) notFound();

  const winner = comparison.winner_id ? localizedProducts.find((p: Product) => p.id === comparison.winner_id) : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  const breadcrumbs = breadcrumbSchema([
    { name: tc("home"), url: `${siteUrl}/${locale}` },
    { name: tc("compare"), url: `${siteUrl}/${locale}/hub` },
    { name: `${product1.name} vs ${product2.name}`, url: `${siteUrl}/${locale}/compare/${comparison.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="py-16">
        <Container size="narrow">
          <ScrollReveal>
            <nav className="text-sm text-text-muted mb-8">
              <a href={`/${locale}`} className="hover:text-primary transition-colors">{tc("home")}</a>
              <span className="mx-2">/</span>
              <a href={`/${locale}/hub`} className="hover:text-primary transition-colors">{tc("compare")}</a>
              <span className="mx-2">/</span>
              <span className="text-text-secondary">{product1.name} vs {product2.name}</span>
            </nav>
          </ScrollReveal>

          <ScrollReveal>
            <h1 className="text-text-primary">
              {tcomp("comparisonTitle", { product1: product1.name, product2: product2.name })}
            </h1>
          </ScrollReveal>

          {/* Winner banner if applicable */}
          {winner && (
            <ScrollReveal delay={100}>
              <div className="mt-8 p-6 bg-primary-tint rounded-xl flex items-center gap-4">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="text-sm font-semibold text-primary">{tcomp("ourPick")}: {winner.name}</p>
                  <p className="text-xs text-primary-dark mt-0.5">
                    {winner.name} wins on overall value and suitability for small business teams.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Comparison Content */}
          <ScrollReveal delay={150}>
            <div className="mt-10 prose prose-slate max-w-none">
              {comparison.comparison_content.split("\n\n").map((paragraph, i) => {
                if (paragraph.startsWith("## ")) {
                  return <h2 key={i} className="text-xl font-bold text-text-primary mt-8 mb-4">{paragraph.replace("## ", "")}</h2>;
                }
                return <p key={i} className="text-text-secondary leading-relaxed mb-4">{paragraph}</p>;
              })}
            </div>
          </ScrollReveal>

          {/* Side-by-side Product Cards */}
          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            <ProductCard
              product={product1}
              pageSlug={comparison.slug}
              placement="compare-p1"
            />
            <ProductCard
              product={product2}
              pageSlug={comparison.slug}
              placement="compare-p2"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
