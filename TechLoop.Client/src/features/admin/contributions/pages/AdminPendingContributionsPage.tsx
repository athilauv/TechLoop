import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminPendingContributions, getAdminTechnologies } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";
import AdminTable from "../../components/AdminTable.tsx";
import AdminBadge from "../../components/AdminBadge.tsx";
import AdminToolbar from "../../components/AdminToolbar.tsx";

export default function AdminPendingContributionsPage() {
    const { data = [], isLoading } = useQuery({ queryKey: ["admin-pending-contributions"], queryFn: getAdminPendingContributions });
    const { data: technologies = [] } = useQuery({ queryKey: ["admin-technologies"], queryFn: getAdminTechnologies });
    const [search, setSearch] = useState("");

    const technologyNameById = useMemo(() => {
        const map = new Map<number, string>();
        technologies.forEach((technology) => map.set(technology.id, technology.name));
        return map;
    }, [technologies]);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return data;
        return data.filter((item) => item.title.toLowerCase().includes(query) || item.contributionType.toLowerCase().includes(query));
    }, [data, search]);

    return (
        <div className="p-6 lg:p-10">
            <AdminPageHeader
                eyebrow="Content review"
                title="Pending contributions"
                description="Learner-submitted curriculum contributions waiting for review."
            />

            <AdminToolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search contributions…" />

            <AdminTable
                headers={["Contribution", "Type", "Technology", "Created", "Status"]}
                isLoading={isLoading}
                loadingLabel="Loading contributions…"
                empty={!isLoading && filtered.length === 0 ? (data.length === 0 ? "No pending contributions." : "No contributions match your search.") : undefined}
            >
                {filtered.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-[#101C30]/60">
                        <td className="px-5 py-4">
                            <p className="font-medium text-white">{item.title}</p>
                            <p className="mt-1 max-w-xl truncate text-xs text-[#5C7394]">{item.description}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.contributionType}</td>
                        <td className="px-5 py-4 text-sm text-[#8CA3BF]">
                            {technologyNameById.get(item.technologyId) ?? "Unknown technology"}
                        </td>
                        <td className="px-5 py-4 text-sm text-[#8CA3BF]">{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-4">
                            <AdminBadge tone="warning" dot>
                                Pending
                            </AdminBadge>
                        </td>
                    </tr>
                ))}
            </AdminTable>
        </div>
    );
}
