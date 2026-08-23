import { motion } from "framer-motion";
import { Users, GraduationCap } from "lucide-react";
import SectionReveal from "./SectionReveal";

const PEERS = [
    { x: -70, y: -40 },
    { x: 70, y: -40 },
    { x: -90, y: 30 },
    { x: 90, y: 30 },
    { x: 0, y: 60 },
];

export default function CommunitySection() {
    return (
        <section className="relative overflow-hidden px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
                <SectionReveal>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#17D4C3]">
                        Community & mentorship
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-[#e8f0fe] sm:text-3xl lg:text-4xl">
                        Learning doesn't have to be isolated.
                    </h2>
                    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#8ca3bf]">
                        Discuss approaches with other developers on the same path, and
                        get 1:1 direction from mentors who've been through it — right
                        next to the content you're learning.
                    </p>

                    <div className="mt-8 flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-[#8ca3bf]">
                            <Users size={16} className="text-[#17D4C3]" />
                            Peer discussion
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#8ca3bf]">
                            <GraduationCap size={16} className="text-[#17D4C3]" />
                            Human mentors
                        </div>
                    </div>
                </SectionReveal>

                <SectionReveal delay={0.1} className="relative mx-auto h-64 w-64">
                    <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#17D4C3]/40 bg-gradient-to-br from-[#0f1e35] to-[#0d2b2a] text-xs font-semibold text-[#e8f0fe]">
                        You
                    </div>

                    <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                        {PEERS.map((p, i) => (
                            <line
                                key={i}
                                x1="50%"
                                y1="50%"
                                x2={`calc(50% + ${p.x}px)`}
                                y2={`calc(50% + ${p.y}px)`}
                                stroke="#203B5C"
                                strokeWidth="1"
                            />
                        ))}
                    </svg>

                    {PEERS.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="absolute flex h-10 w-10 items-center justify-center rounded-full border border-[#203B5C] bg-[#0f1e35]"
                            style={{
                                left: `calc(50% + ${p.x}px)`,
                                top: `calc(50% + ${p.y}px)`,
                                transform: "translate(-50%,-50%)",
                            }}
                        >
                            <Users size={14} className="text-[#8ca3bf]" />
                        </motion.div>
                    ))}
                </SectionReveal>
            </div>
        </section>
    );
}
