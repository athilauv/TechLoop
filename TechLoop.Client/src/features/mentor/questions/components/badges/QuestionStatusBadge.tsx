import { CheckCircle2, Clock3 } from "lucide-react";

interface QuestionStatusBadgeProps {
    publishedAt?: string | null;
}

const QuestionStatusBadge = ({ publishedAt }: QuestionStatusBadgeProps) => {
    const isPublished = Boolean(publishedAt);

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                isPublished
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                    : "border-amber-400/20 bg-amber-400/10 text-amber-400"
            }`}
        >
            {isPublished ? (
                <CheckCircle2 className="h-3 w-3" />
            ) : (
                <Clock3 className="h-3 w-3" />
            )}
            {isPublished ? "Published" : "Pending"}
        </span>
    );
};

export default QuestionStatusBadge;
