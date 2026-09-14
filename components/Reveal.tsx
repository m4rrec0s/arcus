"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Entrada suave ao rolar. Sem branch de render (SSR e cliente idênticos):
 * o respeito a `prefers-reduced-motion` vem do <MotionConfig reducedMotion="user">
 * no SmoothScroll — nunca de `if` aqui, que quebra hidratação.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
