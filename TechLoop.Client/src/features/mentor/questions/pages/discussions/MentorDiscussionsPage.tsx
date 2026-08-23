import { useQuery, useQueryClient } from "@tanstack/react-query";
import Breadcrumb from "../../../../../shared/Breadcrumb.tsx";
import { showToast } from "../../../../../utils/toast.tsx";
import { getMentorDiscussions, pinDiscussion, unpinDiscussion } from "../../../../../api/mentorDiscussion.api.ts";
import { getDiscussionComments } from "../../../../../api/discussion.api.ts";
import type { Discussion } from "../../../../../types/discussion.types.ts";
import { useCurrentUserId } from "../../../../../hooks/useCurrentUserId.ts";
import DiscussionList from "../../../../common/Discussion/components/DiscussionList.tsx";
import PinToggleButton from "../../components/discussions/PinToggleButton.tsx";

const MentorDiscussionsPage = () => {
    const queryClient = useQueryClient();
    const currentUserId = useCurrentUserId();

    const {
        data: discussions = [],
        isLoading,
        isError,
    } = useQuery<Discussion[]>({
        queryKey: ["mentor-discussions"],
        queryFn: getMentorDiscussions,
    });

    const invalidateDiscussions = () =>
        queryClient.invalidateQueries({ queryKey: ["mentor-discussions"] });

    const handleTogglePin = async (discussion: Discussion) => {
        try {
            if (discussion.isPinned) {
                await unpinDiscussion(discussion.id);
                showToast.success("Discussion unpinned.");
            } else {
                await pinDiscussion(discussion.id);
                showToast.success("Discussion pinned.");
            }
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(
                error instanceof Error ? error.message : "Failed to update pin status.",
            );
        }
    };

    return (
        <div className="min-h-full px-6 py-6">
            <Breadcrumb items={[{ label: "Discussions" }]} />

            <div className="mx-auto mt-6 max-w-4xl">
                <div>
                    <h1 className="text-xl font-bold text-[var(--cs-text)]">
                        All Discussions
                    </h1>
                    <p className="mt-1 text-sm text-[var(--cs-text-muted)]">
                        Browse learner discussions across every question and pin the useful ones.
                    </p>
                </div>

                <div className="mt-6">
                    <DiscussionList
                        discussions={discussions}
                        isLoading={isLoading}
                        isError={isError}
                        currentUserId={currentUserId}
                        fetchComments={getDiscussionComments}
                        commentsReadOnly
                        renderExtraAction={(discussion) => (
                            <PinToggleButton
                                isPinned={discussion.isPinned}
                                onToggle={() => handleTogglePin(discussion)}
                            />
                        )}
                        renderContextSlot={(discussion) => (
                            <span className="text-[var(--cs-text-muted)]">
                                Question #{discussion.questionId}
                            </span>
                        )}
                        emptyTitle="No discussions"
                        emptyDescription="There are no learner discussions yet."
                    />
                </div>
            </div>
        </div>
    );
};

export default MentorDiscussionsPage;
