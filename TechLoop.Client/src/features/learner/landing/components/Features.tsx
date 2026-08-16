import React from "react";
import {
    Database,
    Shield,
    Network,
} from "lucide-react";

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
                                                     icon: Icon,
                                                     title,
                                                     description,
                                                 }) => (
    <div className="bg-card border border-border rounded-2xl p-6 hover:border-accent/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 transition-all duration-300">
        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-5">
            <Icon className="w-[18px] h-[18px] text-accent" />
        </div>

        <h3 className="text-[17px] font-bold text-white mb-2 leading-snug">
            {title}
        </h3>

        <p className="text-[13px] text-secondary leading-relaxed">
            {description}
        </p>
    </div>
);

const FEATURES: FeatureCardProps[] = [
    {
        icon: Database,
        title: "Advanced SQL Engine",
        description:
            "Query optimization benchmarks on multi-terabyte datasets inside production-grade sandbox environments.",
    },
    {
        icon: Shield,
        title: "Secure Systems Architecture",
        description:
            "Practice secure software engineering using real-world security scenarios and infrastructure challenges.",
    },
    {
        icon: Network,
        title: "Distributed Infrastructure",
        description:
            "Build and scale distributed applications, microservices, caching strategies, and event-driven systems.",
    },
];

const Features: React.FC = () => {
    return (
        <section className="px-6 sm:px-10 lg:px-16 py-16 md:py-20 lg:py-24">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 max-w-2xl">
                    <span className="text-accent text-[11px] font-mono tracking-widest uppercase">
                        Features
                    </span>

                    <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-white mt-3 leading-tight">
                        Everything You Need to Become
                        <br className="hidden sm:block" />
                        a Better Software Engineer
                    </h2>

                    <p className="text-secondary mt-4 text-[15px] leading-relaxed">
                        Learn modern backend development, distributed systems,
                        cloud architecture, databases, security, AI-assisted
                        development, and production engineering through an
                        interactive learning experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((feature) => (
                        <FeatureCard
                            key={feature.title}
                            {...feature}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;