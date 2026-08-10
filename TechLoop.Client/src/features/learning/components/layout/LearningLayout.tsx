import type { ReactNode } from "react";
import CurriculumSidebar from "../curriculum/CurriculumSidebar";

interface LearningLayoutProps {
    children: ReactNode;
}

export default function LearningLayout({
                                           children,
                                       }: LearningLayoutProps) {
    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#081423]">

            {/* Left Sidebar */}
            <aside className="hidden w-80 border-r border-[#223A59] bg-[#0E192A] xl:block">
                <CurriculumSidebar />
            </aside>

            {/* Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-5xl px-8 py-8">
                    {children}
                </div>
            </main>

        </div>
    );
}