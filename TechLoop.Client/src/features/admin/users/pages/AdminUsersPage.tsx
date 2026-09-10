import { useState } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminTechnologies, getAdminUsers, updateAdminUserRole } from "../../../../api/admin.api.ts";
import type { AdminUser } from "../../../../types/admin.types.ts";
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
    const [mentorConversionUser, setMentorConversionUser] = useState<AdminUser | null>(null);
    const [selectedTechnologyId, setSelectedTechnologyId] = useState<number | null>(null);

    const query = useInfiniteQuery({
        queryKey: ["admin-users", search, status],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => getAdminUsers(pageParam, PAGE_SIZE, search, status),
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    });

    const users = query.data?.pages.flatMap((page) => page.items) ?? [];

    const technologiesQuery = useQuery({
        queryKey: ["admin-mentor-assignment-technologies"],
        queryFn: getAdminTechnologies,
        enabled: mentorConversionUser !== null,
        staleTime: 5 * 60 * 1000,
    });

    const roleMutation = useMutation({
        mutationFn: ({ id, roleId, technologyId }: { id: string; roleId: number; technologyId?: number }) =>
            updateAdminUserRole(id, roleId, technologyId),
        onSuccess: (result) => {
            showToast.success(result.message || "Role updated successfully.");
            void client.invalidateQueries({ queryKey: ["admin-users"] });
            setMentorConversionUser(null);
            setSelectedTechnologyId(null);
        },
        onError: (error) => showToast.error(getErrorMessage(error, "Failed to update role.")),
    });

    const requestRoleChange = (user: AdminUser, roleId: number) => {
        if (roleId === user.roleId) return;

        if (roleId === 2) {
            setMentorConversionUser(user);
            setSelectedTechnologyId(null);
            return;
        }

        showToast.confirm(
            "Change user role",
            `Change ${user.username} role?`,
            () => roleMutation.mutate({ id: user.id, roleId }),
            undefined,
            "Change role",
        );
    };

    const confirmMentorConversion = () => {
        if (!mentorConversionUser || !selectedTechnologyId) {
            showToast.error("Select a technology before converting the user to Mentor.");
            return;
        }

        showToast.confirm(
            "Convert user to Mentor",
            `Convert ${mentorConversionUser.username} to Mentor and send the initial setup email?`,
            () => roleMutation.mutate({
                id: mentorConversionUser.id,
                roleId: 2,
                technologyId: selectedTechnologyId,
            }),
            undefined,
            "Convert to Mentor",
        );
    };

    return <div className="p-4 sm:p-6 lg:p-10">
        <AdminPageHeader eyebrow="Access control" title="Users" description="Review learner accounts and manage their platform role." />
        <div className="mb-4 flex gap-3"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search learners..." className="rounded-lg border border-[#223A59] bg-[#101C30] px-3 py-2 text-sm text-white" /><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-[#223A59] bg-[#101C30] px-3 py-2 text-sm text-white"><option value="">All status</option><option value="active">Active</option><option value="locked">Locked</option></select></div>
        <AdminTable headers={["User","Email","Role","Last login","Status","Change role"]} empty={!query.isLoading && !query.isError && users.length === 0 ? "No learner accounts found." : undefined}>
            {query.isError && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#F87171]">Unable to load users.</td></tr>}
            {query.isLoading && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#8CA3BF]">Loading users...</td></tr>}
            {!query.isLoading && !query.isError && users.map((user) => <tr key={user.id}>
                <td className="px-5 py-4 font-medium text-white">{user.username}</td><td className="px-5 py-4 text-sm text-[#8CA3BF]">{user.email}</td><td className="px-5 py-4 text-sm text-white">{user.role}</td><td className="px-5 py-4 text-sm text-[#8CA3BF]">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}</td>
                <td className="px-5 py-4"><span className="text-xs">{user.isLocked ? "Locked" : "Active"}</span></td><td className="px-5 py-4">
                <select value={user.roleId} onChange={(e) => requestRoleChange(user, Number(e.target.value))} disabled={roleMutation.isPending} className="rounded-lg border border-[#223A59] bg-[#101C30] px-2.5 py-2 text-xs text-white">
                    <option value={1}>
                        Learner
                    </option>
                    <option value={2}>
                        Mentor
                    </option>
                </select></td>
            </tr>)}
        </AdminTable>
        <InfiniteScrollTrigger hasNextPage={!!query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} onLoadMore={() => void query.fetchNextPage()} />

        {mentorConversionUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="mentor-conversion-title">
                <div className="w-full max-w-md rounded-2xl border border-[#223A59] bg-[#12233B] p-6 shadow-2xl">
                    <div className="mb-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[#00E8C2]">Role conversion</p>
                        <h2 id="mentor-conversion-title" className="mt-1 text-lg font-semibold text-white">Convert {mentorConversionUser.username} to Mentor</h2>
                        <p className="mt-1 text-sm text-[#8CA3BF]">Select the technology this mentor will be responsible for. An initial setup email will be sent after conversion.</p>
                    </div>

                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.8px] text-[#7A99BB]">Technology</label>
                    <select
                        value={selectedTechnologyId ?? ""}
                        onChange={(e) => setSelectedTechnologyId(e.target.value ? Number(e.target.value) : null)}
                        disabled={technologiesQuery.isLoading || technologiesQuery.isError || roleMutation.isPending}
                        className="mb-2 w-full rounded-xl border border-[#223A59] bg-[#101C30] px-3 py-2.5 text-sm text-white outline-none focus:border-[#00E8C2]"
                    >
                        <option value="">Select technology</option>
                        {technologiesQuery.data?.map((technology) => (
                            <option key={technology.id} value={technology.id}>{technology.name}</option>
                        ))}
                    </select>

                    {technologiesQuery.isLoading && <p className="text-xs text-[#8CA3BF]">Loading technologies...</p>}
                    {technologiesQuery.isError && <p className="text-xs text-[#F87171]">Unable to load technologies.</p>}

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => { setMentorConversionUser(null); setSelectedTechnologyId(null); }} disabled={roleMutation.isPending} className="rounded-xl border border-[#223A59] px-4 py-2.5 text-sm text-white">Cancel</button>
                        <button type="button" onClick={confirmMentorConversion} disabled={roleMutation.isPending || technologiesQuery.isLoading || technologiesQuery.isError || !selectedTechnologyId} className="rounded-xl bg-[#00E8C2] px-4 py-2.5 text-sm font-semibold text-[#081423] disabled:opacity-50">
                            {roleMutation.isPending ? "Converting..." : "Convert to Mentor"}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>;
}
