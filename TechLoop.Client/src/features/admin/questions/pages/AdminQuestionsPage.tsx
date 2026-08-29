import { useQuery } from "@tanstack/react-query";
import { getAdminQuestions } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";
import AdminTable from "../../components/AdminTable.tsx";

export default function AdminQuestionsPage() {
    const { data = [], isLoading, isError } = useQuery({ queryKey: ["admin-questions"], queryFn: getAdminQuestions });
    return <div className="p-6 lg:p-10">
        <AdminPageHeader eyebrow="Assessment" title="Questions" description="Review questions using the existing question data service." />
        {isError ? <div className="rounded-2xl border border-[#F87171]/20 bg-[#F87171]/5 p-5 text-sm text-[#F87171]">Unable to load admin question data.</div> : <AdminTable headers={["Question","Type","Difficulty","Published"]} empty={!isLoading && data.length === 0 ? "No questions found." : undefined}>
            {isLoading ? <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-[#8CA3BF]">Loading questions...</td></tr> : data.map((item) => <tr key={item.id}>
                <td className="px-5 py-4"><p className="font-medium text-white">{item.title}</p><p className="text-xs text-[#5C7394]">{item.slug}</p></td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.questionType}</td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.difficulty}</td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.publishedAt ? "Yes" : "No"}</td>
            </tr>)}
        </AdminTable>}
    </div>;
}
