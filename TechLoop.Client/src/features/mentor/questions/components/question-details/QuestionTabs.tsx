interface QuestionTab {
    key: string;
    label: string;
}

interface QuestionTabsProps {
    tabs: QuestionTab[];
    active: string;
    onChange: (key: string) => void;
}

const QuestionTabs = ({ tabs, active, onChange }: QuestionTabsProps) => {
    return (
        <div className="flex gap-1 overflow-x-auto border-b border-[var(--cs-border)]">
            {tabs.map((tab) => {
                const isActive = tab.key === active;

                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onChange(tab.key)}
                        className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                            isActive
                                ? "border-[var(--cs-primary)] text-[var(--cs-primary)]"
                                : "border-transparent text-[var(--cs-text-muted)] hover:text-[var(--cs-text)]"
                        }`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default QuestionTabs;
