import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, updateAdminUserRole } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";
import AdminTable from "../../components/AdminTable.tsx";
import AdminBadge from "../../components/AdminBadge.tsx";
import AdminToolbar from "../../components/AdminToolbar.tsx";
import AdminFilterChip from "../../components/AdminFilterChip.tsx";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { showToast } from "../../../../utils/toast.tsx";

const ROLE_NAME_BY_ID: Record<number, string> = {
    1: "Learner",
    2: "Mentor",
    3: "Admin",
};

type RoleFilter = "all" | "Learner" | "Mentor" | "Admin";

export default function AdminUsersPage() {
    const client = useQueryClient();
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
    const { data = [], isLoading } = useQuery({ queryKey: ["admin-users"], queryFn: getAdminUsers });

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        return data
            .filter((user) => roleFilter === "all" || user.role === roleFilter)
            .filter((user) => !query || user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query));
    }, [data, search, roleFilter]);

    const roleMutation = useMutation({
        mutationFn: ({ id, roleId }: { id: string; roleId: number }) => updateAdminUserRole(id, roleId),
        onSuccess: (result) => {
            showToast.success(result.message || "Role updated successfully.");
            client.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: (error) => showToast.error(getErrorMessage(error, "Failed to update role.")),
    });

    const handleRoleChange = (userName: string, userId: string, roleId: number) => {
        showToast.confirm(
            "Change user role",
            `Change ${userName} to ${ROLE_NAME_BY_ID[roleId] ?? "this role"}?`,
            () => roleMutation.mutate({ id: userId, roleId }),
            undefined,
            "Change role",
        );
    };

    return (
        <div className="p-6 lg:p-10">
            <AdminPageHeader
                eyebrow="Access control"
                title="Users"
                description="Review platform accounts and manage their platform role."
            />

            <AdminToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search by name or email…"
                filters={
                    <>
                        <AdminFilterChip label="All" active={roleFilter === "all"} onClick={() => setRoleFilter("all")} />
                        <AdminFilterChip label="Learners" active={roleFilter === "Learner"} onClick={() => setRoleFilter("Learner")} />
                        <AdminFilterChip label="Mentors" active={roleFilter === "Mentor"} onClick={() => setRoleFilter("Mentor")} />
                        <AdminFilterChip label="Admins" active={roleFilter === "Admin"} onClick={() => setRoleFilter("Admin")} />
                    </>
                }
            />

            <AdminTable
                headers={["User", "Email", "Role", "Last login", "Status", "Change role"]}
                isLoading={isLoading}
                loadingLabel="Loading users…"
                empty={!isLoading && filtered.length === 0 ? (data.length === 0 ? "No users found." : "No users match your filters.") : undefined}
            >
                {filtered.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-[#101C30]/60">
                        <td className="px-5 py-4">
                            <p className="font-medium text-white">{user.username}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#8CA3BF]">{user.email}</td>
                        <td className="px-5 py-4 text-sm text-white">{user.role}</td>
                        <td className="px-5 py-4 text-sm text-[#8CA3BF]">
                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}
                        </td>
                        <td className="px-5 py-4">
                            <AdminBadge tone={user.isLocked ? "danger" : "success"} dot>
                                {user.isLocked ? "Locked" : "Active"}
                            </AdminBadge>
                        </td>
                        <td className="px-5 py-4">
                            {user.roleId === 3 ? (
                                <span className="text-xs font-medium text-[#5C7394]">Protected</span>
                            ) : (
                                <select
                                    value={user.roleId}
                                    onChange={(event) => handleRoleChange(user.username, user.id, Number(event.target.value))}
                                    disabled={roleMutation.isPending}
                                    aria-label={`Change role for ${user.username}`}
                                    className="rounded-lg border border-[#223A59] bg-[#101C30] px-2.5 py-2 text-xs text-white outline-none transition-colors focus:border-[#00E8C2] disabled:opacity-50"
                                >
                                    <option value={1}>Learner</option>
                                    <option value={2}>Mentor</option>
                                </select>
                            )}
                        </td>
                    </tr>
                ))}
            </AdminTable>
        </div>
    );
}
