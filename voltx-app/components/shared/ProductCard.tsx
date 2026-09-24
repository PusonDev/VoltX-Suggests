"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { resolveMerchantUrl } from "@/lib/affiliate";
import type { Product } from "@/lib/firebase/types";

interface ProductCardProps {
  product: Product;
  fitScore?: number;
  fitExplanation?: string;
  recommendedBecause?: string[];
  notIdealIf?: string[];
  segmentLabel?: string; // "Best match", "Best value", etc.
  pageSlug?: string;
  placement?: string;
}

export default function ProductCard({
  product,
  fitScore,
  fitExplanation,
  recommendedBecause,
  notIdealIf,
  segmentLabel,
  pageSlug = "",
  placement = "card",
}: ProductCardProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const merchantUrl = resolveMerchantUrl(product);
  
  const [guideOpen, setGuideOpen] = useState(false);
  const setupGuide = locale === "ar" ? product.setup_guide_ar : product.setup_guide_en;

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setGuideOpen(true);
    }, 80);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    // Hold for 600ms so user has time to read and it doesn't snap closed immediately
    hoverTimeoutRef.current = setTimeout(() => {
      setGuideOpen(false);
    }, 600);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleClick = async () => {
    // Log click via API
    try {
      await fetch(`/api/click/${product.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          page_slug: pageSlug,
          placement,
        }),
      });
    } catch {
      // Non-blocking — don't prevent navigation on click-log failure
    }
  };

  return (
    <Card className="flex flex-col h-full">
      {/* Segment Label */}
      {segmentLabel && (
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md bg-primary/10 text-primary border border-primary/20">
            {segmentLabel}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-headline text-lg font-bold text-text-primary">
            {product.name}
          </h3>
          <p className="text-sm text-text-muted mt-0.5">{product.vendor}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {fitScore && (
            <Badge variant="success">
              {t("fitScore")}: {fitScore.toFixed(1)}
            </Badge>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-grow">
        {product.description}
      </p>

      {/* Fit explanation if provided */}
      {fitExplanation && (
        <div className="bg-primary-tint rounded-lg p-3 mb-4">
          <p className="text-sm text-primary-dark">{fitExplanation}</p>
        </div>
      )}

      {/* Recommended because — v4 card format */}
      {recommendedBecause && recommendedBecause.length > 0 && (
        <div className="mb-4 bg-primary-tint/40 rounded-lg p-3 border border-primary/10">
          <p className="text-xs font-semibold text-primary-dark uppercase tracking-wide mb-2">
            {t("recommendedBecause")}
          </p>
          <ul className="space-y-1.5">
            {recommendedBecause.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-primary mt-0.5 flex-shrink-0">✔</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Not ideal if — v4 card format */}
      {notIdealIf && notIdealIf.length > 0 && (
        <div className="mb-4 bg-amber-500/5 rounded-lg p-3 border border-amber-500/10">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
            {t("notIdealIf")}
          </p>
          <ul className="space-y-1.5">
            {notIdealIf.map((scenario, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">✕</span>
                <span>{scenario}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <Badge variant="info">{product.category}</Badge>
        {product.platforms.slice(0, 3).map((p) => (
          <Badge key={p}>{p}</Badge>
        ))}
        {product.platforms.length > 3 && (
          <Badge>+{product.platforms.length - 3}</Badge>
        )}
      </div>

      {/* Pricing */}
      <div className="flex items-center justify-between mb-4">
        <div>
          {product.price_from ? (
            <p className="text-sm text-text-primary">
              <span className="font-semibold text-lg">
                ${product.price_from.toFixed(2)}
              </span>
              {product.recurring && (
                <span className="text-text-muted">{t("perMonth")}</span>
              )}
            </p>
          ) : (
            <p className="text-sm font-medium text-primary">{t("free")}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-text-muted">{t("editorialScore")}:</span>
          <span className="text-sm font-bold text-text-primary">
            {product.editorial_score.toFixed(1)}/10
          </span>
        </div>
      </div>

      {/* CTA */}
      <a
        href={merchantUrl}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        onClick={handleClick}
        className="
          w-full inline-flex items-center justify-center
          px-5 py-2.5 text-sm font-semibold rounded-lg
          bg-primary text-white
          hover:bg-primary-hover active:bg-primary-dark
          shadow-sm hover:shadow-md
          transition-all duration-200
          min-h-[44px]
        "
      >
        {t("viewProduct")}
        <svg
          className="ms-2 w-4 h-4 flip-rtl"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </a>

      {/* Last verified */}
      {product.last_verified_at && (
        <p className="text-xs text-text-muted text-center mt-2">
          {t("lastVerified")}:{" "}
          {new Date(product.last_verified_at).toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      )}

      {/* Setup Guide Expander */}
      {setupGuide && setupGuide.length > 0 && (
        <div 
          className="mt-4 pt-4 border-t border-border"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => setGuideOpen(!guideOpen)}
            className="flex items-center justify-between w-full text-xs font-semibold text-text-secondary hover:text-primary transition-colors cursor-pointer group"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-base group-hover:scale-110 transition-transform">⏱️</span> {t("setupIn5Mins", { defaultMessage: "Setup in 5 Minutes" })}
            </span>
            <svg
              className={`w-4 h-4 text-text-muted group-hover:text-primary transition-transform duration-300 ${guideOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          
          <div
            className={`
              grid transition-all duration-400 ease-in-out overflow-hidden
              ${guideOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0 mt-0 pointer-events-none"}
            `}
          >
            <div className="overflow-hidden">
              <div className="space-y-2.5 bg-surface/90 p-3.5 rounded-xl border border-border/80 text-xs shadow-inner">
                {setupGuide.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-text-secondary leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-primary-tint text-primary-dark font-bold flex-shrink-0 flex items-center justify-center text-[10px] mt-0.5 shadow-xs">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{step.replace(/^\d+\.\s*/, "").replace(/^\[AR-DRAFT\]\s*/, "")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
