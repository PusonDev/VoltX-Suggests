import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ProductCard from "@/components/shared/ProductCard";
import { getBestCategories, getBestCategoryBySlug, getProducts } from "@/lib/firebase/seed";
import type { Product } from "@/lib/firebase/types";
import { breadcrumbSchema } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const categories = getBestCategories();
  return categories.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = getBestCategoryBySlug(slug, locale);
  if (!category) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  return {
    title: category.title,
    description: category.description,
    alternates: {
      canonical: `${siteUrl}/${locale}/best/${slug}`,
      languages: {
        en: `${siteUrl}/en/best/${slug}`,
        ar: `${siteUrl}/ar/best/${slug}`,
      },
    },
  };
}

export default async function BestPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const category = getBestCategoryBySlug(slug, locale);
  if (!category) notFound();

  const tc = await getTranslations({ locale, namespace: "common" });
  const th = await getTranslations({ locale, namespace: "hub" });

  const localizedProducts: Product[] = getProducts(locale);
  const products = category.product_ids
    .map((id) => localizedProducts.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  const breadcrumbs = breadcrumbSchema([
    { name: tc("home"), url: `${siteUrl}/${locale}` },
    { name: th("bestPicks"), url: `${siteUrl}/${locale}/hub` },
    { name: category.title, url: `${siteUrl}/${locale}/best/${category.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="py-16">
        <Container>
          <ScrollReveal>
            <nav className="text-sm text-text-muted mb-8">
              <a href={`/${locale}`} className="hover:text-primary transition-colors">{tc("home")}</a>
              <span className="mx-2">/</span>
              <a href={`/${locale}/hub`} className="hover:text-primary transition-colors">{th("bestPicks")}</a>
              <span className="mx-2">/</span>
              <span className="text-text-secondary">{category.title}</span>
            </nav>
          </ScrollReveal>

          <ScrollReveal>
            <h1 className="text-text-primary">{category.title}</h1>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl">
              {category.description}
            </p>
          </ScrollReveal>

          {products.length > 0 ? (
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 100}>
                  <ProductCard
                    product={product}
                    pageSlug={category.slug}
                    placement="best-category"
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <div className="mt-12 max-w-xl mx-auto text-center py-12 px-6 bg-surface rounded-2xl border border-border">
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
