import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Boxes, ChevronRight, ClipboardList, FileQuestion, Layers, ListTree } from "lucide-react";
import { getAdminDashboard } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";

export default function AdminContentPage() {
    const { data } = useQuery({ queryKey: ["admin-dashboard"], queryFn: getAdminDashboard, staleTime: 30_000 });

    const catalogAreas = [
        {
            title: "Technologies",
            description: "The root technology entities and their publishing state.",
            href: "/admin/technologies",
            icon: Boxes,
            count: data?.technologiesCount,
        },
        {
            title: "Technology categories",
            description: "The taxonomy used to organize technologies.",
            href: "/admin/technology-categories",
            icon: Layers,
            count: data?.technologyCategoriesCount,
        },
    ];

    const assessmentAreas = [
        {
            title: "Questions",
            description: "Question management through the dedicated admin workflow.",
            href: "/admin/questions",
            icon: FileQuestion,
            count: data?.questionsCount,
        },
        {
            title: "Contributions",
            description: "Learner-submitted curriculum contributions awaiting review.",
            href: "/admin/contributions",
            icon: ClipboardList,
            count: data?.pendingContributionsCount,
        },
    ];

    const renderArea = ({
        title,
        description,
        href,
        icon: Icon,
        count,
    }: {
        title: string;
        description: string;
        href: string;
        icon: typeof Boxes;
        count?: number;
    }) => (
        <Link
            key={title}
            to={href}
            className="group flex items-start justify-between gap-4 rounded-2xl border border-[#223A59] bg-[#12233B] p-6 transition-all hover:-translate-y-0.5 hover:border-[#00E8C2]/40"
        >
            <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#00E8C2]/20 bg-[#00E8C2]/10 text-[#00E8C2]">
                    <Icon size={19} />
                </div>
                <div className="mt-5 flex items-center gap-2.5">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    {typeof count === "number" && (
                        <span className="rounded-full bg-[#101C30] px-2 py-0.5 text-xs font-semibold text-[#8CA3BF]">{count}</span>
                    )}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#8CA3BF]">{description}</p>
            </div>
            <ChevronRight
                size={18}
                className="mt-1 shrink-0 text-[#5C7394] transition-transform group-hover:translate-x-0.5 group-hover:text-[#00E8C2]"
            />
        </Link>
    );

    return (
        <div className="p-6 lg:p-10">
            <AdminPageHeader
                eyebrow="Learning content"
                title="Content management"
                description="Use the admin content areas to keep the learning hierarchy consistent and publish-ready."
            />

            {/* Visualizes the actual learning hierarchy: Technology → Topic → Subtopic → Question.
                Topic/Subtopic administration isn't exposed by the current admin API (only
                aggregate counts are available), so this stays a navigational map rather than
                a fabricated tree of records that don't exist here. */}
            <div className="mb-8 flex flex-wrap items-center gap-2 rounded-2xl border border-[#223A59] bg-[#12233B] p-4 text-sm text-[#8CA3BF]">
                <ListTree size={16} className="text-[#00E8C2]" />
                <span className="font-medium text-white">Technology</span>
                <ChevronRight size={14} className="text-[#5C7394]" />
                <span>Topic</span>
                <ChevronRight size={14} className="text-[#5C7394]" />
                <span>Subtopic</span>
                <ChevronRight size={14} className="text-[#5C7394]" />
                <span>Question</span>
                {data && (
                    <span className="ml-auto text-xs text-[#5C7394]">
                        {data.topicsCount} topics · {data.subTopicsCount} subtopics tracked
                    </span>
                )}
            </div>

            <section className="mb-8">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#5C7394]">Catalog</h2>
                <div className="grid gap-4 md:grid-cols-2">{catalogAreas.map(renderArea)}</div>
            </section>

            <section>
                <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#5C7394]">
                    <BookOpen size={13} />
                    Assessment &amp; review
                </h2>
                <div className="grid gap-4 md:grid-cols-2">{assessmentAreas.map(renderArea)}</div>
            </section>
        </div>
    );
}
