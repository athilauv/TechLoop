import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type {CurriculumTopic,} from "../../../../../types/curriculum.types.ts";
import SubTopicItem from "./SubTopicItem";

interface TopicAccordionProps {
    technologySlug: string;
    topic: CurriculumTopic;
}

interface CurriculumSubTopicNode {
    id: number;
    title: string;
    slug: string;
    position?: number;
    subTopics?: CurriculumSubTopicNode[];
}

export default function TopicAccordion({
                                           technologySlug,
                                           topic,
                                       }: TopicAccordionProps) {
    const [open, setOpen] =
        useState(true);

    const subTopics =
        (topic.subTopics ??
            []) as CurriculumSubTopicNode[];

    const sortedSubTopics = [
        ...subTopics,
    ].sort(
        (a, b) =>
            (a.position ?? 0) -
            (b.position ?? 0)
    );

    return (
        <div className="border-b border-white/5">
            <button
                type="button"
                onClick={() =>
                    setOpen(
                        (previous) =>
                            !previous
                    )
                }
                className="
                    flex
                    w-full
                    items-center
                    justify-between
                    px-6
                    py-4
                    text-left
                    transition-colors
                    hover:bg-white/5
                "
            >
                <span className="font-medium text-white">
                    {topic.title}
                </span>

                <ChevronDown
                    size={18}
                    className={`
                        shrink-0
                        text-slate-400
                        transition-transform
                        duration-200
                        ${
                        open
                            ? "rotate-180"
                            : ""
                    }
                    `}
                />
            </button>

            {open && (
                <div className="space-y-1 pb-3">
                    {sortedSubTopics.map(
                        (subTopic) => (
                            <SubTopicItem
                                key={subTopic.id}
                                technologySlug={
                                    technologySlug
                                }
                                topicSlug={
                                    topic.slug
                                }
                                subTopic={
                                    subTopic
                                }
                            />
                        )
                    )}
                </div>
            )}
        </div>
    );
}