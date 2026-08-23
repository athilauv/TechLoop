import { useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import SectionReveal from "./SectionReveal";

export default function FinalCTA() {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);

    const glowX = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 });
    const glowY = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 });

    const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
        if (prefersReducedMotion || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        glowX.set(e.clientX - rect.left);
        glowY.set(e.clientY - rect.top);
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative overflow-hidden px-6 py-28 text-center sm:px-10 sm:py-36 lg:px-16"
        >
            {!prefersReducedMotion && (
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-[#17D4C3]/10 blur-[100px]"
                    style={{
                        left: glowX,
                        top: glowY,
                        translateX: "-50%",
                        translateY: "-50%",
                    }}
                />
            )}

            <SectionReveal className="relative mx-auto max-w-2xl">
                <h2 className="text-3xl font-bold text-[#e8f0fe] sm:text-4xl lg:text-5xl">
                    Your developer journey starts here.
                </h2>

                <Link
                    to="/learner/dashboard"
                    className="group mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-[#17D4C3] px-8 py-4 text-sm font-semibold text-[#081423] transition hover:brightness-105"
                >
                    Enter TechLoop
                    <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                    />
                </Link>
            </SectionReveal>
        </section>
    );
}
