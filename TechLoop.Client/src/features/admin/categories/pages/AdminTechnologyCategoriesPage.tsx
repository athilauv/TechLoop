import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Edit3, Plus, Trash2 } from "lucide-react";
import { createAdminTechnologyCategory, deleteAdminTechnologyCategory, getAdminTechnologyCategories, publishAdminTechnologyCategory, updateAdminTechnologyCategory } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable from "../../components/AdminTable";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { showToast } from "../../../../utils/toast.tsx";
import { getBackendValidationMessage } from "../../../../validations/backend.validation.ts";

export default function AdminTechnologyCategoriesPage() {
    const client = useQueryClient();
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const { data = [], isLoading } = useQuery({ queryKey: ["admin-technology-categories"], queryFn: getAdminTechnologyCategories });
    const refresh = () => client.invalidateQueries({ queryKey: ["admin-technology-categories"] });
    const create = useMutation({ mutationFn: createAdminTechnologyCategory, onSuccess: (result) => { setName(""); showToast.success(result.message || "Category created successfully."); refresh(); }, onError: (error) => showToast.error(getErrorMessage(error, "Failed to create category.")) });
    const update = useMutation({ mutationFn: ({ id, value }: { id: number; value: string }) => updateAdminTechnologyCategory(id, value), onSuccess: (result) => { setName(""); setEditingId(null); showToast.success(result.message || "Category updated successfully."); refresh(); }, onError: (error) => showToast.error(getErrorMessage(error, "Failed to update category.")) });
    const publish = useMutation({ mutationFn: publishAdminTechnologyCategory, onSuccess: (result) => { showToast.success(result.message || "Category published successfully."); refresh(); }, onError: (error) => showToast.error(getErrorMessage(error, "Failed to publish category.")) });
    const remove = useMutation({ mutationFn: deleteAdminTechnologyCategory, onSuccess: (result) => { showToast.success(result.message || "Category deleted successfully."); refresh(); }, onError: (error) => showToast.error(getErrorMessage(error, "Failed to delete category.")) });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        const value = name;
        const validationMessage = getBackendValidationMessage(
            editingId ? "PUT" : "POST",
            editingId
                ? `/admin/technology-categories/${editingId}`
                : "/admin/technology-categories",
            { name: value },
        );

        if (validationMessage) {
            showToast.error(validationMessage);
            return;
        }

        if (editingId) update.mutate({ id: editingId, value: value.trim() });
        else create.mutate(value.trim());
    };
    return <div className="p-6 lg:p-10">
        <AdminPageHeader eyebrow="Content structure" title="Technology categories" description="Create, update, publish, and soft-delete the category structure used to organize technologies." />
        <form onSubmit={submit} className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#223A59] bg-[#12233B] p-4 sm:flex-row">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder={editingId ? "Category name" : "New category name"} className="h-11 flex-1 rounded-xl border border-[#223A59] bg-[#101C30] px-3 text-sm text-white outline-none focus:border-[#00E8C2]" />
            <button type="submit" disabled={create.isPending || update.isPending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00E8C2] px-4 py-2.5 text-sm font-semibold text-[#081423]"><Plus size={16}/>{editingId ? "Save category" : "Add category"}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setName(""); }} className="rounded-xl border border-[#223A59] px-4 py-2.5 text-sm text-white">Cancel</button>}
        </form>
        <AdminTable headers={["ID","Name","Created","Status","Actions"]} empty={!isLoading && data.length === 0 ? "No categories found." : undefined}>
            {isLoading ? <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#8CA3BF]">Loading categories...</td></tr> : data.map((item) => <tr key={item.id} className="hover:bg-[#101C30]/60">
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.id}</td>
                <td className="px-5 py-4 font-medium text-white">{item.name}</td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.publishAt ? "bg-[#00E8C2]/10 text-[#00E8C2]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}`}>{item.publishAt ? "Published" : "Draft"}</span></td>
                <td className="px-5 py-4"><div className="flex items-center gap-2">
                    <button type="button" onClick={() => { setEditingId(item.id); setName(item.name); }} className="rounded-lg p-2 text-[#8CA3BF] hover:bg-[#101C30] hover:text-white"><Edit3 size={15}/></button>
                    {!item.publishAt && <button type="button" onClick={() => showToast.confirm("Publish category", `Publish ${item.name}?`, () => publish.mutate(item.id), undefined, "Publish")} className="rounded-lg p-2 text-[#00E8C2] hover:bg-[#00E8C2]/10"><CheckCircle2 size={15}/></button>}
                    <button type="button" onClick={() => showToast.confirm("Delete category", `Delete ${item.name}? This action cannot be undone.`, () => remove.mutate(item.id), undefined, "Delete")} className="rounded-lg p-2 text-[#F87171] hover:bg-[#F87171]/10"><Trash2 size={15}/></button>
                </div></td>
            </tr>)}
        </AdminTable>
    </div>;
}
