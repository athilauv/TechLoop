import { BookOpen, Terminal } from "lucide-react";
import CodeBlock from "./CodeBlock";

interface ExampleViewerProps {
    title?: string;
    language?: string;
    code: string;
    exampleType?: number | string | null;
}

function isCodeExample(exampleType?: number | string | null): boolean {
    if (exampleType === 2) {
        return true;
    }

    if (typeof exampleType === "string" && exampleType.toLowerCase() === "code") {
        return true;
    }

    return false;
}

export default function ExampleViewer({
                                          title = "Example",
                                          language,
                                          code,
                                          exampleType,
                                      }: ExampleViewerProps) {
    if (!code?.trim()) {
        return null;
    }

    const codeExample = isCodeExample(exampleType);

    if (codeExample) {
        return (
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#00E8C2]/25 bg-[#00E8C2]/10">
                        <Terminal className="h-3.5 w-3.5 text-[#00E8C2]" />
                    </span>

                    <h2 className="text-xl font-semibold text-white">
                        {title}
                    </h2>
                </div>

                <CodeBlock language={language} code={code}/>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#00E8C2]/25 bg-[#00E8C2]/10">
                    <BookOpen className="h-3.5 w-3.5 text-[#00E8C2]" />
                </span>

                <h2 className="text-xl font-semibold text-white">
                    {title}
                </h2>
            </div>

            <div className="rounded-2xl border border-[#223A59] bg-[#0F1C30] px-6 py-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-[#A8BAD0]">
                    {code}
                </p>
            </div>
        </section>
    );
}