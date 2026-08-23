import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { BookOpen, Target, Code2, MessageSquare, Sparkles } from "lucide-react";
import SectionReveal from "./SectionReveal";

const STEPS = [
    { label: "Learn", icon: BookOpen },
    { label: "Practice", icon: Target },
    { label: "Code", icon: Code2 },
    { label: "Discuss", icon: MessageSquare },
    { label: "Improve", icon: Sparkles },
];

export default function JourneySection() {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.8", "end 0.4"],
    });

    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <section className="relative px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
            <div className="mx-auto max-w-4xl text-center">
                <SectionReveal>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#17D4C3]">
                        The journey
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-[#e8f0fe] sm:text-3xl lg:text-4xl">
                        A path, not a pile of tabs.
                    </h2>
                </SectionReveal>
            </div>

            <div ref={containerRef} className="relative mx-auto mt-20 max-w-4xl">
                {/* connecting line */}
                <svg
                    viewBox="0 0 1000 60"
                    preserveAspectRatio="none"
                    className="absolute left-0 top-1/2 hidden w-full -translate-y-1/2 sm:block"
                    style={{ height: 4 }}
                    aria-hidden="true"
                >
                    <line
                        x1="40"
                        y1="30"
                        x2="960"
                        y2="30"
                        stroke="#203B5C"
                        strokeWidth="2"
                    />
                    <motion.line
                        x1="40"
                        y1="30"
                        x2="960"
                        y2="30"
                        stroke="#17D4C3"
                        strokeWidth="2"
                        style={
                            prefersReducedMotion
                                ? undefined
                                : { pathLength }
                        }
                        strokeDasharray={prefersReducedMotion ? undefined : "1"}
                    />
                </svg>

                <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-5 sm:gap-4">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon;

                        return (
                            <motion.div
                                key={step.label}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.6 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="flex flex-col items-center gap-3 text-center"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#203B5C] bg-[#0f1e35]">
                                    <Icon size={22} className="text-[#17D4C3]" />
                                </div>
                                <span className="text-sm font-semibold text-[#e8f0fe]">
                                    {step.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
