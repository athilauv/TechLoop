import {
    ArrowLeft,
    Bookmark,
    Heart,
    MessageCircle,
    MoreVertical,
    Pencil,
    Trash2,
} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    deletePost,
    getCommunityPost,
    getLikeStatus,
    likePost,
    savePost,
    unlikePost,
    unsavePost,
    updatePost,
} from "../../../../api/community.api";
import type {CommunityPost} from "../../../../types/community.types";
import PostCommentsSection from "../components/PostCommentsSection";
import {formatRelativeTime} from "../../../../utils/formatRelativeTime";

export default function CommunityPostPage() {
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();
    const numericPostId = Number(postId);
    const isInvalidPostId = !postId || Number.isNaN(numericPostId) || numericPostId <= 0;
    const [post, setPost] = useState<CommunityPost | null>(null);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const currentUserId = localStorage.getItem("userId") ?? undefined;
    const isOwner = !!post && !!currentUserId && post.userId.toLowerCase() === currentUserId.toLowerCase();

    useEffect(() => {
        if (isInvalidPostId) {
            return;
        }

        let cancelled = false;

        async function loadPost() {
            try {
                setLoading(true);
                setError(null);

                const [postResult, likeResult,] = await Promise.all([getCommunityPost(numericPostId), getLikeStatus(numericPostId),]);
                if (cancelled) {
                    return;
                }

                setPost(postResult);
                setLiked(likeResult);
            } catch (err: unknown) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Unable to load discussion.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadPost();
        return () => {cancelled = true;};
    }, [isInvalidPostId, numericPostId,]);

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        function handleOutsideClick(
            event: MouseEvent
        ) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [menuOpen]);

    function handleBack() {
        navigate(-1);
    }

    async function handleLike() {
        if (!post) {
            return;
        }

        try {
            setError(null);

            if (liked) {
                await unlikePost(post.id);
                setLiked(false);
                setPost((current) => current ? {...current, likeCount: Math.max(0, current.likeCount - 1),} : current);
            } else {
                await likePost(post.id);
                setLiked(true);
                setPost((current) => current ? {...current, likeCount: current.likeCount + 1} : current);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to update like.");
        }
    }

    async function handleSave() {
        if (!post) {
            return;
        }

        try {
            setError(null);

            if (saved) {
                await unsavePost(post.id);
                setSaved(false);
            } else {
                await savePost(post.id);
                setSaved(true);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to update saved post.");
        }
    }

    async function handleEdit() {
        if (!post) {
            return;
        }

        const title = window.prompt("Edit discussion title:", post.title);
        if (title === null) {
            return;
        }

        const content = window.prompt("Edit discussion content:", post.content);
        if (content === null) {
            return;
        }

        if (!title.trim() || !content.trim()) {
            setError("Title and content are required.");
            return;
        }

        try {
            setError(null);
            const updated = await updatePost(post.id,
                    {
                        technologyId:
                        post.technologyId,
                        title: title.trim(),
                        content: content.trim(),
                    }
                );

            setPost(updated);
            setMenuOpen(false);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to update discussion.");
        }
    }

    async function handleDelete() {
        if (!post) {
            return;
        }

        const confirmed = window.confirm("Are you sure you want to delete this discussion?");
        if (!confirmed) {
            return;
        }

        try {
            setError(null);
            await deletePost(post.id);
            navigate("/community");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to delete discussion.");
        }
    }

    if (isInvalidPostId) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-4xl px-5 py-8">
                    <button type="button" onClick={handleBack}
                        className="mb-5 inline-flex items-center gap-2 text-xs text-[#7189a8] transition hover:text-white"
                    >
                        <ArrowLeft size={15} />
                        Back to Community
                    </button>

                    <div className="rounded-2xl border border-[#5c3038] bg-[#24151b] p-6">
                        <p className="text-sm font-semibold text-[#ef8b8b]">
                            Unable to load discussion
                        </p>

                        <p className="mt-2 text-xs text-[#a96d76]">
                            Invalid community post.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
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

    if (error && !post) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-4xl px-5 py-8">
                    <button type="button" onClick={handleBack}
                        className="mb-5 inline-flex items-center gap-2 text-xs text-[#7189a8] transition hover:text-white">
                        <ArrowLeft size={15}/>
                        Back to Community
                    </button>

                    <div className="rounded-2xl border border-[#5c3038] bg-[#24151b] p-6">
                        <p className="text-sm font-semibold text-[#ef8b8b]">
                            Unable to load discussion
                        </p>

                        <p className="mt-2 text-xs text-[#a96d76]">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <div className="min-h-full bg-[#081423]">
            <div className="mx-auto max-w-4xl px-5 py-8">

                {/* BACK */}
                <button type="button" onClick={handleBack}
                    className="mb-5 inline-flex items-center gap-2 text-xs text-[#7189a8] transition hover:text-white">
                    <ArrowLeft size={15}/>
                    Back to Community
                </button>

                {/* POST */}
                <article className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5">

                    {/* HEADER */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17D4C3] text-sm font-bold text-[#06141f]">
                                {post.userName.charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">
                                    {post.userName}
                                </p>

                                <p className="mt-0.5 text-[10px] text-[#526d8e]">
                                    {formatRelativeTime(post.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* OWNER MENU */}
                        {isOwner && (
                            <div ref={menuRef} className="relative">
                                <button type="button" onClick={() => setMenuOpen((current) => !current)}
                                    className="rounded-lg p-1.5 text-[#526d8e] transition hover:bg-[#10283e] hover:text-white"
                                    aria-label="Post options"
                                    aria-expanded={menuOpen}>
                                    <MoreVertical size={17}/>
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 top-full z-30 mt-1 w-32 rounded-xl border border-[#1e3254] bg-[#0f1e35] p-1 shadow-xl">
                                        <button type="button" onClick={handleEdit}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#a8bad0] transition hover:bg-[#10283e] hover:text-white">
                                            <Pencil size={13}/>
                                            Edit
                                        </button>

                                        <button type="button" onClick={handleDelete}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#a8bad0] transition hover:bg-[#24151b] hover:text-[#ef8b8b]">
                                            <Trash2 size={13}/>

                                            Delete
                                        </button>

                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="mt-4 rounded-xl border border-[#5c3038] bg-[#24151b] px-3 py-2 text-xs text-[#ef8b8b]">
                            {error}
                        </div>
                    )}

                    {/* TECHNOLOGY */}
                    {post.technologyName && (
                        <div className="mt-5">
                            <span className="inline-flex rounded-full border border-[#24506a] bg-[#0a2638] px-2.5 py-1 text-[10px] font-medium text-[#17D4C3]">
                                {post.technologyName}
                            </span>
                        </div>
                    )}

                    {/* TITLE */}

                    <h1 className="mt-4 text-xl font-semibold text-white">
                        {post.title}
                    </h1>

                    {/* CONTENT */}
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#a8bad0]">
                        {post.content}
                    </p>

                    {/* ACTIONS */}
                    <div className="mt-6 flex items-center gap-5 border-t border-[#1e3254] pt-4">

                        {/* LIKE */}
                        <button type="button" onClick={handleLike}
                            className={`inline-flex items-center gap-1.5 text-xs transition ${
                                liked ? "text-[#17D4C3]" : "text-[#7189a8] hover:text-[#17D4C3]"}`}>
                            <Heart size={16} fill={liked ? "currentColor" : "none"}/>
                            {post.likeCount}
                        </button>

                        {/* COMMENTS */}
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#7189a8]">
                            <MessageCircle size={16}/>
                            {post.commentCount}
                        </span>

                        {/* SAVE */}
                        <button type="button" onClick={handleSave}
                            className={`ml-auto rounded-lg p-2 transition ${saved ? "text-[#17D4C3]" : "text-[#7189a8] hover:bg-[#10283e] hover:text-white"}`}
                            aria-label={saved ? "Unsave post" : "Save post"}>
                            <Bookmark size={16} fill={saved ? "currentColor" : "none"}/>
                        </button>
                    </div>
                </article>

                {/* COMMENTS */}
                <div className="mt-5 rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5">
                    <PostCommentsSection postId={post.id} currentUserId={currentUserId ?? ""}/>
                </div>
            </div>
        </div>
    );
}