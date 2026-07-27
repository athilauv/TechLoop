import { ArrowLeft, ArrowRight, Lock } from "lucide-react";

interface LessonNavigationProps {
    previousTitle?: string;
    nextTitle?: string;
    onPrevious?: () => void;
    onNext?: () => void;
    canGoPrevious?: boolean;
    canGoNext?: boolean;
    nextLocked?: boolean;
    lockMessage?: string;
}

export default function LessonNavigation({
                                             previousTitle,
                                             nextTitle,
                                             onPrevious,
                                             onNext,
                                             canGoPrevious = true,
                                             canGoNext = true,
                                             nextLocked = false,
                                             lockMessage = "Complete this lesson to unlock the next lesson.",
                                         }: LessonNavigationProps) {
    return (
        <div className="border-t border-slate-800 pt-8 mt-12">
            <div className="flex items-center justify-between">
                {/* Previous */}

                <button onClick={onPrevious} disabled={!canGoPrevious} className="group flex items-center gap-4 disabled:cursor-not-allowed disabled:opacity-40">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 transition group-hover:border-teal-400 group-hover:text-teal-400">
                        <ArrowLeft size={26} />
                    </div>

                    <div className="text-left">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            Previous Lesson
                        </p>

                        <h3 className="mt-1 text-xl font-semibold text-white">
                            {previousTitle ?? "—"}
                        </h3>
                    </div>
                </button>

                {/* Next */}

                {nextLocked ? (
                    <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3">
                        <Lock size={18} className="text-amber-400"/>
                        <span className="text-sm text-amber-300">
                            {lockMessage}
                        </span>

                    </div>
                ) : (
                    <button onClick={onNext} disabled={!canGoNext} className="group flex items-center gap-4 disabled:cursor-not-allowed disabled:opacity-40">
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                Next Lesson
                            </p>

                            <h3 className="mt-1 text-xl font-semibold text-white">
                                {nextTitle ?? "—"}
                            </h3>
                        </div>

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-400 text-slate-950 transition group-hover:scale-105">
                            <ArrowRight size={26} />
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
}