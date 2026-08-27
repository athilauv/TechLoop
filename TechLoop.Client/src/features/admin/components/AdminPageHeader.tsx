import type { ReactNode } from "react";

interface AdminPageHeaderProps {
    eyebrow: string;
    title: string;
    description?: string;
    action?: ReactNode;
}

export default function AdminPageHeader({ eyebrow, title, description, action }: AdminPageHeaderProps) {
    return (
        <div className="mb-8 flex flex-col gap-4 border-b border-[#223A59] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00E8C2]">{eyebrow}</p>
                <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{title}</h1>
                {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8CA3BF]">{description}</p>}
            </div>
            {action}
        </div>
    );
}
