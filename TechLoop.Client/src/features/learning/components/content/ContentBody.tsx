import ImageViewer from "./ImageViewer";
import ExampleViewer from "./ExampleViewer";

interface ContentBodyProps {
    subTopic: {
        title: string;
        description?: string | null;
        imageUrl?: string | null;
        example?: string | null;
        exampleType?: string | number | null;
    };
}

export default function ContentBody({
                                        subTopic,
                                    }: ContentBodyProps) {
    const hasExample = Boolean(subTopic.example?.trim());
    const hasImage = Boolean(subTopic.imageUrl?.trim());

    return (
        <section className="space-y-8">
            {hasExample && (
                <ExampleViewer
                    title="Example"
                    code={subTopic.example!}
                    language={subTopic.exampleType?.toString()}
                />
            )}

            {hasImage && (
                <ImageViewer
                    src={subTopic.imageUrl!}
                    alt={subTopic.title}
                />
            )}

            {!hasExample && !hasImage && (
                <div className="rounded-xl border border-[#223A59] bg-[#101C30] px-6 py-10 text-center">
                    <p className="text-sm text-[#5C7394]">
                        No additional content available for this lesson.
                    </p>
                </div>
            )}
        </section>
    );
}