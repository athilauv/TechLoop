import type { CommunityPost } from "../../../types/community.types";
import CommunityPostCard from "./CommunityPostCard";

interface CommunityPostListProps {
    posts: CommunityPost[];
    likedPosts?: number[];
    savedPosts?: number[];
    onLike?: (postId: number) => void;
    onSave?: (postId: number) => void;
    onOpen?: (postId: number) => void;
}

export default function CommunityPostList({
                                              posts,
                                              likedPosts = [],
                                              savedPosts = [],
                                              onLike,
                                              onSave,
                                              onOpen,
                                          }: CommunityPostListProps) {
    if (posts.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-[#1e3254] bg-[#0f1e35] p-12 text-center">
                <p className="text-sm font-medium text-white">
                    No community posts yet.
                </p>

                <p className="mt-2 text-xs text-[#7189a8]">
                    Be the first learner to start a discussion.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <CommunityPostCard
                    key={post.id}
                    post={post}
                    liked={likedPosts.includes(
                        post.id
                    )}
                    saved={savedPosts.includes(
                        post.id
                    )}
                    onLike={
                        onLike ??
                        (() => undefined)
                    }
                    onSave={
                        onSave ??
                        (() => undefined)
                    }
                    onOpen={
                        onOpen ??
                        (() => undefined)
                    }
                />
            ))}
        </div>
    );
}