"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Anton } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400" });

type Project = {
  id: string;
  title: string;
  description: string;
  href: string;
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
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.99 }}
      className="group relative flex flex-col bg-white shadow-xl overflow-hidden"
    >
      {/* Imagen — más baja */}
      <div className="relative h-[140px] md:h-[160px] overflow-hidden bg-[#f5fafa]">
        {p.imageSrc ? (
          <img
            src={p.imageSrc}
            alt={`Preview ${p.title}`}
            className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(10,186,181,0.12),transparent_60%)]" />
        )}
      </div>

      {/* Contenido */}
      <div
        className="flex flex-grow flex-col pb-4 px-4 md:pb-5 md:px-5"
        style={{ backgroundColor: "rgba(7,43,42,0.95)" }}
      >
        <h3
          className={`${anton.className} mb-4 uppercase text-white leading-[0.95]`}
          style={{
            fontSize: "clamp(22px, 2.2vw, 26px)",
            letterSpacing: "-0.02em",
            paddingTop: "1.25rem",
          }}
        >
          {p.title}
        </h3>

        <div className="mb-4 h-px w-full bg-white/15" />

        <p className="flex-1 font-mono text-[11px] font-medium leading-relaxed text-white">
          {p.description}
        </p>

        <div className="mt-5">
          <Link
            href={p.href}
            className="group/link inline-flex items-center gap-3 font-mono text-[10px] font-bold tracking-[0.15em] text-[#0abab5] uppercase transition hover:text-white"
          >
            [ VER CASO ]
            <span className="h-[1px] w-5 bg-[#0abab5]/40 transition-all group-hover/link:w-8 group-hover/link:bg-[#0abab5]" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}