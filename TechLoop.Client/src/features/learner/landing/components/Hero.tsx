import { useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useReducedMotion,
} from "framer-motion";
import EcosystemGraph from "./EcosystemGraph";

export default function Hero() {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { stiffness: 120, damping: 20, mass: 0.6 };
    const rotateX = useSpring(
        useTransform(mouseY, [-0.5, 0.5], [6, -6]),
        springConfig
    );
    const rotateY = useSpring(
        useTransform(mouseX, [-0.5, 0.5], [-6, 6]),
        springConfig
    );

    const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
        if (prefersReducedMotion || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative overflow-hidden px-6 pb-20 pt-24 sm:px-10 sm:pt-28 lg:px-16 lg:pt-32"
        >
            {/* ambient background glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#17D4C3]/10 blur-[120px]"
            />

            <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
                <div>
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 rounded-full border border-[#17D4C3]/30 px-3 py-1.5 text-[11px] font-mono tracking-widest text-[#17D4C3]"
                    >
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#17D4C3] opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#17D4C3]" />
                        </span>
                        THE DEVELOPER ECOSYSTEM
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="mt-6 text-[36px] font-extrabold leading-[1.1] tracking-tight text-[#e8f0fe] sm:text-[46px] lg:text-[52px]"
                    >
                        One place to build your
                        <br />
                        entire developer journey.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mt-6 max-w-md text-[15px] leading-relaxed text-[#8ca3bf] sm:text-base"
                    >
                        Learn technologies, practice with real questions, solve coding
                        challenges, and get unstuck with AI, mentors, and a community —
                        without leaving TechLoop.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
                    >
                        <MagneticLink
                            to="/learner/dashboard"
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#17D4C3] px-6 py-3.5 text-sm font-semibold text-[#081423] transition hover:brightness-105"
                        >
                            Enter TechLoop
                            <ArrowRight
                                size={16}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </MagneticLink>

                        <a
                            href="#ecosystem"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#203B5C] px-6 py-3.5 text-sm font-semibold text-[#e8f0fe] transition hover:border-[#17D4C3]/40 hover:text-[#17D4C3]"
                        >
                            See how it works
                        </a>
                    </motion.div>
                </div>

                <motion.div
                    style={
                        prefersReducedMotion
                            ? undefined
                            : { rotateX, rotateY, transformPerspective: 900 }
                    }
                    className="mx-auto flex items-center justify-center"
                >
                    <EcosystemGraph size={380} />
                </motion.div>
            </div>
        </section>
    );
}

function MagneticLink({
                          to,
                          children,
                          className,
                      }: {
    to: string;
    children: React.ReactNode;
    className?: string;
}) {
    const prefersReducedMotion = useReducedMotion();
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useSpring(0, { stiffness: 200, damping: 18 });
    const y = useSpring(0, { stiffness: 200, damping: 18 });

    const handleMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
        if (prefersReducedMotion || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
    };

    const handleLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div style={{ x, y }} className="inline-block">
            <Link
                ref={ref}
                to={to}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                className={className}
            >
                {children}
            </Link>
        </motion.div>
    );
}
