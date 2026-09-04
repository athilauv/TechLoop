import { useMemo, useState, type ReactNode } from "react";
import { MessageSquare, Search } from "lucide-react";
import EmptyState from "../../../../shared/EmptyState";
import LoadingSpinner from "../../../../shared/LoadingSpinner";
import type { Discussion, DiscussionComment } from "../../../../types/discussion.types.ts";
import DiscussionListItem from "./DiscussionListItem";
import CustomSelect from "../../../../shared/Customselect.tsx";
import InfiniteScrollTrigger from "../../../../shared/InfiniteScrollTrigger.tsx";

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
    serverSide?: boolean;
    onSearchChange?: (value: string) => void;
    onSortChange?: (value: SortOption) => void;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onLoadMore?: () => void;
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
    emptyDescription = "Start the first discussion.",
    serverSide = false,
    onSearchChange,
    onSortChange,
    hasNextPage = false,
    isFetchingNextPage = false,
    onLoadMore,
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
        if (serverSide) return discussions;
        const normalized = search.trim().toLowerCase();
        const filtered = normalized ? discussions.filter(d => d.title.toLowerCase().includes(normalized) || d.content.toLowerCase().includes(normalized) || d.userName.toLowerCase().includes(normalized)) : discussions;
        const sorted = [...filtered].sort((a,b) => sort === "oldest" ? new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime() : sort === "most-commented" ? b.commentCount-a.commentCount : new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());
        return [...sorted].sort((a,b)=>Number(b.isPinned)-Number(a.isPinned));
    }, [discussions, search, sort, serverSide]);

    return (
        <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--cs-text-muted)]"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => { setSearch(event.target.value); onSearchChange?.(event.target.value); }}
                        placeholder="Search discussions..."
                        aria-label="Search discussions"
                        className="w-full rounded-lg border border-[var(--cs-border)] bg-[var(--cs-input-bg,var(--cs-surface-muted))] py-2.5 pl-10 pr-3.5 text-sm text-[var(--cs-text)] outline-none transition-colors duration-150 placeholder:text-[var(--cs-text-muted)] hover:border-[var(--cs-border)]/80 focus:border-[var(--cs-primary)] focus:ring-2 focus:ring-[var(--cs-primary)]/15"
                    />
                </div>

                <CustomSelect
                    value={sort}
                    onChange={(value) => { setSort(value as SortOption); onSortChange?.(value as SortOption); }}
                    options={[
                        { value: "newest", label: "Newest first" },
                        { value: "oldest", label: "Oldest first" },
                        { value: "most-commented", label: "Most commented" },
                    ]}
                    className="w-full rounded-lg border border-[var(--cs-border)] bg-[var(--cs-input-bg,var(--cs-surface-muted))] px-3.5 py-2.5 text-sm text-[var(--cs-text)] outline-none transition-colors duration-150 hover:border-[var(--cs-border)]/80 focus:border-[var(--cs-primary)] focus:ring-2 focus:ring-[var(--cs-primary)]/15 sm:w-auto"
                />
            </div>

            <div className="mt-5">
                {isLoading ? (
                    <div className="flex justify-center py-20">
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
                    <div className="space-y-4">
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
                {serverSide && <InfiniteScrollTrigger hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} onLoadMore={onLoadMore ?? (() => undefined)} />}
            </div>
        </div>
    );
};

export default DiscussionList;
