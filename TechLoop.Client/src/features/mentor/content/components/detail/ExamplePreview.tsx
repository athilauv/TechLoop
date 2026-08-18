import { ExternalLink, FileText, Image as ImageIcon, Video } from "lucide-react";
import { ExampleType } from "../../../../../types/enums/example-type.ts";

interface ExamplePreviewProps {
    example: string;
    exampleType: ExampleType | null;
}

export default function ExamplePreview({ example, exampleType }: ExamplePreviewProps) {
    return (
        <div className="border-t border-[var(--cs-border)] p-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--cs-accent)]">
                Example
            </p>

            {renderByType(example, exampleType)}
        </div>
    );
}

function renderByType(example: string, exampleType: ExampleType | null) {
    switch (exampleType) {
        case ExampleType.Code:
            return (
                <pre className="cs-scroll overflow-x-auto rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg-primary-deep)] p-5 font-mono text-sm leading-6 text-[var(--cs-text-secondary)]">
                    {example}
                </pre>
            );

        case ExampleType.Link:
            return (

              <a  href={example}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg-primary-deep)] px-5 py-4 text-sm text-[var(--cs-accent)] transition hover:border-[var(--cs-accent-border)] hover:bg-[var(--cs-accent-subtle)]"
                >
                <ExternalLink size={15} />
            <span className="break-all">{example}</span>
        </a>
        );

        case ExampleType.Image:
            return (
                <div className="overflow-hidden rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg-primary-deep)]">
                    <img
                        src={example}
                        alt="Example"
                        className="max-h-[420px] w-full object-contain"
                    />
                </div>
            );

        case ExampleType.Video:
            return (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg-primary-deep)] p-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--cs-accent-subtle)] text-[var(--cs-accent)]">
                        <Video size={16} />
                    </span>

                    <a
                    href={example}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 flex-1 truncate text-sm text-[var(--cs-accent)] hover:underline"
                    >
                    {example}
                </a>
        </div>
        );

        case ExampleType.Pdf:
            return (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg-primary-deep)] p-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--cs-accent-subtle)] text-[var(--cs-accent)]">
                        <FileText size={16} />
                    </span>

                    <a
                    href={example}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 flex-1 truncate text-sm text-[var(--cs-accent)] hover:underline"
                    >
                    {example}
                </a>
        </div>
        );

        case ExampleType.Text:
        default:
            return (
                <div className="flex items-start gap-3 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg-primary-deep)] p-5">
                    <ImageIcon size={0} className="hidden" />
                    <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--cs-text-secondary)]">
                        {example}
                    </p>
                </div>
            );
    }
}