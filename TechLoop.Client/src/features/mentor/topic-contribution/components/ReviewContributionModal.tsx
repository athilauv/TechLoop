import { useState } from "react";
import { X } from "lucide-react";

import Button from "../../../../shared/Button.tsx";
import type {
    ReviewTopicContributionRequest,
} from "../../../../types/topicContribution.types.ts";

interface ReviewContributionModalProps {
    open: boolean;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (request: ReviewTopicContributionRequest) => void;
}

export default function ReviewContributionModal({
                                                    open,
                                                    loading = false,
                                                    onClose,
                                                    onSubmit,
                                                }: ReviewContributionModalProps) {
    const [status, setStatus] = useState<2 | 3>(2);
    const [reviewNotes, setReviewNotes] = useState("");
    const [position, setPosition] = useState("");
    const [parentSubTopicId, setParentSubTopicId] = useState("");

    if (!open) {
        return null;
    }

    const resetForm = () => {
        setStatus(2);
        setReviewNotes("");
        setPosition("");
        setParentSubTopicId("");
    };

    const handleClose = () => {
        if (loading) {
            return;
        }
        resetForm();
        onClose();
    };

    const handleSubmit = () => {
        onSubmit({
            status,
            reviewNotes: reviewNotes.trim() || null,
            position: position.trim() ? Number(position) : null,
            parentSubTopicId: parentSubTopicId.trim()
                ? Number(parentSubTopicId)
                : null,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="review-contribution-title"
                className="
                    w-full max-w-lg overflow-hidden
                    rounded-[var(--cs-radius-card)]
                    border border-[var(--cs-border)]
                    bg-[var(--cs-bg-card)]
                    shadow-2xl
                "
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--cs-border)] px-6 py-5">
                    <div>
                        <h2
                            id="review-contribution-title"
                            className="text-lg font-semibold text-[var(--cs-text-primary)]"
                        >
                            Review Contribution
                        </h2>
                        <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                            Decide whether this contribution should be accepted.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        aria-label="Close review modal"
                        className="
                            rounded-lg p-2
                            text-[var(--cs-text-secondary)]
                            transition
                            hover:bg-white/5 hover:text-[var(--cs-text-primary)]
                            disabled:cursor-not-allowed disabled:opacity-50
                        "
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-5 px-6 py-6">
                    {/* Decision */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[var(--cs-text-primary)]">
                            Decision
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setStatus(2)}
                                disabled={loading}
                                className={`
                                    rounded-[var(--cs-radius-control)] border px-4 py-3
                                    text-sm font-medium transition
                                    disabled:cursor-not-allowed disabled:opacity-50
                                    ${
                                    status === 2
                                        ? "border-[var(--cs-accent-border)] bg-[var(--cs-accent-subtle)] text-[var(--cs-accent)]"
                                        : "border-[var(--cs-border)] bg-transparent text-[var(--cs-text-secondary)] hover:bg-white/5 hover:text-[var(--cs-text-primary)]"
                                }
                                `}
                            >
                                Approve
                            </button>

                            <button
                                type="button"
                                onClick={() => setStatus(3)}
                                disabled={loading}
                                className={`
                                    rounded-[var(--cs-radius-control)] border px-4 py-3
                                    text-sm font-medium transition
                                    disabled:cursor-not-allowed disabled:opacity-50
                                    ${
                                    status === 3
                                        ? "border-[var(--cs-danger-border)] bg-[var(--cs-danger-subtle)] text-[var(--cs-danger)]"
                                        : "border-[var(--cs-border)] bg-transparent text-[var(--cs-text-secondary)] hover:bg-white/5 hover:text-[var(--cs-text-primary)]"
                                }
                                `}
                            >
                                Reject
                            </button>
                        </div>

                        {/* Clarify what each decision actually does — approval ≠ publishing */}
                        <p className="mt-3 text-xs leading-5 text-[var(--cs-text-muted)]">
                            {status === 2
                                ? "Approving moves this contribution into the relevant management area as a draft. It will not be published to learners automatically."
                                : "Rejecting closes this contribution. The learner will see your notes below, if provided."}
                        </p>
                    </div>

                    {/* Review Notes */}
                    <div>
                        <label
                            htmlFor="review-notes"
                            className="mb-2 block text-sm font-medium text-[var(--cs-text-primary)]"
                        >
                            Review Notes
                        </label>
                        <textarea
                            id="review-notes"
                            value={reviewNotes}
                            onChange={(event) => setReviewNotes(event.target.value)}
                            rows={4}
                            placeholder="Add feedback for the learner..."
                            disabled={loading}
                            className="
                                w-full resize-none
                                rounded-[var(--cs-radius-control)]
                                border border-[var(--cs-border)]
                                bg-[var(--cs-bg-input)]
                                px-3 py-2.5
                                text-sm text-[var(--cs-text-primary)]
                                outline-none transition
                                placeholder:text-[var(--cs-text-muted)]
                                focus:border-[var(--cs-accent-border)]
                                disabled:cursor-not-allowed disabled:opacity-50
                            "
                        />
                    </div>

                    {/* Approval-only fields */}
                    {status === 2 && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="position"
                                    className="mb-2 block text-sm font-medium text-[var(--cs-text-primary)]"
                                >
                                    Position
                                </label>
                                <input
                                    id="position"
                                    type="number"
                                    min={1}
                                    value={position}
                                    onChange={(event) => setPosition(event.target.value)}
                                    placeholder="Required"
                                    disabled={loading}
                                    className="
                                        w-full rounded-[var(--cs-radius-control)]
                                        border border-[var(--cs-border)]
                                        bg-[var(--cs-bg-input)]
                                        px-3 py-2.5
                                        text-sm text-[var(--cs-text-primary)]
                                        outline-none transition
                                        placeholder:text-[var(--cs-text-muted)]
                                        focus:border-[var(--cs-accent-border)]
                                        disabled:cursor-not-allowed disabled:opacity-50
                                    "
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="parent-sub-topic-id"
                                    className="mb-2 block text-sm font-medium text-[var(--cs-text-primary)]"
                                >
                                    Parent Sub Topic ID
                                </label>
                                <input
                                    id="parent-sub-topic-id"
                                    type="number"
                                    min={1}
                                    value={parentSubTopicId}
                                    onChange={(event) =>
                                        setParentSubTopicId(event.target.value)
                                    }
                                    placeholder="Optional"
                                    disabled={loading}
                                    className="
                                        w-full rounded-[var(--cs-radius-control)]
                                        border border-[var(--cs-border)]
                                        bg-[var(--cs-bg-input)]
                                        px-3 py-2.5
                                        text-sm text-[var(--cs-text-primary)]
                                        outline-none transition
                                        placeholder:text-[var(--cs-text-muted)]
                                        focus:border-[var(--cs-accent-border)]
                                        disabled:cursor-not-allowed disabled:opacity-50
                                    "
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-[var(--cs-border)] px-6 py-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={loading}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant={status === 3 ? "danger" : "primary"}
                        size="sm"
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        {status === 3 ? "Reject Contribution" : "Approve Contribution"}
                    </Button>
                </div>
            </div>
        </div>
    );
}