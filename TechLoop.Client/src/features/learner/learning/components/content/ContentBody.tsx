import { BookOpen } from "lucide-react";
import ImageViewer from "./ImageViewer";
import ExampleViewer from "./ExampleViewer";
import McqSection from "./McqSection";

interface ContentBodyProps {
    subTopic: {
        id: number;
        title: string;
        description?: string | null;
        imageUrl?: string | null;
        example?: string | null;
        exampleType?: number | string | null;
        exampleLanguage?: string | null;
    };
    technologyId: number;
}

export default function ContentBody({
                                        subTopic,
                                        technologyId,
                                    }: ContentBodyProps) {
    return (
        <section
            id={`subtopic-${subTopic.id}`}
            className="scroll-mt-28"
        >
            {/* Subtopic title */}
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#00E8C2]/20 bg-[#00E8C2]/10">
                        <BookOpen className="h-4 w-4 text-[#00E8C2]" />
                    </span>

                    <h2 className="text-2xl font-semibold text-white">
                        {subTopic.title}
                    </h2>
                </div>
            </div>

            <div className="space-y-8">
                {/* Description */}
                {subTopic.description && (
                    <div className="whitespace-pre-wrap text-base leading-8 text-[#8CA3BF]">
                        {subTopic.description}
                    </div>
                )}

                {/* Image */}
                {subTopic.imageUrl && (
                    <ImageViewer src={subTopic.imageUrl} alt={subTopic.title}/>
                )}

                {/* Example */}
                {subTopic.example && (
                    <ExampleViewer title="Example" code={subTopic.example}
                        exampleType={subTopic.exampleType} language={subTopic.exampleLanguage ?? undefined}/>
                )}
            </div>

            {/* MCQ */}
            <McqSection subTopicId={subTopic.id} technologyId={technologyId}/>
        </section>
    );
}