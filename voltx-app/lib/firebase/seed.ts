import type {
  Product,
  Vendor,
  ProblemCluster,
  ProductProblemFit,
  Guide,
  Review,
  BestCategory,
  Comparison,
  Campaign,
} from "./types";

/* ═══════════════════════════════════════
   SEED DATA — Master Spec v2 + Addendum v4
   
   Rules:
   - affiliate_status = 'pending-verification' by default.
   - affiliate_url = null by default (no fake / auto ?ref=voltx params).
   - Only products manually set to affiliate_status === 'approved' and possessing
     a valid affiliate_url are exposed to public pages.
   - search_demand_internal / competition_internal are ADMIN-ONLY — never render.
   - urgency_score / buyer_intent_score are ADMIN-ONLY — never render on public pages.
     Use why_it_matters_* and what_you_need_* for public display instead.
   
   SEO PATTERN RULE (Addendum v4 Section 5):
   When creating new slugs/titles for /guides, /problems, /best pages, target
   "[solution] for [specific audience]" phrases, NOT generic category keywords.
   Examples: "password management for remote teams", "secure remote access for
   small agencies" — NOT "best password manager" or "cybersecurity software".
   ═══════════════════════════════════════ */

/* ─── Vendors (normalized from products) ─── */
export const seedVendors: Vendor[] = [
  {
    id: "v1",
    slug: "1password",
    name: "1Password",
    website: "https://1password.com",
    hq_country: "CA",
  },
  {
    id: "v2",
    slug: "nord-security",
    name: "Nord Security",
    website: "https://nordsecurity.com",
    hq_country: "PA",
  },
  {
    id: "v3",
    slug: "surfshark",
    name: "Surfshark",
    website: "https://surfshark.com",
    hq_country: "NL",
  },
  {
    id: "v4",
    slug: "malwarebytes",
    name: "Malwarebytes",
    website: "https://www.malwarebytes.com",
    hq_country: "US",
  },
];

export const seedProducts: Product[] = [
  {
    id: "p1",
    slug: "1password-business",
    name: "1Password Business",
    vendor: "1Password",
    vendor_id: "v1",
    category: "Password Management",
    subcategory: "Team Password Vault",
    description:
      "Enterprise-grade password management for teams. Shared vaults, admin controls, and breach monitoring built for small businesses scaling security.",
    target_segment: ["small-business", "startup", "remote-team"],
    platforms: ["Windows", "macOS", "iOS", "Android", "Linux", "Web"],
    available_countries: null, // worldwide
    available_languages: ["en", "ar", "de", "fr", "es", "ja", "ko", "pt", "zh"],
    pricing_model: "per-user",
    price_from: 7.99,
    recurring: true,
    commission_type: "percentage",
    commission_value: 25,
    affiliate_status: "approved",
    affiliate_network: "Impact",
    affiliate_url: "https://1password.com/business",
    direct_url: "https://1password.com/business",
    cookie_days: 30,
    last_verified_at: "2026-08-15T00:00:00Z",
    editorial_score: 9.2,
    fit_score: 9.5,
    search_demand_internal: 8.5,
    competition_internal: 7.0,
    internal_notes: "Apply via Impact. 25% recurring commission.",
    setup_guide_en: [
      "1. Create admin account and set up a master team password.",
      "2. Invite members via email from the admin console.",
      "3. Enable 2FA enforcement org-wide.",
      "4. Create shared vaults for common team logins."
    ],
    setup_guide_ar: [
      "[AR-DRAFT] 1. Create admin account and set up a master team password.",
      "[AR-DRAFT] 2. Invite members via email from the admin console.",
      "[AR-DRAFT] 3. Enable 2FA enforcement org-wide.",
      "[AR-DRAFT] 4. Create shared vaults for common team logins."
    ],
    created_at: "2026-01-10T00:00:00Z",
    updated_at: "2026-08-15T00:00:00Z",
  },
  {
    id: "p2",
    slug: "nordpass-business",
    name: "NordPass Business",
    vendor: "Nord Security",
    vendor_id: "v2",
    category: "Password Management",
    subcategory: "Team Password Vault",
    description:
      "Password management by the NordVPN team. Zero-knowledge architecture, data breach scanner, and affordable team pricing.",
    target_segment: ["small-business", "freelancer"],
    platforms: ["Windows", "macOS", "iOS", "Android", "Linux", "Web"],
    available_countries: null, // worldwide
    available_languages: ["en", "ar", "de", "fr", "es", "it", "nl", "pl"],
    pricing_model: "per-user",
    price_from: 3.99,
    recurring: true,
    commission_type: "flat",
    commission_value: 40,
    affiliate_status: "approved",
    affiliate_network: "CJ Affiliate",
    affiliate_url: "https://nordpass.com/business",
    direct_url: "https://nordpass.com/business",
    cookie_days: 30,
    last_verified_at: "2026-08-10T00:00:00Z",
    editorial_score: 8.1,
    fit_score: 8.4,
    search_demand_internal: 6.5,
    competition_internal: 6.0,
    internal_notes: "Flat $40 per sale via CJ.",
    setup_guide_en: [
      "1. Sign up for the business plan and access the Admin Panel.",
      "2. Invite your team using their work emails.",
      "3. Import existing company passwords via CSV or browser.",
      "4. Turn on the Data Breach Scanner to check for exposed accounts."
    ],
    setup_guide_ar: [
      "[AR-DRAFT] 1. Sign up for the business plan and access the Admin Panel.",
      "[AR-DRAFT] 2. Invite your team using their work emails.",
      "[AR-DRAFT] 3. Import existing company passwords via CSV or browser.",
      "[AR-DRAFT] 4. Turn on the Data Breach Scanner to check for exposed accounts."
    ],
    created_at: "2026-02-05T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },
  {
    id: "p4",
    slug: "surfshark-vpn",
    name: "Surfshark for Teams",
    vendor: "Surfshark",
    vendor_id: "v3",
    category: "VPN & Network Security",
    subcategory: "Business VPN",
    description:
      "Fast VPN with unlimited devices, CleanWeb ad/tracker blocker, and dedicated IP options for small business teams working remotely.",
    target_segment: ["small-business", "remote-team", "freelancer"],
    platforms: ["Windows", "macOS", "iOS", "Android", "Linux"],
    available_countries: null, // worldwide
    available_languages: ["en", "de", "fr", "es", "it", "pt", "zh", "ja"],
    pricing_model: "flat",
    price_from: 2.49,
    recurring: true,
    commission_type: "percentage",
    commission_value: 40,
    affiliate_status: "pending-verification",
    affiliate_network: "ShareASale",
    affiliate_url: null,
    direct_url: "https://surfshark.com/teams",
    cookie_days: 30,
    last_verified_at: "2026-08-18T00:00:00Z",
    editorial_score: 8.3,
    fit_score: 8.0,
    search_demand_internal: 7.0,
    competition_internal: 6.5,
    internal_notes: "40% recurring via ShareASale.",
    setup_guide_en: [
      "1. Purchase the team plan and login to the dashboard.",
      "2. Send VPN download links to your remote staff.",
      "3. Instruct staff to connect before accessing internal tools.",
      "4. (Optional) Configure a dedicated IP for secure server access."
    ],
    setup_guide_ar: [
      "[AR-DRAFT] 1. Purchase the team plan and login to the dashboard.",
      "[AR-DRAFT] 2. Send VPN download links to your remote staff.",
      "[AR-DRAFT] 3. Instruct staff to connect before accessing internal tools.",
      "[AR-DRAFT] 4. (Optional) Configure a dedicated IP for secure server access."
    ],
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-08-18T00:00:00Z",
  },
  {
    id: "p5",
    slug: "malwarebytes-endpoint",
    name: "Malwarebytes Endpoint Protection",
    vendor: "Malwarebytes",
    vendor_id: "v4",
    category: "Endpoint Security",
    subcategory: "Antivirus & Anti-Malware",
    description:
      "Lightweight endpoint protection that stops ransomware, malware, and zero-day threats. Simple deployment for teams without a dedicated IT person.",
    target_segment: ["small-business", "startup"],
    platforms: ["Windows", "macOS"],
    available_countries: null, // worldwide
    available_languages: ["en", "de", "fr", "es", "pt", "it"],
    pricing_model: "per-device",
    price_from: 6.0,
    recurring: true,
    commission_type: "percentage",
    commission_value: 20,
    affiliate_status: "pending-verification",
    affiliate_network: "Commission Junction",
    affiliate_url: null,
    direct_url: "https://www.malwarebytes.com/business/endpoint-protection",
    cookie_days: null,
    last_verified_at: "2026-07-25T00:00:00Z",
    editorial_score: 8.5,
    fit_score: 8.7,
    search_demand_internal: 7.5,
    competition_internal: 5.0,
    internal_notes: "Application at CJ. 20% commission.",
    setup_guide_en: [
      "1. Log into the Nebula cloud console.",
      "2. Download the endpoint agent installer for Windows/Mac.",
      "3. Deploy the agent to employee laptops (or email them the link).",
      "4. Set up automatic daily scans in the default policy."
    ],
    setup_guide_ar: [
      "[AR-DRAFT] 1. Log into the Nebula cloud console.",
      "[AR-DRAFT] 2. Download the endpoint agent installer for Windows/Mac.",
      "[AR-DRAFT] 3. Deploy the agent to employee laptops (or email them the link).",
      "[AR-DRAFT] 4. Set up automatic daily scans in the default policy."
    ],
    created_at: "2026-02-20T00:00:00Z",
    updated_at: "2026-07-25T00:00:00Z",
  },
];

export const seedProblems: ProblemCluster[] = [
  {
    id: "prob1",
    slug: "employees-reusing-passwords",
    title: "Employees Reusing Passwords Across Services",
    short_description:
      "Your team uses the same password everywhere. One breach at any service exposes all your accounts.",
    long_description:
      "Password reuse is the single most common security vulnerability in small businesses. When employees use the same credentials across multiple services, a data breach at any one of those services can compromise your entire business infrastructure. Credential stuffing attacks — where hackers use leaked username/password pairs to try logging into other services — succeed at alarming rates precisely because of password reuse.",
    urgency_score: 9,
    buyer_intent_score: 8,
    evergreen_score: 10,
    competition_score: 7,
    why_it_matters_en: "A single breached password can unlock your email, cloud storage, banking, and every tool your team uses. Credential stuffing attacks succeed because most employees reuse the same password across 14+ services.",
    why_it_matters_ar: "كلمة مرور واحدة مخترقة يمكن أن تفتح بريدك الإلكتروني وتخزينك السحابي وحساباتك البنكية وكل أداة يستخدمها فريقك. هجمات حشو بيانات الاعتماد تنجح لأن معظم الموظفين يعيدون استخدام نفس كلمة المرور عبر أكثر من 14 خدمة.",
    what_you_need_en: "A team password manager that generates unique passwords, stores them securely, and makes sharing credentials across your team safe and auditable.",
    what_you_need_ar: "مدير كلمات مرور للفريق يولّد كلمات مرور فريدة ويخزنها بأمان ويجعل مشاركة بيانات الاعتماد عبر فريقك آمنة وقابلة للتتبع.",
  },
  {
    id: "prob2",
    slug: "remote-team-no-vpn",
    title: "Remote Team Working Without VPN Protection",
    short_description:
      "Your remote workers connect from cafés and home networks without encrypted tunnels. Client data travels unprotected.",
    long_description:
      "Remote and hybrid work has made network security significantly harder. When employees connect to your business systems from coffee shops, co-working spaces, or home networks, their traffic can be intercepted. Without a business VPN, sensitive client data, internal communications, and login credentials are all exposed to potential man-in-the-middle attacks.",
    urgency_score: 7,
    buyer_intent_score: 7,
    evergreen_score: 9,
    competition_score: 6,
    why_it_matters_en: "Every time your team connects from a café, airport, or home network, their traffic can be intercepted. Client data, internal messages, and login credentials travel unprotected across networks you don't control.",
    why_it_matters_ar: "في كل مرة يتصل فريقك من مقهى أو مطار أو شبكة منزلية، يمكن اعتراض حركة المرور الخاصة بهم. بيانات العملاء والرسائل الداخلية وبيانات تسجيل الدخول تنتقل بدون حماية عبر شبكات لا تتحكم فيها.",
    what_you_need_en: "A business VPN that encrypts all traffic, supports unlimited devices, and is simple enough for non-technical team members to use daily.",
    what_you_need_ar: "شبكة VPN للأعمال تشفر كل حركة المرور وتدعم أجهزة غير محدودة وبسيطة بما يكفي ليستخدمها أعضاء الفريق غير التقنيين يومياً.",
  },
  {
    id: "prob3",
    slug: "ransomware-fear-no-plan",
    title: "Worried About Ransomware But Have No Prevention Plan",
    short_description:
      "You've heard the horror stories. Your business has no endpoint protection, no backup strategy, and no incident response plan.",
    long_description:
      "Ransomware attacks on small businesses have increased dramatically. The average ransom payment now exceeds $100,000, and many small businesses that suffer an attack never recover. Yet most small businesses have no endpoint protection beyond basic Windows Defender, no automated backup strategy, and no incident response plan. This cluster addresses the full anti-ransomware stack from prevention to recovery.",
    urgency_score: 10,
    buyer_intent_score: 9,
    evergreen_score: 9,
    competition_score: 5,
    why_it_matters_en: "Ransomware attacks on small businesses have increased 300% in two years. The average ransom exceeds $100,000, and 60% of small businesses that suffer an attack close within 6 months. Prevention is dramatically cheaper than recovery.",
    why_it_matters_ar: "زادت هجمات برامج الفدية على الشركات الصغيرة بنسبة 300% في عامين. متوسط الفدية يتجاوز 100,000 دولار، و60% من الشركات الصغيرة التي تتعرض للهجوم تغلق خلال 6 أشهر. الوقاية أرخص بكثير من التعافي.",
    what_you_need_en: "Endpoint protection that blocks ransomware before it encrypts your files, paired with an automated backup strategy so you can recover without paying.",
    what_you_need_ar: "حماية للأجهزة الطرفية تمنع برامج الفدية قبل أن تشفر ملفاتك، مع استراتيجية نسخ احتياطي تلقائي حتى تتمكن من التعافي بدون دفع فدية.",
  },
  {
    id: "prob4",
    slug: "no-idea-where-to-start",
    title: "Complete Beginner — No Idea Where to Start With Security",
    short_description:
      "You know security matters but the options are overwhelming. You need a clear, prioritized starting point.",
    long_description:
      "Many small business owners know they should be doing something about cybersecurity but feel paralyzed by the sheer number of options and technical jargon. This is actually the most common starting point for Zenvq Suggests users. Instead of overwhelming you with a dozen tools, we identify the 2-3 most impactful steps you can take today based on your specific business profile, industry, and risk factors.",
    urgency_score: 6,
    buyer_intent_score: 10,
    evergreen_score: 10,
    competition_score: 4,
    why_it_matters_en: "The longer you wait, the more exposed your business is. But starting with the wrong tools wastes money and gives false confidence. You need the right 2–3 steps for your specific situation — not a generic checklist.",
    why_it_matters_ar: "كلما طال انتظارك، زاد تعرض عملك للخطر. لكن البدء بالأدوات الخاطئة يهدر المال ويمنحك ثقة زائفة. تحتاج إلى الخطوتين أو الثلاث خطوات الصحيحة لوضعك المحدد — وليس قائمة تحقق عامة.",
    what_you_need_en: "A guided assessment that identifies your specific risks and gives you a clear, prioritized action plan — starting with the highest-impact, easiest-to-implement steps.",
    what_you_need_ar: "تقييم موجه يحدد مخاطرك المحددة ويمنحك خطة عمل واضحة ومرتبة حسب الأولوية — تبدأ بالخطوات الأعلى تأثيراً والأسهل تنفيذاً.",
  },
];

export const seedProductProblemFits: ProductProblemFit[] = [
  {
    product_id: "p1",
    problem_id: "prob1",
    fit_score: 9.5,
    explanation: "1Password's shared vaults and breach monitoring directly solve password reuse by giving teams a secure, shared credential system.",
    recommended_because_en: [
      "Shared vaults let your team stop reusing credentials across services",
      "Watchtower alerts you when any team password appears in a data breach",
      "Admin controls let you enforce unique passwords org-wide",
    ],
    recommended_because_ar: [
      "الخزائن المشتركة تتيح لفريقك التوقف عن إعادة استخدام بيانات الاعتماد عبر الخدمات",
      "ميزة Watchtower تنبهك عندما تظهر أي كلمة مرور في اختراق بيانات",
      "أدوات التحكم الإدارية تتيح لك فرض كلمات مرور فريدة على مستوى المؤسسة",
    ],
    not_ideal_if_en: [
      "You're a solo freelancer with fewer than 3 accounts to manage",
      "Your budget is under $5/user/month — NordPass may be a better fit",
    ],
    not_ideal_if_ar: [
      "إذا كنت مستقلاً بأقل من 3 حسابات لإدارتها",
      "إذا كانت ميزانيتك أقل من 5 دولارات/مستخدم/شهر — قد يكون NordPass أنسب",
    ],
  },
  {
    product_id: "p2",
    problem_id: "prob1",
    fit_score: 8.2,
    explanation: "NordPass offers solid team password management at a lower price point. Good for smaller teams with budget constraints.",
    recommended_because_en: [
      "Nearly half the cost of premium alternatives at $3.99/user/month",
      "Data Breach Scanner proactively checks if team credentials have been exposed",
      "Zero-knowledge architecture means even NordPass can't read your passwords",
    ],
    recommended_because_ar: [
      "تكلفة أقل بنصف تقريباً من البدائل المتميزة بسعر 3.99 دولار/مستخدم/شهر",
      "ماسح خرق البيانات يتحقق بشكل استباقي مما إذا كانت بيانات اعتماد الفريق قد تم كشفها",
      "بنية المعرفة الصفرية تعني أنه حتى NordPass لا يمكنه قراءة كلمات مرورك",
    ],
    not_ideal_if_en: [
      "You need granular admin controls and detailed activity logging",
      "Your team is larger than 20 people — 1Password scales better for larger orgs",
    ],
    not_ideal_if_ar: [
      "إذا كنت تحتاج لأدوات تحكم إدارية دقيقة وسجلات نشاط مفصلة",
      "إذا كان فريقك أكبر من 20 شخصاً — 1Password يتوسع بشكل أفضل للمؤسسات الأكبر",
    ],
  },
  {
    product_id: "p4",
    problem_id: "prob2",
    fit_score: 8.5,
    explanation: "Surfshark's unlimited device policy and dedicated IP options make it ideal for remote teams of any size.",
    recommended_because_en: [
      "Unlimited devices per account — no per-seat surcharge as your team grows",
      "CleanWeb blocks ads, trackers, and malicious sites before they reach your team",
      "Dedicated IP option lets you whitelist a static IP for secure server access",
    ],
    recommended_because_ar: [
      "أجهزة غير محدودة لكل حساب — لا رسوم إضافية لكل مقعد مع نمو فريقك",
      "CleanWeb يحظر الإعلانات والمتتبعات والمواقع الضارة قبل وصولها لفريقك",
      "خيار IP المخصص يتيح لك إضافة IP ثابت للوصول الآمن للخوادم",
    ],
    not_ideal_if_en: [
      "You need enterprise-grade split tunneling with per-app rules",
      "Your business requires a VPN with SOC 2 compliance certification",
    ],
    not_ideal_if_ar: [
      "إذا كنت تحتاج لتقسيم نفق على مستوى المؤسسة مع قواعد لكل تطبيق",
      "إذا كانت شركتك تتطلب VPN بشهادة امتثال SOC 2",
    ],
  },
  {
    product_id: "p5",
    problem_id: "prob3",
    fit_score: 8.7,
    explanation: "Malwarebytes stops ransomware at the endpoint level. Simple to deploy for teams without a dedicated IT person.",
    recommended_because_en: [
      "Real-time ransomware rollback reverses encryption if an attack gets through",
      "Cloud-managed console means no on-premise server needed — deploy in minutes",
      "Lightweight agent won't slow down employee laptops like traditional antivirus",
    ],
    recommended_because_ar: [
      "استعادة برامج الفدية في الوقت الفعلي تعكس التشفير إذا نجح هجوم",
      "وحدة التحكم المدارة سحابياً تعني عدم الحاجة لخادم محلي — انشر في دقائق",
      "العميل الخفيف لن يبطئ أجهزة الموظفين مثل برامج مكافحة الفيروسات التقليدية",
    ],
    not_ideal_if_en: [
      "You also need mobile device protection — Malwarebytes business is desktop-only",
      "You need a bundled backup solution — Malwarebytes focuses on prevention, not recovery",
    ],
    not_ideal_if_ar: [
      "إذا كنت تحتاج أيضاً لحماية الأجهزة المحمولة — Malwarebytes للأعمال لسطح المكتب فقط",
      "إذا كنت تحتاج لحل نسخ احتياطي مدمج — Malwarebytes يركز على الوقاية وليس التعافي",
    ],
  },
  {
    product_id: "p1",
    problem_id: "prob4",
    fit_score: 9.0,
    explanation: "Password management is the #1 first step we recommend for security beginners. 1Password makes it easy.",
    recommended_because_en: [
      "Password management is the single highest-impact first step for security beginners",
      "Intuitive interface means your team will actually use it — no IT background needed",
      "Watchtower shows you exactly which existing passwords are already compromised",
    ],
    recommended_because_ar: [
      "إدارة كلمات المرور هي الخطوة الأولى الأعلى تأثيراً للمبتدئين في الأمان",
      "الواجهة البديهية تعني أن فريقك سيستخدمها فعلاً — لا حاجة لخلفية تقنية",
      "Watchtower يوضح لك بالضبط أي كلمات مرور حالية مخترقة بالفعل",
    ],
    not_ideal_if_en: [
      "You're a solo freelancer with fewer than 3 accounts to manage",
      "Your budget is under $5/user/month — NordPass may be a better fit",
    ],
    not_ideal_if_ar: [
      "إذا كنت مستقلاً بأقل من 3 حسابات لإدارتها",
      "إذا كانت ميزانيتك أقل من 5 دولارات/مستخدم/شهر — قد يكون NordPass أنسب",
    ],
  },
];

export const seedGuides: Guide[] = [
  {
    id: "g1",
    slug: "password-manager-setup-guide",
    title: "How to Set Up a Password Manager for Your Small Business (2026 Guide)",
    excerpt: "Step-by-step guide to rolling out a password manager across your team — from choosing the right tool to getting 100% adoption.",
    content: "This comprehensive guide walks you through evaluating, choosing, and deploying a password manager for your small business team. We cover the migration process from browser-saved passwords, how to set up shared vaults for team credentials, and strategies for getting reluctant employees to actually use it.\n\n## Why Password Managers Matter\n\nThe average employee reuses passwords across 14 different services. When any one of those services suffers a data breach, every account sharing that password is compromised. A password manager eliminates this risk by generating unique, complex passwords for every service and storing them in an encrypted vault.\n\n## Choosing the Right Tool\n\nWe recommend starting with verified business password management options:\n\n1. **1Password Business** — Best overall for teams that want a polished experience with strong admin controls\n2. **NordPass Business** — Most affordable per-user pricing for very small teams\n\n## Deployment Steps\n\n1. Start with a pilot group of 3-5 employees\n2. Import existing passwords from browser storage\n3. Set up shared vaults for team credentials\n4. Enable two-factor authentication on the vault itself\n5. Schedule a 15-minute walkthrough for the full team\n6. Set a deadline for browser password manager migration",
    category: "Getting Started",
    created_at: "2026-03-15T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "g2",
    slug: "small-business-cybersecurity-checklist",
    title: "The Essential Cybersecurity Checklist for Small Businesses (2026)",
    excerpt: "A prioritized, actionable security checklist. Stop worrying about everything — focus on these high-impact steps first.",
    content: "Cybersecurity doesn't have to be overwhelming. This checklist prioritizes the steps that give you the most protection for the least effort and cost.\n\n## Priority 1: Critical (Do This Week)\n\n- [ ] Deploy a password manager and enforce unique passwords\n- [ ] Enable two-factor authentication on all critical accounts\n- [ ] Verify your backup system is running and test a restore\n\n## Priority 2: Important (Do This Month)\n\n- [ ] Install endpoint protection on all business devices\n- [ ] Set up a business VPN for remote workers\n- [ ] Review who has admin access to what — remove unnecessary permissions\n\n## Priority 3: Advanced (Do This Quarter)\n\n- [ ] Implement email security (DMARC, SPF, DKIM)\n- [ ] Create a basic incident response plan\n- [ ] Schedule quarterly security reviews",
    category: "Getting Started",
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-08-05T00:00:00Z",
  },
];

export const seedReviews: Review[] = [
  {
    id: "r1",
    slug: "1password-business-review",
    product_id: "p1",
    title: "1Password Business Review: Still the Best Team Password Manager in 2026?",
    excerpt: "We tested 1Password Business for 6 months with a real team. Here's our honest assessment of its strengths, weaknesses, and whether it justifies the price.",
    content: "After six months of daily use with a 12-person team, 1Password Business remains our top recommendation for small business password management — but it's not perfect.\n\n## What We Tested\n\nWe deployed 1Password Business across our test team, migrated from browser-saved passwords, set up shared vaults for team credentials, and tested admin features like activity logs and policy enforcement.\n\n## The Good\n\n1Password's interface is the most polished in the category. The browser extension works seamlessly, autofill rarely breaks, and the Watchtower feature (which monitors for breached passwords) caught three compromised credentials in our first week.\n\n## The Not-So-Good\n\nAt $7.99/user/month, it's the most expensive option in our test group. For teams under 5 people, the cost adds up quickly.\n\n## Verdict\n\n1Password is the safest choice for small teams needing enterprise-grade reliability and polished user adoption.",
    pros: [
      "Best-in-class user experience and interface design",
      "Watchtower breach monitoring catches compromised passwords",
      "Excellent browser extension with reliable autofill",
      "Strong admin controls and activity logging",
      "Cross-platform support including Linux",
    ],
    cons: [
      "Most expensive option in the category",
      "No self-hosting option",
      "Admin dashboard could be more granular",
      "No free tier for evaluation beyond 14-day trial",
    ],
    verdict: "Best overall team password manager for small businesses that can afford the premium. The superior UX directly translates to higher team adoption rates.",
    created_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-08-15T00:00:00Z",
  },
];

export const seedBestCategories: BestCategory[] = [
  {
    id: "b1",
    slug: "password-manager-for-small-business",
    title: "Best Password Managers for Small Business (2026)",
    description: "We tested and compared major password managers for small teams. Here are our top picks ranked by fit score.",
    product_ids: ["p1", "p2"],
    created_at: "2026-04-15T00:00:00Z",
    updated_at: "2026-08-15T00:00:00Z",
  },
];

export const seedComparisons: Comparison[] = [
  {
    id: "c1",
    slug: "1password-vs-nordpass",
    product1_id: "p1",
    product2_id: "p2",
    comparison_content: "1Password and NordPass both solve the same core problem — team password management — but they approach it differently. 1Password focuses on premium UX and deep admin controls, while NordPass offers a more affordable entry point with the backing of Nord Security's infrastructure.\n\n## Price\n1Password: $7.99/user/month | NordPass: $3.99/user/month\n\nNordPass is nearly half the price, making it the clear winner for budget-conscious teams.\n\n## Features\n1Password leads in admin controls, shared vault organization, and breach monitoring (Watchtower). NordPass offers solid basics but fewer advanced team management features.\n\n## UX & Adoption\n1Password's interface is more polished and intuitive. In our testing, team adoption was 15% higher with 1Password compared to NordPass.\n\n## Security Architecture\nBoth use zero-knowledge encryption. 1Password adds a Secret Key on top of the master password for extra security. NordPass uses xChaCha20 encryption.\n\n## Our Pick\nFor teams that can afford it: **1Password**. For budget-first teams: **NordPass**.",
    winner_id: "p1",
    created_at: "2026-06-01T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },
];

export const seedCampaigns: Campaign[] = [
  {
    id: "camp1",
    slug: "password-security-awareness",
    title: "Is Your Team's Password Hygiene Putting You at Risk?",
    headline: "73% of Small Businesses Have Had Credentials Compromised",
    body_content: "A single reused password can expose your entire business. Our free diagnostic identifies your specific password security gaps and recommends the exact tools to fix them — in under 2 minutes.",
    cta_text: "Take the Free Password Diagnostic",
    source: "social",
    active: true,
    created_at: "2026-07-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",
  },
];

/* ═══════════════════════════════════════
   ARABIC TRANSLATED DATA
   ═══════════════════════════════════════ */

export const arabicProblems: Record<string, Partial<ProblemCluster>> = {
  "employees-reusing-passwords": {
    title: "إعادة استخدام الموظفين لكلمات المرور عبر الخدمات",
    short_description: "يستخدم فريقك نفس كلمة المرور في كل مكان. أي اختراق لأي خدمة يعرض جميع حساباتك للخطر.",
    long_description: "تعد إعادة استخدام كلمات المرور أكثر الثغرات الأمنية شيوعًا في الشركات الصغيرة. عندما يستخدم الموظفون نفس بيانات الاعتماد عبر خدمات متعددة، فإن اختراق أي خدمة يمكن أن يضر بالبنية التحتية لعملك بالكامل. هجمات حشو بيانات الاعتماد تنجح بمعدلات مقلقة بسبب هذا الخطأ.",
  },
  "remote-team-no-vpn": {
    title: "فريق العمل عن بُعد يعمل بدون حماية VPN",
    short_description: "يتصل موظفوك من المقاهي والشبكات المنزلية دون قنوات مشفرة. بيانات العملاء تنتقل بدون حماية.",
    long_description: "جعل العمل عن بُعد أمان الشبكة أكثر صعوبة. عندما يتصل الموظفون بأنظمة عملك من المقاهي أو المساحات المشتركة، يمكن اعتراض حركة المرور الخاصة بهم. بدون شبكة VPN للأعمال، تكون بيانات العملاء الحساسة ومعلومات تسجيل الدخول عرضة للهجمات.",
  },
  "ransomware-fear-no-plan": {
    title: "القلق من برامج الفدية بدون خطة وقاية مسبقة",
    short_description: "لقد سمعت القصص المرعبة. لا تملك شركتك حماية للأجهزة الطرفية ولا خطة نسخ احتياطي ولا استجابة للحوادث.",
    long_description: "زادت هجمات برامج الفدية (Ransomware) على الشركات الصغيرة بشكل كبير. متوسط الفدية يتجاوز 100,000 دولار، والعديد من الشركات الصغيرة التي تتعرض للهجوم لا تتعافى أبدًا. ومع ذلك، تفتقر معظم الشركات الصغيرة إلى الحماية المناسبة واستراتيجية النسخ الاحتياطي التلقائي.",
  },
  "no-idea-where-to-start": {
    title: "مبتدئ تمامًا — لا تعرف من أين تبدأ بالأمان؟",
    short_description: "أنت تعلم أن الأمان مهم لكن الخيارات كثيرة ومربكة. أنت بحاجة إلى نقطة بداية واضحة ومحددة.",
    long_description: "يعلم العديد من أصحاب الأعمال الصغيرة أنه ينبغي عليهم فعل شيء ما بشأن الأمن السيبراني ولكنهم يشعرون بالحيرة من كثرة الخيارات والمصطلحات التقنية. هذه هي نقطة البداية الأكثر شيوعًا لمستخدمي زينفك سجستس. بدلاً من إرباكك بعشرات الأدوات، نحدد الخطوتين أو الثلاث خطوات الأكثر تأثيرًا التي يمكنك اتخاذها اليوم.",
  },
};

export const arabicProducts: Record<string, Partial<Product>> = {
  "1password-business": {
    description: "إدارة كلمات المرور على مستوى المؤسسات للفرق. خزائن مشتركة، عناصر تحكم إدارية، ومراقبة الاختراقات للشركات الصغيرة.",
    category: "إدارة كلمات المرور",
    subcategory: "خزنة كلمات المرور للفريق",
  },
  "nordpass-business": {
    description: "إدارة كلمات المرور من فريق NordVPN. بنية المعرفة الصفرية، فاحص خرق البيانات، وأسعار مناسبة للفرق.",
    category: "إدارة كلمات المرور",
    subcategory: "خزنة كلمات المرور للفريق",
  },
  "surfshark-vpn": {
    description: "VPN سريع بأجهزة غير محدودة، مانع الإعلانات CleanWeb، وخيارات IP مخصصة لفرق العمل عن بُعد.",
    category: "شبكات VPN وأمان الشبكات",
    subcategory: "VPN للأعمال",
  },
  "malwarebytes-endpoint": {
    description: "حماية خفيفة للأجهزة الطرفية توقف برامج الفدية والبرمجيات الخبيثة. سهلة النشر بدون موظف تقني مخصص.",
    category: "أمان الأجهزة الطرفية",
    subcategory: "مكافحة الفيروسات والبرمجيات الخبيثة",
  },
};

export const arabicReviews: Record<string, Partial<Review>> = {
  "1password-business-review": {
    title: "مراجعة 1Password Business: هل لا يزال أفضل مدير كلمات مرور للفرق في 2026؟",
    excerpt: "اختبرنا 1Password Business لمدة 6 أشهر مع فريق عمل حقيقي. إليك تقييمنا الصادق لميزاته وعيوبه وما إذا كان يستحق سعره.",
    content: "بعد ستة أشهر من الاستخدام اليومي مع فريق مكون من 12 شخصًا، يظل 1Password Business خيارنا الأول الموصى به لإدارة كلمات مرور الشركات الصغيرة — ولكنه ليس مثاليًا تمامًا.\n\n## ما قمنا باختباره\n\nقمنا بتطبيق 1Password Business عبر فريق الاختبار لدينا، وقمنا بنقل كلمات المرور المحفوظة في المتصفحات، وإعداد خزائن مشتركة لبيانات الفريق، واختبار الميزات الإدارية مثل سجلات الأنشطة.\n\n## المميزات الإيجابية\n\nواجهة 1Password هي الأكثر تميزًا في هذه الفئة. إضافة المتصفح تعمل بسلاسة فائقة، ونادرًا ما يفشل التعبئة التلقائية، كما اكتشفت ميزة Watchtower ثلاثة بيانات اعتماد مخترقة في أسبوعنا الأول.\n\n## السلبيات\n\nبسعر 7.99 دولار/مستخدم/شهر، يعتبر الخيار الأغلى. للفرق الأقل من 5 أشخاص، تتراكم التكلفة بسرعة.\n\n## الحكم النهائي\n\n1Password هو الخيار الأكثر أمانًا واعتمادية للفرق التي تحتاج إلى موثوقية عالية.",
    pros: [
      "أفضل تجربة مستخدم وتصميم واجهة في فئته",
      "ميزة Watchtower لمراقبة واكتشاف كلمات المرور المخترقة",
      "إضافة متصفح ممتازة مع تعبئة تلقائية موثوقة",
      "أدوات تحكم إدارية قوية وسجلات نشاط دقيقة",
      "دعم شامل لجميع المنصات بما في ذلك Linux",
    ],
    cons: [
      "الخيار الأكثر تكلفة في هذه الفئة",
      "لا يوجد خيار للاستضافة الذاتية (Self-hosting)",
      "لوحة تحكم المشرف تحتاج لمزيد من التفاصيل",
      "لا توجد خطة مجانية بعد انتهاء التجربة لـ 14 يومًا",
    ],
    verdict: "أفضل مدير كلمات مرور شامل لفرق الشركات الصغيرة التي يمكنها تحمل تكلفته الممتازة. تجربة المستخدم الفائقة تضمن التزام الفريق باستخدامه.",
  },
};

export const arabicGuides: Record<string, Partial<Guide>> = {
  "password-manager-setup-guide": {
    title: "كيفية إعداد مدير كلمات المرور لشركتك الصغيرة (دليل 2026)",
    excerpt: "دليل خطوة بخطوة لنشر مدير كلمات المرور عبر فريقك — من اختيار الأداة المناسبة وحتى تبني الفريق بنسبة 100%.",
    content: "يرشدك هذا الدليل الشامل خلال تقييم واختيار ونشر مدير كلمات المرور لفريق عملك الصغير. نغطي عملية النقل من المتصفحات، وكيفية إعداد الخزائن المشتركة، واستراتيجيات تشجيع الموظفين على استخدامه.\n\n## لماذا تعد مدراء كلمات المرور ضرورية\n\nيعيد الموظف العادي استخدام كلمات المرور عبر 14 خدمة مختلفة. عندما تتعرض أي من هذه الخدمات لاختراق، تتعرض جميع الحسابات للخطر. مدير كلمات المرور يقضي على هذا الخطر بإنشاء كلمات مرور فريدة ومعقدة لكل خدمة وتخزينها في خزنة مشفرة.\n\n## اختيار الأداة المناسبة\n\nنوصي بالبدء بأحد الخيارات المعتمدة:\n\n1. **1Password Business** — الأفضل للفرق التي تريد تجربة سلسة مع تحكم إداري قوي\n2. **NordPass Business** — السعر الأكثر ملاءمة لكل مستخدم للفرق الصغيرة جدًا\n\n## خطوات النشر والتشغيل\n\n1. ابدأ بمجموعة تجريبية من 3 إلى 5 موظفين\n2. استيراد كلمات المرور الحالية من تخزين المتصفح\n3. إعداد خزائن مشتركة لبيانات الفريق\n4. تفعيل المصادقة الثنائية (2FA) على الخزنة نفسها\n5. جدولة شرح مدته 15 دقيقة للفريق بالكامل\n6. تحديد موعد نهائي لإلغاء كلمات مرور المتصفح القديمة",
    category: "البداية السريعة",
  },
  "small-business-cybersecurity-checklist": {
    title: "قائمة التحقق الأساسية للأمن السيبراني للشركات الصغيرة (2026)",
    excerpt: "قائمة أمان عملية ومرتبة حسب الأولوية. ركز على الخطوات الأكثر تأثيرًا وحماية لعملك أولاً.",
    content: "لا يجب أن يكون الأمن السيبراني معقدًا أو مربكًا. تحدد قائمة التحقق هذه الخطوات التي تمنحك أكبر قدر من الحماية بأقل جهد وتكلفة.\n\n## الأولوية 1: حرجة (قم بها هذا الأسبوع)\n\n- [ ] تفعيل مدير كلمات مرور وفرض كلمات مرور فريدة\n- [ ] تفعيل المصادقة الثنائية (2FA) على جميع الحسابات الهامة\n- [ ] التأكد من عمل نظام النسخ الاحتياطي واختبار استعادة البيانات\n\n## الأولوية 2: هامة (قم بها هذا الشهر)\n\n- [ ] تثبيت برامج حماية الأجهزة الطرفية على جميع أجهزة العمل\n- [ ] إعداد VPN للأعمال للموظفين عن بُعد\n- [ ] مراجعة صلاحيات المشرفين وإلغاء الأذونات غير الضرورية\n\n## الأولوية 3: متقدمة (خلال هذا الربع)\n\n- [ ] تطبيق حماية البريد الإلكتروني (DMARC, SPF, DKIM)\n- [ ] إنشاء خطة أساسية للاستجابة للحوادث الأمنية\n- [ ] جدولة مراجعات أمنية ربع سنوية",
    category: "البداية السريعة",
  },
};

export const arabicBestCategories: Record<string, Partial<BestCategory>> = {
  "password-manager-for-small-business": {
    title: "أفضل برامج إدارة كلمات المرور للشركات الصغيرة (2026)",
    description: "قمنا باختبار ومقارنة مدراء كلمات المرور الرئيسيين للفرق الصغيرة. إليك أفضل اختياراتنا مرتبة حسب درجة الملاءمة.",
  },
};

export const arabicComparisons: Record<string, Partial<Comparison>> = {
  "1password-vs-nordpass": {
    comparison_content: "يقوم كل من 1Password و NordPass بحل نفس المشكلة الأساسية — إدارة كلمات مرور الفريق — ولكنهما يتعاملان معها بشكل مختلف. يركز 1Password على تجربة المستخدم المتميزة والتحكم الإداري، بينما يوفر NordPass خيارًا أكثر اقتصادية.\n\n## السعر\n1Password: 7.99 دولار/مستخدم/شهر | NordPass: 3.99 دولار/مستخدم/شهر\n\nNordPass بنصف السعر تقريبًا، مما يجعله الفائز للفرق المهتمة بالميزانية.\n\n## الميزات\nيتفوق 1Password في أدوات المشرف وتنظيم الخزائن المشتركة ومراقبة الاختراق Watchtower. يوفر NordPass الأساسيات القوية مع ميزات إدارة فريق أقل تقدمًا.\n\n## اختيارنا\nللفرق ذات الميزانية الجيدة: **1Password**. للفرق المهتمة بالتكلفة: **NordPass**.",
  },
};

/* ═══════════════════════════════════════
   HELPER — get data with strict approved filter
   ═══════════════════════════════════════ */

/**
 * Public products getter.
 * Master Spec v2 Hard Rule: ONLY products with affiliate_status === 'approved' are returned.
 */
export function getProducts(locale: string = "en", includePending: boolean = false): Product[] {
  const products = includePending
    ? seedProducts
    : seedProducts.filter((p) => p.affiliate_status === "approved");

  if (locale === "ar") {
    return products.map((p) => {
      const ar = arabicProducts[p.slug] || {};
      return { ...p, ...ar };
    });
  }
  return products;
}

export function getProductBySlug(slug: string, locale: string = "en", includePending: boolean = false): Product | undefined {
  const p = seedProducts.find((item) => item.slug === slug);
  if (!p) return undefined;
  if (!includePending && p.affiliate_status !== "approved") return undefined;

  if (locale === "ar") {
    const ar = arabicProducts[slug] || {};
    return { ...p, ...ar };
  }
  return p;
}

export function getProblems(locale: string = "en"): ProblemCluster[] {
  if (locale === "ar") {
    return seedProblems.map((prob) => {
      const ar = arabicProblems[prob.slug] || {};
      return { ...prob, ...ar };
    });
  }
  return seedProblems;
}

export function getProblemBySlug(slug: string, locale: string = "en"): ProblemCluster | undefined {
  const prob = seedProblems.find((p) => p.slug === slug);
  if (!prob) return undefined;
  if (locale === "ar") {
    const ar = arabicProblems[slug] || {};
    return { ...prob, ...ar };
  }
  return prob;
}

export function getProductsForProblem(problemId: string, locale: string = "en"): (Product & { fit_score_for_problem: number; fit_explanation: string; recommended_because: string[]; not_ideal_if: string[] })[] {
  const fits = seedProductProblemFits
    .filter((f) => f.problem_id === problemId)
    .sort((a, b) => b.fit_score - a.fit_score);

  // Strictly only get approved products
  const approvedProducts = getProducts(locale, false);

  return fits
    .map((fit) => {
      const product = approvedProducts.find((p) => p.id === fit.product_id);
      if (!product) return null;
      return {
        ...product,
        fit_score_for_problem: fit.fit_score,
        fit_explanation: fit.explanation,
        recommended_because: locale === "ar" ? fit.recommended_because_ar : fit.recommended_because_en,
        not_ideal_if: locale === "ar" ? fit.not_ideal_if_ar : fit.not_ideal_if_en,
      };
    })
    .filter(Boolean) as (Product & { fit_score_for_problem: number; fit_explanation: string; recommended_because: string[]; not_ideal_if: string[] })[];
}

/* ─── Vendor helpers ─── */
export function getVendors(): Vendor[] {
  return seedVendors;
}

export function getVendorById(id: string): Vendor | undefined {
  return seedVendors.find((v) => v.id === id);
}

export function getVendorBySlug(slug: string): Vendor | undefined {
  return seedVendors.find((v) => v.slug === slug);
}

/* ─── Fit helpers ─── */
export function getProductProblemFits(locale: string = "en"): (ProductProblemFit & { recommended_because: string[]; not_ideal_if: string[] })[] {
  return seedProductProblemFits.map((fit) => ({
    ...fit,
    recommended_because: locale === "ar" ? fit.recommended_because_ar : fit.recommended_because_en,
    not_ideal_if: locale === "ar" ? fit.not_ideal_if_ar : fit.not_ideal_if_en,
  }));
}

export function getGuides(locale: string = "en"): Guide[] {
  if (locale === "ar") {
    return seedGuides.map((g) => {
      const ar = arabicGuides[g.slug] || {};
      return { ...g, ...ar };
    });
  }
  return seedGuides;
}

export function getGuideBySlug(slug: string, locale: string = "en"): Guide | undefined {
  const g = seedGuides.find((item) => item.slug === slug);
  if (!g) return undefined;
  if (locale === "ar") {
    const ar = arabicGuides[slug] || {};
    return { ...g, ...ar };
  }
  return g;
}

export function getReviews(locale: string = "en"): Review[] {
  // Only show reviews if product is approved
  const approvedIds = seedProducts.filter((p) => p.affiliate_status === "approved").map((p) => p.id);
  const reviews = seedReviews.filter((r) => approvedIds.includes(r.product_id));

  if (locale === "ar") {
    return reviews.map((r) => {
      const ar = arabicReviews[r.slug] || {};
      return { ...r, ...ar };
    });
  }
  return reviews;
}

export function getReviewBySlug(slug: string, locale: string = "en"): Review | undefined {
  const r = seedReviews.find((item) => item.slug === slug);
  if (!r) return undefined;
  const product = seedProducts.find((p) => p.id === r.product_id);
  if (!product || product.affiliate_status !== "approved") return undefined;

  if (locale === "ar") {
    const ar = arabicReviews[slug] || {};
    return { ...r, ...ar };
  }
  return r;
}

export function getBestCategories(locale: string = "en"): BestCategory[] {
  if (locale === "ar") {
    return seedBestCategories.map((b) => {
      const ar = arabicBestCategories[b.slug] || {};
      return { ...b, ...ar };
    });
  }
  return seedBestCategories;
}

export function getBestCategoryBySlug(slug: string, locale: string = "en"): BestCategory | undefined {
  const b = seedBestCategories.find((item) => item.slug === slug);
  if (!b) return undefined;
  if (locale === "ar") {
    const ar = arabicBestCategories[slug] || {};
    return { ...b, ...ar };
  }
  return b;
}

export function getComparisons(locale: string = "en"): Comparison[] {
  const approvedIds = seedProducts.filter((p) => p.affiliate_status === "approved").map((p) => p.id);
  const comparisons = seedComparisons.filter((c) => approvedIds.includes(c.product1_id) && approvedIds.includes(c.product2_id));

  if (locale === "ar") {
    return comparisons.map((c) => {
      const ar = arabicComparisons[c.slug] || {};
      return { ...c, ...ar };
    });
  }
  return comparisons;
}

export function getComparisonBySlug(slug: string, locale: string = "en"): Comparison | undefined {
  const c = seedComparisons.find((item) => item.slug === slug);
  if (!c) return undefined;
  const p1 = seedProducts.find((p) => p.id === c.product1_id);
  const p2 = seedProducts.find((p) => p.id === c.product2_id);
  if (!p1 || !p2 || p1.affiliate_status !== "approved" || p2.affiliate_status !== "approved") return undefined;

  if (locale === "ar") {
    const ar = arabicComparisons[slug] || {};
    return { ...c, ...ar };
  }
  return c;
}

export function getCampaigns(): Campaign[] {
  return seedCampaigns;
}

export function getCampaignBySlug(slug: string): Campaign | undefined {
  return seedCampaigns.find((c) => c.slug === slug);
}
