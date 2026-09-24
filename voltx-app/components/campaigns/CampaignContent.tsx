"use client";

import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Button from "@/components/ui/Button";
import EmailGate from "@/components/gate/EmailGate";
import type { Campaign } from "@/lib/firebase/types";

interface CampaignContentProps {
  campaign: Campaign;
  locale: string;
}

export default function CampaignContent({ campaign, locale }: CampaignContentProps) {
  const [isGated, setIsGated] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkGate = async () => {
      try {
        const res = await fetch("/api/lead", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) setIsGated(false);
        }
      } catch {
        // Default to gated
      }
      setLoading(false);
    };
    checkGate();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <Container size="narrow">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </Container>
      </section>
    );
  }

  if (isGated) {
    return (
      <section className="py-16">
        <Container size="narrow">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h1 className="text-text-primary">{campaign.headline}</h1>
              <p className="mt-4 text-lg text-text-secondary">
                {campaign.body_content.substring(0, 200)}...
              </p>
            </div>
          </ScrollReveal>
          <EmailGate
            topicSlug={campaign.slug}
            pageType="campaign"
            source={campaign.source}
            onPass={() => setIsGated(false)}
          />
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16">
      <Container size="narrow">
        <ScrollReveal>
          <h1 className="text-text-primary">{campaign.headline}</h1>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed">
            {campaign.body_content}
          </p>
          <div className="mt-8">
            <Button size="lg" href={`/${locale}/diagnostic`}>
              {campaign.cta_text}
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
