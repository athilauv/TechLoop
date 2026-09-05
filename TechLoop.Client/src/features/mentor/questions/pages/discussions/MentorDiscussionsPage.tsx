import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Breadcrumb from "../../../../../shared/Breadcrumb.tsx";
import { showToast } from "../../../../../utils/toast.tsx";
import {
    createDiscussionComment,
    deleteDiscussion,
    deleteDiscussionComment,
    getDiscussionComments,
    updateDiscussion,
    updateDiscussionComment,
} from "../../../../../api/discussion.api.ts";
import {
    getMentorDiscussions,
    pinDiscussion,
    unpinDiscussion,
} from "../../../../../api/mentorDiscussion.api.ts";
import type { Discussion, DiscussionComment } from "../../../../../types/discussion.types.ts";
import { useCurrentUserId } from "../../../../../hooks/useCurrentUserId.ts";
import DiscussionList from "../../../../common/Discussion/components/DiscussionList.tsx";
import PinToggleButton from "../../components/discussions/PinToggleButton.tsx";

const MentorDiscussionsPage = () => {
    const queryClient = useQueryClient();
    const currentUserId = useCurrentUserId();
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"newest" | "oldest" | "most-commented">("newest");

    const query = useInfiniteQuery({
        queryKey: ["mentor-discussions", search, sort],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => getMentorDiscussions(pageParam, 20, search, sort),
        getNextPageParam: (page) => page.hasNextPage ? page.page + 1 : undefined,
    });
    const discussions = query.data?.pages.flatMap(page => page.items) ?? [];
    const isLoading = query.isLoading;
    const isError = query.isError;

    const invalidateDiscussions = async () => {
        await queryClient.invalidateQueries({
            queryKey: ["mentor-discussions"],
        });
    };

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
            throw error;
        }
    };

    const handleEditDiscussion = async (
        discussion: Discussion,
        title: string,
        content: string,
    ) => {
        try {
            await updateDiscussion({
                id: discussion.id,
                title,
                content,
            });

            showToast.success("Discussion updated successfully.");
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(
                error instanceof Error ? error.message : "Failed to update discussion.",
            );
            throw error;
        }
    };

    const handleDeleteDiscussion = async (discussion: Discussion) => {
        try {
            await deleteDiscussion(discussion.id);
            showToast.success("Discussion deleted successfully.");
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(
                error instanceof Error ? error.message : "Failed to delete discussion.",
            );
            throw error;
        }
    };

    const handleCreateComment = async (discussion: Discussion, content: string) => {
        try {
            await createDiscussionComment(discussion.id, {
                content,
                parentCommentId: null,
            });

            await invalidateDiscussions();
        } catch (error) {
            showToast.error(
                error instanceof Error ? error.message : "Failed to post comment.",
            );
            throw error;
        }
    };

    const handleReplyComment = async (
        discussion: Discussion,
        comment: DiscussionComment,
        content: string,
    ) => {
        try {
            await createDiscussionComment(discussion.id, {
                content,
                parentCommentId: comment.id,
            });

            await invalidateDiscussions();
        } catch (error) {
            showToast.error(
                error instanceof Error ? error.message : "Failed to post reply.",
            );
            throw error;
        }
    };

    const handleEditComment = async (
        _discussion: Discussion,
        comment: DiscussionComment,
        content: string,
    ) => {
        try {
            await updateDiscussionComment(comment.id, { content });
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(
                error instanceof Error ? error.message : "Failed to update comment.",
            );
            throw error;
        }
    };

    const handleDeleteComment = async (
        _discussion: Discussion,
        comment: DiscussionComment,
    ) => {
        try {
            await deleteDiscussionComment(comment.id);
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(
                error instanceof Error ? error.message : "Failed to delete comment.",
            );
            throw error;
        }
    };

    return (
        <div className="min-h-full px-6 py-6">
            <Breadcrumb items={[{ label: "Discussions" }]} />

            <div className="mx-auto mt-6 max-w-4xl">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--cs-text)]">All Discussions</h1>
                    <p className="mt-1.5 text-sm text-[var(--cs-text-secondary)]">
                        Browse all discussions, participate in conversations, and pin useful ones.
                    </p>
                </div>

                <div className="mt-7">
                    <DiscussionList
                        discussions={discussions}
                        serverSide
                        onSearchChange={setSearch}
                        onSortChange={setSort}
                        hasNextPage={!!query.hasNextPage}
                        isFetchingNextPage={query.isFetchingNextPage}
                        onLoadMore={() => void query.fetchNextPage()}
                        isLoading={isLoading}
                        isError={isError}
                        currentUserId={currentUserId}
                        fetchComments={getDiscussionComments}
                        onCreateComment={handleCreateComment}
                        onReplyComment={handleReplyComment}
                        onEditComment={handleEditComment}
                        onDeleteComment={handleDeleteComment}
                        onEditDiscussion={handleEditDiscussion}
                        onDeleteDiscussion={handleDeleteDiscussion}
                        renderExtraAction={(discussion) => (
                            <PinToggleButton
                                isPinned={discussion.isPinned}
                                onToggle={() => handleTogglePin(discussion)}
                            />
                        )}
                        // renderContextSlot={(discussion) => (
                        //     <span className="text-[var(--cs-text-muted)]">
                        //         Question #{discussion.questionId}
                        //     </span>
                        // )}
                        emptyTitle="No discussions"
                        emptyDescription="There are no discussions yet."
                    />
                </div>
            </div>
        </div>
    );
};

export default MentorDiscussionsPage;
