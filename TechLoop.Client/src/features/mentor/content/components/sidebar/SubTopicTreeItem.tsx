import { Circle, MoreHorizontal, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MentorCurriculumSubTopic } from "../../../../../types/mentor.types.ts";
import { cn} from "../../../../../shared/cn.ts";

interface SubTopicTreeItemProps {
    subTopic: MentorCurriculumSubTopic;
    selected: boolean;
    onSelect: () => void;
    onEdit?: (id: number) => void;
}

export default function SubTopicTreeItem({
                                             subTopic,
                                             selected,
                                             onSelect,
                                             onEdit,
                                         }: SubTopicTreeItemProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    const handleEdit = () => {
        setMenuOpen(false);
        onEdit?.(subTopic.id);
    };

    return (
        <div
            className={cn(
                "group relative ml-9 mr-3 flex items-center gap-2 rounded-lg transition",
                selected ? "bg-[var(--cs-accent-subtle)]" : "hover:bg-white/5"
            )}
        >
            {/* SUBTOPIC SELECT */}
            <button
                type="button"
                onClick={onSelect}
                className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left"
            >
                <Circle
                    size={7}
                    className={cn(
                        "shrink-0 fill-current",
                        selected ? "text-[var(--cs-accent)]" : "text-[var(--cs-text-muted)]"
                    )}
                />

                <span
                    className={cn(
                        "min-w-0 flex-1 truncate text-sm",
                        selected ? "text-[var(--cs-accent)]" : "text-[var(--cs-text-secondary)]"
                    )}
                >
                    {subTopic.title}
                </span>
            </button>

            {/* ACTION BUTTON */}
            <div className="relative mr-2 shrink-0" ref={menuRef}>
                <button
                    type="button"
                    title="Subtopic actions"
                    aria-label={`Actions for ${subTopic.title}`}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((previous) => !previous)}
                    className={cn(
                        "rounded-md p-1.5 transition",
                        menuOpen
                            ? "bg-white/10 text-[var(--cs-text-primary)]"
                            : "text-[var(--cs-text-muted)] opacity-0 group-hover:opacity-100 hover:bg-white/10 hover:text-[var(--cs-text-primary)]"
                    )}
                >
                    <MoreHorizontal size={16} />
                </button>

                {menuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-lg border border-[var(--cs-border)] bg-[var(--cs-bg-card)] p-1 shadow-xl">
                        <button
                            type="button"
                            onClick={handleEdit}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[var(--cs-text-secondary)] transition hover:bg-white/5 hover:text-[var(--cs-text-primary)]"
                        >
                            <Pencil size={14} />
                            <span>Edit</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}