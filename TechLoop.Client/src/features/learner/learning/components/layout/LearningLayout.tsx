import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";
import CurriculumSidebar from "../curriculum/CurriculumSidebar";

interface LearningLayoutProps {
    children: ReactNode;
    mobileCurriculumOpen?: boolean;
    onMobileCurriculumChange?: (open: boolean) => void;
    keepCurriculumOpenInitially?: boolean;
}

export default function LearningLayout({
    children,
    mobileCurriculumOpen = false,
    onMobileCurriculumChange,
}: LearningLayoutProps) {
    const closeCurriculum = () => onMobileCurriculumChange?.(false);

    return (
        <div className="relative flex h-[calc(100vh-64px)] overflow-hidden bg-[#081423]">
            {/* Curriculum is permanently visible on wide screens. */}
            <aside className="hidden w-80 shrink-0 border-r border-[#223A59] bg-[#0E192A] xl:block">
                <CurriculumSidebar />
            </aside>

            {/* Below the wide-screen breakpoint, the curriculum becomes a
                side panel opened by the sticky Curriculum button. */}
            {mobileCurriculumOpen && (
                <aside className="absolute inset-y-0 left-0 z-50 flex w-[min(20rem,82vw)] flex-col border-r border-[#223A59] bg-[#0E192A] shadow-2xl xl:hidden">
                    <div className="flex shrink-0 items-center justify-between border-b border-[#223A59] px-4 py-3">
                        <span className="text-sm font-semibold text-white">
                            Curriculum
                        </span>

                        <button
                            type="button"
                            onClick={closeCurriculum}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                            aria-label="Close curriculum"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="min-h-0 flex-1">
                        <CurriculumSidebar onNavigate={closeCurriculum} />
                    </div>
                </aside>
            )}

            {mobileCurriculumOpen && (
                <button
                    type="button"
                    aria-label="Close curriculum"
                    onClick={closeCurriculum}
                    className="fixed inset-0 z-40 bg-black/40 xl:hidden"
                />
            )}

            <main className="min-w-0 flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
                    {!mobileCurriculumOpen && (
                        <div className="sticky top-3 z-30 mb-6 flex justify-start xl:hidden">
                            <div className="rounded-xl border border-[#223A59] bg-[#081423]/80 p-1.5 backdrop-blur-sm">
                                <button
                                    type="button"
                                    onClick={() => onMobileCurriculumChange?.(true)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#0B4A68] px-4 py-2 text-sm font-semibold text-[#66E8FF] shadow-sm transition hover:bg-[#0F5B7D]"
                                    aria-label="Open curriculum"
                                >
                                    <Menu className="h-4 w-4" />
                                    Curriculum
                                </button>
                            </div>
                        </div>
                    )}

                    {children}
                </div>
            </main>
        </div>
    );
}
