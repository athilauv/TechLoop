import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createAdminMentor, deleteAdminMentor, getAdminMentors, getAdminTechnologies } from "../../../../api/admin.api.ts";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";
import AdminTable from "../../components/AdminTable.tsx";
import AdminIconButton from "../../components/AdminIconButton.tsx";
import AdminToolbar from "../../components/AdminToolbar.tsx";
import { adminInputClass } from "../../components/AdminFormField.tsx";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { showToast } from "../../../../utils/toast.tsx";

export default function AdminMentorsPage() {
    const client = useQueryClient();
    const [search, setSearch] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [technologyId, setTechnologyId] = useState("");
    const { data = [], isLoading } = useQuery({ queryKey: ["admin-mentors"], queryFn: getAdminMentors });
    const { data: technologies = [] } = useQuery({ queryKey: ["admin-technologies"], queryFn: getAdminTechnologies });

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return data;
        return data.filter(
            (mentor) =>
                mentor.username.toLowerCase().includes(query) ||
                mentor.email.toLowerCase().includes(query) ||
                mentor.technologyName.toLowerCase().includes(query),
        );
    }, [data, search]);

    const create = useMutation({
        mutationFn: createAdminMentor,
        onSuccess: (result) => {
            setName("");
            setEmail("");
            setTechnologyId("");
            showToast.success(result.message || "Mentor created successfully.");
            client.invalidateQueries({ queryKey: ["admin-mentors"] });
        },
        onError: (error) => showToast.error(getErrorMessage(error, "Failed to create mentor.")),
    });

    const remove = useMutation({
        mutationFn: deleteAdminMentor,
        onSuccess: () => {
            showToast.success("Mentor deleted successfully.");
            client.invalidateQueries({ queryKey: ["admin-mentors"] });
        },
        onError: (error) => showToast.error(getErrorMessage(error, "Failed to delete mentor.")),
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (!name.trim() || !email.trim() || !technologyId) return;
        create.mutate({ name: name.trim(), email: email.trim(), technologyId: Number(technologyId) });
    };

    return (
        <div className="p-6 lg:p-10">
            <AdminPageHeader
                eyebrow="People"
                title="Mentors"
                description="Create mentor accounts, review assignments, and inspect mentor activity."
            />

            <form onSubmit={submit} className="mb-6 grid gap-3 rounded-2xl border border-[#223A59] bg-[#12233B] p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Mentor name"
                    className={adminInputClass}
                />
                <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    placeholder="Mentor email"
                    className={adminInputClass}
                />
                <select
                    value={technologyId}
                    onChange={(event) => setTechnologyId(event.target.value)}
                    className={adminInputClass}
                >
                    <option value="">Assign technology</option>
                    {technologies.map((technology) => (
                        <option key={technology.id} value={technology.id}>
                            {technology.name}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    disabled={create.isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00E8C2] px-4 py-2.5 text-sm font-semibold text-[#081423] transition-colors hover:bg-[#00D4B4] disabled:opacity-50"
                >
                    <Plus size={16} />
                    Create
                </button>
            </form>

            <AdminToolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search mentors…" />

            <AdminTable
                headers={["Mentor", "Technology", "Created", "Overview", "Actions"]}
                isLoading={isLoading}
                loadingLabel="Loading mentors…"
                empty={!isLoading && filtered.length === 0 ? (data.length === 0 ? "No mentors found." : "No mentors match your search.") : undefined}
            >
                {filtered.map((mentor) => (
                    <tr key={mentor.id} className="transition-colors hover:bg-[#101C30]/60">
                        <td className="px-5 py-4">
                            <p className="font-medium text-white">{mentor.username}</p>
                            <p className="text-xs text-[#5C7394]">{mentor.email}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#8CA3BF]">{mentor.technologyName}</td>
                        <td className="px-5 py-4 text-sm text-[#8CA3BF]">{new Date(mentor.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-4">
                            <Link
                                to={`/admin/mentors/${mentor.id}`}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00E8C2] transition-colors hover:text-[#00D4B4]"
                            >
                                <Eye size={14} />
                                View
                            </Link>
                        </td>
                        <td className="px-5 py-4">
                            <AdminIconButton
                                icon={Trash2}
                                label={`Delete ${mentor.username}`}
                                tone="danger"
                                onClick={() =>
                                    showToast.confirm(
                                        "Delete mentor",
                                        `Delete ${mentor.username}? This action cannot be undone.`,
                                        () => remove.mutate(mentor.id),
                                        undefined,
                                        "Delete",
                                    )
                                }
                            />
                        </td>
                    </tr>
                ))}
            </AdminTable>
        </div>
    );
}
