import type { CommunityPost } from "../../../../types/community.types.ts";
import MentorCommunityPostCard from "./MentorCommunityPostCard";

interface MentorCommunityPostListProps {
    posts: CommunityPost[];
    likedPosts: number[];
    savedPosts: number[];
    currentUserId?: string;
    onLike: (postId: number) => Promise<void>;
    onSave: (postId: number) => Promise<void>;
    onEdit: (
        postId: number,
        technologyId: number | null,
        title: string,
        content: string
    ) => Promise<void>;
    onDelete: (postId: number) => Promise<void>;
}

export default function MentorCommunityPostList({
                                                    posts,
                                                    likedPosts,
                                                    savedPosts,
                                                    currentUserId,
                                                    onLike,
                                                    onSave,
                                                    onEdit,
                                                    onDelete,
                                                }: MentorCommunityPostListProps) {
    if (posts.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#0B1B30] px-6 py-16 text-center">
                <h2 className="text-sm font-semibold text-white">
                    No discussions found
                </h2>

                <p className="mt-2 text-xs text-slate-500">
                    Try changing your search or start a new discussion.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <MentorCommunityPostCard
                    key={post.id}
                    post={post}
                    liked={likedPosts.includes(post.id)}
                    saved={savedPosts.includes(post.id)}
                    currentUserId={currentUserId}
                    onLike={onLike}
                    onSave={onSave}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}