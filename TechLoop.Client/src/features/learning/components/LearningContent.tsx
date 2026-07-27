import { BookOpen, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import type { Topic } from "../types/Topic";
import type { SubTopic } from "../types/SubTopic";

interface LearningContentProps {
    topic: Topic | null;
    subTopic: SubTopic | null;
    previousTitle?: string;
    nextTitle?: string;
    canGoPrevious?: boolean;
    canGoNext?: boolean;
    onPrevious?: () => void;
    onNext?: () => void;
}

export default function LearningContent({
                                            topic,
                                            subTopic,
                                            previousTitle,
                                            nextTitle,
                                            canGoPrevious = true,
                                            canGoNext = true,
                                            onPrevious,
                                            onNext,
                                        }: LearningContentProps) {
    const displayDate = subTopic?.updatedAt ?? subTopic?.createdAt;

    return (
        <main className="flex-1 overflow-hidden bg-[#0E192A]">
            <div className="flex h-full flex-col">

                {/* Header */}
                <div className="border-b border-[#223A59] bg-[#0E192A] px-10 py-8">
                    <div className="mb-3 flex items-center gap-2 text-[#00E8C2]">
                        <BookOpen size={18} strokeWidth={1.75} />
                        <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                            Learning Content
                        </span>
                    </div>

                    {/* Breadcrumb: Topic > SubTopic */}
                    {topic && subTopic && (
                        <div className="mb-4 flex items-center gap-2 text-sm text-[#8CA3BF]">
                            <span>{topic.title}</span>
                            <ChevronRight size={14} className="text-[#5C7394]" />
                            <span className="text-white">{subTopic.title}</span>
                        </div>
                    )}

                    {displayDate && (
                        <div className="mb-5 flex items-center gap-2 text-sm text-[#8CA3BF]">
                            <CalendarDays size={16} strokeWidth={1.75} />
                            <span>
                                {subTopic?.updatedAt
                                    ? `Last updated · ${new Date(displayDate).toLocaleDateString()}`
                                    : `Created · ${new Date(displayDate).toLocaleDateString()}`}
                            </span>
                        </div>
                    )}

                    <h1 className="text-4xl font-bold tracking-tight text-white">
                        {subTopic?.title}
                    </h1>
                </div>

                {/* Body — unchanged */}
                <div className="flex-1 overflow-y-auto">
                    <div className="h-full w-full px-12 py-10">

                        {subTopic?.imageUrl && (
                            <div className="mb-10 overflow-hidden rounded-2xl border border-[#223A59]">
                                <img src={subTopic.imageUrl} alt={subTopic.title} className="w-full object-cover" />
                            </div>
                        )}

                        <div className="rounded-2xl border border-[#223A59] bg-[#14243C] p-8">
                            <div className="whitespace-pre-wrap text-lg leading-9 text-[#8CA3BF]">
                                {subTopic?.description || "Content for this lesson hasn't been added yet."}
                            </div>
                        </div>

                        {/* Footer Navigation — unchanged */}
                        <div className="mt-10 flex items-center justify-between border-t border-[#223A59] pt-8">
                            <button onClick={onPrevious} disabled={!canGoPrevious} className="group flex items-center gap-3 disabled:cursor-not-allowed disabled:opacity-40">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#223A59] text-[#8CA3BF] transition-colors group-hover:border-[#00E8C2] group-hover:text-[#00E8C2]">
                                    <ChevronLeft size={18} strokeWidth={1.75} />
                                </span>
                                <span className="text-left">
                                    <span className="block text-[11px] uppercase tracking-[0.14em] text-[#5C7394]">
                                        Previous
                                    </span>
                                    <span className="block text-sm font-medium text-white group-hover:text-[#00E8C2]">
                                        {previousTitle ?? "Lesson"}
                                    </span>
                                </span>
                            </button>

                            <button onClick={onNext} disabled={!canGoNext} className="group flex items-center gap-3 disabled:cursor-not-allowed disabled:opacity-40">
                                <span className="text-right">
                                    <span className="block text-[11px] uppercase tracking-[0.14em] text-[#5C7394]">
                                        Next
                                    </span>
                                    <span className="block text-sm font-medium text-white group-hover:text-[#00E8C2]">
                                        {nextTitle ?? "Lesson"}
                                    </span>
                                </span>
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00E8C2] text-[#081423] transition-transform group-hover:translate-x-0.5 group-hover:bg-[#00DDB9]">
                                    <ChevronRight size={18} strokeWidth={1.75} />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}