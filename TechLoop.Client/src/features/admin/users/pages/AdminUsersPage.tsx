import { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, updateAdminUserRole } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable from "../../components/AdminTable";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { showToast } from "../../../../utils/toast.tsx";
import InfiniteScrollTrigger from "../../../../shared/InfiniteScrollTrigger";

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
    const client = useQueryClient();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const query = useInfiniteQuery({
        queryKey: ["admin-users", search, status],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => getAdminUsers(pageParam, PAGE_SIZE, search, status),
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    });
    const users = query.data?.pages.flatMap((page) => page.items) ?? [];
    const roleMutation = useMutation({
        mutationFn: ({ id, roleId }: { id: string; roleId: number }) => updateAdminUserRole(id, roleId),
        onSuccess: (result) => { showToast.success(result.message || "Role updated successfully."); void client.invalidateQueries({ queryKey: ["admin-users"] }); },
        onError: (error) => showToast.error(getErrorMessage(error, "Failed to update role.")),
    });
    return <div className="p-4 sm:p-6 lg:p-10">
        <AdminPageHeader eyebrow="Access control" title="Users" description="Review learner accounts and manage their platform role." />
        <div className="mb-4 flex gap-3"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search learners..." className="rounded-lg border border-[#223A59] bg-[#101C30] px-3 py-2 text-sm text-white" /><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-[#223A59] bg-[#101C30] px-3 py-2 text-sm text-white"><option value="">All status</option><option value="active">Active</option><option value="locked">Locked</option></select></div>
        <AdminTable headers={["User","Email","Role","Last login","Status","Change role"]} empty={!query.isLoading && !query.isError && users.length === 0 ? "No learner accounts found." : undefined}>
            {query.isError && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#F87171]">Unable to load users.</td></tr>}
            {query.isLoading && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#8CA3BF]">Loading users...</td></tr>}
            {!query.isLoading && !query.isError && users.map((user) => <tr key={user.id}>
                <td className="px-5 py-4 font-medium text-white">{user.username}</td><td className="px-5 py-4 text-sm text-[#8CA3BF]">{user.email}</td><td className="px-5 py-4 text-sm text-white">{user.role}</td><td className="px-5 py-4 text-sm text-[#8CA3BF]">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}</td>
                <td className="px-5 py-4"><span className="text-xs">{user.isLocked ? "Locked" : "Active"}</span></td><td className="px-5 py-4"><select value={user.roleId} onChange={(e) => { const roleId=Number(e.target.value); showToast.confirm("Change user role", `Change ${user.username} role?`, () => roleMutation.mutate({ id:user.id, roleId }), undefined, "Change role"); }} disabled={roleMutation.isPending} className="rounded-lg border border-[#223A59] bg-[#101C30] px-2.5 py-2 text-xs text-white"><option value={1}>Learner</option><option value={2}>Mentor</option><option value={3}>Admin</option></select></td>
            </tr>)}
        </AdminTable>
        <InfiniteScrollTrigger hasNextPage={!!query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} onLoadMore={() => void query.fetchNextPage()} />
    </div>;
}
