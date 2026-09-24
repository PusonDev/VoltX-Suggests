"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ProductCard from "@/components/shared/ProductCard";
import EmailGate from "@/components/gate/EmailGate";
import { getProducts } from "@/lib/firebase/seed";

export default function DiagnosticResultPage() {
  const t = useTranslations("diagnostic");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [isGated, setIsGated] = useState(true);
  const [loading, setLoading] = useState(true);

  // Check for existing cookie on mount
  useEffect(() => {
    const checkGate = async () => {
      try {
        const res = await fetch("/api/lead", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsGated(false);
          }
        }
      } catch {
        // Default to gated
      }
      setLoading(false);
    };
    checkGate();
  }, []);

  const handleGatePass = () => {
    setIsGated(false);
  };

  // Only approved products returned by getProducts
  const allProducts = getProducts(locale, false);
  const recommendations = [...allProducts]
    .sort((a, b) => b.editorial_score - a.editorial_score)
    .slice(0, 3);

  if (loading) {
    return (
      <section className="py-16">
        <Container size="narrow">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </Container>
      </section>
    );
  }

  if (isGated) {
    return (
      <section className="py-16">
        <Container size="narrow">
          <EmailGate
            topicSlug="diagnostic-result"
            pageType="diagnostic"
            source="diagnostic"
            onPass={handleGatePass}
          />
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16">
      <Container>
        <ScrollReveal>
          <h1 className="text-text-primary">{t("resultTitle")}</h1>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl">
            {t("resultSubtitle")}
          </p>
        </ScrollReveal>

        {recommendations.length > 0 ? (
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 100}>
                <ProductCard
                  product={product}
                  pageSlug="diagnostic-result"
                  placement="diagnostic-result"
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
  );
}
