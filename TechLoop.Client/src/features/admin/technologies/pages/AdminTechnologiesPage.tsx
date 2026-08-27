import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CheckCircle2, Edit3, Plus, Trash2 } from "lucide-react";
import {
    deleteAdminTechnology,
    getAdminTechnologies,
    getAdminTechnologyCategories,
    publishAdminTechnology,
} from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";
import AdminTable from "../../components/AdminTable.tsx";
import AdminBadge from "../../components/AdminBadge.tsx";
import AdminToolbar from "../../components/AdminToolbar.tsx";
import AdminFilterChip from "../../components/AdminFilterChip.tsx";
import AdminActionMenu, { type AdminActionMenuItem } from "../../components/AdminActionMenu.tsx";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { showToast } from "../../../../utils/toast.tsx";

type StatusFilter = "all" | "published" | "draft";

export default function AdminTechnologiesPage() {
    const client = useQueryClient();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const { data = [], isLoading } = useQuery({ queryKey: ["admin-technologies"], queryFn: getAdminTechnologies });
    const { data: categories = [] } = useQuery({ queryKey: ["admin-technology-categories"], queryFn: getAdminTechnologyCategories });

    const categoryNameById = useMemo(() => {
        const map = new Map<number, string>();
        categories.forEach((category) => map.set(Number(category.id), category.name));
        return map;
    }, [categories]);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        return data
            .filter((item) => (statusFilter === "published" ? !!item.publishedAt : statusFilter === "draft" ? !item.publishedAt : true))
            .filter((item) => !query || item.name.toLowerCase().includes(query) || item.slug.toLowerCase().includes(query));
    }, [data, search, statusFilter]);

    const publishedCount = data.filter((item) => item.publishedAt).length;

    const publish = useMutation({
        mutationFn: publishAdminTechnology,
        onSuccess: (result) => {
            showToast.success(result.message || "Technology published successfully.");
            client.invalidateQueries({ queryKey: ["admin-technologies"] });
        },
        onError: (error) => showToast.error(getErrorMessage(error, "Failed to publish technology.")),
    });

    const remove = useMutation({
        mutationFn: deleteAdminTechnology,
        onSuccess: (result) => {
            showToast.success(result.message || "Technology deleted successfully.");
            client.invalidateQueries({ queryKey: ["admin-technologies"] });
        },
        onError: (error) => showToast.error(getErrorMessage(error, "Failed to delete technology.")),
    });

    return (
        <div className="p-6 lg:p-10">
            <AdminPageHeader
                eyebrow="Content structure"
                title="Technologies"
                description={`Manage the technologies available across the TechLoop learning ecosystem. ${publishedCount} of ${data.length} published.`}
                action={
                    <Link
                        to="/admin/technologies/new"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#00E8C2] px-4 py-2.5 text-sm font-semibold text-[#081423] transition-colors hover:bg-[#00D4B4]"
                    >
                        <Plus size={16} />
                        Add technology
                    </Link>
                }
            />

            <AdminToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search technologies…"
                filters={
                    <>
                        <AdminFilterChip label="All" active={statusFilter === "all"} onClick={() => setStatusFilter("all")} />
                        <AdminFilterChip label="Published" active={statusFilter === "published"} onClick={() => setStatusFilter("published")} />
                        <AdminFilterChip label="Draft" active={statusFilter === "draft"} onClick={() => setStatusFilter("draft")} />
                    </>
                }
            />

            <AdminTable
                headers={["Technology", "Category", "Position", "Status", "Actions"]}
                isLoading={isLoading}
                loadingLabel="Loading technologies…"
                empty={!isLoading && filtered.length === 0 ? (data.length === 0 ? "No technologies found." : "No technologies match your filters.") : undefined}
            >
                {filtered.map((item) => {
                    const menuItems: AdminActionMenuItem[] = [
                        { label: "Edit", icon: Edit3, to: `/admin/technologies/${item.id}/edit` },
                        ...(!item.publishedAt
                            ? [
                                  {
                                      label: "Publish",
                                      icon: CheckCircle2,
                                      onClick: () =>
                                          showToast.confirm("Publish technology", `Publish ${item.name}?`, () => publish.mutate(item.id), undefined, "Publish"),
                                  },
                              ]
                            : []),
                        {
                            label: "Delete",
                            icon: Trash2,
                            tone: "danger",
                            onClick: () =>
                                showToast.confirm(
                                    "Delete technology",
                                    `Delete ${item.name}? This action cannot be undone.`,
                                    () => remove.mutate(item.id),
                                    undefined,
                                    "Delete",
                                ),
                        },
                    ];

                    return (
                        <tr key={item.id} className="transition-colors hover:bg-[#101C30]/60">
                            <td className="px-5 py-4">
                                <p className="font-medium text-white">{item.name}</p>
                                <p className="text-xs text-[#5C7394]">{item.slug}</p>
                            </td>
                            <td className="px-5 py-4 text-sm text-[#8CA3BF]">{categoryNameById.get(Number(item.categoryId)) ?? "Unknown category"}</td>
                            <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.position}</td>
                            <td className="px-5 py-4">
                                <AdminBadge tone={item.publishedAt ? "success" : "warning"} dot>
                                    {item.publishedAt ? "Published" : "Draft"}
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
