import { useId, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ECOSYSTEM_NODES } from "../data/EcosystemNodes.ts";

interface EcosystemGraphProps {
    size?: number;
    interactive?: boolean;
    className?: string;
}

function pointOnCircle(angleDeg: number, radius: number) {
   const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
        x: radius * Math.cos(rad),
        y: radius * Math.sin(rad),
    };
}

export default function EcosystemGraph({
                                           size = 420,
                                           interactive = false,
                                           className = "",
                                       }: EcosystemGraphProps) {
    const prefersReducedMotion = useReducedMotion();
    const [activeId, setActiveId] = useState<string | null>(null);
    const gradientId = useId();

    const center = size / 2;
    const orbitRadius = size * 0.38;
    const nodeSize = interactive ? 56 : 34;

    return (
        <div
            className={`relative ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Connecting lines */}
            <svg
                viewBox={`0 0 ${size} ${size}`}
                width={size}
                height={size}
                className="absolute inset-0"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#17D4C3" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#17D4C3" stopOpacity="0.05" />
                    </linearGradient>
                </defs>

                {/* faint orbit ring */}
                <circle
                    cx={center}
                    cy={center}
                    r={orbitRadius}
                    fill="none"
                    stroke="#203B5C"
                    strokeWidth={1}
                    strokeDasharray="2 6"
                />

                {ECOSYSTEM_NODES.map((node) => {
                    const { x, y } = pointOnCircle(node.angle, orbitRadius);
                    const isActive = activeId === node.id;

                    return (
                        <line
                            key={node.id}
                            x1={center}
                            y1={center}
                            x2={center + x}
                            y2={center + y}
                            stroke={isActive ? "#17D4C3" : `url(#${gradientId})`}
                            strokeWidth={isActive ? 1.75 : 1}
                            className="transition-[stroke-width] duration-300"
                        />
                    );
                })}
            </svg>

            {/* Central TechLoop node */}
            <div
                className="absolute flex items-center justify-center rounded-full border border-[#17D4C3]/40 bg-gradient-to-br from-[#0f1e35] to-[#0d2b2a] shadow-[0_0_40px_rgba(23,212,195,0.15)]"
                style={{
                    width: interactive ? 96 : 64,
                    height: interactive ? 96 : 64,
                    left: center,
                    top: center,
                    transform: "translate(-50%,-50%)",
                }}
            >
                <span
                    className="font-bold tracking-tight text-[#e8f0fe]"
                    style={{ fontSize: interactive ? 15 : 11 }}
                >
                    TL
                </span>
                {!prefersReducedMotion && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-[#17D4C3]/10 animate-[techloop-pulse_3.6s_ease-in-out_infinite]" />
                )}
            </div>

            {/* Orbit nodes */}
            {ECOSYSTEM_NODES.map((node, i) => {
                const { x, y } = pointOnCircle(node.angle, orbitRadius);
                const Icon = node.icon;
                const isActive = activeId === node.id;

                return (
                    <motion.button
                        key={node.id}
                        type="button"
                        disabled={!interactive}
                        onMouseEnter={() => interactive && setActiveId(node.id)}
                        onMouseLeave={() => interactive && setActiveId(null)}
                        onFocus={() => interactive && setActiveId(node.id)}
                        onBlur={() => interactive && setActiveId(null)}
                        initial={{ opacity: 0, scale: 0.6 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{duration: 0.5,
                            delay: prefersReducedMotion ? 0 : i * 0.06,
                        }}
                        whileHover={interactive ? { scale: 1.08 } : undefined}
                        className={`absolute flex flex-col items-center justify-center rounded-full border transition-colors duration-300 ${
                            interactive ? "cursor-pointer" : "cursor-default"
                        } ${isActive ? "border-[#17D4C3] bg-[#0d2b2a]" : "border-[#203B5C] bg-[#0f1e35]"} ${
                            !interactive && !prefersReducedMotion ? "animate-[techloop-float_6s_ease-in-out_infinite]" : ""}`}
                        style={{
                            width: nodeSize,
                            height: nodeSize,
                            left: center + x,
                            top: center + y,
                            transform: "translate(-50%,-50%)",
                            animationDelay: `${i * 0.4}s`,
                        }}
                        aria-label={`${node.label}: ${node.description}`}>
                        <Icon
                            size={interactive ? 20 : 14}
                            className={isActive ? "text-[#17D4C3]" : "text-[#8ca3bf]"}/>
                        {interactive && (
                            <span
                                className={`mt-1 text-[10px] font-medium ${
                                    isActive ? "text-[#17D4C3]" : "text-[#8ca3bf]"
                                }`}
                            >
                                {node.label}
                            </span>
                        )}
                    </motion.button>
                );
            })}

            {/* Expanded description bubble (interactive mode only) */}
            {interactive && (
                <AnimatePresence>
                    {activeId && (
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.18 }}
                            className="absolute left-1/2 top-full mt-4 w-64 -translate-x-1/2 rounded-xl border border-[#203B5C] bg-[#0f1e35] px-4 py-3 text-center shadow-lg"
                        >
                            <p className="text-xs font-semibold text-[#e8f0fe]">
                                {ECOSYSTEM_NODES.find((n) => n.id === activeId)?.label}
                            </p>
                            <p className="mt-1 text-[11px] leading-relaxed text-[#8ca3bf]">
                                {ECOSYSTEM_NODES.find((n) => n.id === activeId)?.description}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
