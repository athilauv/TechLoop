import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAdminQuestions } from "../../../../api/admin.api";
import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable from "../../components/AdminTable";
import InfiniteScrollTrigger from "../../../../shared/InfiniteScrollTrigger";

const PAGE_SIZE = 20;

export default function AdminQuestionsPage() {
    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState<string>("");
    const [questionType, setQuestionType] = useState<string>("");

    const query = useInfiniteQuery({
        queryKey: ["admin-questions", search, difficulty, questionType],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => getAdminQuestions(pageParam, PAGE_SIZE, search, difficulty ? Number(difficulty) : undefined, questionType ? Number(questionType) : undefined),
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    });

    const questions = query.data?.pages.flatMap((page) => page.items) ?? [];

    return <div className="p-6 lg:p-10">
        <AdminPageHeader eyebrow="Assessment" title="Questions" description="Review questions with backend filtering and infinite scroll." />
        <div className="mb-4 flex flex-wrap gap-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions..." className="rounded-lg border border-[#223A59] bg-[#101C30] px-3 py-2 text-sm text-white" />
            <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="rounded-lg border border-[#223A59] bg-[#101C30] px-3 py-2 text-sm text-white">
                <option value="">All types</option><option value="1">MCQ</option><option value="2">Coding</option>
            </select>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded-lg border border-[#223A59] bg-[#101C30] px-3 py-2 text-sm text-white">
                <option value="">All difficulties</option><option value="1">Beginner</option><option value="2">Easy</option><option value="3">Medium</option><option value="4">Hard</option><option value="5">Expert</option>
            </select>
        </div>
        {query.isError ? <div className="rounded-2xl border border-[#F87171]/20 bg-[#F87171]/5 p-5 text-sm text-[#F87171]">Unable to load admin question data.</div> : <AdminTable headers={["Question","Type","Difficulty","Published"]} empty={!query.isLoading && questions.length === 0 ? "No questions found." : undefined}>
            {query.isLoading ? <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-[#8CA3BF]">Loading questions...</td></tr> : questions.map((item) => <tr key={item.id}>
                <td className="px-5 py-4"><p className="font-medium text-white">{item.title}</p><p className="text-xs text-[#5C7394]">{item.slug}</p></td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.questionType}</td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.difficulty}</td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.publishedAt ? "Yes" : "No"}</td>
            </tr>)}
        </AdminTable>}
        <InfiniteScrollTrigger hasNextPage={!!query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} onLoadMore={() => void query.fetchNextPage()} />
    </div>;
}
