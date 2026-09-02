import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface McqOption {
    id: number;
    optionText: string;
}

interface McqOptionsProps {
    options: McqOption[];
    disabled?: boolean;
    solved?: boolean;
    onSubmit: (optionId: number) => void;
}

export default function McqOptions({
    options,
    disabled = false,
    solved = false,
    onSubmit,
}: McqOptionsProps) {
    const [selectedOption, setSelectedOption] =
        useState<number | null>(null);

    useEffect(() => {
        if (!disabled && !solved) {
            setSelectedOption(null);
        }
    }, [options, disabled, solved]);

    const handleSelect = (optionId: number) => {
        if (disabled || solved) {
            return;
        }

        setSelectedOption(optionId);
    };

    const handleSubmit = () => {
        if (
            selectedOption === null ||
            disabled ||
            solved
        ) {
            return;
        }

        onSubmit(selectedOption);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {options.map((option) => {
                    const isSelected =
                        selectedOption === option.id;

                    return (
                        <button
                            key={option.id}
                            type="button"
                            disabled={disabled || solved}
                            onClick={() =>
                                handleSelect(option.id)
                            }
                            className={`
                                flex w-full items-center gap-3
                                rounded-xl border px-5 py-4
                                text-left transition-all duration-150
                                ${
                                    isSelected
                                        ? "border-[#00E8C2] bg-[#00E8C2]/10 text-white"
                                        : "border-[#223A59] bg-[#101C30] text-[#8CA3BF]"
                                }
                                ${
                                    !disabled && !solved
                                        ? "hover:border-[#00E8C2]/40 hover:text-white"
                                        : ""
                                }
                                ${
                                    disabled || solved
                                        ? "cursor-not-allowed"
                                        : ""
                                }
                            `}
                        >
                            <span
                                className={`
                                    flex h-5 w-5 shrink-0
                                    items-center justify-center
                                    rounded-full border
                                    ${
                                        isSelected
                                            ? "border-[#00E8C2] bg-[#00E8C2]"
                                            : "border-[#223A59]"
                                    }
                                `}
                            >
                                {isSelected && (
                                    <Check className="h-3 w-3 text-[#081423]" />
                                )}
                            </span>

                            <span className="flex-1">
                                {option.optionText}
                            </span>
                        </button>
                    );
                })}
            </div>

            {!solved && (
                <button
                    type="button"
                    disabled={
                        selectedOption === null ||
                        disabled
                    }
                    onClick={handleSubmit}
                    className="
                        w-full rounded-xl
                        bg-[#00E8C2]
                        py-3
                        font-semibold
                        text-[#081423]
                        transition-colors duration-150
                        hover:bg-[#00DDB9]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    {disabled
                        ? "Checking Answer..."
                        : "Submit Answer"}
                </button>
            )}
        </div>
    );
}
