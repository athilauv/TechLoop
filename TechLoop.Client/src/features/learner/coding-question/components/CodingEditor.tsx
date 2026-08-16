import { useEffect, useState } from "react";
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

    useEffect(() => {
        setCode(starterCode);
    }, [starterCode]);

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
        <div className="flex h-full min-h-[500px] flex-col overflow-hidden rounded-xl border border-slate-700 bg-[#0f172a]">
            {/* Editor Header */}
            <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
                <span className="text-xs font-medium text-slate-300">
                    Code
                </span>

                <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-white"
                >
                    <RotateCcw size={14} />
                    Reset
                </button>
            </div>

            {/* Editor */}
            <div className="flex flex-1">
                <div className="w-10 shrink-0 select-none border-r border-slate-700 bg-[#111827] px-2 py-4 text-right font-mono text-xs leading-6 text-slate-600">
                    {code.split("\n").map((_, index) => (
                        <div key={index}>{index + 1}</div>
                    ))}
                </div>

                <textarea
                    value={code}
                    onChange={handleChange}
                    spellCheck={false}
                    className="min-h-[460px] flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-6 text-slate-200 outline-none"
                    aria-label="Code editor"
                />
            </div>
        </div>
    );
};

export default CodingEditor;