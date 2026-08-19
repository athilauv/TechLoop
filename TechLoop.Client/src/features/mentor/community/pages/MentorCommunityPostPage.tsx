import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getMentorCommunityPost,
    getMentorLikeStatus,
    likeMentorPost,
    saveMentorPost,
    unlikeMentorPost,
    unsaveMentorPost,
} from "../../../../api/mentorCommunity.api.ts";
import type { CommunityPost } from "../../../../types/community.types.ts";
import { showToast } from "../../../../utils/toast.tsx";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import MentorPostDetails from "../components/MentorPostDetails";

export default function MentorCommunityPostPage() {
    const { id } = useParams<{ id: string }>();

    const postId = Number(id);

    const [post, setPost] =
        useState<CommunityPost | null>(null);

    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const currentUserId =
        localStorage.getItem("userId") ?? undefined;

    useEffect(() => {
        const loadPost = async () => {
            if (!postId) {
                const message = "Invalid discussion.";

                setError(message);
                setLoading(false);
                showToast.error(message);

                return;
            }

            try {
                setLoading(true);
                setError("");

                const [postData, likeStatus] =
                    await Promise.all([
                        getMentorCommunityPost(postId),
                        getMentorLikeStatus(postId),
                    ]);

                setPost(postData);
                setLiked(likeStatus);
            } catch (err: unknown) {
                const message = getErrorMessage(
                    err,
                    "Unable to load the discussion."
                );

                setError(message);
                showToast.error(message);
            } finally {
                setLoading(false);
            }
        };

        void loadPost();
    }, [postId]);

    const handleLike = async () => {
        if (!post) return;

        try {
            if (liked) {
                await unlikeMentorPost(post.id);

                setLiked(false);

                setPost((current) =>
                    current
                        ? {
                            ...current,
                            likeCount: Math.max(
                                0,
                                current.likeCount - 1
                            ),
                        }
                        : current
                );
            } else {
                await likeMentorPost(post.id);

                setLiked(true);

                setPost((current) =>
                    current
                        ? {
                            ...current,
                            likeCount:
                                current.likeCount + 1,
                        }
                        : current
                );
            }
        } catch (err: unknown) {
            showToast.error(
                getErrorMessage(
                    err,
                    "Unable to update the discussion like."
                )
            );

            throw err;
        }
    };

    const handleSave = async () => {
        if (!post) return;

        try {
            if (saved) {
                await unsaveMentorPost(post.id);
                setSaved(false);
            } else {
                await saveMentorPost(post.id);
                setSaved(true);
            }
        } catch (err: unknown) {
            showToast.error(
                getErrorMessage(
                    err,
                    "Unable to update the saved discussion."
                )
            );

            throw err;
        }
    };

    if (loading) {
        return (
            <div className="min-h-full bg-[#071426] p-5 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-4xl animate-pulse">
                    <div className="h-[500px] rounded-2xl bg-[#0B1B30]" />
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex min-h-full items-center justify-center bg-[#071426] p-6">
                <div className="rounded-2xl border border-white/10 bg-[#0B1B30] px-8 py-10 text-center">
                    <h2 className="text-base font-semibold text-white">
                        Discussion unavailable
                    </h2>

                    <p className="mt-2 text-xs text-slate-500">
                        {error ||
                            "Unable to load the discussion."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[#071426] text-white">
            <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
                <MentorPostDetails
                    post={post}
                    liked={liked}
                    saved={saved}
                    currentUserId={currentUserId}
                    onLike={handleLike}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
}