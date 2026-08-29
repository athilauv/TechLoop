import { ArrowLeft, CheckCircle2, ClipboardCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../shared/Breadcrumb.tsx";
import Button from "../../../../shared/Button.tsx";
import EmptyState from "../../../../shared/EmptyState.tsx";
import LoadingSpinner from "../../../../shared/LoadingSpinner.tsx";
import {
    getMentorTopicContributionById,
    reviewTopicContribution,
} from "../../../../api/mentorTopicContribution.api.ts";
import { MENTOR_PENDING_QUERY_KEY } from "../../../../hooks/useMentorPendingQueue.ts";
import MentorContributionDetails from "../components/MentorContributionDetails.tsx";
import ReviewContributionModal from "../components/ReviewContributionModal.tsx";
import type { ReviewTopicContributionRequest, TopicContributionResponse } from "../../../../types/topicContribution.types.ts";
import { showToast } from "../../../../utils/toast.tsx";

export default function MentorTopicContributionDetailsPage() {
    const { contributionId } = useParams<{ contributionId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const contributionIdNumber = Number(contributionId);
    const isValidId =
        !!contributionId &&
        Number.isInteger(contributionIdNumber) &&
        contributionIdNumber > 0;

    const [contribution, setContribution] = useState<TopicContributionResponse | null>(null);
    const [loading, setLoading] = useState(isValidId);
    const [reviewing, setReviewing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(isValidId ? null : "Invalid contribution ID.");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isValidId) {
            return;
        }

        let cancelled = false;

        const loadContribution = async () => {
            try {
                const data = await getMentorTopicContributionById(contributionIdNumber);

                if (!cancelled) {
                    setContribution(data);
                    setError(null);
                }
            } catch {
                if (!cancelled) {
                    setError("Unable to load the contribution.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadContribution();

        return () => {
            cancelled = true;
        };
    }, [contributionId, isValidId]);

    const handleReview = async (request: ReviewTopicContributionRequest) => {
        if (!isValidId) {
            return;
        }

        try {
            setReviewing(true);
            setError(null);
            setSuccessMessage(null);

            await reviewTopicContribution(contributionIdNumber, request);

            await queryClient.invalidateQueries({
                queryKey: MENTOR_PENDING_QUERY_KEY,
            });

            setModalOpen(false);

            const message =
                request.status === 2
                    ? "Contribution approved successfully."
                    : "Contribution rejected.";

            setSuccessMessage(message);
            showToast.success(message);

            navigate("/mentor/contributions");
        } catch {
            setError("Unable to review the contribution.");
        } finally {
            setReviewing(false);
        }
    };

    if (!isValidId) {
        return (
            <EmptyState
                icon={<ClipboardCheck size={24} />}
                title="Invalid contribution ID"
                description="The requested contribution ID is invalid."
                action={
                    <Button
                        variant="secondary"
                        icon={<ArrowLeft size={15} />}
                        onClick={() => navigate("/mentor/contributions")}
                    >
                        Back to Contributions
                    </Button>
                }
            />
        );
    }

    if (loading) {
        return <LoadingSpinner size="lg" label="Loading contribution..." fullHeight />;
    }

    if (error || !contribution) {
        return (
            <EmptyState
                icon={<ClipboardCheck size={24} />}
                title="Contribution not found"
                description={error ?? "The requested contribution could not be loaded."}
                action={
                    <Button
                        variant="secondary"
                        icon={<ArrowLeft size={15} />}
                        onClick={() => navigate("/mentor/contributions")}
                    >
                        Back to Contributions
                    </Button>
                }
            />
        );
    }

    const canReview = contribution.status === 1;

    return (
        <div className="content-studio-theme flex h-full min-h-0 flex-col">
            <div className="shrink-0 border-b border-[var(--cs-border)] px-7 py-5">
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/mentor/contributions")}
                        aria-label="Back to contributions"
                        className="
                            flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--cs-radius-control)]
                            border border-[var(--cs-border)] text-[var(--cs-text-secondary)]
                            transition hover:border-[var(--cs-accent-border)] hover:text-[var(--cs-accent)]
                        "
                    >
                        <ArrowLeft size={15} />
                    </button>

                    <Breadcrumb
                        items={[
                            { label: "Mentor" },
                            {
                                label: "Review Queue",
                                onClick: () => navigate("/mentor/contributions"),
                            },
                            { label: contribution.title },
                        ]}
                    />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-[var(--cs-text-primary)]">
                            Contribution Review
                        </h1>
                        <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                            Review the learner-submitted content before it moves into the content
                            management workflow.
                        </p>
                    </div>

                    {canReview && (
                        <Button
                            size="sm"
                            icon={<ClipboardCheck size={14} />}
                            onClick={() => setModalOpen(true)}
                        >
                            Review Contribution
                        </Button>
                    )}
                </div>

                {successMessage && (
                    <div
                        className="
                            mt-4 flex items-center gap-2
                            rounded-[var(--cs-radius-control)]
                            border border-[var(--cs-accent-border)]
                            bg-[var(--cs-accent-subtle)]
                            px-4 py-2.5
                            text-sm text-[var(--cs-accent)]
                        "
                    >
                        <CheckCircle2 size={15} />
                        {successMessage}
                    </div>
                )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-7">
                <div className="mx-auto max-w-5xl">
                    <MentorContributionDetails contribution={contribution} />
                </div>
            </div>

            <ReviewContributionModal
                key={modalOpen ? "open" : "closed"}
                open={modalOpen}
                loading={reviewing}
                contribution={contribution}
                onClose={() => setModalOpen(false)}
                onSubmit={handleReview}
            />
        </div>
    );
}
