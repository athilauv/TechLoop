import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { getAdminCommunity } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";
import AdminTable from "../../components/AdminTable.tsx";
import AdminToolbar from "../../components/AdminToolbar.tsx";

export default function AdminCommunityPage() {
    const { data = [], isLoading } = useQuery({ queryKey: ["admin-community-feed"], queryFn: getAdminCommunity });
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return data;
        return data.filter((item) => item.title.toLowerCase().includes(query) || item.userName.toLowerCase().includes(query));
    }, [data, search]);

    return (
        <div className="p-6 lg:p-10">
            <AdminPageHeader
                eyebrow="Community"
                title="Community activity"
                description="Review the current community feed using the existing platform data."
            />

            <AdminToolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search posts or authors…" />

            <AdminTable
                headers={["Post", "Author", "Created", "Engagement"]}
                isLoading={isLoading}
                loadingLabel="Loading community…"
                empty={!isLoading && filtered.length === 0 ? (data.length === 0 ? "No community posts found." : "No posts match your search.") : undefined}
            >
                {filtered.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-[#101C30]/60">
                        <td className="px-5 py-4">
                            <p className="font-medium text-white">{item.title}</p>
                            <p className="max-w-xl truncate text-xs text-[#5C7394]">{item.content}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.userName}</td>
                        <td className="px-5 py-4 text-sm text-[#8CA3BF]">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 text-sm text-[#8CA3BF]">
                                <Heart size={14} className="text-[#F87171]" />
                                {item.likeCount}
                            </span>
                        </td>
                    </tr>
                ))}
            </AdminTable>
        </div>
    );
}
