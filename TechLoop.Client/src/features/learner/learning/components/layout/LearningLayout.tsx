import type { ReactNode } from "react";
import { X } from "lucide-react";
import CurriculumSidebar from "../curriculum/CurriculumSidebar";

interface LearningLayoutProps {
    children: ReactNode;
    mobileCurriculumOpen?: boolean;
    onMobileCurriculumChange?: (open: boolean) => void;
}

export default function LearningLayout({
    children,
    mobileCurriculumOpen = false,
    onMobileCurriculumChange,
}: LearningLayoutProps) {
    const closeMobileCurriculum = () => onMobileCurriculumChange?.(false);

    return (
        <div className="relative flex h-[calc(100vh-64px)] overflow-hidden bg-[#081423]">
            {/* Full curriculum on wide screens */}
            <aside className="hidden w-80 shrink-0 border-r border-[#223A59] bg-[#0E192A] xl:block">
                <CurriculumSidebar />
            </aside>

            {/* Curriculum drawer on smaller screens */}
            <div
                className={`absolute inset-0 z-50 xl:hidden ${mobileCurriculumOpen ? "pointer-events-auto" : "pointer-events-none"}`}
                aria-hidden={!mobileCurriculumOpen}
            >
                <button
                    type="button"
                    aria-label="Close curriculum"
                    onClick={closeMobileCurriculum}
                    className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${mobileCurriculumOpen ? "opacity-100" : "opacity-0"}`}
                />

                <aside
                    className={`absolute left-0 top-0 flex h-full w-[min(22rem,88vw)] flex-col border-r border-[#223A59] bg-[#0E192A] shadow-2xl transition-transform duration-200 ${mobileCurriculumOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <div className="flex shrink-0 items-center justify-between border-b border-[#223A59] px-4 py-3">
                        <span className="text-sm font-semibold text-white">Curriculum</span>
                        <button
                            type="button"
                            onClick={closeMobileCurriculum}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                            aria-label="Close curriculum"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="min-h-0 flex-1">
                        <CurriculumSidebar onNavigate={closeMobileCurriculum} />
                    </div>
                </aside>
            </div>

            <main className="min-w-0 flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
