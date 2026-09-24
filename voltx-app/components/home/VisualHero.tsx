"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function VisualHero() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 cyber-grid-bg">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-tint/60 rounded-full blur-3xl pointer-events-none -z-10 opacity-70" />

      <Container size="wide">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Asymmetric Bold Typography */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Security Radar Pulse Tag */}
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-radar-dot" />
                <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
                  {isAr ? "دفاع سيبراني استباقي للشركات الصغيرة" : "Active Cyber Defense Intelligence"}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-white font-bold">
                  2026
                </span>
              </div>
            </ScrollReveal>

            {/* Headline */}
            <ScrollReveal delay={100}>
              <h1 className="text-text-primary text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                {isAr ? (
                  <>
                    احمِ شركتك من الاختراق وفقدان البيانات — <span className="text-primary underline decoration-primary/40">بدون تعقيدات تقنية</span>.
                  </>
                ) : (
                  <>
                    Stop worrying about hacks & ransomware. <span className="text-primary underline decoration-primary/40">Get the exact security stack</span> your business needs.
                  </>
                )}
              </h1>
            </ScrollReveal>

            {/* Subtitle */}
            <ScrollReveal delay={200}>
              <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl">
                {isAr
                  ? "تشخيص فوري خلال 60 ثانية يطابق وضع عملك مع الأدوات المعتمدة المناسبة — مرتبة حسب قوة الحماية، وليس حسب العمولات."
                  : "We evaluate and verify battle-tested cybersecurity tools fitted to your exact team size, remote setup, and threat risks in under 60 seconds."}
              </p>
            </ScrollReveal>

            {/* CTA Buttons & Social Proof metrics */}
            <ScrollReveal delay={300}>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button size="lg" href={`/${locale}/diagnostic`} className="shadow-lg shadow-primary/25 text-base">
                  {t("heroCta")}
                  <span className="ms-2 flip-rtl">→</span>
                </Button>
                <Button variant="outline" size="lg" href={`/${locale}/tools`} className="text-base">
                  {t("heroSecondary")}
                </Button>
              </div>

              {/* Floating Micro-metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-border/70 max-w-lg">
                <div>
                  <p className="font-headline text-xl sm:text-2xl font-bold text-text-primary">100%</p>
                  <p className="text-xs text-text-muted">{isAr ? "برامج معتمدة ومحققة" : "Verified Partner Stack"}</p>
                </div>
                <div>
                  <p className="font-headline text-xl sm:text-2xl font-bold text-emerald-500">60 Sec</p>
                  <p className="text-xs text-text-muted">{isAr ? "تشخيص فوري مخصص" : "Instant Fitted Setup"}</p>
                </div>
                <div>
                  <p className="font-headline text-xl sm:text-2xl font-bold text-primary">$0</p>
                  <p className="text-xs text-text-muted">{isAr ? "استشارة مجانية بالكامل" : "Free Security Advisory"}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: 3D Holographic Visual with Floating Glass Cards */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal delay={250}>
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* 3D Hero Cyber Shield Image Container */}
                <div className="relative rounded-2xl overflow-hidden border border-primary/30 shadow-2xl shadow-primary/20 glow-border group">
                  <Image
                    src="/hero-cyber-shield.jpg"
                    alt="Zenvq Suggests Cyber Defense Command"
                    width={720}
                    height={405}
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  {/* Subtle gradient overlay to blend into UI */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card-bg/90 via-transparent to-transparent pointer-events-none" />

                  {/* Overlaid Live Shield Status Pill */}
                  <div className="absolute bottom-4 start-4 end-4 p-3 bg-card-bg/90 backdrop-blur-md rounded-xl border border-border/80 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-sm">
                        🛡️
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-primary">
                          {isAr ? "نظام حماية البيانات نشط" : "Live Security Guard Active"}
                        </p>
                        <p className="text-[10px] text-text-muted">
                          {isAr ? "فحص ثغرات كلمات المرور والشبكة" : "Zero-Knowledge Breach Protection"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      SECURE
                    </span>
                  </div>
                </div>

                {/* Floating Decorative Glass Card Top-Right */}
                <div className="hidden sm:flex absolute -top-6 -end-6 p-3 bg-card-bg/95 backdrop-blur-md rounded-xl border border-border shadow-xl items-center gap-3 animate-pulse-slow">
                  <span className="text-xl">⚡</span>
                  <div>
                    <p className="text-xs font-bold text-text-primary">
                      {isAr ? "الإعداد في 5 دقائق" : "5-Min Deployment"}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {isAr ? "بدون توقف عن العمل" : "Zero Business Downtime"}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
