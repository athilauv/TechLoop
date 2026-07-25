import React from "react";
import { Inbox, ShieldCheck } from "lucide-react";

interface StatPillProps {
    label: string;
    value: string;
}

const StatPill: React.FC<StatPillProps> = ({ label, value }) => (
    <div className="bg-card border border-border rounded-xl px-4 py-2.5 text-right">
        <p className="text-[11px] font-mono text-muted">{label}</p>
        <p className="text-[16px] font-bold text-accent">{value}</p>
    </div>
);

interface StatCardProps {
    icon?: React.ElementType;
    value: string;
    label: string;
    progress?: number;
    dot?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
                                               icon: Icon,
                                               value,
                                               label,
                                               progress,
                                               dot,
                                           }) => (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-accent/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
            {Icon && (
                <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-accent" />
                </div>
            )}

            {dot && (
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            )}
        </div>

        <p className="text-[22px] font-extrabold text-white">
            {value}
        </p>

        <p className="text-[12px] text-secondary mt-1">
            {label}
        </p>

        {progress !== undefined && (
            <div className="w-full h-1.5 bg-bg rounded-full mt-3 overflow-hidden">
                <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>
        )}
    </div>
);

const LineChart: React.FC = () => (
    <svg
        viewBox="0 0 600 220"
        className="w-full h-full"
        preserveAspectRatio="none"
    >
        <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#17D4C3" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#17D4C3" stopOpacity="0" />
            </linearGradient>
        </defs>

        <path
            d="M0,150 C60,120 90,170 150,140 C210,110 240,160 300,130 C360,100 390,60 450,70 C510,80 550,40 600,20 L600,220 L0,220 Z"
            fill="url(#chartFill)"
        />

        <path
            d="M0,150 C60,120 90,170 150,140 C210,110 240,160 300,130 C360,100 390,60 450,70 C510,80 550,40 600,20"
            fill="none"
            stroke="#17D4C3"
            strokeWidth="2.5"
        />

        {[
            [150, 140],
            [300, 130],
            [450, 70],
        ].map(([x, y], index) => (
            <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#081423"
                stroke="#17D4C3"
                strokeWidth="2"
            />
        ))}
    </svg>
);

const Metrics: React.FC = () => {
    return (
        <section className="px-6 sm:px-10 lg:px-16 py-16 md:py-20 lg:py-24 bg-[#0A1930]/40 border-y border-border">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                    <div>
                        <span className="text-accent text-[11px] font-mono tracking-widest uppercase">
                            Platform Analytics
                        </span>

                        <h2 className="text-[26px] sm:text-[28px] font-bold text-white mt-2">
                            Community Mastery Metrics
                        </h2>

                        <p className="text-[13px] text-secondary mt-1 max-w-md">
                            Real-time performance analytics of the
                            CodeCommunity expert network.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <StatPill label="Avg. Velocity" value="98.4%" />
                        <StatPill label="Peer Confidence" value="9.8/10" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-[11px] font-mono tracking-wider text-secondary">
                                    TOTAL USER PROGRESS
                                </p>

                                <p className="text-[12px] text-muted">
                                    Global Skill Acquisition Index
                                </p>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-accent" />
                                <span className="w-2 h-2 rounded-full bg-muted" />
                            </div>
                        </div>

                        <div className="h-[180px] sm:h-[220px]">
                            <LineChart />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                        <StatCard
                            icon={Inbox}
                            value="124.5k"
                            label="Problems Solved"
                            progress={82}
                        />

                        <StatCard
                            icon={ShieldCheck}
                            value="48k"
                            label="Active Peer Reviews"
                            progress={55}
                        />

                        <StatCard
                            value="99.99%"
                            label="System Uptime"
                            dot
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Metrics;