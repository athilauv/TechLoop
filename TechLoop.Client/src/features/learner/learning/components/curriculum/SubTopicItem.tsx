import {
    ChevronDown,
    Circle,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export interface CurriculumSubTopicNode {
    id: number;
    title: string;
    slug: string;
    position?: number;
    subTopics?: CurriculumSubTopicNode[];
    children?: CurriculumSubTopicNode[];
}

interface SubTopicItemProps {
    technologySlug: string;
    topicSlug: string;
    subTopic: CurriculumSubTopicNode;
    level?: number;
    onNavigate?: () => void;
}

export default function SubTopicItem({
                                         technologySlug,
                                         topicSlug,
                                         subTopic,
                                         level = 0,
                                         onNavigate,
                                     }: SubTopicItemProps) {
    const childNodes =
        subTopic.subTopics ??
        subTopic.children ??
        [];

    const hasChildren = childNodes.length > 0;

    const [open, setOpen] =
        useState(true);

    const path =
        `/learner/learning/${technologySlug}/${topicSlug}/${subTopic.slug}`;

    const sortedChildren = [
        ...childNodes,
    ].sort(
        (a, b) =>
            (a.position ?? 0) -
            (b.position ?? 0)
    );

    return (
        <div>
            {/* =========================
                SUBTOPIC ITEM
            ========================== */}
            <div
                className="flex items-center"
                style={{
                    paddingLeft:
                        level > 0
                            ? `${level * 16}px`
                            : "0px",
                }}
            >
                <NavLink
                    to={path}
                    onClick={(event) => {
                        const currentPath =
                            window.location.pathname;

                        /*
                         * If the user clicks the
                         * currently active lesson,
                         * don't navigate again.
                         *
                         * Instead scroll to the
                         * existing content.
                         */
                        if (
                            currentPath ===
                            path
                        ) {
                            event.preventDefault();

                            const element =
                                document.getElementById(
                                    `subtopic-${subTopic.slug}`
                                );

                            element?.scrollIntoView(
                                {
                                    behavior:
                                        "smooth",
                                    block: "start",
                                }
                            );
                        }

                        onNavigate?.();
                    }}
                    className={({ isActive }) =>
                        `
                        mx-3
                        flex
                        min-w-0
                        flex-1
                        items-center
                        gap-3
                        rounded-lg
                        px-4
                        py-3
                        text-sm
                        transition-all
                        duration-200
                        ${
                            isActive
                                ? "bg-[#17D4C3]/10 text-[#17D4C3]"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }
                        `
                    }
                >
                    <Circle
                        className="
                            h-2
                            w-2
                            shrink-0
                            fill-current
                        "
                    />

                    <span className="min-w-0 flex-1 truncate">
                        {subTopic.title}
                    </span>
                </NavLink>

                {/* =========================
                    CHILD TOGGLE
                ========================== */}
                {hasChildren && (
                    <button
                        type="button"
                        aria-label={
                            open
                                ? `Collapse ${subTopic.title}`
                                : `Expand ${subTopic.title}`
                        }
                        onClick={() =>
                            setOpen(
                                (previous) =>
                                    !previous
                            )
                        }
                        className="
                            mr-4
                            shrink-0
                            rounded-md
                            p-1.5
                            text-slate-500
                            transition
                            hover:bg-white/5
                            hover:text-white
                        "
                    >
                        <ChevronDown
                            className={`
                                h-4
                                w-4
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
                )}
            </div>

            {/* =========================
                NESTED CHILDREN
            ========================== */}
            {hasChildren &&
                open && (
                    <div className="space-y-1">
                        {sortedChildren.map(
                            (child) => (
                                <SubTopicItem
                                    key={child.id}
                                    technologySlug={
                                        technologySlug
                                    }
                                    topicSlug={
                                        topicSlug
                                    }
                                    subTopic={
                                        child
                                    }
                                    level={
                                        level +
                                        1
                                    }
                                    onNavigate={onNavigate}
                                />
                            )
                        )}
                    </div>
                )}
        </div>
    );
}