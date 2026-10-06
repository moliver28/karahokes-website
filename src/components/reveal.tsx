"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  once?: boolean;
};

/**
 * A small client wrapper that fades + slides its children up on view.
 * Used for subtle section-reveal animations throughout the page.
 * When the visitor prefers reduced motion, content renders without
 * movement (opacity-only, no slide) and transitions are near-instant.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  once = true,
  className,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{
        duration: reduce ? 0.15 : 0.6,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container: children fade in one after another.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  ...rest
}: HTMLMotionProps<"div"> & { stagger?: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: reduce ? 0 : stagger },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export const RevealItem = ({
  children,
  className,
  y = 16,
  ...rest
}: HTMLMotionProps<"div"> & { y?: number }) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : y },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: reduce ? 0.15 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
