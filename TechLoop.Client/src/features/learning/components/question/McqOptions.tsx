import { useEffect, useState } from "react";
import {
    Check,
    CircleCheck,
    CircleX,
} from "lucide-react";

interface McqOption {
    id: number;
    optionText: string;
}

interface McqOptionsProps {
    options: McqOption[];
    disabled?: boolean;
    result?: {
        isCorrect: boolean;
        score: number;
        message: string;
    } | null;
    onSubmit: (optionId: number) => void;
}

export default function McqOptions({
                                       options,
                                       disabled = false,
                                       result = null,
                                       onSubmit,
                                   }: McqOptionsProps) {
    const [selectedOption, setSelectedOption] =
        useState<number | null>(null);

    useEffect(() => {
        if (result) {
            return;
        }

        setSelectedOption(null);
    }, [options, result]);

    const hasResult = result !== null;

    const handleSelect = (optionId: number) => {
        if (disabled || hasResult) {
            return;
        }

        setSelectedOption(optionId);
    };

    const handleSubmit = () => {
        if (
            selectedOption === null ||
            disabled ||
            hasResult
        ) {
            return;
        }

        onSubmit(selectedOption);
    };

    return (
        <div className="space-y-4">

            {/* Options */}
            <div className="space-y-3">
                {options.map((option) => {
                    const isSelected =
                        selectedOption === option.id;

                    return (
                        <button
                            key={option.id}
                            type="button"
                            disabled={
                                disabled ||
                                hasResult
                            }
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
                                !disabled &&
                                !hasResult
                                    ? "hover:border-[#00E8C2]/40 hover:text-white"
                                    : ""
                            }
                                ${
                                disabled || hasResult
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

            {/* Submit */}
            {!hasResult && (
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

            {/* Result */}
            {result && (
                <div
                    className={`
                        flex items-start gap-3
                        rounded-xl border px-5 py-4
                        ${
                        result.isCorrect
                            ? "border-[#00E8C2]/30 bg-[#00E8C2]/10"
                            : "border-rose-500/30 bg-rose-500/10"
                    }
                    `}
                >
                    {result.isCorrect ? (
                        <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#00E8C2]" />
                    ) : (
                        <CircleX className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
                    )}

                    <div>
                        <p
                            className={`
                                text-sm font-semibold
                                ${
                                result.isCorrect
                                    ? "text-[#00E8C2]"
                                    : "text-rose-400"
                            }
                            `}
                        >
                            {result.message}
                        </p>

                        <p className="mt-1 text-xs text-[#8CA3BF]">
                            {result.isCorrect
                                ? `You earned ${result.score} ${result.score === 1 ? "mark" : "marks"}.`
                                : "Your attempt has been recorded. No marks were awarded."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}