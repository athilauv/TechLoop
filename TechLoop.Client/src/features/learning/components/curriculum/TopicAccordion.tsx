import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type { CurriculumTopic } from "../../types/curriculum.types";
import SubTopicItem from "./SubTopicItem";

interface TopicAccordionProps {
    technologySlug: string;
    topic: CurriculumTopic;
}

export default function TopicAccordion({
                                           technologySlug,
                                           topic,
                                       }: TopicAccordionProps) {
    const [open, setOpen] = useState(true);

    return (
        <div className="border-b border-white/5">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="
                    flex
                    w-full
                    items-center
                    justify-between
                    px-6
                    py-4
                    text-left
                "
            >
                <span className="font-medium text-white">
                    {topic.title}
                </span>

                <ChevronDown
                    size={18}
                    className={`transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <div className="space-y-1 pb-3">
                    {topic.subTopics.map((subTopic) => (
                        <SubTopicItem
                            key={subTopic.id}
                            technologySlug={technologySlug}
                            topicSlug={topic.slug}
                            subTopicSlug={subTopic.slug}
                            title={subTopic.title}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}