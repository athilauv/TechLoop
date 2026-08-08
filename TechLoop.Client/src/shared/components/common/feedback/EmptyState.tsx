import React from "react";
import { SearchX } from "lucide-react";

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

    const renderedIcon = React.isValidElement(icon) ? (
        icon
    ) : (
        <SearchX className="h-7 w-7" />
    );

    return (
        <div
            className={`relative flex flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-[#223A59] bg-[#0F1C30] px-6 py-24 text-center ${className}`}
        >
            {/* Soft radial glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,232,194,0.08),transparent_45%)]" />

            {/* Icon */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00E8C2]/20 bg-[#00E8C2]/10 text-[#00E8C2]">
                {renderedIcon}
            </div>

            {/* Content */}
            <div className="relative max-w-sm space-y-2">
                <h3 className="text-lg font-semibold text-white">
                    {title}
                </h3>

                {description && (
                    <p className="text-sm leading-relaxed text-[#8CA3BF]">
                        {description}
                    </p>
                )}
            </div>

            {/* Actions */}
            {(actionLabel || secondaryActionLabel) && (
                <div className="relative mt-2 flex items-center gap-3">
                    {actionLabel && (
                        <button
                            type="button"
                            onClick={onAction}
                            className="rounded-lg bg-[#00E8C2] px-4 py-2 text-sm font-semibold text-[#081423] transition-colors duration-150 hover:bg-[#00DDB9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C30]"
                        >
                            {actionLabel}
                        </button>
                    )}

                    {secondaryActionLabel && (
                        <button
                            type="button"
                            onClick={onSecondaryAction}
                            className="rounded-lg border border-[#223A59] bg-[#101C30] px-4 py-2 text-sm font-semibold text-[#8CA3BF] transition-colors duration-150 hover:border-[#00E8C2]/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C30]"
                        >
                            {secondaryActionLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmptyState;