import { notFound } from "next/navigation";
import { getCampaigns, getCampaignBySlug } from "@/lib/firebase/seed";
import CampaignContent from "@/components/campaigns/CampaignContent";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const campaigns = getCampaigns();
  return campaigns.map((c) => ({ slug: c.slug }));
}

export default async function CampaignPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const campaign = getCampaignBySlug(slug);
  if (!campaign) notFound();

  return <CampaignContent campaign={campaign} locale={locale} />;
}
