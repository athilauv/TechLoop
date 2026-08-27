import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Edit3, Plus, Trash2, X } from "lucide-react";
import {
    createAdminTechnologyCategory,
    deleteAdminTechnologyCategory,
    getAdminTechnologyCategories,
    publishAdminTechnologyCategory,
    updateAdminTechnologyCategory,
} from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";
import AdminTable from "../../components/AdminTable.tsx";
import AdminBadge from "../../components/AdminBadge.tsx";
import AdminToolbar from "../../components/AdminToolbar.tsx";
import AdminActionMenu, { type AdminActionMenuItem } from "../../components/AdminActionMenu.tsx";
import { adminInputClass } from "../../components/AdminFormField.tsx";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { showToast } from "../../../../utils/toast.tsx";

export default function AdminTechnologyCategoriesPage() {
    const client = useQueryClient();
    const [search, setSearch] = useState("");
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const { data = [], isLoading } = useQuery({ queryKey: ["admin-technology-categories"], queryFn: getAdminTechnologyCategories });
    const refresh = () => client.invalidateQueries({ queryKey: ["admin-technology-categories"] });

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        return query ? data.filter((item) => item.name.toLowerCase().includes(query)) : data;
    }, [data, search]);

    const create = useMutation({
        mutationFn: createAdminTechnologyCategory,
        onSuccess: (result) => {
            setName("");
            showToast.success(result.message || "Category created successfully.");
            refresh();
        },
        onError: (error) => showToast.error(getErrorMessage(error, "Failed to create category.")),
    });

    const update = useMutation({
        mutationFn: ({ id, value }: { id: number; value: string }) => updateAdminTechnologyCategory(id, value),
        onSuccess: (result) => {
            setName("");
            setEditingId(null);
            showToast.success(result.message || "Category updated successfully.");
            refresh();
        },
        onError: (error) => showToast.error(getErrorMessage(error, "Failed to update category.")),
    });

    const publish = useMutation({
        mutationFn: publishAdminTechnologyCategory,
        onSuccess: (result) => {
            showToast.success(result.message || "Category published successfully.");
            refresh();
        },
        onError: (error) => showToast.error(getErrorMessage(error, "Failed to publish category.")),
    });

    const remove = useMutation({
        mutationFn: deleteAdminTechnologyCategory,
        onSuccess: (result) => {
            showToast.success(result.message || "Category deleted successfully.");
            refresh();
        },
        onError: (error) => showToast.error(getErrorMessage(error, "Failed to delete category.")),
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        const value = name.trim();
        if (!value) return;
        if (editingId) update.mutate({ id: editingId, value });
        else create.mutate(value);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setName("");
    };

    return (
        <div className="p-6 lg:p-10">
            <AdminPageHeader
                eyebrow="Content structure"
                title="Technology categories"
                description="Create, update, publish, and soft-delete the category structure used to organize technologies."
            />

            <form onSubmit={submit} className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#223A59] bg-[#12233B] p-4 sm:flex-row">
                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={editingId ? "Category name" : "New category name"}
                    className={`flex-1 ${adminInputClass}`}
                />
                <button
                    type="submit"
                    disabled={create.isPending || update.isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00E8C2] px-4 py-2.5 text-sm font-semibold text-[#081423] transition-colors hover:bg-[#00D4B4] disabled:opacity-50"
                >
                    <Plus size={16} />
                    {editingId ? "Save category" : "Add category"}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#223A59] px-4 py-2.5 text-sm text-white transition-colors hover:bg-[#101C30]"
                    >
                        <X size={15} />
                        Cancel
                    </button>
                )}
            </form>

            <AdminToolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search categories…" />

            <AdminTable
                headers={["Name", "Created", "Status", "Actions"]}
                isLoading={isLoading}
                loadingLabel="Loading categories…"
                empty={!isLoading && filtered.length === 0 ? (data.length === 0 ? "No categories found." : "No categories match your search.") : undefined}
            >
                {filtered.map((item) => {
                    const menuItems: AdminActionMenuItem[] = [
                        {
                            label: "Edit",
                            icon: Edit3,
                            onClick: () => {
                                setEditingId(item.id);
                                setName(item.name);
                            },
                        },
                        ...(!item.publishAt
                            ? [
                                  {
                                      label: "Publish",
                                      icon: CheckCircle2,
                                      onClick: () =>
                                          showToast.confirm("Publish category", `Publish ${item.name}?`, () => publish.mutate(item.id), undefined, "Publish"),
                                  },
                              ]
                            : []),
                        {
                            label: "Delete",
                            icon: Trash2,
                            tone: "danger",
                            onClick: () =>
                                showToast.confirm(
                                    "Delete category",
                                    `Delete ${item.name}? This action cannot be undone.`,
                                    () => remove.mutate(item.id),
                                    undefined,
                                    "Delete",
                                ),
                        },
                    ];

                    return (
                        <tr key={item.id} className="transition-colors hover:bg-[#101C30]/60">
                            <td className="px-5 py-4 font-medium text-white">{item.name}</td>
                            <td className="px-5 py-4 text-sm text-[#8CA3BF]">{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td className="px-5 py-4">
                                <AdminBadge tone={item.publishAt ? "success" : "warning"} dot>
                                    {item.publishAt ? "Published" : "Draft"}
                                </AdminBadge>
                            </td>
                            <td className="px-5 py-4">
                                <AdminActionMenu items={menuItems} label={`Actions for ${item.name}`} />
                            </td>
                        </tr>
                    );
                })}
            </AdminTable>
        </div>
    );
}
