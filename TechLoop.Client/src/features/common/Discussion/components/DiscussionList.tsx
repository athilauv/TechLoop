import { useMemo, useState, type ReactNode } from "react";
import { MessageSquare, Search } from "lucide-react";

import EmptyState from "../../../../shared/EmptyState";
import LoadingSpinner from "../../../../shared/LoadingSpinner";

import type { Discussion, DiscussionComment } from "../../../../types/discussion.types.ts";
import DiscussionListItem from "./DiscussionListItem";
import CustomSelect from "../../../../shared/Customselect.tsx";

type SortOption = "newest" | "oldest" | "most-commented";

interface DiscussionListProps {
    discussions: Discussion[];
    isLoading: boolean;
    isError: boolean;
    currentUserId?: string | null;

    fetchComments: (discussionId: number) => Promise<DiscussionComment[]>;
    commentsReadOnly?: boolean;
    onCreateComment?: (discussion: Discussion, content: string) => Promise<void>;
    onReplyComment?: (
        discussion: Discussion,
        comment: DiscussionComment,
        content: string,
    ) => Promise<void>;
    onEditComment?: (
        discussion: Discussion,
        comment: DiscussionComment,
        content: string,
    ) => Promise<void>;
    onDeleteComment?: (discussion: Discussion, comment: DiscussionComment) => Promise<void>;

    onEditDiscussion?: (discussion: Discussion, title: string, content: string) => Promise<void>;
    onDeleteDiscussion?: (discussion: Discussion) => Promise<void>;

    renderExtraAction?: (discussion: Discussion) => ReactNode;
    renderContextSlot?: (discussion: Discussion) => ReactNode;

    emptyTitle?: string;
    emptyDescription?: string;
}

const DiscussionList = ({
                            discussions,
                            isLoading,
                            isError,
                            currentUserId,
                            fetchComments,
                            commentsReadOnly = false,
                            onCreateComment,
                            onReplyComment,
                            onEditComment,
                            onDeleteComment,
                            onEditDiscussion,
                            onDeleteDiscussion,
                            renderExtraAction,
                            renderContextSlot,
                            emptyTitle = "No discussions yet",
                            emptyDescription = "Start the conversation.",
                        }: DiscussionListProps) => {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortOption>("newest");
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

    const toggleExpand = (id: number) => {
        setExpandedIds((current) => {
            const next = new Set(current);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const filteredAndSorted = useMemo(() => {
        const normalized = search.trim().toLowerCase();

        const filtered = normalized
            ? discussions.filter(
                (discussion) =>
                    discussion.title.toLowerCase().includes(normalized) ||
                    discussion.content.toLowerCase().includes(normalized) ||
                    discussion.userName.toLowerCase().includes(normalized),
            )
            : discussions;

        const sorted = [...filtered].sort((a, b) => {
            if (sort === "oldest") {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            if (sort === "most-commented") {
                return b.commentCount - a.commentCount;
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        // Pinned discussions always float to the top, regardless of sort.
        return [...sorted].sort(
            (a, b) => Number(b.isPinned) - Number(a.isPinned),
        );
    }, [discussions, search, sort]);

    return (
        <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cs-text-muted)]"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search discussions..."
                        className="w-full rounded-lg border border-[var(--cs-border)]/70 bg-[var(--cs-surface-muted)]/60 py-2 pl-9 pr-3 text-sm text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)]"
                    />
                </div>

                <CustomSelect
                    value={sort}
                    onChange={(value) => setSort(value as SortOption)}
                    options={[
                        { value: "newest", label: "Newest first" },
                        { value: "oldest", label: "Oldest first" },
                        { value: "most-commented", label: "Most commented" },
                    ]}
                    className="rounded-lg border border-[var(--cs-border)]/70 bg-[var(--cs-surface-muted)]/60 px-3 py-2 text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                />
            </div>

            <div className="mt-5">
                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <LoadingSpinner />
                    </div>
                ) : isError ? (
                    <EmptyState
                        icon={<MessageSquare size={22} />}
                        title="Unable to load discussions"
                        description="Something went wrong while loading discussions."
                    />
                ) : filteredAndSorted.length === 0 ? (
                    <EmptyState
                        icon={<MessageSquare size={22} />}
                        title={search ? "No matching discussions" : emptyTitle}
                        description={search ? "Try a different search term." : emptyDescription}
                    />
                ) : (
                    <div className="divide-y divide-[var(--cs-border)]/50">
                        {filteredAndSorted.map((discussion) => (
                            <DiscussionListItem
                                key={discussion.id}
                                discussion={discussion}
                                currentUserId={currentUserId}
                                expanded={expandedIds.has(discussion.id)}
                                onToggleExpand={() => toggleExpand(discussion.id)}
                                fetchComments={fetchComments}
                                commentsReadOnly={commentsReadOnly}
                                onCreateComment={
                                    onCreateComment
                                        ? (content) => onCreateComment(discussion, content)
                                        : undefined
                                }
                                onReplyComment={
                                    onReplyComment
                                        ? (comment, content) =>
                                            onReplyComment(discussion, comment, content)
                                        : undefined
                                }
                                onEditComment={
                                    onEditComment
                                        ? (comment, content) =>
                                            onEditComment(discussion, comment, content)
                                        : undefined
                                }
                                onDeleteComment={
                                    onDeleteComment
                                        ? (comment) => onDeleteComment(discussion, comment)
                                        : undefined
                                }
                                onEditDiscussion={
                                    onEditDiscussion
                                        ? (title, content) =>
                                            onEditDiscussion(discussion, title, content)
                                        : undefined
                                }
                                onDeleteDiscussion={
                                    onDeleteDiscussion
                                        ? () => onDeleteDiscussion(discussion)
                                        : undefined
                                }
                                extraAction={renderExtraAction?.(discussion)}
                                contextSlot={renderContextSlot?.(discussion)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscussionList;
