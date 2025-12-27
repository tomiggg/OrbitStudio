"use client";

import type { Service } from "@/lib/services";
import { motion } from "framer-motion";

type Props = {
  services: Service[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function ServicesCarousel({ services, selectedId, onSelect }: Props) {
  return (
    <div className="mx-auto w-full max-w-[1280px]">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {services.map((s, i) => {
          const active = s.id === selectedId;

          const highlights = Array.isArray((s as any).highlights)
            ? ((s as any).highlights as string[]).slice(0, 3)
            : [];

          return (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: 0.08 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={[
                "group",
                "w-full md:flex-1 min-w-0",
                "text-left rounded-xl",
                "h-[360px] md:h-[380px]",
                "p-10 flex flex-col",
                "border border-white/25",
                "bg-white/30 backdrop-blur-2xl",
                "shadow-[0_18px_50px_rgba(0,0,0,0.12)]",
                "transition-shadow",
                active
                  ? "bg-white/55 border-black/15 shadow-[0_22px_60px_rgba(0,0,0,0.16)]"
                  : "hover:bg-white/42 hover:shadow-[0_22px_60px_rgba(0,0,0,0.14)]",
              ].join(" ")}
            >
              <div>
                <p className="text-xl font-extrabold tracking-[-0.02em] text-[#072b2a]">
                  {s.title}
                </p>

                {"priceFrom" in s && (
                  <div className="mt-3 text-sm font-semibold text-[#0ABAB5]">
                    Desde {(s as any).priceFrom}
                  </div>
                )}

                {"idealFor" in s && (
                  <p className="mt-3 text-sm leading-relaxed text-[#072b2a]/70">
                    <span className="font-semibold text-[#072b2a]">Ideal para:</span>{" "}
                    {(s as any).idealFor}
                  </p>
                )}

                <div className="mt-5 h-[84px]">
                  {highlights.length > 0 && (
                    <ul className="space-y-2 text-sm text-[#072b2a]/70">
                      {highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0ABAB5]" />
                          <span className="line-clamp-1">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* CTA minimal pro */}
              <div className="mt-auto pt-8">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#072b2a]/70 transition group-hover:text-[#072b2a]">
                  Ver más
                  <span className="h-[1px] w-6 bg-[#072b2a]/25 transition-all group-hover:w-10 group-hover:bg-[#0ABAB5]" />
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}