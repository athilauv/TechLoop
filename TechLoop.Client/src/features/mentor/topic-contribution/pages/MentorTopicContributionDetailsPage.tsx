import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
    getMentorTopicContributionById,
} from "../../../../api/topicContribution.api.ts";

import MentorContributionDetails from "../components/MentorContributionDetails.tsx";

import ReviewContributionModal from "../components/ReviewContributionModal.tsx";

export default function MentorTopicContributionDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [showReviewModal, setShowReviewModal] =
        useState(false);

    const contributionId = Number(id);

    const {
        data: contribution,
        isLoading,
        isError,
    } = useQuery({
        queryKey: [
            "mentor-topic-contribution",
            contributionId,
        ],
        queryFn: () =>
            getMentorTopicContributionById(
                contributionId
            ),
        enabled:
            Number.isInteger(contributionId) &&
            contributionId > 0,
    });

    if (
        !Number.isInteger(contributionId) ||
        contributionId <= 0
    ) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                Invalid contribution ID.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
            </div>
        );
    }

    if (isError || !contribution) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                <h2 className="text-lg font-semibold text-slate-900">
                    Contribution not found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    This contribution may no longer be available for review.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/mentor/topic-contributions"
                        )
                    }
                    className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                    Back to Pending Contributions
                </button>
            </div>
        );
    }

    const handleReviewSuccess = () => {
        setShowReviewModal(false);

        navigate("/mentor/topic-contributions", {
            replace: true,
        });
    };

    return (
        <section className="mx-auto w-full max-w-5xl">
            <MentorContributionDetails
                contribution={contribution}
                onBack={() =>
                    navigate(
                        "/mentor/topic-contributions"
                    )
                }
                onReview={() =>
                    setShowReviewModal(true)
                }
            />

            {showReviewModal && (
                <ReviewContributionModal
                    contributionId={
                        contribution.id
                    }
                    onClose={() =>
                        setShowReviewModal(false)
                    }
                    onSuccess={
                        handleReviewSuccess
                    }
                />
            )}
        </section>
    );
}