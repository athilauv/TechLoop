import React from "react";

interface EmptyStateProps {
    
    icon?: React.ReactNode;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
    className?: string;
}

const DefaultIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 12h8M8 16h5M8 8h3" strokeLinecap="round" />
    </svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({
                                                          icon,
                                                          title,
                                                          description,
                                                          actionLabel,
                                                          onAction,
                                                          secondaryActionLabel,
                                                          onSecondaryAction,
                                                          className = "",
                                                      }) => {
    return (
        <div className={`flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-800 bg-[#0f1729] px-6 py-14 text-center ${className}`}>
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-teal-400/20 bg-teal-400/10 text-teal-300">
                {icon ?? <DefaultIcon />}
            </div>

            <div className="max-w-sm space-y-1.5">
                <h3 className="text-base font-semibold text-slate-100">{title}</h3>
                {description && (
                    <p className="text-sm leading-relaxed text-slate-400">{description}</p>
                )}
            </div>

            {(actionLabel || secondaryActionLabel) && (
                <div className="mt-2 flex items-center gap-3">
                    {actionLabel && (
                        <button type="button" onClick={onAction} className="rounded-lg bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1729]">
                            {actionLabel}
                        </button>
                    )}
                    {secondaryActionLabel && (
                        <button type="button" onClick={onSecondaryAction} className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1729]">
                            {secondaryActionLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmptyState;