import { Search, ChevronDown } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchBar({
                                      value,
                                      onChange,
                                  }: SearchBarProps) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
                <Search
                    size={18}
                    className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-500
                    "
                />

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="What are you looking for? Type to search..."
                    className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-slate-700
                        bg-slate-900
                        pl-11
                        pr-4
                        text-sm
                        text-white
                        placeholder:text-slate-500
                        outline-none
                        transition-all
                        focus:border-sky-500
                        focus:ring-2
                        focus:ring-sky-500/20"/>
            </div>

            <button className="flex h-12 min-w-[160px] items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-slate-300 transition hover:border-sky-500 hover:text-white">
                Most relevant
                <ChevronDown size={16} />
            </button>
        </div>
    );
}