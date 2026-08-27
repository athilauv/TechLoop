import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { BookOpen, CircleHelp, FileQuestion, GraduationCap, Mail } from "lucide-react";
import { getAdminMentorOverview } from "../../../../api/admin.api.ts";
import AdminEntityHeader from "../../components/AdminEntityHeader.tsx";
import AdminStatCard from "../../components/AdminStatCard.tsx";
import AdminBackLink from "../../components/AdminBackLink.tsx";
import AdminBadge from "../../components/AdminBadge.tsx";

export default function AdminMentorOverviewPage() {
    const { id } = useParams();
    const mentorId = Number(id);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-mentor-overview", mentorId],
        queryFn: () => getAdminMentorOverview(mentorId),
        enabled: Number.isInteger(mentorId) && mentorId > 0,
    });

    if (isLoading) {
        return (
            <div className="p-6 lg:p-10">
                <AdminBackLink to="/admin/mentors" label="Back to mentors" />
                <p className="text-sm text-[#8CA3BF]">Loading mentor overview…</p>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="p-6 lg:p-10">
                <AdminBackLink to="/admin/mentors" label="Back to mentors" />
                <p className="text-sm text-[#F87171]">Mentor overview could not be loaded.</p>
            </div>
        );
    }

    const publishRate = data.questionsCount > 0 ? Math.round((data.publishedQuestionsCount / data.questionsCount) * 100) : 0;

    return (
        <div className="p-6 lg:p-10">
            <AdminBackLink to="/admin/mentors" label="Back to mentors" />

            <AdminEntityHeader
                initials={data.username.charAt(0).toUpperCase()}
                title={data.username}
                subtitle={data.email}
                meta={
                    <>
                        <AdminBadge tone="info">{data.technologyName}</AdminBadge>
                        <AdminBadge tone={publishRate === 100 ? "success" : "neutral"}>{publishRate}% questions published</AdminBadge>
                    </>
                }
                action={
                    <a
                        href={`mailto:${data.email}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#223A59] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#101C30]"
                    >
                        <Mail size={15} />
                        Contact
                    </a>
                }
            />

            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#5C7394]">Content contribution</p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStatCard label="Topics" value={data.topicsCount} icon={BookOpen} />
                <AdminStatCard label="Subtopics" value={data.subTopicsCount} icon={FileQuestion} />
                <AdminStatCard label="Questions" value={data.questionsCount} icon={CircleHelp} />
                <AdminStatCard label="Published questions" value={data.publishedQuestionsCount} icon={GraduationCap} />
            </div>
        </div>
    );
}
