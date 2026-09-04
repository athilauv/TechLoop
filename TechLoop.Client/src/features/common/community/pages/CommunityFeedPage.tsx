import { Bookmark } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CommunityRole } from "../../../../types/community.types";
import { useCommunityFeed } from "../../../../hooks/useCommunityFeed";
import { usePostMutations } from "../../../../hooks/usePostMutations";
import { useCurrentUser } from "../../../../hooks/useCurrentUser.ts";
import CommunityHeader from "../components/feed/CommunityHeader";
import TechnologyFilter from "../components/feed/TechnologyFilter";
import PostList from "../components/feed/PostList";
import PostComposer from "../components/composer/PostComposer";
import InfiniteScrollTrigger from "../../../../shared/InfiniteScrollTrigger";
import { getErrorMessage } from "../../../../utils/error.utils";

interface CommunityFeedPageProps {
    role: CommunityRole;
    /**
     * Route prefix used to build links to the post detail and saved-posts
     * pages (e.g. "/learner/community" or "/mentor/community"), preserving
     * the existing route structure for each role rather than assuming a
     * single shared route.
     */
    routeBase: string;
}

export default function CommunityFeedPage({ role, routeBase }: CommunityFeedPageProps) {
    const navigate = useNavigate();
    const currentUser = useCurrentUser();

    const [search, setSearch] = useState("");
    const [selectedTechnologyId, setSelectedTechnologyId] = useState<number | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const {
        posts,
        likedPostIds,
        savedPostIds,
        technologies,
        isLoading,
        isLoadingTechnologies,
        error,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useCommunityFeed(role, search, selectedTechnologyId);

    const { toggleLike, toggleSave, createPost, updatePost, deletePost, isCreating } =
        usePostMutations(role);



    async function handleCreate(technologyId: number | null, title: string, content: string) {
        await createPost({ technologyId, title, content });
        setCreateModalOpen(false);
    }

    async function handleEdit(
        postId: number,
        technologyId: number | null,
        title: string,
        content: string
    ) {
        await updatePost(postId, { technologyId, title, content });
    }

    if (isLoading) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-4xl px-5 py-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-44 rounded-2xl bg-[#0f1e35]" />
                        <div className="h-11 rounded-xl bg-[#14253d]" />
                        <div className="h-52 rounded-2xl bg-[#0f1e35]" />
                        <div className="h-52 rounded-2xl bg-[#0f1e35]" />
                    </div>
                </div>
            </div>
        );
    }

    if (error && posts.length === 0) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-4xl px-5 py-8">
                    <div className="rounded-2xl border border-[#5c3038] bg-[#24151b] p-6">
                        <p className="text-sm font-semibold text-[#ef8b8b]">Unable to load community</p>
                        <p className="mt-2 text-xs text-[#a96d76]">
                            {getErrorMessage(error, "Something went wrong.")}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[#081423]">
            <div className="mx-auto max-w-4xl px-5 py-8">
                <div className="flex items-start justify-between gap-4">
                    <div className="w-full">
                        <CommunityHeader
                            search={search}
                            onSearchChange={setSearch}
                            onCreatePost={() => setCreateModalOpen(true)}
                        />
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate(`${routeBase}/saved-posts`)}
                        className="group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-[#7189a8] transition hover:text-white"
                        aria-label="Open saved posts"
                    >
                        <Bookmark size={15} className="text-[#17D4C3] transition group-hover:scale-105" />
                        <span>Saved posts</span>
                    </button>
                </div>

                <div className="mt-4">
                    <TechnologyFilter
                        technologies={technologies}
                        selectedTechnologyId={selectedTechnologyId}
                        onTechnologyChange={setSelectedTechnologyId}
                        loading={isLoadingTechnologies}
                    />
                </div>

                <div className="mt-6">
                    <PostList
                        posts={posts}
                        role={role}
                        likedPostIds={likedPostIds}
                        savedPostIds={savedPostIds}
                        currentUserId={currentUser.id}
                        technologies={technologies}
                        commentsMode="inline"
                        onLike={(postId) => toggleLike(postId, likedPostIds.includes(postId))}
                        onSave={(postId) => toggleSave(postId, savedPostIds.includes(postId))}
                        onOpen={(postId) => navigate(`${routeBase}/post/${postId}`)}
                        onEdit={handleEdit}
                        onDelete={deletePost}
                    />
                    <InfiniteScrollTrigger hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} onLoadMore={() => void fetchNextPage()} />
                </div>
            </div>

            {createModalOpen && (
                <PostComposer
                    mode="create"
                    variant="modal"
                    technologies={technologies}
                    loadingTechnologies={isLoadingTechnologies}
                    submitting={isCreating}
                    onSubmit={handleCreate}
                    onCancel={() => setCreateModalOpen(false)}
                />
            )}
        </div>
    );
}
