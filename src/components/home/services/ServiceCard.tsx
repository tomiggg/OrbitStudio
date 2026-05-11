"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Service } from "@/lib/services";
import { Anton } from "next/font/google";

const font = Anton({ subsets: ["latin"], weight: "400" });

function TypingTag({ text, index }: { text: string; index: number }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    const startDelay = 1500 + (index * 2000); 
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i === text.length) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, index]);

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && displayedText.length > 0 && (
        <span className="animate-pulse">_</span>
      )}
    </span>
  );
}

type Props = {
  service: Service;
  index?: number;
};

export function ServiceCard({ service, index = 0 }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
      // Se eliminó 'border' y 'border-black/5'
      className="group flex h-full w-full max-w-[320px] md:max-w-none mx-auto flex-col bg-white p-2 md:p-2.5 shadow-xl"
    >
      {/* SECCIÓN SUPERIOR */}
      <div className="relative h-[100px] md:h-[110px] w-full shrink-0 overflow-hidden bg-[#fafcfc]">
        <span
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[#0abab5] transition-transform duration-700 group-hover:scale-105 ${font.className}`}
          style={{ 
            fontSize: "clamp(150px, 14vw, 180px)", 
            lineHeight: "1", 
            opacity: 0.15 
          }}
        >
          {service.number}
        </span>
      </div>

      {/* SECCIÓN INFERIOR */}
      <div 
        className="flex flex-grow flex-col p-4 md:p-5"
        style={{ 
          backgroundColor: "rgba(7, 43, 42, 0.95)", 
        }}
      >
        <h3 className="mb-2.5 text-[18px] md:text-[22px] font-black uppercase leading-[0.95] tracking-tighter text-white">
          {service.title}
        </h3>

        <div className="mb-3 h-px w-full bg-white/20" />

        <p className="text-[12px] font-mono font-medium leading-relaxed text-white/80">
          {service.description}
        </p>

        <div className="mt-auto pt-4 min-h-[24px]">
          <span className="font-mono text-[9px] md:text-[10px] font-bold tracking-[0.12em] text-[#0abab5] uppercase">
            [ <TypingTag text={service.model} index={index} /> ]
          </span>
        </div>
      </div>
    </motion.article>
  );
}