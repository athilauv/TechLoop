import { useState } from "react";
import type { FormEvent } from "react";
import { Check, Loader2, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { reviewTopicContribution } from "../../../../api/topicContribution.api.ts";
import type {ReviewTopicContributionRequest } from "../../../../types/topicContribution.types.ts";

interface ReviewContributionModalProps {
    contributionId: number;
    onClose: () => void;
    onSuccess: () => void;
}

type ReviewAction = "approve" | "reject";

interface ReviewMutationVariables {
    contributionId: number;
    request: ReviewTopicContributionRequest;
}

export default function ReviewContributionModal({
                                                    contributionId,
                                                    onClose,
                                                    onSuccess,
                                                }: ReviewContributionModalProps) {
    const [action, setAction] = useState<ReviewAction>("approve");
    const [reviewNotes, setReviewNotes] = useState("");
    const [position, setPosition] = useState("");
    const [parentSubTopicId, setParentSubTopicId] = useState("");
    const [error, setError] = useState<string | null>(null);
    const mutation = useMutation<void, Error, ReviewMutationVariables>({
        mutationFn: ({
                         contributionId,
                         request,
                     }) =>
            reviewTopicContribution(
                contributionId,
                request
            ),

        onSuccess: () => {
            toast.success(action === "approve" ? "Contribution approved successfully." : "Contribution rejected successfully.");
            onSuccess();
        },

        onError: () => {
            toast.error("Unable to review contribution.");
        },
    });

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (action === "reject" && !reviewNotes.trim()) {
            setError("Review notes are required when rejecting a contribution.");
            return;
        }

        if (action === "approve" && !position.trim()) {
            setError("Position is required when approving a contribution.");
            return;
        }

        const numericPosition = position.trim() ? Number(position) : null;
        const numericParentSubTopicId = parentSubTopicId.trim() ? Number(parentSubTopicId) : null;
        if (
            numericPosition !== null &&
            (!Number.isInteger(numericPosition) || numericPosition <= 0)){
            setError("Position must be a positive integer.");
            return;
        }

        if (numericParentSubTopicId !== null && (!Number.isInteger(numericParentSubTopicId) || numericParentSubTopicId <= 0)) {
            setError("Parent SubTopic ID must be a positive integer.");
            return;
        }

        const request: ReviewTopicContributionRequest = {
            status: action === "approve" ? 2 : 3,
            reviewNotes: reviewNotes.trim() ? reviewNotes.trim() : null,
            position: numericPosition,
            parentSubTopicId: numericParentSubTopicId,
        };

        mutation.mutate({
            contributionId,
            request,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Review Contribution
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Choose whether this contribution should be approved or rejected.
                        </p>
                    </div>

                    <button type="button" onClick={onClose} disabled={mutation.isPending}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50">
                        <X size={18} />
                    </button>

                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-6">

                    <div className="grid grid-cols-2 gap-3">

                        {/* APPROVE */}
                        <button type="button" disabled={mutation.isPending}
                            onClick={() => {
                                setAction("approve");
                                setError(null);
                            }}
                            className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                                action === "approve" ? "border-green-300 bg-green-50 text-green-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            <Check size={16} className="mx-auto mb-1"/>

                            Approve
                        </button>

                        {/* REJECT */}

                        <button type="button" disabled={mutation.isPending}
                            onClick={() => {
                                setAction("reject");
                                setError(null);
                            }}
                            className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${action === "reject" ? "border-red-300 bg-red-50 text-red-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}>
                            <X size={16} className="mx-auto mb-1"/>

                            Reject
                        </button>

                    </div>

                    {/* ==================================================
                        APPROVAL FIELDS
                    ================================================== */}

                    {action === "approve" && (
                        <div className="space-y-4">

                            {/* POSITION */}

                            <div>
                                <label htmlFor="position" className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Position
                                </label>

                                <input id="position" type="number" min="1" value={position}
                                    onChange={(event) => {
                                        setPosition(event.target.value);
                                        setError(null);
                                    }}
                                    placeholder="Enter position"
                                    disabled={mutation.isPending}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:bg-slate-50"/>
                            </div>

                            {/* PARENT SUBTOPIC */}

                            <div>
                                <label htmlFor="parentSubTopicId"
                                    className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Parent SubTopic ID
                                </label>

                                <input id="parentSubTopicId" type="number" min="1" value={parentSubTopicId}
                                    onChange={(event) => {
                                        setParentSubTopicId(event.target.value);
                                        setError(null);
                                    }}
                                    placeholder="Optional" disabled={mutation.isPending}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:bg-slate-50"/>

                                <p className="mt-1 text-xs text-slate-400">
                                    Leave empty if this is a normal subtopic.
                                </p>
                            </div>

                        </div>
                    )}

                    <div>
                        <label htmlFor="reviewNotes"
                            className="mb-1.5 block text-sm font-medium text-slate-700">
                            Review Notes

                            {action === "reject" && (
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            )}
                        </label>

                        <textarea id="reviewNotes" rows={5}
                            value={reviewNotes}
                            onChange={(event) => {
                                setReviewNotes(event.target.value);
                                setError(null);
                            }}
                            placeholder={action === "approve" ? "Optional review notes" : "Explain why the contribution was rejected"}
                            disabled={mutation.isPending}
                            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:bg-slate-50"/>
                    </div>

                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={mutation.isPending}
                            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                action === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                            }`}>
                            {mutation.isPending && (
                                <Loader2
                                    size={16} className="animate-spin"
                                />
                            )}

                            {action === "approve" ? "Approve Contribution" : "Reject Contribution"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}