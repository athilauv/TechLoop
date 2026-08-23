import {
    BookOpen,
    Code2,
    MessagesSquare,
    FilePlus2,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
    {
        title: "Learn",
        description: "Explore technologies and topics",
        icon: BookOpen,
        href: "/learner/learning",
    },
    {
        title: "Practice",
        description: "Solve coding and MCQ questions",
        icon: Code2,
        href: "/learner/coding-questions",
    },
    {
        title: "Community",
        description: "See what other developers are asking",
        icon: MessagesSquare,
        href: "/learner/community",
    },
    {
        title: "Contribute",
        description: "Suggest a topic or piece of content",
        icon: FilePlus2,
        href: "/learner/topic-contributions",
    },
];

export default function QuickActions() {
    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35]">
            <div className="border-b border-[#1e3254] px-5 py-4">
                <h2 className="text-sm font-semibold text-[#e8f0fe]">
                    Quick Actions
                </h2>

                <p className="mt-1 text-xs text-[#5f7898]">
                    Jump back into your learning
                </p>
            </div>

            <div className="grid gap-1 p-3 sm:grid-cols-2">
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <Link
                            key={action.href}
                            to={action.href}
                            className="group flex items-center justify-between rounded-xl px-3 py-3 no-underline transition-colors hover:bg-[#12243b]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#17D4C3]/15">
                                    <Icon
                                        size={17}
                                        className="text-[#17D4C3]"
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
                                className="text-[#496582] transition-transform group-hover:translate-x-1 group-hover:text-[#17D4C3]"
                            />
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
