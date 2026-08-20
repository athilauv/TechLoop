import { Braces, Code2, ListChecks } from "lucide-react";
import { QuestionType, type QuestionType as QuestionTypeValue } from "../../../../types/enums/question-type.ts";

interface QuestionTypeBadgeProps {
    type: QuestionTypeValue;
}

const TYPE_CONFIG: Record<
    QuestionTypeValue,
    {
        label: string;
        icon: typeof Code2;
        className: string;
    }
> = {
    [QuestionType.Mcq]: {
        label: "MCQ",
        icon: ListChecks,
        className:
            "border-violet-400/20 bg-violet-400/10 text-violet-400",
    },

    [QuestionType.Coding]: {
        label: "Coding",
        icon: Code2,
        className:
            "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
    },

    [QuestionType.Challenge]: {
        label: "Challenge",
        icon: Braces,
        className:
            "border-orange-400/20 bg-orange-400/10 text-orange-400",
    },
};

const QuestionTypeBadge = ({
                               type,
                           }: QuestionTypeBadgeProps) => {
    const config = TYPE_CONFIG[type];

    if (!config) {
        return null;
    }

    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${config.className}`}>
            <Icon className="h-3 w-3" />
            {config.label}
        </span>
    );
};

export default QuestionTypeBadge;