import { useQuery } from "@tanstack/react-query";
import { getAdminCommunity } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable from "../../components/AdminTable";

export default function AdminCommunityPage() {
    const { data = [], isLoading } = useQuery({ queryKey: ["admin-community-feed"], queryFn: getAdminCommunity });
    return <div className="p-6 lg:p-10">
        <AdminPageHeader eyebrow="Community" title="Community activity" description="Review the current community feed using the existing platform data." />
        <AdminTable headers={["Post","Author","Created","Engagement"]} empty={!isLoading && data.length === 0 ? "No community posts found." : undefined}>
            {isLoading ? <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-[#8CA3BF]">Loading community...</td></tr> : data.map((item) => <tr key={item.id}>
                <td className="px-5 py-4"><p className="font-medium text-white">{item.title}</p><p className="max-w-xl truncate text-xs text-[#5C7394]">{item.content}</p></td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.userName}</td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.likeCount} likes</td>
            </tr>)}
        </AdminTable>
    </div>;
}
