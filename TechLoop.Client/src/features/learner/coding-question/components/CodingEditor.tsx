import { useState } from "react";
import { RotateCcw } from "lucide-react";

interface CodingEditorProps {
    starterCode: string;
    onCodeChange?: (code: string) => void;
}

const CodingEditor = ({
                          starterCode,
                          onCodeChange,
                      }: CodingEditorProps) => {
    const [code, setCode] = useState(starterCode);
    const handleChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const value = event.target.value;

        setCode(value);
        onCodeChange?.(value);
    };

    const handleReset = () => {
        setCode(starterCode);
        onCodeChange?.(starterCode);
    };

    return (
        <div className="flex h-full min-h-[500px] flex-col overflow-hidden rounded-2xl border border-[#223A59] bg-[#0E192A]">
            {/* Editor Header */}
            <div className="flex items-center justify-between border-b border-[#223A59] bg-[#101C30] px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#00E8C2]/70" />
                    <span className="text-xs font-medium text-[#B9C8DC]">
                        Code
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[#8CA3BF] transition hover:bg-[#14243C] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/40"
                >
                    <RotateCcw size={13} />
                    Reset
                </button>
            </div>

            {/* Editor */}
            <div className="flex flex-1">
                <div className="w-10 shrink-0 select-none border-r border-[#223A59] bg-[#0E192A] px-2 py-4 text-right font-mono text-xs leading-6 text-[#3E5878]">
                    {code.split("\n").map((_, index) => (
                        <div key={index}>{index + 1}</div>
                    ))}
                </div>

                <textarea
                    value={code}
                    onChange={handleChange}
                    spellCheck={false}
                    className="min-h-[460px] flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-6 text-[#D7E1EE] outline-none placeholder:text-[#3E5878]"
                    aria-label="Code editor"
                />
            </div>
        </div>
    );
};

export default CodingEditor;