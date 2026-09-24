# ⚡ Zenvq Suggests — Problem-First Cybersecurity Advisor

Zenvq Suggests is a problem-solving cybersecurity and privacy advisor platform designed for small businesses and teams. Rather than serving as a generic affiliate directory, Zenvq Suggests diagnoses specific security pain points and recommends tailored solutions based on fit and editorial merit.
Live Domain: [suggests.zenvq.com](https://suggests.zenvq.com)

---

## 🚀 Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Styling**: Tailwind CSS (Tailored Emerald `#059669` Design System — No Blue)
- **Internationalization (i18n)**: `next-intl` (English & Arabic with dynamic RTL support)
- **Database & Backend**: Supabase (PostgreSQL with RLS, Auto-translation triggers, and robust seed fallback)
- **Security & Lead Gating**: Jose (JWT Signed HttpOnly Cookies)
- **Typography**: Geist Sans & Outfit

---

## 📂 Project Structure

```
VoltX/
├── voltx-app/                   # Next.js 15 Full Application
│   ├── app/                     # App Router with [locale] dynamic routing
│   │   ├── [locale]/            # Public & Gated localized pages (en, ar)
│   │   │   ├── hub/             # Central Content Hub
│   │   │   ├── problems/        # Problem-solving directory & detail pages
│   │   │   ├── tools/           # Interactive Tools directory with live filters
│   │   │   ├── reviews/         # In-depth editorial product reviews
│   │   │   ├── guides/          # Cybersecurity best practice guides
│   │   │   ├── compare/         # Head-to-head product comparisons
│   │   │   ├── best/            # Ranked best-of category picks
│   │   │   ├── diagnostic/      # 3-step security assessment flow
│   │   │   └── campaigns/       # Gated campaign landing pages
│   │   ├── api/                 # API Routes (leads, diagnostic, click tracking, translation)
│   │   ├── sitemap.ts           # Dynamic XML sitemap generator
│   │   └── robots.ts            # Crawler instructions
│   ├── components/              # Emerald design system components
│   │   ├── ui/                  # Button, Card, Badge, Input, Container
│   │   ├── layout/              # Navbar, Footer, LanguageSwitcher
│   │   ├── shared/              # ProductCard, ScrollReveal, TranslationPending
│   │   └── gate/                # EmailGate component
│   ├── i18n/                    # Localization config & dictionaries (en.json, ar.json)
│   ├── lib/                     # Utilities
│   │   ├── affiliate.ts         # Central resolveMerchantUrl engine
│   │   ├── cookies.ts           # Signed JWT cookie utilities
│   │   ├── structured-data.ts   # Schema.org JSON-LD helpers
│   │   └── supabase/            # Client, Server, Types & Mock Seed Engine
│   └── supabase/
│       └── migrations/          # 001_initial_schema.sql
└── all files for this project/  # Project specs, plans & assets
```

---

## 🛠️ Local Setup & Getting Started

### 1. Navigate to the app directory
```bash
cd voltx-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file inside `voltx-app/` based on `.env.local.example`:

```env
# Supabase (Optional for local development; app will use mock seed data if omitted)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Cookie Security (Required for lead gating)
COOKIE_SECRET=your-random-32-character-secret

# Translation API (Optional for automated Arabic translation pipeline)
TRANSLATION_API_KEY=your-translation-key

# Production Domain
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔒 Affiliate Routing & Ethics Guarantee
All product links across the platform route strictly through `resolveMerchantUrl(product)`:
- If a product is an approved affiliate partner, the affiliate link is resolved with tracking.
- If not, the direct vendor link is provided with a **"Direct link — no commission"** badge.
- Editorial rankings and Fit Scores are **never** influenced by affiliate commission rates.
