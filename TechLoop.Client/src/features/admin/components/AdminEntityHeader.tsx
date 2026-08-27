import type { ReactNode } from "react";

interface AdminEntityHeaderProps {
    initials: string;
    title: string;
    subtitle?: string;
    meta?: ReactNode;
    action?: ReactNode;
}

/**
 * Profile-style header used on entity detail pages (e.g. a mentor's
 * overview) — an identity block instead of a generic page title, so the
 * page reads like "who/what this record is" rather than a form heading.
 */
export default function AdminEntityHeader({ initials, title, subtitle, meta, action }: AdminEntityHeaderProps) {
    return (
        <div className="mb-8 flex flex-col gap-5 border-b border-[#223A59] pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#00E8C2]/25 bg-[#00E8C2]/10 text-lg font-semibold text-[#00E8C2]">
                    {initials}
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white sm:text-2xl">{title}</h1>
                    {subtitle && <p className="mt-1 text-sm text-[#8CA3BF]">{subtitle}</p>}
                    {meta && <div className="mt-2 flex flex-wrap items-center gap-2">{meta}</div>}
                </div>
            </div>
            {action}
        </div>
    );
}
