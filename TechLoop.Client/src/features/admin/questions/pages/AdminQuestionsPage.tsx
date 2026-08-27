import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminQuestions } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";
import AdminTable from "../../components/AdminTable.tsx";
import AdminBadge from "../../components/AdminBadge.tsx";
import AdminToolbar from "../../components/AdminToolbar.tsx";
import AdminFilterChip from "../../components/AdminFilterChip.tsx";
import { getDifficultyLabel, getDifficultyTone, getQuestionTypeLabel } from "../../utils/adminLabels.ts";

type PublishFilter = "all" | "published" | "unpublished";

export default function AdminQuestionsPage() {
    const { data = [], isLoading, isError } = useQuery({ queryKey: ["admin-questions"], queryFn: getAdminQuestions });
    const [search, setSearch] = useState("");
    const [publishFilter, setPublishFilter] = useState<PublishFilter>("all");

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        return data
            .filter((item) => (publishFilter === "published" ? !!item.publishedAt : publishFilter === "unpublished" ? !item.publishedAt : true))
            .filter((item) => !query || item.title.toLowerCase().includes(query) || item.slug.toLowerCase().includes(query));
    }, [data, search, publishFilter]);

    return (
        <div className="p-6 lg:p-10">
            <AdminPageHeader eyebrow="Assessment" title="Questions" description="Review questions using the existing question data service." />

            {isError ? (
                <div className="rounded-2xl border border-[#F87171]/20 bg-[#F87171]/5 p-5 text-sm text-[#F87171]">
                    Unable to load admin question data.
                </div>
            ) : (
                <>
                    <AdminToolbar
                        searchValue={search}
                        onSearchChange={setSearch}
                        searchPlaceholder="Search questions…"
                        filters={
                            <>
                                <AdminFilterChip label="All" active={publishFilter === "all"} onClick={() => setPublishFilter("all")} />
                                <AdminFilterChip label="Published" active={publishFilter === "published"} onClick={() => setPublishFilter("published")} />
                                <AdminFilterChip label="Unpublished" active={publishFilter === "unpublished"} onClick={() => setPublishFilter("unpublished")} />
                            </>
                        }
                    />

                    <AdminTable
                        headers={["Question", "Type", "Difficulty", "Published"]}
                        isLoading={isLoading}
                        loadingLabel="Loading questions…"
                        empty={!isLoading && filtered.length === 0 ? (data.length === 0 ? "No questions found." : "No questions match your filters.") : undefined}
                    >
                        {filtered.map((item) => (
                            <tr key={item.id} className="transition-colors hover:bg-[#101C30]/60">
                                <td className="px-5 py-4">
                                    <p className="font-medium text-white">{item.title}</p>
                                    <p className="text-xs text-[#5C7394]">{item.slug}</p>
                                </td>
                                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{getQuestionTypeLabel(item.questionType)}</td>
                                <td className="px-5 py-4">
                                    <AdminBadge tone={getDifficultyTone(item.difficulty)}>{getDifficultyLabel(item.difficulty)}</AdminBadge>
                                </td>
                                <td className="px-5 py-4">
                                    <AdminBadge tone={item.publishedAt ? "success" : "neutral"} dot>
                                        {item.publishedAt ? "Published" : "Unpublished"}
                                    </AdminBadge>
                                </td>
                            </tr>
                        ))}
                    </AdminTable>
                </>
            )}
        </div>
    );
}
