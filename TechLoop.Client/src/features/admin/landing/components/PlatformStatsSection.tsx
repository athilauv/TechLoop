import { Boxes, FileText, ListChecks, Users, Layers, MessagesSquare, type LucideIcon } from "lucide-react";
import { useScrollReveal} from "../../../../hooks/useScrollReveal.ts";
import { useCountUp } from "../../../../hooks/useCountUp.ts";
import type { PlatformStats } from "../../../../types/admin-landing.types.ts";

interface PlatformStatsSectionProps {
    stats: PlatformStats | null;
    isLoading: boolean;
}

interface StatDefinition {
    icon: LucideIcon;
    label: string;
    value: number | undefined;
}

const StatCard = ({
    icon: Icon,
    label,
    value,
    inView,
    delay,
}: StatDefinition & { inView: boolean; delay: number }) => {
    const animated = useCountUp(value ?? 0, inView && value !== undefined);

    return (
        <div
            style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
            className={`rounded-2xl border border-[#223A59] bg-[#12233B] p-5 transition-all duration-700 ease-out ${
                inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
        >
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#223A59] bg-[#101C30] text-[#00E8C2]">
                <Icon size={16} />
            </div>
            {value === undefined ? (
                <div className="h-8 w-16 animate-pulse rounded-md bg-[#101C30]" />
            ) : (
                <div className="text-2xl font-bold text-white sm:text-3xl">
                    {animated.toLocaleString()}
                    <span className="text-[#00E8C2]">+</span>
                </div>
            )}
            <div className="mt-1 text-xs font-medium text-[#8CA3BF]">{label}</div>
        </div>
    );
};

const PlatformStatsSection = ({ stats, isLoading }: PlatformStatsSectionProps) => {
    const { ref, inView } = useScrollReveal<HTMLDivElement>();

    const definitions: StatDefinition[] = [
        { icon: Boxes, label: "Technologies", value: stats?.technologiesCount },
        { icon: Layers, label: "Topics", value: stats?.topicsCount },
        { icon: ListChecks, label: "Coding Questions", value: stats?.questionsCount },
        { icon: FileText, label: "Published Content", value: stats?.publishedContentCount },
        { icon: MessagesSquare, label: "Active Discussions", value: stats?.activeDiscussionsCount },
        { icon: Users, label: "Users", value: stats?.usersCount },
    ];

    if (!isLoading && !stats) {
        // No backend data available yet — per the brief, we don't fabricate numbers.
        return null;
    }

    return (
        <section className="border-y border-[#223A59]/60 bg-[#0A0E17]/40 px-6 py-16 lg:px-10">
            <div ref={ref} className="mx-auto max-w-6xl">
                <div
                    className={`mb-8 transition-all duration-700 ease-out ${
                        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                >
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#00E8C2]">
                        Platform Statistics
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                        The ecosystem, by the numbers
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {definitions.map((definition, index) => (
                        <StatCard
                            key={definition.label}
                            {...definition}
                            inView={inView}
                            delay={index * 80}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlatformStatsSection;
