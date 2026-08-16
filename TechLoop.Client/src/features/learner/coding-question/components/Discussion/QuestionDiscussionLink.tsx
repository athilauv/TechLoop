import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuestionDiscussionLinkProps {
    questionId: number;
    count: number;
}

export default function QuestionDiscussionLink({
                                                   questionId,
                                                   count,
                                               }: QuestionDiscussionLinkProps) {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() =>
                navigate(`/learner/coding/questions/${questionId}/discussions`)
            }
            className="inline-flex items-center gap-2 text-sm text-[#8CA3BF] transition hover:text-[#00E8C2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/40 rounded"
        >
            <MessageCircle size={16} />
            <span>
                {count} {count === 1 ? "Discussion" : "Discussions"}
            </span>
        </button>
    );
}