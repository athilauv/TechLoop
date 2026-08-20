import {
    Code2,
    ListChecks,
    Layers3,
} from "lucide-react";
import {
    QuestionType,
    type QuestionType as QuestionTypeValue,
} from "../../../../types/enums/question-type.ts";

export type QuestionTypeFilter =
    | "all"
    | QuestionTypeValue;

interface QuestionTypeTabsProps {
    value: QuestionTypeFilter;
    onChange: (value: QuestionTypeFilter) => void;
}

const TABS: Array<{
    value: QuestionTypeFilter;
    label: string;
    icon: typeof Layers3;
}> = [
    {
        value: "all",
        label: "All",
        icon: Layers3,
    },
    {
        value: QuestionType.Mcq,
        label: "MCQ",
        icon: ListChecks,
    },
    {
        value: QuestionType.Coding,
        label: "Coding",
        icon: Code2,
    },
    {
        value: QuestionType.Challenge,
        label: "Challenge",
        icon: Code2,
    },
];

const QuestionTypeTabs = ({
                              value,
                              onChange,
                          }: QuestionTypeTabsProps) => {
    return (
        <div className="flex min-w-0 overflow-x-auto border-b border-[var(--cs-border)]">
            {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = value === tab.value;

                return (
                    <button
                        key={String(tab.value)}
                        type="button"
                        onClick={() =>
                            onChange(tab.value)
                        }
                        className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                            active
                                ? "border-[var(--cs-primary)] text-[var(--cs-primary)]"
                                : "border-transparent text-[var(--cs-text-muted)] hover:text-[var(--cs-text)]"
                        }`}
                    >
                        <Icon size={15} />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default QuestionTypeTabs;