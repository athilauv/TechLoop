import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
    retryLabel?: string;
}

export default function ErrorState({
                                       title = "Something went wrong",
                                       description = "We hit an error loading this content. Try again.",
                                       onRetry,
                                       retryLabel = "Try again",
                                   }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#F87171]/30 bg-[#081423] px-6 py-16 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F87171]/30 bg-[#F87171]/10">
                <AlertTriangle className="h-5 w-5 text-[#F87171]" />
            </span>

            <p className="text-sm font-medium text-white">{title}</p>

            {description && (
                <p className="max-w-sm text-sm text-[#5C7394]">{description}</p>
            )}

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#223A59] bg-[#101C30] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:border-[#00E8C2]/40"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {retryLabel}
                </button>
            )}
        </div>
    );
}