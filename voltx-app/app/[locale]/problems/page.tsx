import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { getProblems } from "@/lib/firebase/seed";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "problems" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `${siteUrl}/${locale}/problems`,
      languages: { en: `${siteUrl}/en/problems`, ar: `${siteUrl}/ar/problems` },
    },
  };
}

export default function ProblemsPage() {
  const t = useTranslations("problems");
  const tc = useTranslations("common");
  const locale = useLocale();
  const problems = getProblems(locale);

  return (
    <section className="py-16">
      <Container>
        <ScrollReveal>
          <h1 className="text-text-primary">{t("title")}</h1>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl">
            {t("subtitle")}
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6">
          {problems.map((problem, i) => (
            <ScrollReveal key={problem.id} delay={i * 100}>
              <Link href={`/${locale}/problems/${problem.slug}`} className="block">
                <Card className="group cursor-pointer">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                        {problem.title}
                      </h2>
                      <p className="mt-2 text-text-secondary leading-relaxed">
                        {problem.short_description}
                      </p>
                    </div>

                    {/* Public-facing "Why this matters" — replaces raw urgency/intent scores */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 bg-primary-tint/40 rounded-lg p-3">
                        <p className="text-xs font-semibold text-primary-dark uppercase tracking-wide mb-1">
                          {tc("whyThisMatters")}
                        </p>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {locale === "ar" ? problem.why_it_matters_ar : problem.why_it_matters_en}
                        </p>
                      </div>
                      <div className="flex-1 bg-surface rounded-lg p-3 border border-border">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                          {tc("whatYouNeed")}
                        </p>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {locale === "ar" ? problem.what_you_need_ar : problem.what_you_need_en}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
