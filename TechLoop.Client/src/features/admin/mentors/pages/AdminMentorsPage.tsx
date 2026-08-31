import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

import {
    createAdminMentor,
    deleteAdminMentor,
    getAdminMentors,
    getAdminTechnologies,
} from "../../../../api/admin.api.ts";

import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable from "../../components/AdminTable";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { showToast } from "../../../../utils/toast.tsx";

export default function AdminMentorsPage() {
    const client = useQueryClient();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [technologyId, setTechnologyId] = useState("");

    const {
        data: mentors = [],
        isLoading: mentorsLoading,
        isError: mentorsError,
    } = useQuery({
        queryKey: ["admin-mentors"],
        queryFn: getAdminMentors,
    });

    const {
        data: technologies = [],
        isLoading: technologiesLoading,
        isError: technologiesError,
        refetch: refetchTechnologies,
    } = useQuery({
        queryKey: ["admin-technologies"],
        queryFn: getAdminTechnologies,
    });

    const create = useMutation({
        mutationFn: createAdminMentor,

        onSuccess: (result) => {
            setName("");
            setEmail("");
            setTechnologyId("");

            showToast.success(
                result.message || "Mentor created successfully."
            );

            client.invalidateQueries({
                queryKey: ["admin-mentors"],
            });
        },

        onError: (error) => {
            showToast.error(
                getErrorMessage(
                    error,
                    "Failed to create mentor."
                )
            );
        },
    });

    const remove = useMutation({
        mutationFn: deleteAdminMentor,

        onSuccess: () => {
            showToast.success(
                "Mentor deleted successfully."
            );

            client.invalidateQueries({
                queryKey: ["admin-mentors"],
            });
        },

        onError: (error) => {
            showToast.error(
                getErrorMessage(
                    error,
                    "Failed to delete mentor."
                )
            );
        },
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        // ---------------------------------------------
        // Name validation
        // ---------------------------------------------

        if (!trimmedName) {
            showToast.error(
                "Mentor name is required."
            );
            return;
        }

        // ---------------------------------------------
        // Email required validation
        // ---------------------------------------------

        if (!trimmedEmail) {
            showToast.error(
                "Email is required."
            );
            return;
        }

        // ---------------------------------------------
        // Leading/trailing whitespace validation
        // ---------------------------------------------

        if (email !== trimmedEmail) {
            showToast.error(
                "Email cannot contain leading or trailing spaces."
            );
            return;
        }

        // ---------------------------------------------
        // Email format validation
        // ---------------------------------------------

        const emailPattern =
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailPattern.test(trimmedEmail)) {
            showToast.error(
                "Please enter a valid email address."
            );
            return;
        }

        // ---------------------------------------------
        // Technology validation
        // ---------------------------------------------

        if (!technologyId) {
            showToast.error(
                "Technology is required."
            );
            return;
        }

        const parsedTechnologyId = Number(technologyId);

        if (
            !Number.isInteger(parsedTechnologyId) ||
            parsedTechnologyId <= 0
        ) {
            showToast.error(
                "Please select a valid technology."
            );
            return;
        }

        // ---------------------------------------------
        // Technology API state
        // ---------------------------------------------

        if (technologiesLoading) {
            showToast.error(
                "Please wait until technologies are loaded."
            );
            return;
        }

        if (technologiesError) {
            showToast.error(
                "Unable to load technologies. Please try again."
            );
            return;
        }

        // ---------------------------------------------
        // Submit
        // ---------------------------------------------

        create.mutate({
            name: trimmedName,
            email: trimmedEmail,
            technologyId: parsedTechnologyId,
        });
    };

    const handleRetryTechnologies = async () => {
        await refetchTechnologies();
    };

    return (
        <div className="p-4 sm:p-6 lg:p-10">
            <AdminPageHeader
                eyebrow="People"
                title="Mentors"
                description="Create mentor accounts, review assignments, and inspect mentor activity."
            />

            {/* Create Mentor Form */}
            <form
                onSubmit={submit}
                noValidate
                className="
                    mb-6
                    grid
                    grid-cols-1
                    gap-3
                    rounded-2xl
                    border
                    border-[#223A59]
                    bg-[#12233B]
                    p-4
                    sm:grid-cols-2
                    lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]
                "
            >
                {/* Mentor Name */}
                <input
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                    placeholder="Mentor name"
                    autoComplete="name"
                    disabled={create.isPending}
                    className="
                        h-11
                        min-w-0
                        rounded-xl
                        border
                        border-[#223A59]
                        bg-[#101C30]
                        px-3
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-[#5C7394]
                        focus:border-[#00E8C2]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                />

                {/* Mentor Email */}
                <input
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    type="email"
                    placeholder="Mentor email"
                    autoComplete="email"
                    disabled={create.isPending}
                    className="
                        h-11
                        min-w-0
                        rounded-xl
                        border
                        border-[#223A59]
                        bg-[#101C30]
                        px-3
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-[#5C7394]
                        focus:border-[#00E8C2]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                />

                {/* Technology */}
                <select
                    value={technologyId}
                    onChange={(event) =>
                        setTechnologyId(event.target.value)
                    }
                    disabled={
                        technologiesLoading ||
                        technologiesError ||
                        create.isPending
                    }
                    className="
                        h-11
                        min-w-0
                        rounded-xl
                        border
                        border-[#223A59]
                        bg-[#101C30]
                        px-3
                        text-sm
                        text-white
                        outline-none
                        focus:border-[#00E8C2]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >
                    <option value="">
                        {technologiesLoading
                            ? "Loading technologies..."
                            : technologiesError
                                ? "Unable to load technologies"
                                : "Assign technology"}
                    </option>

                    {technologies.map((technology) => (
                        <option
                            key={technology.id}
                            value={technology.id}
                        >
                            {technology.name}
                        </option>
                    ))}
                </select>

                {/* Create */}
                <button
                    type="submit"
                    disabled={create.isPending}
                    className="
                        inline-flex
                        min-h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[#00E8C2]
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-[#081423]
                        transition
                        hover:bg-[#00D7B4]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#00E8C2]/40
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <Plus size={16} />

                    {create.isPending
                        ? "Creating..."
                        : "Create"}
                </button>
            </form>

            {/* Technology error */}
            {technologiesError && (
                <div
                    className="
                        mb-6
                        flex
                        flex-col
                        gap-3
                        rounded-xl
                        border
                        border-[#F87171]/30
                        bg-[#F87171]/5
                        px-4
                        py-3
                        text-sm
                        text-[#F87171]
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <span>
                        Unable to load technologies.
                        Mentor creation is unavailable until
                        the technology list can be loaded.
                    </span>

                    <button
                        type="button"
                        onClick={handleRetryTechnologies}
                        disabled={technologiesLoading}
                        className="
                            shrink-0
                            rounded-lg
                            border
                            border-[#F87171]/30
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            transition
                            hover:bg-[#F87171]/10
                            disabled:opacity-50
                        "
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Mentor Table */}
            <AdminTable
                headers={[
                    "Mentor",
                    "Technology",
                    "Created",
                    "Overview",
                    "Actions",
                ]}
                empty={
                    !mentorsLoading &&
                    !mentorsError &&
                    mentors.length === 0
                        ? "No mentors found."
                        : undefined
                }
            >
                {/* Mentor API error */}
                {mentorsError && (
                    <tr>
                        <td
                            colSpan={5}
                            className="
                                px-5
                                py-10
                                text-center
                                text-sm
                                text-[#F87171]
                            "
                        >
                            Unable to load mentors.
                            Check the API error for details.
                        </td>
                    </tr>
                )}

                {/* Loading */}
                {mentorsLoading && (
                    <tr>
                        <td
                            colSpan={5}
                            className="
                                px-5
                                py-10
                                text-center
                                text-sm
                                text-[#8CA3BF]
                            "
                        >
                            Loading mentors...
                        </td>
                    </tr>
                )}

                {/* Data */}
                {!mentorsLoading &&
                    !mentorsError &&
                    mentors.map((mentor) => (
                        <tr
                            key={mentor.id}
                            className="hover:bg-[#101C30]/60"
                        >
                            <td className="px-5 py-4">
                                <p className="font-medium text-white">
                                    {mentor.username}
                                </p>

                                <p className="text-xs text-[#5C7394]">
                                    {mentor.email}
                                </p>
                            </td>

                            <td className="px-5 py-4 text-sm text-[#8CA3BF]">
                                {mentor.technologyName}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-sm text-[#8CA3BF]">
                                {new Date(
                                    mentor.createdAt
                                ).toLocaleDateString()}
                            </td>

                            <td className="px-5 py-4">
                                <Link
                                    to={`/admin/mentors/${mentor.id}`}
                                    className="
                                        text-sm
                                        font-medium
                                        text-[#00E8C2]
                                        hover:underline
                                    "
                                >
                                    View
                                </Link>
                            </td>

                            <td className="px-5 py-4">
                                <button
                                    type="button"
                                    disabled={remove.isPending}
                                    onClick={() =>
                                        showToast.confirm(
                                            "Delete mentor",
                                            `Delete ${mentor.username}? This action cannot be undone.`,
                                            () =>
                                                remove.mutate(
                                                    mentor.id
                                                ),
                                            undefined,
                                            "Delete"
                                        )
                                    }
                                    className="
                                        rounded-lg
                                        p-2
                                        text-[#F87171]
                                        transition
                                        hover:bg-[#F87171]/10
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    <Trash2 size={15} />
                                </button>
                            </td>
                        </tr>
                    ))}
            </AdminTable>
        </div>
    );
}