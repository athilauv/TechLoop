import { useState } from "react";
import { Check } from "lucide-react";

interface McqOption {
    id: number;
    optionText: string;
}

interface McqOptionsProps {
    options: McqOption[];
    disabled?: boolean;
    onSubmit: (optionId: number) => void;
}

export default function McqOptions({
                                       options,
                                       disabled = false,
                                       onSubmit,
                                   }: McqOptionsProps) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    return (
        <div className="space-y-4">
            {options.map((option) => {
                const isSelected = selectedOption === option.id;

                return (
                    <button
                        key={option.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSelectedOption(option.id)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-5 py-4 text-left transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
                            isSelected
                                ? "border-[#00E8C2] bg-[#00E8C2]/10 text-white"
                                : "border-[#223A59] bg-[#101C30] text-[#8CA3BF] hover:border-[#00E8C2]/40"
                        }`}
                    >
                        <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ${
                                isSelected
                                    ? "border-[#00E8C2] bg-[#00E8C2]"
                                    : "border-[#223A59]"
                            }`}
                        >
                            {isSelected && <Check className="h-3 w-3 text-[#081423]" />}
                        </span>

                        <span>{option.optionText}</span>
                    </button>
                );
            })}

            <button
                type="button"
                disabled={selectedOption === null || disabled}
                onClick={() => {
                    if (selectedOption !== null) {
                        onSubmit(selectedOption);
                    }
                }}
                className="w-full rounded-xl bg-[#00E8C2] py-3 font-semibold text-[#081423] transition-colors duration-150 hover:bg-[#00DDB9] disabled:cursor-not-allowed disabled:opacity-50"
            >
                Submit Answer
            </button>
        </div>
    );
}