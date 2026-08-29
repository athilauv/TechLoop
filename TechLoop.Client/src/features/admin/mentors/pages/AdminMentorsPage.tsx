import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { createAdminMentor, deleteAdminMentor, getAdminMentors, getAdminTechnologies } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";
import AdminTable from "../../components/AdminTable.tsx";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { showToast } from "../../../../utils/toast.tsx";

export default function AdminMentorsPage() {
    const client = useQueryClient();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [technologyId, setTechnologyId] = useState("");
    const { data = [], isLoading } = useQuery({ queryKey: ["admin-mentors"], queryFn: getAdminMentors });
    const { data: technologies = [] } = useQuery({ queryKey: ["admin-technologies"], queryFn: getAdminTechnologies });
    const create = useMutation({ mutationFn: createAdminMentor, onSuccess: (result) => { setName(""); setEmail(""); setTechnologyId(""); showToast.success(result.message || "Mentor created successfully."); client.invalidateQueries({ queryKey: ["admin-mentors"] }); }, onError: (error) => showToast.error(getErrorMessage(error, "Failed to create mentor.")) });
    const remove = useMutation({ mutationFn: deleteAdminMentor, onSuccess: () => { showToast.success("Mentor deleted successfully."); client.invalidateQueries({ queryKey: ["admin-mentors"] }); }, onError: (error) => showToast.error(getErrorMessage(error, "Failed to delete mentor.")) });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (!name.trim() || !email.trim() || !technologyId) return;
        create.mutate({ name: name.trim(), email: email.trim(), technologyId: Number(technologyId) });
    };
    return <div className="p-6 lg:p-10">
        <AdminPageHeader eyebrow="People" title="Mentors" description="Create mentor accounts, review assignments, and inspect mentor activity." />
        <form onSubmit={submit} className="mb-6 grid gap-3 rounded-2xl border border-[#223A59] bg-[#12233B] p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Mentor name" className="h-11 rounded-xl border border-[#223A59] bg-[#101C30] px-3 text-sm text-white outline-none focus:border-[#00E8C2]"/>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Mentor email" className="h-11 rounded-xl border border-[#223A59] bg-[#101C30] px-3 text-sm text-white outline-none focus:border-[#00E8C2]"/>
            <select value={technologyId} onChange={(event) => setTechnologyId(event.target.value)} className="h-11 rounded-xl border border-[#223A59] bg-[#101C30] px-3 text-sm text-white outline-none focus:border-[#00E8C2]"><option value="">Assign technology</option>{technologies.map((technology) => <option key={technology.id} value={technology.id}>{technology.name}</option>)}</select>
            <button type="submit" disabled={create.isPending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00E8C2] px-4 py-2.5 text-sm font-semibold text-[#081423]"><Plus size={16}/>Create</button>
        </form>
        <AdminTable headers={["Mentor","Technology","Created","Overview","Actions"]} empty={!isLoading && data.length === 0 ? "No mentors found." : undefined}>
            {isLoading ? <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#8CA3BF]">Loading mentors...</td></tr> : data.map((mentor) => <tr key={mentor.id} className="hover:bg-[#101C30]/60">
                <td className="px-5 py-4"><p className="font-medium text-white">{mentor.username}</p><p className="text-xs text-[#5C7394]">{mentor.email}</p></td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{mentor.technologyName}</td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{new Date(mentor.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4"><Link to={`/admin/mentors/${mentor.id}`} className="text-sm font-medium text-[#00E8C2] hover:underline">View</Link></td>
                <td className="px-5 py-4"><button type="button" onClick={() => showToast.confirm("Delete mentor", `Delete ${mentor.username}? This action cannot be undone.`, () => remove.mutate(mentor.id), undefined, "Delete")} className="rounded-lg p-2 text-[#F87171] hover:bg-[#F87171]/10"><Trash2 size={15}/></button></td>
            </tr>)}
        </AdminTable>
    </div>;
}
