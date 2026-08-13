import { Terminal } from "lucide-react";
import CodeBlock from "./CodeBlock";

interface ExampleViewerProps {
    title?: string;
    language?: string;
    code: string;
}

export default function ExampleViewer({
                                          title,
                                          language,
                                          code,
                                      }: ExampleViewerProps) {
    return (
        <section className="space-y-4">
            {title && (
                <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#00E8C2]/25 bg-[#00E8C2]/10">
                        <Terminal className="h-3.5 w-3.5 text-[#00E8C2]" />
                    </span>

                    <h2 className="text-xl font-semibold text-white">
                        {title}
                    </h2>
                </div>
            )}

            <CodeBlock
                language={language}
                code={code}
            />
        </section>
    );
}