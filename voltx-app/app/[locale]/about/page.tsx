import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `${siteUrl}/${locale}/about`,
      languages: { en: `${siteUrl}/en/about`, ar: `${siteUrl}/ar/about` },
    },
  };
}

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <section className="py-16">
      <Container size="narrow">
        <ScrollReveal>
          <h1 className="text-text-primary">{t("title")}</h1>
          <p className="mt-4 text-lg text-text-secondary">{t("subtitle")}</p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="mt-12">
            <h2 className="text-xl font-bold text-text-primary">{t("missionTitle")}</h2>
            <p className="mt-4 text-text-secondary leading-relaxed">{t("missionDesc")}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="mt-12">
            <h2 className="text-xl font-bold text-text-primary">{t("howWeReview")}</h2>
            <p className="mt-4 text-text-secondary leading-relaxed">{t("howWeReviewDesc")}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-12">
            <h2 className="text-xl font-bold text-text-primary">{t("transparencyTitle")}</h2>
            <ul className="mt-4 space-y-3">
              {[t("transparency1"), t("transparency2"), t("transparency3"), t("transparency4")].map(
                (item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary flex-shrink-0 flex items-center justify-center mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-text-secondary">{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
