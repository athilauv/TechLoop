import { useState } from "react";
import { Play, Send } from "lucide-react";

interface CodingEditorProps {
    starterCode: string;
    language: string;
    onRun: (sourceCode: string) => void;
    onSubmit: (sourceCode: string) => void;
}

export default function CodingEditor({
                                         starterCode,
                                         language,
                                         onRun,
                                         onSubmit,
                                     }: CodingEditorProps) {
    const [code, setCode] = useState(starterCode);

    return (
        <div className="overflow-hidden rounded-2xl border border-[#223A59] bg-[#081423]">
            <div className="flex items-center justify-between border-b border-[#223A59] bg-[#12233B] px-5 py-3">
                <span className="rounded-full border border-[#223A59] bg-[#101C30] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#8CA3BF]">
                    {language}
                </span>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => onRun(code)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#223A59] bg-[#101C30] px-4 py-2 text-sm text-[#8CA3BF] transition-colors duration-150 hover:border-[#00E8C2]/40 hover:text-white"
                    >
                        <Play className="h-3.5 w-3.5" />
                        Run
                    </button>

                    <button
                        type="button"
                        onClick={() => onSubmit(code)}
                        className="flex items-center gap-1.5 rounded-lg bg-[#00E8C2] px-4 py-2 text-sm font-semibold text-[#081423] transition-colors duration-150 hover:bg-[#00DDB9]"
                    >
                        <Send className="h-3.5 w-3.5" />
                        Submit
                    </button>
                </div>
            </div>

            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="h-[500px] w-full resize-none bg-[#081423] p-6 font-mono text-sm leading-7 text-[#E5EEF9] outline-none transition-shadow duration-150 focus:shadow-[inset_0_0_0_1px_#00E8C2]"
            />
        </div>
    );
}