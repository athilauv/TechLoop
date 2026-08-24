import { Link } from "react-router-dom";
import { ArrowRight, Boxes, FileText, ListChecks, MessagesSquare, type LucideIcon } from "lucide-react";
import { useScrollReveal } from "../../../../hooks/useScrollReveal.ts";

interface OverviewArea {
    icon: LucideIcon;
    title: string;
    description: string;
    href: string;
    ctaLabel: string;
}

const areas: OverviewArea[] = [
    {
        icon: Boxes,
        title: "Technologies",
        description: "Manage technologies and categories across the platform.",
        href: "/admin/technologies",
        ctaLabel: "Manage",
    },
    {
        icon: FileText,
        title: "Learning Content",
        description: "Organize learning materials and curriculum structure.",
        href: "/admin/content",
        ctaLabel: "Manage",
    },
    {
        icon: ListChecks,
        title: "Coding Questions",
        description: "Manage coding questions and related practice content.",
        href: "/admin/questions",
        ctaLabel: "Manage",
    },
    {
        icon: MessagesSquare,
        title: "Community",
        description: "Monitor discussions and overall platform activity.",
        href: "/admin/community",
        ctaLabel: "Review",
    },
];

const PlatformOverview = () => {
    const { ref, inView } = useScrollReveal<HTMLDivElement>();

    return (
        <section className="px-6 py-16 lg:px-10 lg:py-20">
            <div ref={ref} className="mx-auto max-w-6xl">
                <div
                    className={`mb-10 max-w-xl transition-all duration-700 ease-out ${
                        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                >
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#00E8C2]">
                        Platform Overview
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                        Everything you manage, in one place
                    </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {areas.map((area, index) => {
                        const Icon = area.icon;
                        return (
                            <Link
                                key={area.title}
                                to={area.href}
                                style={{ transitionDelay: inView ? `${index * 90}ms` : "0ms" }}
                                className={`group flex flex-col rounded-2xl border border-[#223A59] bg-[#12233B] p-5 transition-all duration-700 ease-out hover:-translate-y-1 hover:border-[#00E8C2]/40 ${
                                    inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                                }`}
                            >
                                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#223A59] bg-[#101C30] text-[#00E8C2] transition-colors duration-150 group-hover:border-[#00E8C2]/40">
                                    <Icon size={18} />
                                </div>
                                <h3 className="text-sm font-semibold text-white">{area.title}</h3>
                                <p className="mt-1.5 flex-1 text-[13px] leading-5 text-[#8CA3BF]">
                                    {area.description}
                                </p>
                                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#00E8C2] transition-transform duration-150 group-hover:translate-x-0.5">
                                    {area.ctaLabel}
                                    <ArrowRight size={13} />
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PlatformOverview;
