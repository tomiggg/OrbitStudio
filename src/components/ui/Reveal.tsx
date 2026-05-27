"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
};

export function Reveal({ children, delay = 0, duration = 0.7, y = 24 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
