"use client";

import { useState } from "react";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { MarqueeDivider } from "@/components/home/MarqueeDivider";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Process } from "@/components/home/Process";
import { FinalCta } from "@/components/home/FinalCta";
import { ContactModal } from "@/components/ui/ContactModal";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics/track";

export default function HomeClient() {
  const [open, setOpen] = useState(false);
  const [presetService, setPresetService] = useState<string | null>(null);

  function openContact(serviceTitle?: string) {
    setPresetService(serviceTitle ?? null);
    setOpen(true);
    track(ANALYTICS_EVENTS.contactOpen, {
      source: serviceTitle ? "services" : "final_cta",
      service: serviceTitle,
    });
  }

  function closeContact() {
    setOpen(false);
    setPresetService(null);
  }

  return (
    <main style={{ background: "#f0f0ee" }}>
      <Hero onOpenContact={openContact} />
      <Services onOpenContact={openContact} />
      <MarqueeDivider />
      <FeaturedProjects />
      <Process />
      <FinalCta onOpenContact={openContact} />

      <ContactModal
        open={open}
        onClose={closeContact}
        presetService={presetService}
      />
    </main>
  );
}