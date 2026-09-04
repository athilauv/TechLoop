import { Activity } from "lucide-react";

interface AnalyticsHeaderProps {
    hasData: boolean;
}

export default function AnalyticsHeader({
                                            hasData,
                                        }: AnalyticsHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <div className="flex items-center gap-2">
                    <Activity size={18} className="text-[#17D4C3]"/>
                    <span className="text-xs font-semibold uppercase tracking-[1.5px] text-[#17D4C3]">
                        Learning Analytics
                    </span>
                </div>

                <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                    Your Learning System
                </h1>

                <p className="mt-1 max-w-2xl text-sm text-[#7a99bb]">
                    Understand your learning time, practice activity,
                    technologies, topics, and progress.
                </p>
            </div>

            {hasData && (
                <div className="flex items-center gap-2 text-xs text-[#6f89a8]">
                    <span className="h-2 w-2 rounded-full bg-[#17D4C3]" />
                    Live learning data
                </div>
            )}
        </div>
    );
}