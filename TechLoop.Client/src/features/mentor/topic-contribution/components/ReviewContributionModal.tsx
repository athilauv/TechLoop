import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import Button from "../../../../shared/Button.tsx";
import {
    getMentorSubTopics,
} from "../../../../api/mentorSubTopic.api.ts";
import {
    getMentorTopics,
} from "../../../../api/mentorTopic.api.ts";
import type { ReviewTopicContributionRequest, TopicContributionResponse } from "../../../../types/topicContribution.types.ts";

interface ReviewContributionModalProps {
    open: boolean;
    loading?: boolean;
    contribution: TopicContributionResponse;
    onClose: () => void;
    onSubmit: (request: ReviewTopicContributionRequest) => void;
}

export default function ReviewContributionModal({
    open,
    loading = false,
    contribution,
    onClose,
    onSubmit,
}: ReviewContributionModalProps) {
    const [status, setStatus] = useState<2 | 3>(2);
    const [reviewNotes, setReviewNotes] = useState("");
    const [position, setPosition] = useState("");
    const [parentSubTopicId, setParentSubTopicId] = useState("");

    const isSubTopicContribution = contribution.topicId !== null;
    const topicId = contribution.topicId ?? undefined;

    const { data: subTopics = [], isLoading: isSubTopicsLoading } = useQuery({
        queryKey: ["mentor-review-subtopics", topicId],
        queryFn: () => getMentorSubTopics(topicId),
        enabled: open && status === 2 && topicId !== undefined && isSubTopicContribution,
    });

    const { data: topics = [], isLoading: isTopicsLoading } = useQuery({
        queryKey: ["mentor-review-topics", contribution.technologyId],
        queryFn: getMentorTopics,
        enabled: open && status === 2 && !isSubTopicContribution,
    });

    const availableParentSubTopics = useMemo(
        () =>
            subTopics
                .filter((subTopic) => subTopic.id !== contribution.subTopicId)
                .sort((a, b) => a.position - b.position),
        [subTopics, contribution.subTopicId],
    );

    const nextPosition = useMemo(() => {
        if (isSubTopicContribution) {
            return (
                Math.max(0, ...subTopics.map((subTopic) => subTopic.position)) + 1
            );
        }

        const technologyTopics = topics.filter(
            (topic) => topic.technologyId === contribution.technologyId,
        );

        return Math.max(0, ...technologyTopics.map((topic) => topic.position)) + 1;
    }, [
        contribution.technologyId,
        isSubTopicContribution,
        subTopics,
        topics,
    ]);

    useEffect(() => {
        if (!open) {
            return;
        }

        setStatus(2);
        setReviewNotes("");
        setParentSubTopicId("");
        setPosition("");
    }, [open, contribution.id]);

    useEffect(() => {
        if (!open || status !== 2 || position.trim()) {
            return;
        }

        if (isSubTopicContribution && isSubTopicsLoading) {
            return;
        }

        if (!isSubTopicContribution && isTopicsLoading) {
            return;
        }

        setPosition(String(nextPosition));
    }, [
        isSubTopicContribution,
        isSubTopicsLoading,
        isTopicsLoading,
        nextPosition,
        open,
        position,
        status,
    ]);

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
        if (status === 2 && (!position.trim() || Number(position) <= 0)) {
            return;
        }

        onSubmit({
            status,
            reviewNotes: reviewNotes.trim() || null,
            position: status === 2 ? Number(position) : null,
            parentSubTopicId:
                status === 2 && isSubTopicContribution && parentSubTopicId.trim()
                    ? Number(parentSubTopicId)
                    : null,
        });
    };

    const placementLoading =
        status === 2 &&
        (isSubTopicContribution ? isSubTopicsLoading : isTopicsLoading);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close review dialog"
                onClick={handleClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="review-contribution-title"
                className="
                    relative flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col
                    overflow-hidden rounded-[var(--cs-radius-card)]
                    border border-[var(--cs-border)]
                    bg-[var(--cs-bg-surface)]
                    shadow-2xl
                "
                style={{ animation: "cs-pop-in 160ms ease-out" }}
            >
                <style>{`
                    @keyframes cs-pop-in {
                        from { transform: scale(0.97) translateY(6px); opacity: 0.7; }
                        to { transform: scale(1) translateY(0); opacity: 1; }
                    }
                `}</style>

                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-[var(--cs-border)] px-6 py-5">
                    <div className="min-w-0">
                        <p className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                            review contribution
                        </p>
                        <h2
                            id="review-contribution-title"
                            className="mt-1 truncate text-lg font-semibold text-[var(--cs-text-primary)]"
                        >
                            {contribution.title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        aria-label="Close review dialog"
                        className="
                            shrink-0 rounded-[var(--cs-radius-control)] p-2
                            text-[var(--cs-text-secondary)]
                            transition
                            hover:bg-white/5 hover:text-[var(--cs-text-primary)]
                            disabled:cursor-not-allowed disabled:opacity-50
                        "
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Decision segmented control — full width, sits directly under header */}
                <div className="grid grid-cols-2 gap-2 border-b border-[var(--cs-border)] px-6 py-4">
                    <button
                        type="button"
                        onClick={() => setStatus(2)}
                        disabled={loading}
                        className={`
                            flex items-center justify-center gap-2 rounded-[var(--cs-radius-control)] border px-4 py-3
                            text-sm font-medium transition
                            disabled:cursor-not-allowed disabled:opacity-50
                            ${
                            status === 2
                                ? "border-[var(--cs-accent-border)] bg-[var(--cs-accent-subtle)] text-[var(--cs-accent)]"
                                : "border-[var(--cs-border)] bg-transparent text-[var(--cs-text-secondary)] hover:bg-white/5 hover:text-[var(--cs-text-primary)]"
                        }
                        `}
                    >
                        <CheckCircle2 size={16} />
                        Approve
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatus(3)}
                        disabled={loading}
                        className={`
                            flex items-center justify-center gap-2 rounded-[var(--cs-radius-control)] border px-4 py-3
                            text-sm font-medium transition
                            disabled:cursor-not-allowed disabled:opacity-50
                            ${
                            status === 3
                                ? "border-[var(--cs-danger-border)] bg-[var(--cs-danger-subtle)] text-[var(--cs-danger)]"
                                : "border-[var(--cs-border)] bg-transparent text-[var(--cs-text-secondary)] hover:bg-white/5 hover:text-[var(--cs-text-primary)]"
                        }
                        `}
                    >
                        <XCircle size={16} />
                        Reject
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                    <p className="rounded-[var(--cs-radius-control)] bg-[var(--cs-bg-input)] px-3.5 py-2.5 text-xs leading-5 text-[var(--cs-text-muted)]">
                        {status === 2
                            ? "Approving moves this contribution into the relevant management area as a draft. It will not be published to learners automatically."
                            : "Rejecting closes this contribution. The learner will see your notes below, if provided."}
                    </p>

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

                    {status === 2 && (
                        <div className="space-y-4 rounded-[var(--cs-radius-control)] border border-[var(--cs-accent-border)] bg-[var(--cs-accent-subtle)] p-4">
                            <p className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-accent)]">
                                placement
                            </p>

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
                                        placeholder={placementLoading ? "Calculating..." : "Required"}
                                        disabled={loading || placementLoading}
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
                                    <p className="mt-1.5 text-xs text-[var(--cs-text-muted)]">
                                        Next available position is pre-filled.
                                    </p>
                                </div>

                                {isSubTopicContribution && (
                                    <div>
                                        <label
                                            htmlFor="parent-sub-topic-id"
                                            className="mb-2 block text-sm font-medium text-[var(--cs-text-primary)]"
                                        >
                                            Parent SubTopic
                                            <span className="ml-1 font-normal text-[var(--cs-text-muted)]">
                                                (Optional)
                                            </span>
                                        </label>

                                        <select
                                            id="parent-sub-topic-id"
                                            value={parentSubTopicId}
                                            onChange={(event) => setParentSubTopicId(event.target.value)}
                                            disabled={
                                                loading ||
                                                placementLoading ||
                                                topicId === undefined
                                            }
                                            className="
                                                h-11 w-full rounded-[var(--cs-radius-control)]
                                                border border-[var(--cs-border)]
                                                bg-[var(--cs-bg-input)]
                                                px-3 text-sm text-[var(--cs-text-primary)]
                                                outline-none transition
                                                focus:border-[var(--cs-accent-border)]
                                                disabled:cursor-not-allowed disabled:opacity-50
                                            "
                                        >
                                            <option value="">Top-level SubTopic</option>
                                            {availableParentSubTopics.map((subTopic) => (
                                                <option key={subTopic.id} value={subTopic.id}>
                                                    {subTopic.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {isSubTopicContribution && (
                                <p className="text-xs text-[var(--cs-text-muted)]">
                                    Only existing subtopics under "{contribution.topicTitle ?? "this topic"}" are shown.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-[var(--cs-border)] px-6 py-5">
                    <Button variant="secondary" size="sm" disabled={loading} onClick={handleClose}>
                        Cancel
                    </Button>

                    <Button
                        variant={status === 3 ? "danger" : "primary"}
                        size="sm"
                        loading={loading}
                        disabled={
                            loading ||
                            placementLoading ||
                            (status === 2 && (!position.trim() || Number(position) <= 0))
                        }
                        onClick={handleSubmit}
                    >
                        {status === 3 ? "Reject Contribution" : "Approve Contribution"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
