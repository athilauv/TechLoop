import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getAdminMentorOverview } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader";
import AdminStatCard from "../../components/AdminStatCard.tsx";
import { BookOpen, CircleHelp, FileQuestion, GraduationCap } from "lucide-react";

export default function AdminMentorOverviewPage() {
    const { id } = useParams();
    const mentorId = Number(id);
    const { data, isLoading, isError } = useQuery({ queryKey: ["admin-mentor-overview", mentorId], queryFn: () => getAdminMentorOverview(mentorId), enabled: Number.isInteger(mentorId) && mentorId > 0 });
    if (isLoading) return <div className="p-6 lg:p-10 text-sm text-[#8CA3BF]">Loading mentor overview...</div>;
    if (isError || !data) return <div className="p-6 lg:p-10 text-sm text-[#F87171]">
        <AdminPageHeader eyebrow="Mentor overview" title="Mentor overview" backTo="/admin/mentors" />
        Mentor overview could not be loaded.
    </div>;
    return <div className="p-6 lg:p-10">
        <AdminPageHeader eyebrow="Mentor overview" title={data.username} description={`${data.email} · ${data.technologyName}`} backTo="/admin/mentors" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Topics" value={data.topicsCount} icon={BookOpen}/>
            <AdminStatCard label="Subtopics" value={data.subTopicsCount} icon={FileQuestion}/>
            <AdminStatCard label="Questions" value={data.questionsCount} icon={CircleHelp}/>
            <AdminStatCard label="Published questions" value={data.publishedQuestionsCount} icon={GraduationCap}/>
        </div>
    </div>;
}