"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Project = {
  id: string;
  title: string;
  description: string;
  href: string; // ahora: ruta interna (/proyectos/slug)
  hrefLabel?: string; // ej: "Ver caso"
  serviceTag?: string;
  imageSrc?: string;
};

type Props = {
  project: Project;
  index?: number;
};

export function ProjectCard({ project: p, index = 0 }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.65,
        delay: 0.08 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -10, rotate: -0.2 }}
      whileTap={{ scale: 0.99 }}
      className={[
        "group relative flex flex-col justify-between",
        "rounded-2xl",
        "bg-white/55 sm:bg-white/28",
        "backdrop-blur-xl sm:backdrop-blur-2xl",
        "shadow-[0_16px_45px_rgba(0,0,0,0.10)]",
        "transition-shadow",
        "hover:shadow-[0_28px_78px_rgba(0,0,0,0.16)]",
        "px-6 py-6",
        "md:px-7 md:py-7",
        "min-h-[280px] md:min-h-[340px]",
      ].join(" ")}
    >
      {/* sheen hover */}
      <span
        aria-hidden
        className={[
          "pointer-events-none absolute inset-0 rounded-2xl",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          "bg-[radial-gradient(900px_circle_at_20%_0%,rgba(10,186,181,0.22),transparent_45%)]",
        ].join(" ")}
      />

      {/* preview visual */}
      <div className="relative">
        <div
          className={[
            "relative overflow-hidden rounded-xl",
            "bg-white/[0.08]",
            "h-[88px] md:h-[96px]",
          ].join(" ")}
        >
          {/* glow suave */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(600px_circle_at_20%_0%,rgba(255,255,255,0.65),transparent_55%)]" />

          {/* fondo decorativo */}
          <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_30%_20%,rgba(10,186,181,0.18),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(7,43,42,0.06),transparent_60%)]" />

          {/* líneas pro */}
          <div className="absolute left-4 top-4 h-[1px] w-16 bg-[#072b2a]/15" />
          <div className="absolute left-4 top-7 h-[1px] w-10 bg-[#0ABAB5]/25" />

          {p.imageSrc ? (
            <img
              src={p.imageSrc}
              alt={`Preview ${p.title}`}
              className="relative h-full w-full object-cover opacity-90"
              loading="lazy"
            />
          ) : null}
        </div>

        {/* título + tag */}
        <div className="mt-5 flex items-start justify-between gap-4">
          <h3 className="text-lg font-extrabold tracking-[-0.03em] text-[#072b2a]">
            {p.title}
          </h3>

          {p.serviceTag && (
            <span
              className={[
                "inline-flex items-center whitespace-nowrap rounded-full",
                "bg-white/70 sm:bg-white/22",
                "px-3 py-1 text-[11px] font-semibold text-[#072b2a]/80",
              ].join(" ")}
            >
              {p.serviceTag}
            </span>
          )}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[#072b2a]/70">
          {p.description}
        </p>
      </div>


{/* CTA */}
<div className="mt-7 relative">
  <Link
    href={p.href} // ahora p.href es "/proyectos/..."
    className={[
      "inline-flex items-center gap-2",
      "text-sm font-semibold",
      "text-[#072b2a]/70 transition",
      "group-hover:text-[#072b2a]",
    ].join(" ")}
  >
    {p.hrefLabel ?? "Ver caso"}
    <span className="h-[1px] w-6 bg-[#072b2a]/25 transition-all group-hover:w-10 group-hover:bg-[#0ABAB5]" />
  </Link>
</div>
    </motion.article>
  );
}