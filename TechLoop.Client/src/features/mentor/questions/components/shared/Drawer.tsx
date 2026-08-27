import { X } from "lucide-react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface DrawerProps {
    open: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    children: ReactNode;
}

const Drawer = ({
    open,
    title,
    description,
    onClose,
    children,
}: DrawerProps) => {
    if (!open) {
        return null;
    }

    const dialog = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
            style={{
                backgroundColor: "rgba(3, 10, 20, 0.94)",
                opacity: 1,
                isolation: "isolate",
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 cursor-default"
                style={{ backgroundColor: "rgba(3, 10, 20, 0.94)" }}
            />

            <div
                className="relative z-10 flex max-h-[min(760px,calc(100vh-2rem))] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#29466d] shadow-[0_24px_80px_rgba(0,0,0,0.75)] sm:max-h-[calc(100vh-3rem)]"
                style={{
                    backgroundColor: "#0b1b2e",
                    opacity: 1,
                    isolation: "isolate",
                }}
            >
                <div
                    className="flex items-start justify-between gap-4 border-b border-[#29466d] px-6 py-5"
                    style={{ backgroundColor: "#0b1b2e" }}
                >
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-white">{title}</h2>
                        {description && (
                            <p className="mt-1 text-xs text-[#8fa6c1]">{description}</p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="shrink-0 rounded-lg p-2 text-[#8fa6c1] transition-colors hover:bg-[#12263d] hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div
                    className="min-h-0 flex-1 overflow-y-auto px-6 py-6"
                    style={{ backgroundColor: "#0b1b2e" }}
                >
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(dialog, document.body);
};

export default Drawer;
