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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
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
        <div className={`relative flex flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-[#223A59] bg-[#0F1C30] px-6 py-24 text-center ${className}`}>
            <div className="pointer-events-none absolute left-1/2 top-16 h-40 w-40 -translate-x-1/2 rounded-full bg-[#00E8C2]/10 blur-3xl" aria-hidden="true"/>
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00E8C2]/20 bg-[#00E8C2]/10 text-[#00E8C2]">
                {icon ?? <DefaultIcon />}
            </div>

            <div className="relative max-w-sm space-y-2">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                {description && (
                    <p className="text-sm leading-relaxed text-[#8CA3BF]">{description}</p>
                )}
            </div>

            {(actionLabel || secondaryActionLabel) && (
                <div className="relative mt-2 flex items-center gap-3">
                    {actionLabel && (
                        <button type="button" onClick={onAction} className="rounded-lg bg-[#00E8C2] px-4 py-2 text-sm font-semibold text-[#081423] transition-colors duration-150 hover:bg-[#00DDB9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C30]">
                            {actionLabel}
                        </button>
                    )}
                    {secondaryActionLabel && (
                        <button type="button" onClick={onSecondaryAction} className="rounded-lg border border-[#223A59] bg-[#101C30] px-4 py-2 text-sm font-semibold text-[#8CA3BF] transition-colors duration-150 hover:border-[#00E8C2]/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C30]">
                            {secondaryActionLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmptyState;