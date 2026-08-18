import { cn } from "./cn.ts";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    label?: string;
    fullHeight?: boolean;
}

const sizeMap = {
    sm: "h-4 w-4 border-2",
    md: "h-7 w-7 border-2",
    lg: "h-9 w-9 border-[3px]",
};

export default function LoadingSpinner({
                                           size = "md",
                                           className,
                                           label,
                                           fullHeight = false,
                                       }: LoadingSpinnerProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-center gap-3",
                fullHeight && "min-h-[320px]",
                className
            )}
        >
            <div
                className={cn(
                    "animate-spin rounded-full border-[var(--cs-border)] border-t-[var(--cs-accent)]",
                    sizeMap[size]
                )}
            />
            {label && (
                <span className="text-sm text-[var(--cs-text-secondary)]">
                    {label}
                </span>
            )}
        </div>
    );
}