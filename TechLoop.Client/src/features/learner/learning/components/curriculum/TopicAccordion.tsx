import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import type {
    CurriculumSubTopic,
    CurriculumTopic,
} from "../../../../../types/curriculum.types.ts";
import SubTopicItem from "./SubTopicItem";

interface TopicAccordionProps {
    technologySlug: string;
    topic: CurriculumTopic;
    onNavigate?: () => void;
}

interface CurriculumSubTopicNode extends CurriculumSubTopic {
    subTopics: CurriculumSubTopicNode[];
}

function buildSubTopicTree(
    subTopics: CurriculumSubTopic[],
): CurriculumSubTopicNode[] {
    const nodes = new Map<number, CurriculumSubTopicNode>();

    // Clone every item first so the API response is never mutated.
    for (const subTopic of subTopics) {
        nodes.set(subTopic.id, {
            ...subTopic,
            subTopics: [],
        });
    }

    const roots: CurriculumSubTopicNode[] = [];

    for (const node of nodes.values()) {
        if (
            node.parentSubTopicId !== null &&
            nodes.has(node.parentSubTopicId)
        ) {
            nodes
                .get(node.parentSubTopicId)!
                .subTopics
                .push(node);
        } else {
            // A missing/deleted parent should not make a published
            // lesson disappear from the learner curriculum.
            roots.push(node);
        }
    }

    const sortTree = (items: CurriculumSubTopicNode[]) => {
        items.sort((a, b) => a.position - b.position);

        for (const item of items) {
            sortTree(item.subTopics);
        }
    };

    sortTree(roots);
    return roots;
}

export default function TopicAccordion({
    technologySlug,
    topic,
    onNavigate,
}: TopicAccordionProps) {
    const [open, setOpen] = useState(true);

    const subTopics = useMemo(
        () => buildSubTopicTree(topic.subTopics ?? []),
        [topic.subTopics],
    );

    return (
        <div className="border-b border-white/5">
            <button
                type="button"
                onClick={() => setOpen((previous) => !previous)}
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
                        ${open ? "rotate-180" : ""}
                    `}
                />
            </button>

            {open && (
                <div className="space-y-1 pb-3">
                    {subTopics.map((subTopic) => (
                        <SubTopicItem
                            key={subTopic.id}
                            technologySlug={technologySlug}
                            topicSlug={topic.slug}
                            subTopic={subTopic}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
