import { FileQuestion, MessageSquarePlus, Plus } from "lucide-react";
import { useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../../shared/Breadcrumb.tsx";
import Button from "../../../../../shared/Button.tsx";
import EmptyState from "../../../../../shared/EmptyState.tsx";
import LoadingSpinner from "../../../../../shared/LoadingSpinner.tsx";
import InfiniteScrollTrigger from "../../../../../shared/InfiniteScrollTrigger.tsx";
import { deleteQuestion, getMentorQuestions } from "../../../../../api/mentorQuestion.api.ts";
import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";
import type { DifficultyLevel as DifficultyLevelType } from "../../../../../types/enums/difficulty-level.ts";
import { QuestionType } from "../../../../../types/enums/question-type.ts";
import type { MentorQuestion } from "../../../../../types/question.types.ts";
import QuestionFilters from "../../components/question-list/QuestionFilters.tsx";
import QuestionTable from "../../components/question-list/QuestionTable.tsx";

const PAGE_SIZE = 20;
export default function McqQuestionListPage() {
    const navigate = useNavigate(); const client = useQueryClient();
    const [search,setSearch]=useState(""); const [difficulty,setDifficulty]=useState<DifficultyLevelType|"all">("all");
    const query=useInfiniteQuery({queryKey:["mentor-questions","coding",search,difficulty],initialPageParam:1,queryFn:({pageParam})=>getMentorQuestions(pageParam,PAGE_SIZE,difficulty==="all"?undefined:difficulty,undefined,QuestionType.Mcq,search),getNextPageParam:p=>p.hasNextPage?p.page+1:undefined});
    const questions=query.data?.pages.flatMap(p=>p.items)??[]; const clear=()=>{setSearch("");setDifficulty("all")};
    const del=(q:MentorQuestion)=>showToast.confirm("Delete MCQ","Are you sure you want to delete this coding question? This action cannot be undone.",()=>{void (async()=>{try{await deleteQuestion(q.id);showToast.success("Coding question deleted successfully.");await client.invalidateQueries({queryKey:["mentor-questions"]})}catch(e){showToast.error(getErrorMessage(e,"Failed to delete coding question."))}})()},undefined,"Delete");
    return <div className="min-h-full px-6 py-6"><Breadcrumb items={[{label:"Questions",onClick:()=>navigate("/mentor/questions")},{label:"MCQ Questions"}]}/><div className="mx-auto mt-6 max-w-6xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold text-[var(--cs-text)]">MCQ Questions</h1><p className="mt-1 text-sm text-[var(--cs-text-muted)]">Create and manage multiple-choice questions.</p></div><Button type="button" onClick={()=>navigate("/mentor/questions/mcq/create")} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[var(--cs-primary,#00C9A7)] bg-[var(--cs-primary,#00C9A7)] px-3.5 py-2 text-sm font-semibold text-[var(--cs-primary-contrast,#081423)] transition-colors hover:bg-[var(--cs-primary-hover,#00DDB9)]"><MessageSquarePlus size={16}/>Create MCQ</Button></div><div className="mt-6 overflow-hidden rounded-2xl bg-[var(--cs-surface)] ring-1 ring-inset ring-[var(--cs-border)]/60"><div className="border-b border-[var(--cs-border)]/60 p-4"><QuestionFilters search={search} difficulty={difficulty} onSearchChange={setSearch} onDifficultyChange={setDifficulty} onClear={clear}/></div>{query.isLoading?<div className="flex justify-center py-20"><LoadingSpinner/></div>:query.isError?<div className="py-12"><EmptyState icon={<FileQuestion size={24}/>} title="Unable to load coding questions" description="Something went wrong while loading coding questions."/></div>:questions.length===0?<div className="py-12"><EmptyState icon={<FileQuestion size={24}/>} title={search||difficulty!=="all"?"No matching coding questions":"No coding questions yet"} description="No coding questions match the selected filters." action={search||difficulty!=="all"?<button onClick={clear}>Clear Filters</button>:<Button onClick={()=>navigate("/mentor/questions/mcq/create")}><Plus size={16}/>Create MCQ</Button>}/></div>:<QuestionTable questions={questions} basePath="/mentor/questions/mcq" onEdit={q=>navigate(`/mentor/questions/mcq/${q.id}/edit`)} onDelete={del}/>}</div><InfiniteScrollTrigger hasNextPage={!!query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} onLoadMore={()=>void query.fetchNextPage()}/></div></div>;
}
