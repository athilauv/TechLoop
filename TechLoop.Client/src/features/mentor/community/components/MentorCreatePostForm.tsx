import { Send, X } from "lucide-react";
import { useState, type FormEvent } from "react";

interface TechnologyOption {
    id: number;
    name: string;
}

interface MentorCreatePostFormProps {
    technologies: TechnologyOption[];
    loadingTechnologies?: boolean;
    submitting?: boolean;
    onSubmit: (
        technologyId: number | null,
        title: string,
        content: string
    ) => Promise<void>;
    onClose: () => void;
}

export default function MentorCreatePostForm({
                                                 technologies,
                                                 submitting = false,
                                                 onSubmit,
                                                 onClose,
                                             }: MentorCreatePostFormProps) {
    const [technologyId, setTechnologyId] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
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
            setError("");

            await onSubmit(
                Number(technologyId),
                trimmedTitle,
                trimmedContent
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to create discussion."
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0B1B30] shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <div>
                        <h2 className="text-base font-semibold text-white">
                            Start a Discussion
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Share a question, idea, or technical insight.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-5"
                >
                    <div>
                        <label className="text-xs font-medium text-slate-400">
                            Technology
                        </label>

                        <select
                            value={technologyId}
                            onChange={(event) =>
                                setTechnologyId(event.target.value)
                            }
                            disabled={submitting}
                            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#071426] px-3 text-sm text-white outline-none focus:border-[#18C6A4]/50"
                        >
                            <option value="">
                                Select technology
                            </option>

                            {technologies.map((technology) => (
                                <option
                                    key={technology.id}
                                    value={technology.id}
                                >
                                    {technology.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-400">
                            Title
                        </label>

                        <input
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            maxLength={150}
                            disabled={submitting}
                            placeholder="What do you want to discuss?"
                            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#071426] px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#18C6A4]/50"
                        />

                        <p className="mt-1 text-right text-[10px] text-slate-600">
                            {title.length}/150
                        </p>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-400">
                            Discussion
                        </label>

                        <textarea
                            value={content}
                            onChange={(event) =>
                                setContent(event.target.value)
                            }
                            rows={7}
                            maxLength={5000}
                            disabled={submitting}
                            placeholder="Explain your question, idea, problem, or experience..."
                            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#071426] px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-[#18C6A4]/50"
                        />

                        <p className="mt-1 text-right text-[10px] text-slate-600">
                            {content.length}/5000
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 border-t border-white/10 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="rounded-xl px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#18C6A4] px-4 py-2.5 text-xs font-semibold text-[#071426] transition hover:bg-[#12B594] disabled:opacity-50"
                        >
                            <Send className="h-3.5 w-3.5" />

                            {submitting
                                ? "Posting..."
                                : "Post Discussion"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}