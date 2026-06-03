"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const cinematicEase = [0.83, 0, 0.17, 1] as const;

export function Loader() {
  const [isVisible, setIsVisible] = useState(true);
  const [showMark, setShowMark] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const revealMarkTimer = window.setTimeout(() => setShowMark(true), shouldReduceMotion ? 20 : 230);
    const exitTimer = window.setTimeout(() => setIsVisible(false), shouldReduceMotion ? 560 : 2220);

    return () => {
      window.clearTimeout(revealMarkTimer);
      window.clearTimeout(exitTimer);
    };
  }, [shouldReduceMotion]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="fixed inset-0 z-[9999] grid h-[100svh] w-screen place-items-center overflow-hidden bg-[var(--page)] text-[var(--ink)]"
          role="status"
          aria-label="Loading YS Photography portfolio"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: shouldReduceMotion ? 0.18 : 1.02, ease: cinematicEase }}
        >
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(180deg,var(--page),#e7e8df)]"
            exit={{
              scaleY: shouldReduceMotion ? 1 : 1.025,
              filter: shouldReduceMotion ? "none" : "blur(4px)"
            }}
            transition={{ duration: shouldReduceMotion ? 0.18 : 1.02, ease: cinematicEase }}
          />

          <AnimatePresence>
            {showMark ? (
              <motion.p
                className="relative flex items-center text-[clamp(76px,12vw,220px)] font-extrabold leading-none tracking-[-0.105em]"
                aria-hidden="true"
                exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.018 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {["Y", "S"].map((letter, index) => (
                  <span key={letter} className="block overflow-hidden">
                    <motion.span
                      className="block"
                      initial={{
                        clipPath: "inset(0% 100% 0% 0%)",
                        y: shouldReduceMotion ? 0 : "18%",
                        opacity: 0
                      }}
                      animate={{
                        clipPath: "inset(0% 0% 0% 0%)",
                        y: "0%",
                        opacity: 1
                      }}
                      transition={{
                        duration: shouldReduceMotion ? 0.01 : index === 0 ? 1.04 : 0.88,
                        delay: shouldReduceMotion ? 0 : index === 0 ? 0.04 : 0.2,
                        ease: cinematicEase
                      }}
                    >
                      {letter}
                    </motion.span>
                  </span>
                ))}
                <span className="sr-only">YS</span>
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
