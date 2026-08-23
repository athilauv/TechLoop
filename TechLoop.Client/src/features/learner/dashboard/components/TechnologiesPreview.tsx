import { ArrowRight, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { useTechnologies } from "../../../learner/technology-category/hooks/useTechnology.ts";
import TechCard from "../../../learner/technology-category/components/TechCard.tsx";

const PREVIEW_COUNT = 4;

export default function TechnologiesPreview() {
    const { data, isLoading } = useTechnologies();
    const technologies = (data ?? []).slice(0, PREVIEW_COUNT);

    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Layers size={18} className="text-[#17D4C3]" />

                    <div>
                        <h2 className="text-sm font-semibold text-[#e8f0fe]">
                            Technologies
                        </h2>

                        <p className="mt-1 text-xs text-[#5f7898]">
                            Explore what you can learn on TechLoop
                        </p>
                    </div>
                </div>

                <Link
                    to="/learner/learning"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#17D4C3] hover:underline"
                >
                    View all
                    <ArrowRight size={13} />
                </Link>
            </div>

            {isLoading ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-48 animate-pulse rounded-2xl border border-[#1e3254] bg-[#0c1a2e]"
                        />
                    ))}
                </div>
            ) : technologies.length === 0 ? (
                <div className="mt-5 rounded-xl border border-[#1e3254] bg-[#0c1a2e] px-5 py-8 text-center">
                    <p className="text-sm text-[#7a99bb]">
                        No technologies published yet.
                    </p>
                </div>
            ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {technologies.map((technology, index) => (
                        <TechCard
                            key={technology.id}
                            technology={technology}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
