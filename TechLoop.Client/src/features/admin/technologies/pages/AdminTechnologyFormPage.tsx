import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
    getAdminTechnologyCategories,
    getAdminTechnologies,
    createAdminTechnology,
    updateAdminTechnology,
} from "../../../../api/admin.api.ts";
import type {
    CreateTechnologyRequest,
    UpdateTechnologyRequest,
} from "../../../../types/technology.types.ts";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { showToast } from "../../../../utils/toast.tsx";

export default function AdminTechnologyFormPage() {
    const { id } = useParams();
    const editing = Boolean(id);
    const navigate = useNavigate();
    const client = useQueryClient();

    const {
        data: categories = [],
    } = useQuery({
        queryKey: ["admin-technology-categories"],
        queryFn: getAdminTechnologyCategories,
    });

    const {
        data: technologies = [],
    } = useQuery({
        queryKey: ["admin-technologies"],
        queryFn: getAdminTechnologies,
    });

    const existing = useMemo(
        () => technologies.find((item) => item.id === Number(id)),
        [technologies, id],
    );

    if (editing && !existing) {
        return null;
    }

    return (
        <TechnologyForm
            key={existing?.id ?? "new"}
            editing={editing}
            id={id}
            existing={existing}
            categories={categories}
            navigate={navigate}
            client={client}
        />
    );
}

type TechnologyFormProps = {
    editing: boolean;
    id?: string;
    existing?: {
        id: number;
        categoryId: number;
        name: string;
        description?: string | null;
        slug: string;
        imageUrl?: string | null;
        position: number;
    };
    categories: Array<{
        id: number;
        name: string;
    }>;
    navigate: ReturnType<typeof useNavigate>;
    client: ReturnType<typeof useQueryClient>;
};

function TechnologyForm({
                            editing,
                            id,
                            existing,
                            categories,
                            navigate,
                            client,
                        }: TechnologyFormProps) {
    const [form, setForm] = useState<CreateTechnologyRequest>({
        categoryId: existing?.categoryId ?? 0,
        name: existing?.name ?? "",
        description: existing?.description ?? "",
        slug: existing?.slug ?? "",
        imageUrl: existing?.imageUrl ?? "",
        position: existing?.position ?? 1,
    });

    const create = useMutation({
        mutationFn: createAdminTechnology,
        onSuccess: (result) => {
            showToast.success(
                result.message || "Technology created successfully.",
            );

            client.invalidateQueries({
                queryKey: ["admin-technologies"],
            });

            navigate("/admin/technologies");
        },
        onError: (error) =>
            showToast.error(
                getErrorMessage(error, "Failed to create technology."),
            ),
    });

    const update = useMutation({
        mutationFn: (request: UpdateTechnologyRequest) =>
            updateAdminTechnology(Number(id), request),
        onSuccess: (result) => {
            showToast.success(
                result.message || "Technology updated successfully.",
            );

            client.invalidateQueries({
                queryKey: ["admin-technologies"],
            });

            navigate("/admin/technologies");
        },
        onError: (error) =>
            showToast.error(
                getErrorMessage(error, "Failed to update technology."),
            ),
    });

    const set = (
        key: keyof CreateTechnologyRequest,
        value: string | number,
    ) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (!form.name.trim() || !form.categoryId || !form.position) {
            return;
        }

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

    return (
        <div className="p-6 lg:p-10">
            <AdminPageHeader
                eyebrow="Technology"
                title={editing ? "Edit technology" : "Create technology"}
                description="Keep technology metadata aligned with the existing backend validation rules."
            />

            <form
                onSubmit={submit}
                className="max-w-3xl space-y-5 rounded-2xl border border-[#223A59] bg-[#12233B] p-6"
            >
                <label className="block text-sm text-[#8CA3BF]">
                    Name
                    <input
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        className="mt-2 h-11 w-full rounded-xl border border-[#223A59] bg-[#101C30] px-3 text-white outline-none focus:border-[#00E8C2]"
                    />
                </label>

                <label className="block text-sm text-[#8CA3BF]">
                    Category
                    <select
                        value={form.categoryId}
                        onChange={(e) =>
                            set("categoryId", Number(e.target.value))
                        }
                        className="mt-2 h-11 w-full rounded-xl border border-[#223A59] bg-[#101C30] px-3 text-white outline-none focus:border-[#00E8C2]"
                    >
                        <option value={0}>Select category</option>

                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block text-sm text-[#8CA3BF]">
                        Slug
                        <input
                            value={form.slug ?? ""}
                            onChange={(e) => set("slug", e.target.value)}
                            className="mt-2 h-11 w-full rounded-xl border border-[#223A59] bg-[#101C30] px-3 text-white outline-none focus:border-[#00E8C2]"
                        />
                    </label>

                    <label className="block text-sm text-[#8CA3BF]">
                        Position
                        <input
                            type="number"
                            min={1}
                            value={form.position}
                            onChange={(e) =>
                                set("position", Number(e.target.value))
                            }
                            className="mt-2 h-11 w-full rounded-xl border border-[#223A59] bg-[#101C30] px-3 text-white outline-none focus:border-[#00E8C2]"
                        />
                    </label>
                </div>

                <label className="block text-sm text-[#8CA3BF]">
                    Description
                    <textarea
                        value={form.description ?? ""}
                        onChange={(e) =>
                            set("description", e.target.value)
                        }
                        rows={5}
                        className="mt-2 w-full rounded-xl border border-[#223A59] bg-[#101C30] px-3 py-3 text-white outline-none focus:border-[#00E8C2]"
                    />
                </label>

                <label className="block text-sm text-[#8CA3BF]">
                    Image URL
                    <input
                        value={form.imageUrl ?? ""}
                        onChange={(e) => set("imageUrl", e.target.value)}
                        className="mt-2 h-11 w-full rounded-xl border border-[#223A59] bg-[#101C30] px-3 text-white outline-none focus:border-[#00E8C2]"
                    />
                </label>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/technologies")}
                        className="rounded-xl border border-[#223A59] px-4 py-2.5 text-sm text-white"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={create.isPending || update.isPending}
                        className="rounded-xl bg-[#00E8C2] px-5 py-2.5 text-sm font-semibold text-[#081423] disabled:opacity-50"
                    >
                        {editing ? "Save changes" : "Create technology"}
                    </button>
                </div>
            </form>
        </div>
    );
}