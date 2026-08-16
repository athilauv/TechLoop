import TechCardSkeleton from "./TechCardSkeleton";

interface TechGridSkeletonProps {
    count?: number;
}

export default function TechGridSkeleton({ count = 8 }: TechGridSkeletonProps) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <TechCardSkeleton key={i} />
            ))}
        </div>
    );
}