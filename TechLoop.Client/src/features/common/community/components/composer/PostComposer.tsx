import { Check, Send, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { CommunityTechnology } from "../../../../../types/community.types.ts";

export interface PostComposerInitialValues {
    technologyId: number | null;
    title: string;
    content: string;
}

interface PostComposerProps {
    mode: "create" | "edit";
    variant?: "modal" | "inline";
    initialValues?: PostComposerInitialValues;
    technologies: CommunityTechnology[];
    loadingTechnologies?: boolean;
    submitting?: boolean;
    onSubmit: (technologyId: number | null, title: string, content: string) => Promise<void>;
    onCancel: () => void;
}

export default function PostComposer({
                                         mode,
                                         variant = "modal",
                                         initialValues,
                                         technologies,
                                         loadingTechnologies = false,
                                         submitting = false,
                                         onSubmit,
                                         onCancel,
                                     }: PostComposerProps) {
    const [technologyId, setTechnologyId] = useState(
        initialValues?.technologyId != null ? String(initialValues.technologyId) : ""
    );
    const [title, setTitle] = useState(initialValues?.title ?? "");
    const [content, setContent] = useState(initialValues?.content ?? "");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!technologyId) {
            setError("Please select a technology.");
            return;
        }

        if (!trimmedTitle) {
            setError("Discussion title is required.");
            return;
        }

        if (!trimmedContent) {
            setError("Discussion content is required.");
            return;
        }

        try {
            setError(null);
            await onSubmit(Number(technologyId), trimmedTitle, trimmedContent);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : mode === "edit"
                        ? "Unable to update discussion."
                        : "Unable to create discussion."
            );
        }
    }

    const heading = mode === "edit" ? "Edit discussion" : "Start a discussion";
    const submitLabel = submitting ? mode === "edit" ? "Saving..." : "Posting..." : mode === "edit" ? "Save changes" : "Post Discussion";

    const formBody = (
        <form onSubmit={handleSubmit} className={variant === "modal" ? "p-5" : ""}>
            <label className="block">
                <span className="text-xs font-medium text-[#a8bad0]">Technology</span>

                <select
                    value={technologyId}
                    onChange={(event) => setTechnologyId(event.target.value)}
                    disabled={submitting || loadingTechnologies}
                    className="mt-2 h-11 w-full rounded-xl border border-[#1e3254] bg-[#081423] px-3 text-sm text-white outline-none transition focus:border-[#17D4C3] disabled:opacity-60"
                >
                    <option value="" className="bg-[#081423]">
                        {loadingTechnologies ? "Loading technologies..." : "Select technology"}
                    </option>

                    {technologies.map((technology) => (
                        <option key={technology.id} value={technology.id} className="bg-[#081423]">
                            {technology.name}
                        </option>
                    ))}
                </select>
            </label>

            <label className="mt-4 block">
                <span className="text-xs font-medium text-[#a8bad0]">Title</span>

                <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={150}
                    disabled={submitting}
                    placeholder="What do you want to discuss?"
                    className="mt-2 h-11 w-full rounded-xl border border-[#1e3254] bg-[#081423] px-3 text-sm text-white outline-none transition placeholder:text-[#526d8e] focus:border-[#17D4C3] disabled:opacity-60"
                />

                <div className="mt-1 text-right text-[10px] text-[#526d8e]">{title.length}/150</div>
            </label>

            <label className="mt-4 block">
                <span className="text-xs font-medium text-[#a8bad0]">Discussion</span>

                <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    rows={variant === "modal" ? 7 : 5}
                    maxLength={5000}
                    disabled={submitting}
                    placeholder="Explain your question, idea, problem, or experience..."
                    className="mt-2 w-full resize-none rounded-xl border border-[#1e3254] bg-[#081423] px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-[#526d8e] focus:border-[#17D4C3] disabled:opacity-60"
                />

                <div className="mt-1 text-right text-[10px] text-[#526d8e]">{content.length}/5000</div>
            </label>

            {error && (
                <div className="mt-4 rounded-xl border border-[#5c3038] bg-[#24151b] px-3 py-2 text-xs text-[#ef8b8b]">
                    {error}
                </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-medium text-[#7189a8] transition hover:bg-[#10283e] hover:text-white disabled:opacity-50"
                >
                    <X size={13} />
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={submitting || loadingTechnologies}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#17D4C3] px-4 py-2.5 text-xs font-semibold text-[#06141f] transition hover:bg-[#35e2d3] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {mode === "edit" ? <Check size={14} /> : <Send size={14} />}
                    {submitLabel}
                </button>
            </div>
        </form>
    );

    if (variant === "inline") {
        return <div className="mt-5">{formBody}</div>;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#1e3254] bg-[#0f1e35] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#1e3254] px-5 py-4">
                    <div>
                        <h2 className="text-base font-semibold text-white">{heading}</h2>
                        <p className="mt-1 text-xs text-[#7189a8]">
                            Share something with the developer community.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        className="rounded-lg p-2 text-[#526d8e] transition hover:bg-[#10283e] hover:text-white disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={17} />
                    </button>
                </div>

                {formBody}
            </div>
        </div>
    );
}
