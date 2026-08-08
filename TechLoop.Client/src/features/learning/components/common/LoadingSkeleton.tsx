interface LoadingSkeletonProps {
    variant?: "text" | "card" | "block" | "avatar";
    lines?: number;
    className?: string;
}

const PULSE = "animate-pulse rounded-lg bg-[#12233B]";

export default function LoadingSkeleton({
                                            variant = "block",
                                            lines = 3,
                                            className = "",
                                        }: LoadingSkeletonProps) {
    if (variant === "text") {
        return (
            <div className={`space-y-3 ${className}`}>
                {Array.from({ length: lines }).map((_, index) => (
                    <div
                        key={index}
                        className={`${PULSE} h-3.5`}
                        style={{ width: index === lines - 1 ? "60%" : "100%" }}
                    />
                ))}
            </div>
        );
    }

    if (variant === "avatar") {
        return <div className={`${PULSE} h-10 w-10 !rounded-full ${className}`} />;
    }

    if (variant === "card") {
        return (
            <div
                className={`overflow-hidden rounded-2xl border border-[#223A59] bg-[#081423] ${className}`}
            >
                <div className="h-10 border-b border-[#223A59] bg-[#12233B]" />
                <div className="space-y-3 p-5">
                    <div className={`${PULSE} h-3.5 w-2/3`} />
                    <div className={`${PULSE} h-3.5 w-full`} />
                    <div className={`${PULSE} h-3.5 w-4/5`} />
                </div>
            </div>
        );
    }

    // block
    return <div className={`${PULSE} h-32 w-full ${className}`} />;
}