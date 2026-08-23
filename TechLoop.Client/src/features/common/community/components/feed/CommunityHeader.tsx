import { Plus, Search, Users } from "lucide-react";

interface CommunityHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onCreatePost: () => void;
    eyebrow?: string;
    title?: string;
    description?: string;
}

export default function CommunityHeader({
                                            search,
                                            onSearchChange,
                                            onCreatePost,
                                            eyebrow = "Community",
                                            title = "Learn together",
                                            description = "Ask questions, share knowledge, and learn from other developers.",
                                        }: CommunityHeaderProps) {
    return (
        <div className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#17D4C3]/10">
                        <Users className="h-5 w-5 text-[#17D4C3]" />
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#17D4C3]">
                            {eyebrow}
                        </p>
                        <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">{title}</h1>
                        <p className="mt-1.5 max-w-2xl text-sm text-[#7189a8]">{description}</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onCreatePost}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17D4C3] px-4 py-2.5 text-sm font-semibold text-[#06141f] transition hover:bg-[#35e2d3]"
                >
                    <Plus className="h-4 w-4" />
                    New Discussion
                </button>
            </div>

            <div className="mt-6">
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#526d8e]" />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search discussions, technologies, topics..."
                        className="h-11 w-full rounded-xl border border-[#1e3254] bg-[#081423] pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-[#526d8e] focus:border-[#17D4C3]"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#526d8e] transition hover:bg-[#10283e] hover:text-white"
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
