import { Menu } from "lucide-react";

interface MentorNavbarProps {
    collapsed: boolean;
    onMenuClick: () => void;
}

export default function MentorNavbar({
                                         collapsed,
                                         onMenuClick,
                                     }: MentorNavbarProps) {
    return (
        <header
            className={[
                "fixed right-0 top-0 z-30 h-16 border-b border-slate-200 bg-white transition-all duration-300",
                collapsed ? "left-20" : "left-64",
            ].join(" ")}
        >
            <div className="flex h-full items-center justify-between px-6">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} />
                </button>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600">
                        Mentor Portal
                    </span>
                </div>
            </div>
        </header>
    );
}