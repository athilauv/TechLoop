import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CheckCircle2, Edit3, Plus, Trash2 } from "lucide-react";
import { deleteAdminTechnology, getAdminTechnologies, publishAdminTechnology } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable from "../../components/AdminTable";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { showToast } from "../../../../utils/toast.tsx";

export default function AdminTechnologiesPage() {
    const client = useQueryClient();
    const { data = [], isLoading } = useQuery({ queryKey: ["admin-technologies"], queryFn: getAdminTechnologies });
    const publish = useMutation({ mutationFn: publishAdminTechnology, onSuccess: (result) => { showToast.success(result.message || "Technology published successfully."); client.invalidateQueries({ queryKey: ["admin-technologies"] }); }, onError: (error) => showToast.error(getErrorMessage(error, "Failed to publish technology.")) });
    const remove = useMutation({ mutationFn: deleteAdminTechnology, onSuccess: (result) => { showToast.success(result.message || "Technology deleted successfully."); client.invalidateQueries({ queryKey: ["admin-technologies"] }); }, onError: (error) => showToast.error(getErrorMessage(error, "Failed to delete technology.")) });

    return <div className="p-6 lg:p-10">
        <AdminPageHeader eyebrow="Content structure" title="Technologies" description="Manage the technologies available across the TechLoop learning ecosystem." action={<Link to="/admin/technologies/new" className="inline-flex items-center gap-2 rounded-xl bg-[#00E8C2] px-4 py-2.5 text-sm font-semibold text-[#081423]"><Plus size={16}/>Add technology</Link>} />
        <AdminTable headers={["Technology","Category","Position","Status","Actions"]} empty={!isLoading && data.length === 0 ? "No technologies found." : undefined}>
            {isLoading ? <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#8CA3BF]">Loading technologies...</td></tr> : data.map((item) => <tr key={item.id} className="hover:bg-[#101C30]/60">
                <td className="px-5 py-4"><p className="font-medium text-white">{item.name}</p><p className="text-xs text-[#5C7394]">{item.slug}</p></td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.categoryId}</td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.position}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.publishedAt ? "bg-[#00E8C2]/10 text-[#00E8C2]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}`}>{item.publishedAt ? "Published" : "Draft"}</span></td>
                <td className="px-5 py-4"><div className="flex items-center gap-2">
                    <Link to={`/admin/technologies/${item.id}/edit`} className="rounded-lg p-2 text-[#8CA3BF] hover:bg-[#101C30] hover:text-white"><Edit3 size={15}/></Link>
                    {!item.publishedAt && <button type="button" onClick={() => showToast.confirm("Publish technology", `Publish ${item.name}?`, () => publish.mutate(item.id), undefined, "Publish")} className="rounded-lg p-2 text-[#00E8C2] hover:bg-[#00E8C2]/10"><CheckCircle2 size={15}/></button>}
                    <button type="button" onClick={() => showToast.confirm("Delete technology", `Delete ${item.name}? This action cannot be undone.`, () => remove.mutate(item.id), undefined, "Delete")} className="rounded-lg p-2 text-[#F87171] hover:bg-[#F87171]/10"><Trash2 size={15}/></button>
                </div></td>
            </tr>)}
        </AdminTable>
    </div>;
}
