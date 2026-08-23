import { Lightbulb, FilePlus2, Share2 } from "lucide-react";
import SectionReveal from "./SectionReveal";

const WAYS = [
    { label: "Suggest a topic", icon: Lightbulb },
    { label: "Submit a question", icon: FilePlus2 },
    { label: "Share knowledge", icon: Share2 },
];

export default function ContributionSection() {
    return (
        <section className="relative px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
            <div className="mx-auto max-w-3xl text-center">
                <SectionReveal>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#17D4C3]">
                        Contribute
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-[#e8f0fe] sm:text-3xl lg:text-4xl">
                        Don't just learn from the ecosystem.
                        <br className="hidden sm:block" />
                        Help build it.
                    </h2>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        {WAYS.map((way) => {
                            const Icon = way.icon;

                            return (
                                <span
                                    key={way.label}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#203B5C] px-4 py-2 text-xs font-medium text-[#8ca3bf]"
                                >
                                    <Icon size={14} className="text-[#17D4C3]" />
                                    {way.label}
                                </span>
                            );
                        })}
                    </div>
                </SectionReveal>
            </div>
        </section>
    );
}
