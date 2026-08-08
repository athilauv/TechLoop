import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
    language?: string;
    code: string;
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            // Clipboard access denied — fail silently, button stays as-is.
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-[#223A59] bg-[#081423] shadow-[0_0_0_1px_rgba(0,232,194,0.02)]">
            {/* Terminal-style chrome */}
            <div className="flex items-center justify-between border-b border-[#223A59] bg-[#12233B] px-4 py-2.5">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#223A59]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#223A59]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#223A59]" />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wide text-[#8CA3BF]">
                        {language ?? "Code"}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg border border-[#223A59] bg-[#101C30] px-2.5 py-1 text-xs text-[#8CA3BF] transition-colors duration-150 hover:border-[#00E8C2]/40 hover:text-white"
                >
                    {copied ? (
                        <>
                            <Check className="h-3.5 w-3.5 text-[#00E8C2]" />
                            <span className="text-[#00E8C2]">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                        </>
                    )}
                </button>
            </div>

            <pre className="overflow-x-auto p-5">
                <code className="font-mono text-sm leading-7 text-[#00E8C2]">
                    {code}
                </code>
            </pre>
        </div>
    );
}