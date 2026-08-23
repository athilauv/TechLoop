import { motion, useReducedMotion } from "framer-motion";
import SectionReveal from "./SectionReveal";

const FRAGMENTS = [
    { label: "Learning site", x: "-34%", y: "-10%" },
    { label: "Practice tool", x: "30%", y: "-16%" },
    { label: "Coding judge", x: "-22%", y: "14%" },
    { label: "Forum / Discord", x: "34%", y: "10%" },
    { label: "Mentor booking", x: "0%", y: "-28%" },
];

export default function ProblemSection() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <section className="relative px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
            <div className="mx-auto max-w-4xl text-center">
                <SectionReveal>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#17D4C3]">
                        The problem
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-[#e8f0fe] sm:text-3xl lg:text-4xl">
                        Learn here. Practice there.
                        <br className="hidden sm:block" />
                        Ask somewhere else entirely.
                    </h2>
                </SectionReveal>

                <div className="relative mx-auto mt-16 h-64 max-w-md sm:h-72">
                    {FRAGMENTS.map((fragment, i) => (
                        <motion.div
                            key={fragment.label}
                            initial={{ opacity: 0, scale: 0.85 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className={`absolute left-1/2 top-1/2 rounded-xl border border-[#203B5C] bg-[#0f1e35] px-4 py-2.5 text-xs font-medium text-[#8ca3bf] ${
                                prefersReducedMotion
                                    ? ""
                                    : "animate-[techloop-drift_7s_ease-in-out_infinite]"
                            }`}
                            style={{
                                transform: `translate(calc(-50% + ${fragment.x}), calc(-50% + ${fragment.y}))`,
                                animationDelay: `${i * 0.5}s`,
                            }}
                        >
                            {fragment.label}
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#17D4C3]/40 bg-gradient-to-br from-[#0f1e35] to-[#0d2b2a] text-sm font-bold text-[#e8f0fe] shadow-[0_0_40px_rgba(23,212,195,0.15)]"
                    >
                        TL
                    </motion.div>
                </div>

                <SectionReveal delay={0.15}>
                    <p className="mt-14 text-lg font-semibold text-[#e8f0fe] sm:text-xl">
                        What if it all lived in one place?
                    </p>
                </SectionReveal>
            </div>
        </section>
    );
}
