import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SectionRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}


export default function SectionReveal({
                                          children,
                                          className = "",
                                          delay = 0,
                                      }: SectionRevealProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            initial={
                prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 28 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
