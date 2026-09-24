import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ProductCard from "@/components/shared/ProductCard";
import TranslationPending from "@/components/shared/TranslationPending";
import { getReviews, getReviewBySlug, getProductBySlug } from "@/lib/firebase/seed";
import { reviewSchema, breadcrumbSchema } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const reviews = getReviews();
  return reviews.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const review = getReviewBySlug(slug);
  if (!review) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  return {
    title: review.title,
    description: review.excerpt,
    alternates: {
      canonical: `${siteUrl}/${locale}/reviews/${slug}`,
      languages: {
        en: `${siteUrl}/en/reviews/${slug}`,
        ar: `${siteUrl}/ar/reviews/${slug}`,
      },
    },
  };
}

export default async function ReviewPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const review = getReviewBySlug(slug, locale);
  if (!review) notFound();

  const tr = await getTranslations({ locale, namespace: "review" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const product = getProductBySlug(
    review.product_id === "p1" ? "1password-business" :
    review.product_id === "p2" ? "nordpass-business" :
    review.product_id === "p3" ? "bitwarden-teams" : "",
    locale
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  const structuredData = product ? reviewSchema(review, product, `${siteUrl}/${locale}/reviews/${review.slug}`) : null;
  const breadcrumbs = breadcrumbSchema([
    { name: tc("home"), url: `${siteUrl}/${locale}` },
    { name: tr("ourVerdict"), url: `${siteUrl}/${locale}/hub` },
    { name: review.title, url: `${siteUrl}/${locale}/reviews/${review.slug}` },
  ]);

  return (
    <>
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <article className="py-16">
        <Container size="narrow">
          {locale !== "en" && <TranslationPending />}

          <ScrollReveal>
            <nav className="text-sm text-text-muted mb-8">
              <a href={`/${locale}`} className="hover:text-primary transition-colors">{tc("home")}</a>
              <span className="mx-2">/</span>
              <a href={`/${locale}/hub`} className="hover:text-primary transition-colors">{tc("readReview")}</a>
              <span className="mx-2">/</span>
              <span className="text-text-secondary">{review.title}</span>
            </nav>
          </ScrollReveal>

          <ScrollReveal>
            <Badge variant="success" className="mb-4">{tr("ourVerdict")}</Badge>
            <h1 className="text-text-primary">{review.title}</h1>
            <p className="mt-4 text-lg text-text-secondary leading-relaxed">
              {review.excerpt}
            </p>
          </ScrollReveal>

          {/* Editorial Score */}
          {product && (
            <ScrollReveal delay={100}>
              <div className="mt-8 flex items-center gap-6 p-6 bg-primary-tint rounded-xl">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{product.editorial_score.toFixed(1)}</p>
                  <p className="text-xs text-primary-dark font-medium mt-1">{tc("editorialScore")}</p>
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-primary-dark">{review.verdict}</p>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Pros & Cons */}
          <ScrollReveal delay={150}>
            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              <div className="p-5 bg-card-bg rounded-xl border border-border">
                <h3 className="font-bold text-primary mb-3">✓ {tr("pros")}</h3>
                <ul className="space-y-2">
                  {review.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-primary mt-0.5">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 bg-card-bg rounded-xl border border-border">
                <h3 className="font-bold text-red-600 mb-3">✗ {tr("cons")}</h3>
                <ul className="space-y-2">
                  {review.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-red-500 mt-0.5">✗</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Full Review Content */}
          <ScrollReveal delay={200}>
            <div className="mt-10 prose prose-slate max-w-none">
              {review.content.split("\n\n").map((paragraph, i) => {
                if (paragraph.startsWith("## ")) {
                  return <h2 key={i} className="text-xl font-bold text-text-primary mt-8 mb-4">{paragraph.replace("## ", "")}</h2>;
                }
                return <p key={i} className="text-text-secondary leading-relaxed mb-4">{paragraph}</p>;
              })}
            </div>
          </ScrollReveal>

          {/* Product CTA */}
          {product && (
            <ScrollReveal delay={250}>
              <div className="mt-12">
                <ProductCard
                  product={product}
                  pageSlug={review.slug}
                  placement="review-page"
                />
              </div>
            </ScrollReveal>
          )}
        </Container>
      </article>
    </>
  );
}
