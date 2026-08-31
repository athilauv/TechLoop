import { useQuery } from "@tanstack/react-query";
import { Activity, BookOpen, Boxes, CircleHelp, FileQuestion, GraduationCap, Layers, MessageSquare, Users } from "lucide-react";
import { getAdminDashboard } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader";
import AdminStatCard from "../../components/AdminStatCard.tsx";

export default function AdminDashboardPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: getAdminDashboard,
        staleTime: 30_000,
    });

    if (isLoading) {
        return <div className="p-6 lg:p-10"><div className="h-8 w-48 animate-pulse rounded bg-[#12233B]" /></div>;
    }

    if (isError || !data) {
        return <div className="p-6 text-sm text-[#F87171] lg:p-10">Unable to load the admin dashboard.</div>;
    }

    const stats = [
        ["Users", data.usersCount, Users],
        ["Mentors", data.mentorsCount, GraduationCap],
        ["Categories", data.technologyCategoriesCount, Layers],
        ["Technologies", data.technologiesCount, Boxes],
        ["Topics", data.topicsCount, BookOpen],
        ["Subtopics", data.subTopicsCount, FileQuestion],
        ["Questions", data.questionsCount, CircleHelp],
        ["Published Questions", data.publishedQuestionsCount, Activity],
        ["Discussions", data.activeDiscussionsCount, MessageSquare],
    ] as const;

    return (
        <div className="p-6 lg:p-10">
            <AdminPageHeader
                eyebrow="Admin dashboard"
                title="Platform control center"
                description="A live overview of the TechLoop learning ecosystem and the areas that need administrative attention."
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map(([label, value, icon]) => <AdminStatCard key={label} label={label} value={value} icon={icon} />)}
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#223A59] bg-[#12233B] p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#00E8C2]">Attention</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">Pending contributions</h2>
                    <p className="mt-2 text-sm text-[#8CA3BF]">Learner contributions waiting for mentor or admin review.</p>
                    <p className="mt-5 text-4xl font-bold text-white">{data.pendingContributionsCount}</p>
                </div>
                <div className="rounded-2xl border border-[#223A59] bg-[#12233B] p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#00E8C2]">Community</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">Published ecosystem activity</h2>
                    <p className="mt-2 text-sm text-[#8CA3BF]">Current community posts and active discussions across the platform.</p>
                    <div className="mt-5 flex gap-8">
                        <div><p className="text-2xl font-bold text-white">{data.communityPostsCount}</p><p className="text-xs text-[#5C7394]">Posts</p></div>
                        <div><p className="text-2xl font-bold text-white">{data.activeDiscussionsCount}</p><p className="text-xs text-[#5C7394]">Discussions</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
