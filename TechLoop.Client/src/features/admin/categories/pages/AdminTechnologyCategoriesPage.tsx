import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Edit3, Plus, Trash2, X } from "lucide-react";
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
    const startEditing = (id: number, categoryName: string) => {
        setEditingId(id);
        setName(categoryName);
    };
    const create = useMutation({ mutationFn: createAdminTechnologyCategory, onSuccess: (result) => { setName(""); showToast.success(result.message || "Category created successfully."); refresh(); }, onError: (error) => showToast.error(getErrorMessage(error, "Failed to create category.")) });
    const update = useMutation({ mutationFn: ({ id, value }: { id: number; value: string }) => updateAdminTechnologyCategory(id, value), onSuccess: (result) => { setName(""); setEditingId(null); showToast.success(result.message || "Category updated successfully."); refresh(); }, onError: (error) => showToast.error(getErrorMessage(error, "Failed to update category.")) });
    const publish = useMutation({ mutationFn: publishAdminTechnologyCategory, onSuccess: (result) => { showToast.success(result.message || "Category published successfully."); refresh(); }, onError: (error) => showToast.error(getErrorMessage(error, "Failed to publish category.")) });
    const remove = useMutation({ mutationFn: deleteAdminTechnologyCategory, onSuccess: (result) => { showToast.success(result.message || "Category deleted successfully."); refresh(); }, onError: (error) => showToast.error(getErrorMessage(error, "Failed to delete category.")) });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        const value = name;
        const validationMessage = getBackendValidationMessage(
            "POST",
            "/admin/technology-categories",
            { name: value },
        );

        if (validationMessage) {
            showToast.error(validationMessage);
            return;
        }

        create.mutate(value.trim());
    };

    const submitEdit = (event: FormEvent) => {
        event.preventDefault();
        if (editingId === null) return;

        const value = name;
        const validationMessage = getBackendValidationMessage(
            "PUT",
            `/admin/technology-categories/${editingId}`,
            { name: value },
        );

        if (validationMessage) {
            showToast.error(validationMessage);
            return;
        }

        update.mutate({ id: editingId, value: value.trim() });
    };

    const closeEditModal = () => {
        if (update.isPending) return;
        setEditingId(null);
        setName("");
    };

    return <div className="p-6 lg:p-10">
        <AdminPageHeader eyebrow="Content structure" title="Technology categories" description="Create, update, publish, and soft-delete the category structure used to organize technologies." />
        <form onSubmit={submit} className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#223A59] bg-[#12233B] p-4 sm:flex-row">
            <input value={editingId === null ? name : ""} onChange={(event) => setName(event.target.value)} placeholder="New category name" className="h-11 flex-1 rounded-xl border border-[#223A59] bg-[#101C30] px-3 text-sm text-white outline-none focus:border-[#00E8C2]" />
            <button type="submit" disabled={create.isPending || update.isPending || editingId !== null} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00E8C2] px-4 py-2.5 text-sm font-semibold text-[#081423] disabled:opacity-50"><Plus size={16}/>Add category</button>
        </form>
        <AdminTable headers={["ID","Name","Created","Status","Actions"]} empty={!isLoading && data.length === 0 ? "No categories found." : undefined}>
            {isLoading ? <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#8CA3BF]">Loading categories...</td></tr> : data.map((item) => <tr key={item.id} className="hover:bg-[#101C30]/60">
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.id}</td>
                <td className="px-5 py-4 font-medium text-white">{item.name}</td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.publishAt ? "bg-[#00E8C2]/10 text-[#00E8C2]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}`}>{item.publishAt ? "Published" : "Draft"}</span></td>
                <td className="px-5 py-4"><div className="flex items-center gap-2">
                    <button type="button" aria-label={`Edit ${item.name}`} onClick={() => startEditing(item.id, item.name)} className="cursor-pointer rounded-lg p-2 text-[#8CA3BF] hover:bg-[#101C30] hover:text-white"><Edit3 size={15}/></button>
                    {!item.publishAt && <button type="button" onClick={() => showToast.confirm("Publish category", `Publish ${item.name}?`, () => publish.mutate(item.id), undefined, "Publish")} className="rounded-lg p-2 text-[#00E8C2] hover:bg-[#00E8C2]/10"><CheckCircle2 size={15}/></button>}
                    <button type="button" onClick={() => showToast.confirm("Delete category", `Delete ${item.name}? This action cannot be undone.`, () => remove.mutate(item.id), undefined, "Delete")} className="rounded-lg p-2 text-[#F87171] hover:bg-[#F87171]/10"><Trash2 size={15}/></button>
                </div></td>
            </tr>)}
        </AdminTable>

        {editingId !== null && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-technology-category-title"
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget) closeEditModal();
                }}
            >
                <div className="w-full max-w-md rounded-2xl border border-[#223A59] bg-[#12233B] p-6 shadow-2xl">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[#00E8C2]">Technology category</p>
                            <h2 id="edit-technology-category-title" className="mt-1 text-lg font-semibold text-white">Edit category</h2>
                            <p className="mt-1 text-sm text-[#8CA3BF]">Update the category name and save your changes.</p>
                        </div>
                        <button type="button" onClick={closeEditModal} disabled={update.isPending} aria-label="Close edit category" className="rounded-lg p-2 text-[#8CA3BF] hover:bg-[#101C30] hover:text-white disabled:opacity-50">
                            <X size={18}/>
                        </button>
                    </div>

                    <form onSubmit={submitEdit}>
                        <label htmlFor="edit-technology-category-name" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.8px] text-[#7A99BB]">Category name</label>
                        <input
                            id="edit-technology-category-name"
                            autoFocus
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="h-11 w-full rounded-xl border border-[#223A59] bg-[#101C30] px-3 text-sm text-white outline-none focus:border-[#00E8C2]"
                        />

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={closeEditModal} disabled={update.isPending} className="rounded-xl border border-[#223A59] px-4 py-2.5 text-sm text-white disabled:opacity-50">Cancel</button>
                            <button type="submit" disabled={update.isPending} className="rounded-xl bg-[#00E8C2] px-4 py-2.5 text-sm font-semibold text-[#081423] disabled:opacity-50">
                                {update.isPending ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>;
}
