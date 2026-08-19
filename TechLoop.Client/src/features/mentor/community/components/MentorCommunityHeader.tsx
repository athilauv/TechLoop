import { Plus, Search, Users } from "lucide-react";

interface MentorCommunityHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onCreatePost: () => void;
}

export default function MentorCommunityHeader({
                                                  search,
                                                  onSearchChange,
                                                  onCreatePost,
                                              }: MentorCommunityHeaderProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#0B1B30] p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#18C6A4]/10">
                        <Users className="h-5 w-5 text-[#18C6A4]" />
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#18C6A4]">
                            Mentor Community
                        </p>

                        <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                            Knowledge & Discussions
                        </h1>

                        <p className="mt-1.5 max-w-2xl text-sm text-slate-400">
                            Connect with developers, share knowledge, and
                            participate in meaningful technical discussions.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onCreatePost}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18C6A4] px-4 py-2.5 text-sm font-semibold text-[#071426] transition hover:bg-[#12B594]"
                >
                    <Plus className="h-4 w-4" />
                    New Discussion
                </button>
            </div>

            <div className="mt-6">
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            onSearchChange(event.target.value)
                        }
                        placeholder="Search discussions..."
                        className="h-11 w-full rounded-xl border border-white/10 bg-[#071426] pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#18C6A4]/50"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}