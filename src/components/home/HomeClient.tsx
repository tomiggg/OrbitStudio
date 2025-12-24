"use client";

import { useState } from "react";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Process } from "@/components/home/Process";
import { FinalCta } from "@/components/home/FinalCta";
import { ContactModal } from "@/components/ui/ContactModal";

export default function HomeClient() {
  const [open, setOpen] = useState(false);
  const [presetService, setPresetService] = useState<string | null>(null);

  function openContact(serviceTitle?: string) {
    setPresetService(serviceTitle ?? null);
    setOpen(true);
  }

  function closeContact() {
    setOpen(false);
    setPresetService(null);
  }

  return (
    <main>
      <Hero onOpenContact={openContact} />
      <Services onOpenContact={openContact} />
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