import type { Product, Review as ReviewType } from "@/lib/firebase/types";

/**
 * Generate JSON-LD structured data for a Product
 */
export function productSchema(product: Product, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.vendor,
    },
    offers: product.price_from
      ? {
          "@type": "Offer",
          price: product.price_from,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        }
      : undefined,
    url,
  };
}

/**
 * Generate JSON-LD structured data for a Review
 */
export function reviewSchema(
  review: ReviewType,
  product: Product,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: product.name,
      brand: { "@type": "Brand", name: product.vendor },
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: product.editorial_score,
      bestRating: 10,
    },
    author: {
      "@type": "Organization",
      name: "Zenvq Suggests",
    },
    datePublished: review.created_at,
    dateModified: review.updated_at,
    reviewBody: review.verdict,
    url,
  };
}

/**
 * Generate FAQ structured data
 */
export function faqSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
