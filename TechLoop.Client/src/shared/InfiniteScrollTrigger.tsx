import { useEffect, useRef } from "react";

interface Props {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
}

export default function InfiniteScrollTrigger({ hasNextPage, isFetchingNextPage, onLoadMore }: Props) {
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!ref.current || !hasNextPage || isFetchingNextPage) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting) onLoadMore();
        }, { rootMargin: "300px" });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, onLoadMore]);
    return <div ref={ref} className="flex min-h-8 items-center justify-center py-3">{isFetchingNextPage ? <span className="text-xs text-[var(--cs-text-muted)]">Loading more...</span> : null}</div>;
}
