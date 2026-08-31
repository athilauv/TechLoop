import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, updateAdminUserRole } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable from "../../components/AdminTable";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { showToast } from "../../../../utils/toast.tsx";

export default function AdminUsersPage() {
    const client = useQueryClient();

    const { data = [], isLoading, isError } = useQuery({
        queryKey: ["admin-users"],
        queryFn: getAdminUsers,
    });

    // The Admin Users area is intentionally for learner accounts only.
    // Mentor accounts are managed from the dedicated Mentors module.
    const learners = data.filter(
        (user) =>
            user.roleId === 1 ||
            user.role?.trim().toLowerCase() === "learner"
    );

    const roleMutation = useMutation({
        mutationFn: ({
            id,
            roleId,
        }: {
            id: string;
            roleId: number;
        }) => updateAdminUserRole(id, roleId),

        onSuccess: (result) => {
            showToast.success(
                result.message || "Role updated successfully."
            );

            client.invalidateQueries({
                queryKey: ["admin-users"],
            });
        },

        onError: (error) =>
            showToast.error(
                getErrorMessage(
                    error,
                    "Failed to update role."
                )
            ),
    });

    return (
        <div className="p-4 sm:p-6 lg:p-10">
            <AdminPageHeader
                eyebrow="Access control"
                title="Users"
                description="Review learner accounts and manage their platform role."
            />

            <AdminTable
                headers={[
                    "User",
                    "Email",
                    "Role",
                    "Last login",
                    "Status",
                    "Change role",
                ]}
                empty={
                    !isLoading &&
                    !isError &&
                    learners.length === 0
                        ? "No learner accounts found."
                        : undefined
                }
            >
                {isError && (
                    <tr>
                        <td
                            colSpan={6}
                            className="px-5 py-10 text-center text-sm text-[#F87171]"
                        >
                            Unable to load users. Check the API error for
                            details.
                        </td>
                    </tr>
                )}

                {isLoading && (
                    <tr>
                        <td
                            colSpan={6}
                            className="px-5 py-10 text-center text-sm text-[#8CA3BF]"
                        >
                            Loading users...
                        </td>
                    </tr>
                )}

                {!isLoading &&
                    !isError &&
                    learners.map((user) => (
                        <tr
                            key={user.id}
                            className="hover:bg-[#101C30]/60"
                        >
                            <td className="px-5 py-4">
                                <p className="font-medium text-white">
                                    {user.username}
                                </p>
                            </td>

                            <td className="px-5 py-4 text-sm text-[#8CA3BF]">
                                {user.email}
                            </td>

                            <td className="px-5 py-4 text-sm text-white">
                                {user.role}
                            </td>

                            <td className="px-5 py-4 text-sm text-[#8CA3BF]">
                                {user.lastLoginAt
                                    ? new Date(
                                          user.lastLoginAt
                                      ).toLocaleString()
                                    : "Never"}
                            </td>

                            <td className="px-5 py-4">
                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                        user.isLocked
                                            ? "bg-[#F87171]/10 text-[#F87171]"
                                            : "bg-[#00E8C2]/10 text-[#00E8C2]"
                                    }`}
                                >
                                    {user.isLocked
                                        ? "Locked"
                                        : "Active"}
                                </span>
                            </td>

                            <td className="px-5 py-4">
                                <select
                                    value={user.roleId}
                                    onChange={(event) => {
                                        const roleId = Number(
                                            event.target.value
                                        );

                                        showToast.confirm(
                                            "Change user role",
                                            `Change ${user.username} to ${
                                                roleId === 1
                                                    ? "Learner"
                                                    : roleId === 2
                                                      ? "Mentor"
                                                      : "Admin"
                                            }?`,
                                            () =>
                                                roleMutation.mutate({
                                                    id: user.id,
                                                    roleId,
                                                }),
                                            undefined,
                                            "Change role"
                                        );
                                    }}
                                    disabled={roleMutation.isPending}
                                    className="rounded-lg border border-[#223A59] bg-[#101C30] px-2.5 py-2 text-xs text-white outline-none focus:border-[#00E8C2]"
                                >
                                    <option value={1}>Learner</option>
                                    <option value={2}>Mentor</option>
                                    <option value={3}>Admin</option>
                                </select>
                            </td>
                        </tr>
                    ))}
            </AdminTable>
        </div>
    );
}
