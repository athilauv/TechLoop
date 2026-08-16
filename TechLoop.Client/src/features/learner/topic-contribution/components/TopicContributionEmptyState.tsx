import { ArrowRight, Lightbulb, Plus, Sparkles } from "lucide-react";

interface TopicContributionEmptyStateProps {
    onCreate: () => void;
}

export default function TopicContributionEmptyState({
                                                        onCreate,
                                                    }: TopicContributionEmptyStateProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-[#223A59] bg-[#14243C]">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#00E8C2]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#00E8C2]/5 blur-3xl" />

            <div className="relative flex flex-col items-center px-6 py-14 text-center sm:px-10 sm:py-16">
                {/* Icon */}
                <div className="relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0E192A] border border-[#223A59] shadow-lg">
                        <Lightbulb
                            size={34}
                            strokeWidth={1.8}
                            className="text-[#00E8C2]"
                        />
                    </div>

                    <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#14243C] bg-[#00E8C2]">
                        <Sparkles size={13} className="text-[#081423]" />
                    </div>
                </div>

                {/* Heading */}
                <h2 className="mt-7 text-xl font-semibold text-white sm:text-2xl">
                    Your ideas can improve TechLoop
                </h2>

                {/* Description */}
                <p className="mt-3 max-w-lg text-sm leading-6 text-[#8CA3BF] sm:text-base">
                    You haven't submitted any contributions yet. Share
                    something useful with the community and help other
                    developers learn faster.
                </p>

                {/* Contribution hints */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {["Topics", "Explanations", "Examples", "References"].map(
                        (label) => (
                            <span
                                key={label}
                                className="rounded-full border border-[#223A59] bg-[#101C30] px-3 py-1.5 text-xs font-medium text-[#8CA3BF]"
                            >
                                {label}
                            </span>
                        )
                    )}
                </div>

                {/* CTA */}
                <button
                    type="button"
                    onClick={onCreate}
                    className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-[#00E8C2] px-5 py-2.5 text-sm font-medium text-[#081423] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#00DDB9] hover:shadow-[0_8px_20px_-6px_rgba(0,232,194,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#14243C]"
                >
                    <Plus size={17} />
                    Start Contributing
                    <ArrowRight
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                </button>

                <p className="mt-3 text-xs text-[#5C7394]">
                    Every contribution goes through a mentor review.
                </p>
            </div>
        </div>
    );
}