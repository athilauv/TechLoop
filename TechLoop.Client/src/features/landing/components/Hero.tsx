import React from "react";

const Hero: React.FC = () => {
    return (
        <section className="px-6 sm:px-10 lg:px-16 py-16 md:py-20 lg:py-24">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                    <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-accent border border-accent/30 rounded-md px-3 py-1.5 mb-6">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
                        </span>
                        PRODUCTION GRADE ENVIRONMENT
                    </span>

                    <h1 className="text-[34px] sm:text-[40px] lg:text-[46px] leading-[1.12] tracking-tight font-extrabold text-white mb-5">
                        Accelerate Your
                        <br />
                        Engineering Career
                    </h1>

                    <p className="text-[15px] sm:text-[16px] text-secondary leading-relaxed max-w-md mb-8">
                        Master production-level SQL, distributed systems security, and
                        high-performance infrastructure through peer-validated engineering
                        challenges.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
                        <button className="w-full sm:w-auto bg-white text-bg text-[14px] font-semibold px-6 py-3 rounded-xl hover:opacity-90 active:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
                            Get Started
                        </button>

                        <button className="w-full sm:w-auto border border-accent text-accent text-[14px] font-semibold px-6 py-3 rounded-xl hover:bg-accent/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
                            View Roadmap
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-mono tracking-wider text-muted border-t border-border pt-5">
                        <span>500K+ ENGINEERS TRAINED</span>
                        <span className="hidden sm:inline text-border">|</span>
                        <span>SOC2 COMPLIANT</span>
                        <span className="hidden sm:inline text-border">|</span>
                        <span>99.99% UPTIME</span>
                    </div>
                </div>

                <div className="relative rounded-2xl border border-border bg-card p-8 sm:p-10 flex items-center justify-center overflow-hidden min-h-[280px]">
                    <div className="absolute w-64 h-64 rounded-full bg-accent/10 blur-3xl" />

                    <svg viewBox="0 0 200 140" className="relative w-full max-w-sm">
                        <rect x="10" y="10" width="180" height="110" rx="8" fill="#081423" stroke="#203B5C" strokeWidth="1.5"/>

                        <circle cx="100" cy="65" r="26" fill="none" stroke="#17D4C3" strokeWidth="2" opacity="0.6"/>

                        <path d="M85 68 q0 -14 14 -14 q3 -8 12 -8 q11 0 12 11 q9 1 9 10 q0 9 -9 9 h-30 q-8 0 -8 -8z" fill="#0F3A38" stroke="#17D4C3" strokeWidth="1.6"/>

                        {[
                            [35, 30],
                            [165, 30],
                            [30, 100],
                            [170, 100],
                            [100, 20],
                        ].map(([x, y], i) => (
                            <g key={i}>
                                <circle cx={x} cy={y} r="6" fill="#10233E" stroke="#17D4C3" strokeWidth="1.2"/>
                                <line x1={x} y1={y} x2={100} y2={65} stroke="#203B5C" strokeWidth="1" strokeDasharray="2 2"/>
                            </g>
                        ))}

                        <rect x="20" y="122" width="160" height="8" rx="2" fill="#10233E" stroke="#203B5C"/>
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default Hero;