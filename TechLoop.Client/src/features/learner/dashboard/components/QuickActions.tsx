import {
    BookOpen,
    Code2,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
    {
        title: "Continue Learning",
        description: "Explore technologies and topics",
        icon: BookOpen,
        href: "/learner/learning",
    },
    {
        title: "Practice Questions",
        description: "Solve coding questions",
        icon: Code2,
        href: "/learner/coding-questions",
    },
];

export default function QuickActions() {
    return (
        <section className="rounded-xl border border-[#1e3254] bg-[#0f1e35]">
            <div className="border-b border-[#1e3254] px-5 py-4">
                <h2 className="text-sm font-semibold text-[#e8f0fe]">
                    Quick Actions
                </h2>

                <p className="mt-1 text-xs text-[#5f7898]">
                    Jump back into your learning
                </p>
            </div>

            <div className="p-3">
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <Link
                            key={action.href}
                            to={action.href}
                            className="group flex items-center justify-between rounded-lg px-3 py-3 no-underline transition-colors hover:bg-[#12243b]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#102f32]">
                                    <Icon
                                        size={17}
                                        className="text-[#00e5c0]"
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-[#dce8f8]">
                                        {action.title}
                                    </p>

                                    <p className="mt-0.5 text-xs text-[#5f7898]">
                                        {action.description}
                                    </p>
                                </div>
                            </div>

                            <ArrowRight
                                size={15}
                                className="text-[#496582] transition-transform group-hover:translate-x-1 group-hover:text-[#00e5c0]"
                            />
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}