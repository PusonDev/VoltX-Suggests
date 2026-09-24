import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  return {
    title: t("title"),
    description: t("s1Desc").substring(0, 150),
    alternates: {
      canonical: `${siteUrl}/${locale}/privacy`,
      languages: { en: `${siteUrl}/en/privacy`, ar: `${siteUrl}/ar/privacy` },
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <section className="py-16">
      <Container size="narrow">
        <h1 className="text-text-primary">{t("title")}</h1>
        <p className="mt-2 text-sm text-text-muted">{t("lastUpdated")}</p>

        <div className="mt-10 prose prose-slate max-w-none space-y-6">
          <h2 className="text-xl font-bold text-text-primary">{t("s1Title")}</h2>
          <p className="text-text-secondary leading-relaxed">{t("s1Desc")}</p>

          <h2 className="text-xl font-bold text-text-primary">{t("s2Title")}</h2>
          <p className="text-text-secondary leading-relaxed">{t("s2Desc")}</p>

          <h2 className="text-xl font-bold text-text-primary">{t("s3Title")}</h2>
          <p className="text-text-secondary leading-relaxed">{t("s3Desc")}</p>

          <h2 className="text-xl font-bold text-text-primary">{t("s4Title")}</h2>
          <p className="text-text-secondary leading-relaxed">{t("s4Desc")}</p>

          <h2 className="text-xl font-bold text-text-primary">{t("s5Title")}</h2>
          <p className="text-text-secondary leading-relaxed">{t("s5Desc")}</p>

          <h2 className="text-xl font-bold text-text-primary">{t("s6Title")}</h2>
          <p className="text-text-secondary leading-relaxed">{t("s6Desc")}</p>
        </div>
      </Container>
    </section>
  );
}
