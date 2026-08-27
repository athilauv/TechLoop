import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BookOpen,
    Boxes,
    CircleHelp,
    ClipboardList,
    FileQuestion,
    GraduationCap,
    Layers,
    MessageSquare,
    Plus,
    Users,
} from "lucide-react";
import { getAdminDashboard } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";
import AdminStatCard from "../../components/AdminStatCard.tsx";

const quickActions = [
    { label: "Add technology", href: "/admin/technologies/new", icon: Plus },
    { label: "Review contributions", href: "/admin/contributions", icon: ClipboardList },
    { label: "Manage questions", href: "/admin/questions", icon: FileQuestion },
    { label: "Manage users", href: "/admin/users", icon: Users },
];

export default function AdminDashboardPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: getAdminDashboard,
        staleTime: 30_000,
    });

    if (isLoading) {
        return (
            <div className="p-6 lg:p-10">
                <div className="h-8 w-56 animate-pulse rounded-lg bg-[#12233B]" />
                <div className="mt-8 grid gap-4 lg:grid-cols-3">
                    <div className="h-40 animate-pulse rounded-2xl border border-[#223A59] bg-[#12233B] lg:col-span-2" />
                    <div className="h-40 animate-pulse rounded-2xl border border-[#223A59] bg-[#12233B]" />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-24 animate-pulse rounded-2xl border border-[#223A59] bg-[#12233B]" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="p-6 lg:p-10">
                <div className="rounded-2xl border border-[#F87171]/20 bg-[#F87171]/5 p-5 text-sm text-[#F87171]">
                    Unable to load the admin dashboard.
                </div>
            </div>
        );
    }

    const hasPendingWork = data.pendingContributionsCount > 0;
    const unpublishedQuestions = Math.max(data.questionsCount - data.publishedQuestionsCount, 0);

    return (
        <div className="p-6 lg:p-10">
            <AdminPageHeader
                eyebrow="Admin dashboard"
                title="Platform control center"
                description="A live overview of the TechLoop learning ecosystem and the areas that need administrative attention."
            />

            {/* What needs attention — the primary, actionable focus of the page. */}
            <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-[#223A59] bg-[#12233B] p-6 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#00E8C2]">Needs attention</p>
                        {hasPendingWork && <span className="h-2 w-2 rounded-full bg-[#F59E0B]" aria-hidden="true" />}
                    </div>

                    <div className="mt-4 divide-y divide-[#223A59]/70">
                        <Link
                            to="/admin/contributions"
                            className="group flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                        >
                            <div>
                                <p className="text-sm font-medium text-white">Pending contributions</p>
                                <p className="mt-0.5 text-xs text-[#8CA3BF]">Learner submissions waiting for review.</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-lg font-bold ${hasPendingWork ? "text-[#F59E0B]" : "text-white"}`}>
                                    {data.pendingContributionsCount}
                                </span>
                                <ArrowRight size={15} className="text-[#5C7394] transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>

                        <Link to="/admin/questions" className="group flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                            <div>
                                <p className="text-sm font-medium text-white">Unpublished questions</p>
                                <p className="mt-0.5 text-xs text-[#8CA3BF]">Questions that aren't live for learners yet.</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-lg font-bold text-white">{unpublishedQuestions}</span>
                                <ArrowRight size={15} className="text-[#5C7394] transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>

                        <Link to="/admin/community" className="group flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                            <div>
                                <p className="text-sm font-medium text-white">Active discussions</p>
                                <p className="mt-0.5 text-xs text-[#8CA3BF]">Community threads currently open.</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-lg font-bold text-white">{data.activeDiscussionsCount}</span>
                                <ArrowRight size={15} className="text-[#5C7394] transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Quick actions — where an admin goes next. */}
                <div className="rounded-2xl border border-[#223A59] bg-[#12233B] p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#5C7394]">Quick actions</p>
                    <div className="mt-4 space-y-1.5">
                        {quickActions.map(({ label, href, icon: Icon }) => (
                            <Link
                                key={label}
                                to={href}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#8CA3BF] transition-colors hover:bg-[#101C30] hover:text-white"
                            >
                                <Icon size={16} className="text-[#00E8C2]" />
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* What is happening — grouped ecosystem metrics. */}
            <div className="mt-8 space-y-6">
                <section>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#5C7394]">People</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <AdminStatCard label="Users" value={data.usersCount} icon={Users} />
                        <AdminStatCard label="Mentors" value={data.mentorsCount} icon={GraduationCap} />
                    </div>
                </section>

                <section>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#5C7394]">Learning content</h2>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <AdminStatCard label="Categories" value={data.technologyCategoriesCount} icon={Layers} />
                        <AdminStatCard label="Technologies" value={data.technologiesCount} icon={Boxes} />
                        <AdminStatCard label="Topics" value={data.topicsCount} icon={BookOpen} />
                        <AdminStatCard label="Subtopics" value={data.subTopicsCount} icon={FileQuestion} />
                    </div>
                </section>

                <section>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#5C7394]">Assessment &amp; community</h2>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <AdminStatCard label="Questions" value={data.questionsCount} icon={CircleHelp} />
                        <AdminStatCard label="Published questions" value={data.publishedQuestionsCount} icon={GraduationCap} />
                        <AdminStatCard label="Community posts" value={data.communityPostsCount} icon={MessageSquare} />
                    </div>
                </section>
            </div>
        </div>
    );
}
