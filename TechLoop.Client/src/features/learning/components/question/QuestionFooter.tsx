import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionFooterProps {
    onPrevious?: () => void;
    onNext?: () => void;
}

export default function QuestionFooter({ onPrevious, onNext }: QuestionFooterProps) {
    return (
        <div className="mt-12 flex items-center justify-between border-t border-[#223A59] pt-6">
            <button
                type="button"
                onClick={onPrevious}
                disabled={!onPrevious}
                className="flex items-center gap-1.5 rounded-lg border border-[#223A59] bg-[#101C30] px-5 py-2 text-sm text-[#8CA3BF] transition-colors duration-150 hover:border-[#00E8C2]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </button>

            <button
                type="button"
                onClick={onNext}
                disabled={!onNext}
                className="flex items-center gap-1.5 rounded-lg bg-[#00E8C2] px-6 py-2 text-sm font-medium text-[#081423] transition-colors duration-150 hover:bg-[#00DDB9] disabled:cursor-not-allowed disabled:opacity-50"
            >
                Next
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}