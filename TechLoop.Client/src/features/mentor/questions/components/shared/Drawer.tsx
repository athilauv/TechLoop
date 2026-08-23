import { X } from "lucide-react";
import type { ReactNode } from "react";

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

    return (
        <div className="fixed inset-0 z-[999] flex justify-end">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            />

            {/* Panel */}
            <div
                className="
                    relative flex h-full w-full max-w-md flex-col
                    border-l border-[var(--cs-border)]
                    bg-[var(--cs-surface)]
                    shadow-2xl
                    animate-in slide-in-from-right duration-150
                "
            >
                <div className="flex items-start justify-between gap-4 border-b border-[var(--cs-border)] px-6 py-5">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-[var(--cs-text)]">
                            {title}
                        </h2>
                        {description && (
                            <p className="mt-1 text-xs text-[var(--cs-text-muted)]">
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close drawer"
                        className="rounded-lg p-2 text-[var(--cs-text-muted)] transition-colors hover:bg-[var(--cs-surface-muted)] hover:text-[var(--cs-text)]"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Drawer;
