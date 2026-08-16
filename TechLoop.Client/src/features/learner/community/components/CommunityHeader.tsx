import { Plus, Search,} from "lucide-react";

interface CommunityHeaderProps {
    search: string;
    onSearchChange: (
        value: string
    ) => void;
    onCreatePost: () => void;
}

export default function CommunityHeader({
                                            search,
                                            onSearchChange,
                                            onCreatePost,
                                        }: CommunityHeaderProps) {
    return (
        <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                        Community
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold text-white">
                        Learn together
                    </h1>

                    <p className="mt-2 text-sm text-[#7189a8]">
                        Ask questions, share knowledge,
                        and learn from other developers.
                    </p>
                </div>

                <button type="button" onClick={onCreatePost} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#17D4C3] px-4 py-2.5 text-xs font-semibold text-[#06141f] transition hover:bg-[#35e2d3]">
                    <Plus size={15} />
                    New Discussion
                </button>
            </div>

            <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#526d8e]"/>

                <input type="text" value={search} onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search discussions, technologies, topics..."
                    className="h-11 w-full rounded-xl border border-[#1e3254] bg-[#0f1e35] pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-[#526d8e] focus:border-[#17D4C3]"
                />

                {search && (
                    <button type="button" onClick={() => onSearchChange("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#526d8e] transition hover:bg-[#10283e] hover:text-white"
                        aria-label="Clear search">
                        ×
                    </button>
                )}
            </div>
        </div>
    );
}