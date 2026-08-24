import { Link } from "react-router-dom";
import {
    Boxes,
    Layers,
    FileText,
    ListChecks,
    MessagesSquare,
    Users,
    type LucideIcon,
} from "lucide-react";
import { useScrollReveal } from "../../../../hooks/useScrollReveal.ts";

interface QuickAction {
    icon: LucideIcon;
    label: string;
    href: string;
}

const actions: QuickAction[] = [
    { icon: Boxes, label: "Add Technology", href: "/admin/technologies/new" },
    { icon: Layers, label: "Create Topic", href: "/admin/topics/new" },
    { icon: FileText, label: "Manage Content", href: "/admin/content" },
    { icon: ListChecks, label: "Manage Questions", href: "/admin/questions" },
    { icon: MessagesSquare, label: "Review Community", href: "/admin/community" },
    { icon: Users, label: "Manage Users", href: "/admin/users" },
];

const QuickActions = () => {
    const { ref, inView } = useScrollReveal<HTMLDivElement>();

    return (
        <section className="px-6 py-16 lg:px-10">
            <div ref={ref} className="mx-auto max-w-6xl">
                <div
                    className={`mb-8 transition-all duration-700 ease-out ${
                        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                >
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#00E8C2]">
                        Quick Actions
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                        Frequently used operations
                    </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                    {actions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.label}
                                to={action.href}
                                style={{ transitionDelay: inView ? `${index * 60}ms` : "0ms" }}
                                className={`group inline-flex items-center gap-2.5 rounded-xl border border-[#223A59] bg-[#101C30] px-4 py-3 text-sm font-medium text-white transition-all duration-700 ease-out hover:-translate-y-0.5 hover:border-[#00E8C2]/40 hover:text-[#00E8C2] ${
                                    inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                }`}
                            >
                                <Icon
                                    size={16}
                                    className="text-[#8CA3BF] transition-colors duration-150 group-hover:text-[#00E8C2]"
                                />
                                {action.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default QuickActions;
