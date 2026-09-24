"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}/problems`, label: t("problems") },
    { href: `/${locale}/tools`, label: t("tools") },
    { href: `/${locale}/hub`, label: t("hub") },
    { href: `/${locale}/about`, label: t("about") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card-bg/95 backdrop-blur-md border-b border-border transition-colors">
      <Container size="wide">
        <nav className="flex items-center justify-between h-16" aria-label="Main navigation">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 font-headline text-xl font-bold text-text-primary hover:text-primary transition-colors group"
          >
            <Image
              src="/logo.png"
              alt="Zenvq Suggests Logo"
              width={34}
              height={34}
              className="w-8.5 h-8.5 rounded-lg object-cover shadow-sm transition-transform duration-200 group-hover:scale-105"
              priority
            />
            <span>Zenvq <span className="text-primary">Suggests</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <div className="ml-2">
              <Button variant="primary" size="sm" href={`/${locale}/diagnostic`}>
                {t("diagnostic")}
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 flex items-center justify-center w-10 h-10 rounded-lg bg-surface border border-border text-text-primary hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border space-y-3 bg-card-bg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-primary hover:bg-surface"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border flex items-center justify-between gap-3 px-3">
              <Button variant="primary" size="sm" fullWidth href={`/${locale}/diagnostic`}>
                {t("diagnostic")}
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
