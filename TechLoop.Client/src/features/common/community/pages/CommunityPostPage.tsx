import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { CommunityRole } from "../../../../types/community.types";
import { getCommunityPost, getPostLikeStatus, getSavedCommunityPosts } from "../../../../api/mentorCommunity.api.ts";
import { getTechnologies } from "../../../../api/technology.api";
import { communityQueryKeys } from "../../../../hooks/queryKeys";
import { usePostMutations } from "../../../../hooks/usePostMutations";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import PostDetail from "../components/post/PostDetail";
import { getErrorMessage } from "../../../../utils/error.utils";

interface CommunityPostPageProps {
    role: CommunityRole;
    routeBase: string;
}

export default function CommunityPostPage({ role, routeBase }: CommunityPostPageProps) {
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();
    const numericPostId = Number(postId);
    const isInvalidPostId = !postId || Number.isNaN(numericPostId) || numericPostId <= 0;

    const currentUser = useCurrentUser();
    const queryClient = useQueryClient();

    const postQuery = useQuery({
        queryKey: communityQueryKeys.post(role, numericPostId),
        queryFn: () => getCommunityPost(role, numericPostId),
        enabled: !isInvalidPostId,
    });

    const likeStatusQuery = useQuery({
        queryKey: communityQueryKeys.likeStatus(role, numericPostId),
        queryFn: () => getPostLikeStatus(role, numericPostId),
        enabled: !isInvalidPostId,
    });

    const technologiesQuery = useQuery({
        queryKey: communityQueryKeys.technologies(),
        queryFn: () => getTechnologies(),
    });

    const savedPostsQuery = useQuery({
        queryKey: communityQueryKeys.savedPosts(role),
        queryFn: () => getSavedCommunityPosts(role),
        enabled: !isInvalidPostId,
    });

    const isSaved = (savedPostsQuery.data ?? []).some((item) => item.postId === numericPostId);

    const { toggleLike, toggleSave, updatePost, deletePost } = usePostMutations(role);

    function handleBack() {
        navigate(-1);
    }

    async function handleDelete() {
        if (!postQuery.data) return;
        await deletePost(postQuery.data.id);
        navigate(routeBase);
    }

    async function handleEdit(technologyId: number | null, title: string, content: string) {
        if (!postQuery.data) return;
        await updatePost(postQuery.data.id, { technologyId, title, content });
        void queryClient.invalidateQueries({
            queryKey: communityQueryKeys.post(role, numericPostId),
        });
    }

    if (isInvalidPostId) {
        return (
            <ErrorState onBack={handleBack} message="Invalid community post." />
        );
    }

    if (postQuery.isLoading) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-4xl px-5 py-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 w-24 rounded bg-[#14253d]" />
                        <div className="h-64 rounded-2xl bg-[#0f1e35]" />
                        <div className="h-48 rounded-2xl bg-[#0f1e35]" />
                    </div>
                </div>
            </div>
        );
    }

    if (postQuery.error || !postQuery.data) {
        return (
            <ErrorState
                onBack={handleBack}
                message={getErrorMessage(postQuery.error, "Unable to load discussion.")}
            />
        );
    }

    return (
        <div className="min-h-full bg-[#081423]">
            <div className="mx-auto max-w-4xl px-5 py-8">
                <PostDetail
                    post={postQuery.data}
                    role={role}
                    liked={likeStatusQuery.data ?? false}
                    saved={isSaved}
                    currentUserId={currentUser.id}
                    technologies={technologiesQuery.data}
                    onBack={handleBack}
                    onLike={() => toggleLike(postQuery.data!.id, likeStatusQuery.data ?? false)}
                    onSave={() => toggleSave(postQuery.data!.id, isSaved)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}

function ErrorState({ onBack, message }: { onBack: () => void; message: string }) {
    return (
        <div className="min-h-full bg-[#081423]">
            <div className="mx-auto max-w-4xl px-5 py-8">
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-5 inline-flex items-center gap-2 text-xs text-[#7189a8] transition hover:text-white"
                >
                    ← Back to Community
                </button>

                <div className="rounded-2xl border border-[#5c3038] bg-[#24151b] p-6">
                    <p className="text-sm font-semibold text-[#ef8b8b]">Unable to load discussion</p>
                    <p className="mt-2 text-xs text-[#a96d76]">{message}</p>
                </div>
            </div>
        </div>
    );
}
