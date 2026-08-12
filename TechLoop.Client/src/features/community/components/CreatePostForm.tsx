import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../../api/community.api";
import { getTechnologies } from "../../../api/technology.api";
import type { LearnerTechnology } from "../../../types/technology.types";

type ToastType = "success" | "error";

interface Toast {
    type: ToastType;
    message: string;
}

export default function CreatePostForm() {
    const navigate = useNavigate();

    const [technologies, setTechnologies] = useState<LearnerTechnology[]>([]);
    const [technologyId, setTechnologyId] = useState<number | "">("");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [loadingTechnologies, setLoadingTechnologies] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<Toast | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadTechnologies() {
            try {
                setLoadingTechnologies(true);
                setError(null);

                const result = await getTechnologies();

                if (!cancelled) {
                    setTechnologies(result);
                }
            } catch (err: unknown) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load technologies."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingTechnologies(false);
                }
            }
        }

        void loadTechnologies();

        return () => {
            cancelled = true;
        };
    }, []);

    function showToast(
        type: ToastType,
        message: string
    ) {
        setToast({
            type,
            message,
        });

        window.setTimeout(() => {
            setToast(null);
        }, 3000);
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!technologyId) {
            setError("Please select a technology.");
            return;
        }

        if (!trimmedTitle) {
            setError("Please enter a title.");
            return;
        }

        if (!trimmedContent) {
            setError("Please enter your post content.");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const post = await createPost({
                technologyId: Number(technologyId),
                title: trimmedTitle,
                content: trimmedContent,
            });

            showToast(
                "success",
                "Post published successfully."
            );

            window.setTimeout(() => {
                navigate(
                    `/learner/community/posts/${post.id}`
                );
            }, 700);
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to create post.";

            setError(message);

            showToast(
                "error",
                message
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            {toast && (
                <div
                    className={`fixed right-5 top-5 z-[100] flex min-w-[280px] items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl ${
                        toast.type === "success"
                            ? "border-[#17615f] bg-[#102b32] text-[#17D4C3]"
                            : "border-[#5c3038] bg-[#24151b] text-[#ef8b8b]"
                    }`}
                    role="status"
                    aria-live="polite"
                >
                    <span className="text-sm font-medium">
                        {toast.type === "success" ? "✓" : "✕"}
                    </span>

                    <span className="text-sm">
                        {toast.message}
                    </span>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6"
            >
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                        Community
                    </p>

                    <h1 className="mt-2 text-xl font-semibold text-white">
                        Create a post
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#7189a8]">
                        Share something you learned, ask a question, or start a technical discussion.
                    </p>
                </div>

                {error && (
                    <div className="mt-5 rounded-xl border border-[#5c3038] bg-[#24151b] px-4 py-3">
                        <p className="text-sm text-[#ef8b8b]">
                            {error}
                        </p>
                    </div>
                )}

                {/* Technology */}
                <div className="mt-6">
                    <label
                        htmlFor="post-technology"
                        className="text-xs font-medium text-[#a8bad0]"
                    >
                        Technology
                    </label>

                    <select
                        id="post-technology"
                        value={technologyId}
                        onChange={(event) =>
                            setTechnologyId(
                                event.target.value
                                    ? Number(event.target.value)
                                    : ""
                            )
                        }
                        disabled={
                            submitting ||
                            loadingTechnologies
                        }
                        className="mt-2 w-full rounded-xl border border-[#29466d] bg-[#081423] px-4 py-3 text-sm text-white outline-none focus:border-[#17D4C3] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <option value="">
                            {loadingTechnologies
                                ? "Loading technologies..."
                                : "Select technology"}
                        </option>

                        {technologies.map(
                            (technology) => (
                                <option
                                    key={technology.id}
                                    value={technology.id}
                                >
                                    {technology.name}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* Title */}
                <div className="mt-5">
                    <label
                        htmlFor="post-title"
                        className="text-xs font-medium text-[#a8bad0]"
                    >
                        Title
                    </label>

                    <input
                        id="post-title"
                        type="text"
                        value={title}
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                        maxLength={200}
                        placeholder="What do you want to discuss?"
                        className="mt-2 w-full rounded-xl border border-[#29466d] bg-[#081423] px-4 py-3 text-sm text-white outline-none placeholder:text-[#526d8e] focus:border-[#17D4C3]"
                        disabled={submitting}
                    />

                    <div className="mt-1 text-right text-[10px] text-[#526d8e]">
                        {title.length}/200
                    </div>
                </div>

                {/* Content */}
                <div className="mt-5">
                    <label
                        htmlFor="post-content"
                        className="text-xs font-medium text-[#a8bad0]"
                    >
                        Content
                    </label>

                    <textarea
                        id="post-content"
                        value={content}
                        onChange={(event) =>
                            setContent(event.target.value)
                        }
                        rows={9}
                        placeholder="Write your question, explanation, experience, or idea..."
                        className="mt-2 w-full resize-y rounded-xl border border-[#29466d] bg-[#081423] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-[#526d8e] focus:border-[#17D4C3]"
                        disabled={submitting}
                    />
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/learner/community")
                        }
                        disabled={submitting}
                        className="rounded-xl border border-[#29466d] px-4 py-2.5 text-sm font-medium text-[#8fa6c2] transition hover:bg-[#10283e] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={
                            submitting ||
                            loadingTechnologies ||
                            !technologyId ||
                            !title.trim() ||
                            !content.trim()
                        }
                        className="rounded-xl bg-[#17D4C3] px-5 py-2.5 text-sm font-semibold text-[#06141f] transition hover:bg-[#35e2d3] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting
                            ? "Publishing..."
                            : "Publish post"}
                    </button>
                </div>
            </form>
        </>
    );
}