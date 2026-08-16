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
        <button type="button" onClick={() =>
                navigate(`/learner/coding/questions/${questionId}/discussions`)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#17D4C3] dark:text-slate-400">
            <MessageCircle size={16} />
            <span>
                {count} {count === 1 ? "Discussion" : "Discussions"}
            </span>
        </button>
    );
}