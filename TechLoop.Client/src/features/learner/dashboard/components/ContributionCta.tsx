import { ArrowRight, FilePlus2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ContributionCta() {
    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#17D4C3]/15">
                    <FilePlus2 size={16} className="text-[#17D4C3]" />
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold text-[#e8f0fe]">
                        Can't find what you're looking for?
                    </h2>

                    <p className="mt-1 text-xs text-[#5f7898]">
                        Help improve TechLoop by suggesting a topic or piece of
                        content.
                    </p>

                    <Link
                        to="/learner/topic-contributions/new"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#17D4C3] hover:underline"
                    >
                        Suggest Content
                        <ArrowRight size={13} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
