import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
    createAdminTechnology,
    getAdminTechnologies,
    getAdminUsers,
    getAdminTechnologyCategories,
    updateAdminTechnology,
} from "../../../../api/admin.api.ts";
import type { CreateTechnologyRequest, UpdateTechnologyRequest } from "../../../../types/technology.types.ts";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";
import AdminBackLink from "../../components/AdminBackLink.tsx";
import AdminBadge from "../../components/AdminBadge.tsx";
import AdminFormField, { adminInputClass, adminTextareaClass } from "../../components/AdminFormField.tsx";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { showToast } from "../../../../utils/toast.tsx";

export default function AdminTechnologyFormPage() {
    const { id } = useParams();
    const editing = Boolean(id);
    const navigate = useNavigate();
    const client = useQueryClient();

    const { data: categories = [] } = useQuery({ queryKey: ["admin-technology-categories"], queryFn: getAdminTechnologyCategories });
    const { data: technologies = [] } = useQuery({ queryKey: ["admin-technologies"], queryFn: getAdminTechnologies });
    const { data: adminUsers = [] } = useQuery({ queryKey: ["admin-users"], queryFn: getAdminUsers, staleTime: 5 * 60 * 1000 });
    const userNameById = useMemo(() => {
        const map = new Map<string, string>();
        adminUsers.forEach((user) => map.set(user.id.toLowerCase(), user.username));
        return map;
    }, [adminUsers]);
    const existing = useMemo(() => technologies.find((item) => item.id === Number(id)), [technologies, id]);

    const [form, setForm] = useState<CreateTechnologyRequest>({
        categoryId: existing?.categoryId ?? 0,
        name: existing?.name ?? "",
        description: existing?.description ?? "",
        slug: existing?.slug ?? "",
        imageUrl: existing?.imageUrl ?? "",
        position: existing?.position ?? 1,
    });

    useEffect(() => {
        if (existing) {
            setForm({
                categoryId: existing.categoryId,
                name: existing.name,
                description: existing.description ?? "",
                slug: existing.slug,
                imageUrl: existing.imageUrl ?? "",
                position: existing.position,
            });
        }
    }, [existing]);

    const create = useMutation({
        mutationFn: createAdminTechnology,
        onSuccess: (result) => {
            showToast.success(result.message || "Technology created successfully.");
            client.invalidateQueries({ queryKey: ["admin-technologies"] });
            navigate("/admin/technologies");
        },
        onError: (error) => showToast.error(getErrorMessage(error, "Failed to create technology.")),
    });

    const update = useMutation({
        mutationFn: (request: UpdateTechnologyRequest) => updateAdminTechnology(Number(id), request),
        onSuccess: (result) => {
            showToast.success(result.message || "Technology updated successfully.");
            client.invalidateQueries({ queryKey: ["admin-technologies"] });
            navigate("/admin/technologies");
        },
        onError: (error) => showToast.error(getErrorMessage(error, "Failed to update technology.")),
    });

    const set = (key: keyof CreateTechnologyRequest, value: string | number) => setForm((current) => ({ ...current, [key]: value }));

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (!form.name.trim() || !form.categoryId || !form.position) return;
        if (editing) {
            update.mutate({
                categoryId: form.categoryId,
                name: form.name,
                description: form.description ?? "",
                slug: form.slug ?? "",
                imageUrl: form.imageUrl ?? "",
                position: form.position,
            });
        } else {
            create.mutate(form);
        }
    };

    const isSaving = create.isPending || update.isPending;

    return (
        <div className="p-6 lg:p-10">
            <AdminBackLink to="/admin/technologies" label="Back to technologies" />

            <AdminPageHeader
                eyebrow="Technology"
                title={editing ? "Edit technology" : "Create technology"}
                description="Keep technology metadata aligned with the existing backend validation rules."
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <form onSubmit={submit} className="space-y-5 rounded-2xl border border-[#223A59] bg-[#12233B] p-6 lg:col-span-2">
                    <AdminFormField label="Name" required>
                        <input
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="e.g. React"
                            className={adminInputClass}
                        />
                    </AdminFormField>

                    <AdminFormField label="Category" required>
                        <select
                            value={form.categoryId}
                            onChange={(e) => set("categoryId", Number(e.target.value))}
                            className={adminInputClass}
                        >
                            <option value={0}>Select category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </AdminFormField>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <AdminFormField label="Slug" hint="Used in public URLs.">
                            <input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} className={adminInputClass} />
                        </AdminFormField>
                        <AdminFormField label="Position" required hint="Controls display order.">
                            <input
                                type="number"
                                min={1}
                                value={form.position}
                                onChange={(e) => set("position", Number(e.target.value))}
                                className={adminInputClass}
                            />
                        </AdminFormField>
                    </div>

                    <AdminFormField label="Description">
                        <textarea
                            value={form.description ?? ""}
                            onChange={(e) => set("description", e.target.value)}
                            rows={5}
                            className={adminTextareaClass}
                        />
                    </AdminFormField>

                    <AdminFormField label="Image URL">
                        <input value={form.imageUrl ?? ""} onChange={(e) => set("imageUrl", e.target.value)} className={adminInputClass} />
                    </AdminFormField>

                    <div className="flex gap-3 border-t border-[#223A59] pt-5">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/technologies")}
                            className="rounded-xl border border-[#223A59] px-4 py-2.5 text-sm text-white transition-colors hover:bg-[#101C30]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-xl bg-[#00E8C2] px-5 py-2.5 text-sm font-semibold text-[#081423] transition-colors hover:bg-[#00D4B4] disabled:opacity-50"
                        >
                            {isSaving ? "Saving…" : editing ? "Save changes" : "Create technology"}
                        </button>
                    </div>
                </form>

                {editing && existing && (
                    <aside className="h-fit space-y-4 rounded-2xl border border-[#223A59] bg-[#12233B] p-6">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#5C7394]">Record details</p>

                        <div>
                            <p className="text-xs text-[#5C7394]">Status</p>
                            <div className="mt-1.5">
                                <AdminBadge tone={existing.publishedAt ? "success" : "warning"} dot>
                                    {existing.publishedAt ? "Published" : "Draft"}
                                </AdminBadge>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-[#5C7394]">Created</p>
                            <p className="mt-1 text-sm text-white">{new Date(existing.createdAt).toLocaleDateString()}</p>
                            {existing.createdBy && <p className="text-xs text-[#5C7394]">by {(existing.createdBy && userNameById.get(existing.createdBy.toLowerCase())) || "Admin"}</p>}
                        </div>

                        {existing.updatedAt && (
                            <div>
                                <p className="text-xs text-[#5C7394]">Last updated</p>
                                <p className="mt-1 text-sm text-white">{new Date(existing.updatedAt).toLocaleDateString()}</p>
                                {existing.updatedBy && <p className="text-xs text-[#5C7394]">by {(existing.updatedBy && userNameById.get(existing.updatedBy.toLowerCase())) || "Admin"}</p>}
                            </div>
                        )}
                    </aside>
                )}
            </div>
        </div>
    );
}
