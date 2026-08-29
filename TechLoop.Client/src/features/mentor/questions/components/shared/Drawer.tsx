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
                backgroundColor: "rgba(3, 10, 20, 0.72)",
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
            />

            <div className="relative z-10 flex max-h-[min(760px,calc(100vh-2rem))] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[var(--cs-surface)] shadow-[0_24px_80px_rgba(0,0,0,0.6)] ring-1 ring-inset ring-[var(--cs-border)]/70 sm:max-h-[calc(100vh-3rem)]">
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--cs-border)]/60 px-6 py-5">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-[var(--cs-text)]">{title}</h2>
                        {description && (
                            <p className="mt-1 text-xs text-[var(--cs-text-muted)]">{description}</p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="shrink-0 rounded-lg p-2 text-[var(--cs-text-muted)] transition-colors hover:bg-[var(--cs-surface-muted)] hover:text-[var(--cs-text)]"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(dialog, document.body);
};

export default Drawer;
