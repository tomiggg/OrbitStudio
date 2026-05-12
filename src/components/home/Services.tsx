"use client";

import { useEffect, useRef, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/lib/services";
import { ServiceCard } from "./services/ServiceCard";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

function TypeLine({ text, delayMs = 0 }: { text: string; delayMs?: number }) {
  const [displayed, setDisplayed] = useState("");
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let i = 0;
          const timeout = setTimeout(() => {
            const interval = setInterval(() => {
              setDisplayed(text.slice(0, i + 1));
              i++;
              if (i === text.length) clearInterval(interval);
            }, 38);
            return () => clearInterval(interval);
          }, delayMs);
          return () => clearTimeout(timeout);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, delayMs]);

  return <span ref={ref}>{displayed}</span>;
}

type ServicesProps = { onOpenContact?: (serviceTitle?: string) => void };

export function Services({ onOpenContact: _ }: ServicesProps = {}) {
  return (
    <section id="services" className="relative py-20 md:py-28" style={{ background: "#0ABAB5" }}>
      <Container>

        {/* HEADER BLOCK */}
        <div className="relative w-full mb-32">

          {/* Section label */}
          <p
            className="mb-5 uppercase"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              color: "rgba(0,0,0,0.5)",
              letterSpacing: "0.18em",
            }}
          >
            // LO QUE OFRECEMOS
          </p>

          <h2
            className={plusJakarta.className}
            style={{
              fontSize: "clamp(56px, 8vw, 120px)",
              color: "#000",
              lineHeight: "0.85",
              textTransform: "none",
              letterSpacing: "-0.03em",
              paddingBottom: "24px",
            }}
          >
            servicios.
          </h2>

          <p
            className="hidden md:block absolute right-0 text-right"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "rgba(0,0,0,0.4)",
              lineHeight: "1.7",
              minWidth: "200px",
            }}
          >
            <TypeLine text="Lo que tu idea necesita" delayMs={200} />
            <br />
            <TypeLine text="para ser realidad." delayMs={1000} />
          </p>
        </div>

        {/* ACCORDION LIST */}
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.15)" }}>
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

      </Container>
    </section>
  );
}
