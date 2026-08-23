import type { ReactNode } from "react";

interface DashboardStatCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: ReactNode;
}

export default function DashboardStatCard({
                                              title,
                                              value,
                                              subtitle,
                                              icon,
                                          }: DashboardStatCardProps) {
    return (
        <div className="rounded-xl border border-[#1e3254] bg-[#0f1e35] p-5 transition-colors hover:border-[#29466d]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.7px] text-[#6f89a8]">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-[#e8f0fe]">
                        {value}
                    </p>

                    {subtitle && (
                        <p className="mt-1 text-xs text-[#526d8e]">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#17D4C3]/15 text-[#17D4C3]">
                    {icon}
                </div>
            </div>
        </div>
    );
}