import { motion } from "framer-motion";
import { Sparkles, MessageSquare, GraduationCap } from "lucide-react";
import SectionReveal from "./SectionReveal";

const PATHS = [
    { label: "Ask AI", icon: Sparkles },
    { label: "Ask the community", icon: MessageSquare },
    { label: "Talk to a mentor", icon: GraduationCap },
];

export default function AIAndMentorSection() {
    return (
        <section className="relative px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
            <div className="mx-auto max-w-3xl text-center">
                <SectionReveal>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#17D4C3]">
                        AI + human help
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-[#e8f0fe] sm:text-3xl lg:text-4xl">
                        Stuck?
                    </h2>
                </SectionReveal>

                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
                    {PATHS.map((path, i) => {
                        const Icon = path.icon;

                        return (
                            <motion.div
                                key={path.label}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.6 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="flex flex-col items-center gap-3 rounded-2xl border border-[#203B5C] bg-[#0f1e35] px-5 py-8"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#17D4C3]/10">
                                    <Icon size={20} className="text-[#17D4C3]" />
                                </div>
                                <span className="text-sm font-semibold text-[#e8f0fe]">
                                    {path.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>

                <SectionReveal delay={0.3}>
                    <p className="mt-12 text-[15px] text-[#8ca3bf]">
                        Whichever path you take, you never leave the flow you were in.
                    </p>
                </SectionReveal>
            </div>
        </section>
    );
}
