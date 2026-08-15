import type {CommunityPost} from "../../../types/community.types";
import CommunityPostCard from "./CommunityPostCard";

interface CommunityPostListProps {
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
    onOpen?: (postId: number) => void;
}

export default function CommunityPostList({
                                              posts,
                                              likedPosts,
                                              savedPosts,
                                              currentUserId,
                                              onLike,
                                              onSave,
                                              onEdit,
                                              onDelete,
                                              onOpen,
                                          }: CommunityPostListProps) {
    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <CommunityPostCard key={post.id} post={post}
                    liked={likedPosts.includes(post.id)}
                    saved={savedPosts.includes(post.id)}
                    currentUserId={currentUserId}
                    onLike={onLike}
                    onSave={onSave}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onOpen={onOpen}
                />
            ))}
        </div>
    );
}