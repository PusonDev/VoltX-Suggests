import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/shared/ScrollReveal";
import VisualHero from "@/components/home/VisualHero";
import LiveThreatSimulator from "@/components/home/LiveThreatSimulator";
import ProductCard from "@/components/shared/ProductCard";
import { getProblems, getProducts } from "@/lib/firebase/seed";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suggests.zenvq.com";

  return {
    title: `${t("siteName")} — ${t("tagline")}`,
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: { en: `${siteUrl}/en`, ar: `${siteUrl}/ar` },
    },
  };
}

export default function HomePage() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const locale = useLocale();
  const isAr = locale === "ar";
  const problems = getProblems(locale);
  const approvedProducts = getProducts(locale, false);

  return (
    <>
      {/* ═══════ 1. HIGH-IMPACT 3D VISUAL HERO ═══════ */}
      <VisualHero />

      {/* ═══════ 2. LIVE INTERACTIVE THREAT SIMULATOR ═══════ */}
      <section className="py-12 md:py-16 bg-surface/50 border-y border-border/60 relative">
        <Container size="wide">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-tint/70 text-primary-dark text-xs font-bold uppercase tracking-wider mb-3">
                <span>⚡</span> {isAr ? "فحص فوري تفاعلي" : "Instant Interactive Risk Simulator"}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary">
                {isAr ? "ما هو أكبر تهديد يواجه عملك اليوم؟" : "What is Your Biggest Cyber Threat Today?"}
              </h2>
              <p className="mt-3 text-text-secondary text-base">
                {isAr
                  ? "اختر وضع فريقك وشاهد تقييم المخاطر المباشر والحل الموصى به فورًا."
                  : "Click your current operational setup to simulate exposure and get an immediate fitted solution."}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <LiveThreatSimulator />
          </ScrollReveal>
        </Container>
      </section>

      {/* ═══════ 3. SECURITY CHALLENGES + 3D RADAR VISUAL ═══════ */}
      <section className="py-20 bg-surface">
        <Container size="wide">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: Problems Grid */}
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal>
                <div className="max-w-xl">
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">
                    {isAr ? "تحديات الأمان الحقيقية" : "Real-World Cyber Hazards"}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-2">
                    {t("problemsTitle")}
                  </h2>
                  <p className="mt-3 text-text-secondary text-base leading-relaxed">
                    {t("problemsSubtitle")}
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {problems.map((problem, i) => (
                  <ScrollReveal key={problem.id} delay={i * 80}>
                    <Link href={`/${locale}/problems/${problem.slug}`} className="block h-full">
                      <Card className="h-full group cursor-pointer border-border hover:border-primary/60 transition-all duration-300">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-primary-tint flex-shrink-0 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                            <span className="text-primary group-hover:text-white text-lg">
                              {i === 0 ? "🔑" : i === 1 ? "🌐" : i === 2 ? "🔒" : "🧭"}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors">
                              {problem.title}
                            </h3>
                            <p className="mt-1.5 text-xs text-text-secondary line-clamp-2 leading-relaxed">
                              {problem.short_description}
                            </p>
                            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-primary">
                              <span>{tc("exploreProblems")}</span>
                              <span className="text-xs transition-transform group-hover:translate-x-1 flip-rtl">→</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal delay={300}>
                <div className="pt-2">
                  <Button variant="outline" href={`/${locale}/problems`}>
                    {tc("exploreProblems")}
                    <span className="ms-2 flip-rtl">→</span>
                  </Button>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: 3D Threat Radar Visual & Trust Matrix */}
            <div className="lg:col-span-5">
              <ScrollReveal delay={200}>
                <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl glow-border">
                  <Image
                    src="/threat-radar.jpg"
                    alt="Zenvq Suggests Threat Radar Matrix"
                    width={640}
                    height={480}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card-bg/95 via-card-bg/40 to-transparent p-6 flex flex-col justify-end">
                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-primary text-white text-xs font-bold w-fit mb-2">
                      <span>🛡️</span> {isAr ? "حماية استباقية" : "Zero-Trust Architecture"}
                    </span>
                    <h4 className="text-lg font-bold text-text-primary">
                      {isAr ? "مصفوفة الحماية المعتمدة 2026" : "Continuous Vulnerability Mitigation"}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1">
                      {isAr
                        ? "نحلل برامج الأمان لنضمن حماية كاملة دون إبطاء أجهزة موظفيك."
                        : "Every tool independently verified against real-world breach and ransomware vectors."}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════ 4. FEATURED VERIFIED SECURITY STACKS ═══════ */}
      {approvedProducts.length > 0 && (
        <section className="py-20">
          <Container size="wide">
            <ScrollReveal>
              <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
                <div>
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">
                    {isAr ? "أدوات تم التحقق منها" : "Verified Partner Products"}
                  </span>
                  <h2 className="text-3xl font-extrabold text-text-primary mt-2">
                    {isAr ? "الأدوات الأكثر ملاءمة للشركات الصغيرة" : "Battle-Tested Tools for Teams"}
                  </h2>
                  <p className="mt-2 text-text-secondary text-base max-w-xl">
                    {isAr
                      ? "أدوات أمان تم فحصها واعتمادها رسميًا — مصممة للعمل الفوري بدون تعقيدات."
                      : "Verified zero-knowledge password vaults and endpoint defense ready for instant team adoption."}
                  </p>
                </div>

                <Button variant="outline" href={`/${locale}/tools`}>
                  {t("heroSecondary")}
                  <span className="ms-2 flip-rtl">→</span>
                </Button>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedProducts.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 100}>
                  <ProductCard
                    product={product}
                    segmentLabel={i === 0 ? tc("bestMatch") : tc("bestValue")}
                    pageSlug="home-featured"
                    placement="home"
                  />
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ═══════ 5. HOW IT WORKS ═══════ */}
      <section className="py-24 bg-surface/60 border-t border-border">
        <Container>
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <ScrollReveal>
                <span className="text-xs font-bold text-primary tracking-wider uppercase">
                  {isAr ? "خطوات بسيطة" : "Simple 3-Step Process"}
                </span>
                <h2 className="text-3xl font-extrabold text-text-primary mt-2 sticky top-24">
                  {t("howItWorksTitle")}
                </h2>
                <p className="mt-4 text-text-secondary">
                  {t("howItWorksSubtitle")}
                </p>
              </ScrollReveal>
            </div>

            <div className="md:col-span-8">
              {[
                {
                  num: "01",
                  title: t("step1Title"),
                  desc: t("step1Desc"),
                  icon: "📋",
                },
                {
                  num: "02",
                  title: t("step2Title"),
                  desc: t("step2Desc"),
                  icon: "🎯",
                },
                {
                  num: "03",
                  title: t("step3Title"),
                  desc: t("step3Desc"),
                  icon: "🚀",
                },
              ].map((step, i) => (
                <ScrollReveal key={step.num} delay={i * 150}>
                  <div
                    className={`flex gap-6 py-8 ${
                      i < 2 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <span className="font-headline text-4xl font-extrabold text-primary/30">
                        {step.num}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <span>{step.icon}</span> {step.title}
                      </h3>
                      <p className="mt-2 text-text-secondary leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════ 6. TRUST SECTION ═══════ */}
      <section className="py-20">
        <Container size="narrow">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                {isAr ? "شفافية ومصداقية" : "Editorial Integrity"}
              </span>
              <h2 className="text-3xl font-extrabold text-text-primary mt-2">{t("trustTitle")}</h2>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {[t("trust1"), t("trust2"), t("trust3"), t("trust4")].map(
              (item, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="flex items-start gap-4 p-4.5 bg-card-bg rounded-xl border border-border hover:border-primary/40 transition-colors shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center mt-0.5 shadow-sm shadow-emerald-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-text-primary font-medium text-sm leading-relaxed">{item}</p>
                  </div>
                </ScrollReveal>
              )
            )}
          </div>
        </Container>
      </section>

      {/* ═══════ 7. HIGH-CONVERTING FINAL CTA ═══════ */}
      <section className="py-24 relative overflow-hidden bg-primary-tint/30 border-t border-border">
        <div className="absolute inset-0 cyber-grid-bg opacity-50 pointer-events-none" />
        <Container size="narrow" className="relative">
          <ScrollReveal>
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold">
                <span>🛡️</span> {isAr ? "ابدأ اليوم مجاناً" : "Free 60-Second Security Checkup"}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary">
                {t("ctaTitle")}
              </h2>
              <p className="text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
                {t("ctaSubtitle")}
              </p>
              <div className="pt-2">
                <Button size="lg" href={`/${locale}/diagnostic`} className="shadow-xl shadow-primary/25 text-base px-8 py-3.5">
                  {t("ctaCta")}
                  <span className="ms-2 flip-rtl">→</span>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
