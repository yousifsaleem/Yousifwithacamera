"use client";

import { motion, useReducedMotion } from "framer-motion";

const cinematicEase = [0.83, 0, 0.17, 1] as const;

export function PageReveal() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[9998] h-[100svh] w-screen bg-[var(--page)]"
      aria-hidden="true"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.86,
        ease: cinematicEase
      }}
    />
  );
}
