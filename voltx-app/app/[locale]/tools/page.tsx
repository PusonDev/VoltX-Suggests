"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ProductCard from "@/components/shared/ProductCard";
import { getProducts, getProblems, seedProductProblemFits } from "@/lib/firebase/seed";

export default function ToolsPage() {
  const t = useTranslations("tools");
  const tc = useTranslations("common");
  const locale = useLocale();
  const allProducts = getProducts(locale);
  const allProblems = getProblems(locale);

  /* ─── State ─── */
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [sortBy, setSortBy] = useState<"editorial" | "fit" | "price">("editorial");

  /* ─── Derive filter options from data ─── */
  const categories = useMemo(
    () => Array.from(new Set(allProducts.map((p) => p.category))),
    [allProducts]
  );
  const platforms = useMemo(
    () => Array.from(new Set(allProducts.flatMap((p) => p.platforms))),
    [allProducts]
  );
  const sizes = useMemo(
    () => Array.from(new Set(allProducts.flatMap((p) => p.target_segment))),
    [allProducts]
  );
  const countries = useMemo(
    () => Array.from(new Set(allProducts.flatMap((p) => p.available_countries || []))),
    [allProducts]
  );
  const languages = useMemo(
    () => Array.from(new Set(allProducts.flatMap((p) => p.available_languages || []))),
    [allProducts]
  );

  /* ─── Search + Filter + Sort ─── */
  const filtered = useMemo(() => {
    let result = [...allProducts];

    // Search — match against product name, description, category, AND problem cluster titles/descriptions
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      
      // Find problem IDs that match the query
      const matchingProblemIds = allProblems
        .filter((prob) =>
          prob.title.toLowerCase().includes(q) ||
          prob.short_description.toLowerCase().includes(q) ||
          (prob.long_description && prob.long_description.toLowerCase().includes(q))
        )
        .map((prob) => prob.id);
      
      // Get product IDs linked to matching problems
      const productIdsFromProblems = seedProductProblemFits
        .filter((fit) => matchingProblemIds.includes(fit.problem_id))
        .map((fit) => fit.product_id);

      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q) ||
        productIdsFromProblems.includes(p.id)
      );
    }

    // Filters
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (platformFilter !== "all") {
      result = result.filter((p) => p.platforms.includes(platformFilter));
    }
    if (sizeFilter !== "all") {
      result = result.filter((p) => p.target_segment.includes(sizeFilter));
    }
    if (countryFilter !== "all") {
      result = result.filter((p) =>
        p.available_countries === null || p.available_countries.includes(countryFilter)
      );
    }
    if (languageFilter !== "all") {
      result = result.filter((p) =>
        p.available_languages === null || p.available_languages.includes(languageFilter)
      );
    }
    if (priceFilter === "free") {
      result = result.filter((p) => !p.price_from || p.price_from === 0);
    } else if (priceFilter === "paid") {
      result = result.filter((p) => p.price_from && p.price_from > 0);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "editorial") return b.editorial_score - a.editorial_score;
      if (sortBy === "fit") return b.fit_score - a.fit_score;
      return (a.price_from || 0) - (b.price_from || 0);
    });

    return result;
  }, [allProducts, allProblems, searchQuery, categoryFilter, platformFilter, sizeFilter, countryFilter, languageFilter, priceFilter, sortBy]);

  /* ─── Compute segmentation labels (dynamic, not hardcoded) ─── */
  const segmentLabels = useMemo(() => {
    if (filtered.length === 0) return {};
    const labels: Record<string, string> = {};

    // Best match — highest fit_score
    const bestMatch = filtered.reduce((best, p) =>
      p.fit_score > best.fit_score ? p : best
    );
    labels[bestMatch.id] = tc("bestMatch");

    // Best value — best editorial_score / price ratio
    const withPrice = filtered.filter((p) => p.price_from && p.price_from > 0);
    if (withPrice.length > 0) {
      const bestValue = withPrice.reduce((best, p) => {
        const ratio = p.editorial_score / (p.price_from || 1);
        const bestRatio = best.editorial_score / (best.price_from || 1);
        return ratio > bestRatio ? p : best;
      });
      if (!labels[bestValue.id]) {
        labels[bestValue.id] = tc("bestValue");
      }
    }

    // Best for teams — has "small-business" or "remote-team" in target_segment
    const teamProducts = filtered.filter((p) =>
      p.target_segment.includes("small-business") || p.target_segment.includes("remote-team")
    );
    if (teamProducts.length > 0) {
      const bestForTeams = teamProducts.reduce((best, p) =>
        p.fit_score > best.fit_score ? p : best
      );
      if (!labels[bestForTeams.id]) {
        labels[bestForTeams.id] = tc("bestForTeams");
      }
    }

    // Best for beginners — solves "no-idea-where-to-start" problem
    const beginnerProductIds = seedProductProblemFits
      .filter((fit) => fit.problem_id === "prob4")
      .map((fit) => fit.product_id);
    const beginnerProducts = filtered.filter((p) => beginnerProductIds.includes(p.id));
    if (beginnerProducts.length > 0) {
      const bestForBeginners = beginnerProducts.reduce((best, p) =>
        p.fit_score > best.fit_score ? p : best
      );
      if (!labels[bestForBeginners.id]) {
        labels[bestForBeginners.id] = tc("bestForBeginners");
      }
    }

    return labels;
  }, [filtered, tc]);

  /* ─── Size label formatter ─── */
  const formatSize = (s: string) =>
    s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <section className="py-16">
      <Container>
        <ScrollReveal>
          <h1 className="text-text-primary">{t("title")}</h1>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl">
            {t("subtitle")}
          </p>
        </ScrollReveal>

        {/* Search Bar */}
        <ScrollReveal delay={50}>
          <div className="mt-8">
            <div className="relative">
              <svg
                className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tc("searchProblems")}
                className="
                  w-full ps-12 pe-4 py-3.5 rounded-xl
                  border border-border bg-card-bg
                  text-text-primary placeholder:text-text-muted
                  focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10
                  transition-all duration-200
                  text-base shadow-sm
                "
              />
            </div>

            {/* Quick Filter Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-text-muted">
                {locale === "ar" ? "بحث سريع:" : "Quick Filter:"}
              </span>
              {[
                { label: locale === "ar" ? "🔑 إدارة كلمات المرور" : "🔑 Password Vaults", query: "password" },
                { label: locale === "ar" ? "👥 فرق العمل عن بُعد" : "👥 Remote Teams", query: "remote" },
                { label: locale === "ar" ? "🛡️ برامج الفدية" : "🛡️ Ransomware Protection", query: "ransomware" },
                { label: locale === "ar" ? "⚡ إعداد سريع" : "⚡ 5-Min Setup", query: "setup" },
              ].map((chip) => (
                <button
                  key={chip.query}
                  onClick={() => setSearchQuery(searchQuery === chip.query ? "" : chip.query)}
                  className={`
                    px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer
                    ${
                      searchQuery === chip.query
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-surface text-text-secondary border-border hover:border-primary/50 hover:bg-card-bg"
                    }
                  `}
                >
                  {chip.label}
                </button>
              ))}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-rose-500 hover:underline ms-2 font-medium"
                >
                  {locale === "ar" ? "إلغاء البحث ✕" : "Clear ✕"}
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal delay={100}>
          <div className="mt-6 flex flex-wrap gap-4 p-4 bg-surface rounded-xl border border-border">
            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-muted">{tc("category")}</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-text-primary focus:border-primary focus:outline-none min-h-[44px]"
              >
                <option value="all">{t("allCategories")}</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Platform */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-muted">{tc("platform")}</label>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-text-primary focus:border-primary focus:outline-none min-h-[44px]"
              >
                <option value="all">{t("allPlatforms")}</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Business Size */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-muted">{tc("businessSize")}</label>
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-text-primary focus:border-primary focus:outline-none min-h-[44px]"
              >
                <option value="all">{tc("allSizes")}</option>
                {sizes.map((s) => (
                  <option key={s} value={s}>{formatSize(s)}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            {languages.length > 0 && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-text-muted">{tc("language")}</label>
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-text-primary focus:border-primary focus:outline-none min-h-[44px]"
                >
                  <option value="all">{tc("allLanguages")}</option>
                  {languages.map((l) => (
                    <option key={l} value={l}>{l.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Free / Paid */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-muted">{tc("freePaid")}</label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as "all" | "free" | "paid")}
                className="px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-text-primary focus:border-primary focus:outline-none min-h-[44px]"
              >
                <option value="all">{t("allPricing")}</option>
                <option value="free">{tc("free")}</option>
                <option value="paid">{tc("paid")}</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-muted">{tc("sortBy")}</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "editorial" | "fit" | "price")}
                className="px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-text-primary focus:border-primary focus:outline-none min-h-[44px]"
              >
                <option value="editorial">{tc("editorialScore")}</option>
                <option value="fit">{tc("fitScore")}</option>
                <option value="pricing">{tc("pricing")}</option>
              </select>
            </div>
          </div>
        </ScrollReveal>

        {/* Results */}
        <div className="mt-8">
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 80}>
                  <ProductCard
                    product={product}
                    segmentLabel={segmentLabels[product.id]}
                    pageSlug="tools"
                    placement="directory"
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-text-muted">{tc("noResults")}</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
