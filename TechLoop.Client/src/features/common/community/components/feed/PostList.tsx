import type { CommunityPost, CommunityRole, CommunityTechnology } from "../../../../../types/community.types.ts";
import PostCard from "../post/PostCard";

interface PostListProps {
    posts: CommunityPost[];
    role: CommunityRole;
    likedPostIds: number[];
    savedPostIds: number[];
    currentUserId?: string;
    technologies?: CommunityTechnology[];
    commentsMode?: "inline" | "navigate";
    onLike: (postId: number) => void | Promise<void>;
    onSave: (postId: number) => void | Promise<void>;
    onOpen?: (postId: number) => void;
    onEdit: (
        postId: number,
        technologyId: number | null,
        title: string,
        content: string
    ) => Promise<void>;
    onDelete: (postId: number) => Promise<void>;
}

export default function PostList({
                                     posts,
                                     role,
                                     likedPostIds,
                                     savedPostIds,
                                     currentUserId,
                                     technologies,
                                     commentsMode = "inline",
                                     onLike,
                                     onSave,
                                     onOpen,
                                     onEdit,
                                     onDelete,
                                 }: PostListProps) {
    if (posts.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-[#1e3254] bg-[#0f1e35] px-6 py-16 text-center">
                <h2 className="text-sm font-semibold text-white">No discussions found</h2>
                <p className="mt-2 text-xs text-[#526d8e]">
                    Try changing your search or start a new discussion.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    role={role}
                    liked={likedPostIds.includes(post.id)}
                    saved={savedPostIds.includes(post.id)}
                    currentUserId={currentUserId}
                    technologies={technologies}
                    commentsMode={commentsMode}
                    onLike={onLike}
                    onSave={onSave}
                    onOpen={onOpen}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
