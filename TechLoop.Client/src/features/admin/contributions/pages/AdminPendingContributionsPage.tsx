import { useQuery } from "@tanstack/react-query";
import { getAdminPendingContributions } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";
import AdminTable from "../../components/AdminTable.tsx";

export default function AdminPendingContributionsPage() {
    const { data = [], isLoading } = useQuery({ queryKey: ["admin-pending-contributions"], queryFn: getAdminPendingContributions });
    return <div className="p-6 lg:p-10">
        <AdminPageHeader eyebrow="Content review" title="Pending contributions" description="Learner-submitted curriculum contributions waiting for review." />
        <AdminTable headers={["Contribution","Type","Technology","Created","Status"]} empty={!isLoading && data.length === 0 ? "No pending contributions." : undefined}>
            {isLoading ? <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#8CA3BF]">Loading contributions...</td></tr> : data.map((item) => <tr key={item.id} className="hover:bg-[#101C30]/60">
                <td className="px-5 py-4"><p className="font-medium text-white">{item.title}</p><p className="mt-1 max-w-xl truncate text-xs text-[#5C7394]">{item.description}</p></td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.contributionType}</td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.technologyId}</td>
                <td className="px-5 py-4 text-sm text-[#8CA3BF]">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4"><span className="rounded-full bg-[#F59E0B]/10 px-2.5 py-1 text-xs font-medium text-[#F59E0B]">Pending</span></td>
            </tr>)}
        </AdminTable>
    </div>;
}
