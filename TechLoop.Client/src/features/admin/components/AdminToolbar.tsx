import type { ReactNode } from "react";
import { Search } from "lucide-react";

interface AdminToolbarProps {
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    filters?: ReactNode;
    actions?: ReactNode;
}

/**
 * Standard enterprise data-table toolbar: search on the left, optional
 * filter chips/selects in the middle, primary actions on the right.
 * Search/filtering happens client-side over data already fetched by the
 * page — no new API calls are introduced.
 */
export default function AdminToolbar({ searchValue, onSearchChange, searchPlaceholder = "Search…", filters, actions }: AdminToolbarProps) {
    return (
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                {onSearchChange && (
                    <div className="relative w-full sm:max-w-xs">
                        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5C7394]" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder={searchPlaceholder}
                            aria-label={searchPlaceholder}
                            className="h-10 w-full rounded-xl border border-[#223A59] bg-[#101C30] pl-9 pr-3 text-sm text-white outline-none transition-colors placeholder:text-[#5C7394] focus:border-[#00E8C2] focus:ring-2 focus:ring-[#00E8C2]/15"
                        />
                    </div>
                )}
                {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
    );
}
