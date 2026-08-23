import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuestionDiscussionLinkProps {
    questionId: number;
    count: number;
    basePath?: string;
}

const QuestionDiscussionLink = ({
                                    questionId,
                                    count,
                                    basePath = "/learner/coding/questions",
                                }: QuestionDiscussionLinkProps) => {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(`${basePath}/${questionId}/discussions`)}
            className="inline-flex items-center gap-2 rounded text-sm text-[var(--cs-text-muted)] transition-colors hover:text-[var(--cs-primary,#00C9A7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-primary,#00C9A7)]/40"
        >
            <MessageCircle size={16} />
            <span>
        {count} {count === 1 ? "Discussion" : "Discussions"}
    </span>
        </button>
    );
};

export default QuestionDiscussionLink;
