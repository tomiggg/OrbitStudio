"use client";

import type { Service } from "@/lib/services";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ServiceDetailsMobileFlip } from "./ServiceDetailsMobileFlip";
import { ServiceDetailsDesktop } from "./ServiceDetailsDesktop";

type Props = {
  service: Service;
  onClose: () => void;
  onChoose: (title: string) => void;
};

export function ServiceDetails({ service, onClose, onChoose }: Props) {
  // ✅ scroll confiable cuando cambia el servicio
  useEffect(() => {
    const el = document.getElementById("service-details");
    if (!el) return;

    const headerOffset = 96;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }, [service.id]);

  return (
    <motion.div
      key={service.id}
      id="service-details"
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "mx-auto mt-10 max-w-6xl overflow-hidden rounded-2xl",
        "relative scroll-mt-24",
        "border border-white/25",
        "bg-white/25 backdrop-blur-2xl",
        "shadow-[0_26px_80px_rgba(0,0,0,0.14)]",
      ].join(" ")}
    >
      {/* sheen suave */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 18% 0%, rgba(10,186,181,0.18), transparent 42%)",
        }}
      />

      {/* Mobile flip */}
      <div className="relative md:hidden">
        <ServiceDetailsMobileFlip
          service={service}
          onClose={onClose}
          onChoose={onChoose}
        />
      </div>

      {/* Desktop normal */}
      <div className="relative hidden md:block">
        <ServiceDetailsDesktop
          service={service}
          onClose={onClose}
          onChoose={onChoose}
        />
      </div>
    </motion.div>
  );
}