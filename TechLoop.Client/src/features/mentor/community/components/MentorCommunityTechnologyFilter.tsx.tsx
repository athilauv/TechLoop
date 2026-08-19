import { useEffect, useRef, useState } from "react";
import type { LearnerTechnology } from "../../../../types/technology.types.ts";

interface MentorCommunityTechnologyFilterProps {
    technologies: LearnerTechnology[];
    selectedTechnologyId: number | null;
    onTechnologyChange: (technologyId: number | null) => void;
    loading?: boolean;
}

export default function MentorCommunityTechnologyFilter({
                                                            technologies,
                                                            selectedTechnologyId,
                                                            onTechnologyChange,
                                                            loading = false,
                                                        }: MentorCommunityTechnologyFilterProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollbarRef = useRef<HTMLDivElement>(null);

    const [thumbWidth, setThumbWidth] = useState(0);
    const [thumbLeft, setThumbLeft] = useState(0);
    const [dragging, setDragging] = useState(false);

    const updateScrollbar = () => {
        const container = scrollRef.current;
        const scrollbar = scrollbarRef.current;

        if (!container || !scrollbar) {
            return;
        }

        const {
            scrollWidth,
            clientWidth,
            scrollLeft,
        } = container;

        const scrollbarWidth = scrollbar.clientWidth;

        if (scrollWidth <= clientWidth) {
            setThumbWidth(0);
            setThumbLeft(0);
            return;
        }

        const calculatedThumbWidth = Math.max(
            24,
            (clientWidth / scrollWidth) * scrollbarWidth
        );

        const maxThumbLeft =
            scrollbarWidth - calculatedThumbWidth;

        const maxScrollLeft =
            scrollWidth - clientWidth;

        const calculatedThumbLeft =
            maxScrollLeft > 0
                ? (scrollLeft / maxScrollLeft) *
                maxThumbLeft
                : 0;

        setThumbWidth(calculatedThumbWidth);
        setThumbLeft(calculatedThumbLeft);
    };

    useEffect(() => {
        const container = scrollRef.current;

        if (!container) {
            return;
        }

        const handleScroll = () => {
            updateScrollbar();
        };

        updateScrollbar();

        container.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
        );

        window.addEventListener(
            "resize",
            updateScrollbar
        );

        return () => {
            container.removeEventListener(
                "scroll",
                handleScroll
            );

            window.removeEventListener(
                "resize",
                updateScrollbar
            );
        };
    }, [technologies]);

    useEffect(() => {
        if (!dragging) {
            return;
        }

        const handleMouseMove = (
            event: MouseEvent
        ) => {
            const container = scrollRef.current;
            const scrollbar = scrollbarRef.current;

            if (!container || !scrollbar) {
                return;
            }

            const scrollbarRect =
                scrollbar.getBoundingClientRect();

            const maxThumbLeft =
                scrollbarRect.width - thumbWidth;

            if (maxThumbLeft <= 0) {
                return;
            }

            let newLeft =
                event.clientX -
                scrollbarRect.left -
                thumbWidth / 2;

            newLeft = Math.max(
                0,
                Math.min(
                    newLeft,
                    maxThumbLeft
                )
            );

            const ratio =
                newLeft / maxThumbLeft;

            container.scrollLeft =
                ratio *
                (container.scrollWidth -
                    container.clientWidth);

            setThumbLeft(newLeft);
        };

        const handleMouseUp = () => {
            setDragging(false);
        };

        document.addEventListener(
            "mousemove",
            handleMouseMove
        );

        document.addEventListener(
            "mouseup",
            handleMouseUp
        );

        return () => {
            document.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            document.removeEventListener(
                "mouseup",
                handleMouseUp
            );
        };
    }, [dragging, thumbWidth]);

    const handleScrollbarClick = (
        event: React.MouseEvent<HTMLDivElement>
    ) => {
        const container = scrollRef.current;
        const scrollbar = scrollbarRef.current;

        if (!container || !scrollbar) {
            return;
        }

        if (
            event.target ===
            scrollbar.firstElementChild
        ) {
            return;
        }

        const scrollbarRect =
            scrollbar.getBoundingClientRect();

        const clickPosition =
            event.clientX -
            scrollbarRect.left;

        const maxThumbLeft =
            scrollbarRect.width -
            thumbWidth;

        if (maxThumbLeft <= 0) {
            return;
        }

        const newThumbLeft = Math.max(
            0,
            Math.min(
                clickPosition -
                thumbWidth / 2,
                maxThumbLeft
            )
        );

        const ratio =
            newThumbLeft / maxThumbLeft;

        container.scrollLeft =
            ratio *
            (container.scrollWidth -
                container.clientWidth);
    };

    if (loading) {
        return (
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((item) => (
                    <div
                        key={item}
                        className="h-9 w-24 shrink-0 animate-pulse rounded-lg bg-[#0B1B30]"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="border-b border-[#1e3254] pb-3">
            <div
                ref={scrollRef}
                className="mentor-community-tech-container flex items-center gap-2 overflow-x-auto"
            >
                <button
                    type="button"
                    onClick={() =>
                        onTechnologyChange(null)
                    }
                    className={`shrink-0 rounded-lg px-4 py-2 text-xs font-medium transition ${
                        selectedTechnologyId === null
                            ? "bg-[#17D4C3] text-[#06141f]"
                            : "bg-[#0B1B30] text-[#7189a8] hover:bg-[#10243B] hover:text-white"
                    }`}
                >
                    All
                </button>

                {technologies.map((technology) => {
                    const selected =
                        selectedTechnologyId ===
                        technology.id;

                    return (
                        <button
                            key={technology.id}
                            type="button"
                            onClick={() =>
                                onTechnologyChange(
                                    technology.id
                                )
                            }
                            className={`shrink-0 rounded-lg px-4 py-2 text-xs font-medium transition ${
                                selected
                                    ? "bg-[#17D4C3] text-[#06141f]"
                                    : "bg-[#0B1B30] text-[#7189a8] hover:bg-[#10243B] hover:text-white"
                            }`}
                        >
                            {technology.name}
                        </button>
                    );
                })}
            </div>

            {thumbWidth > 0 && (
                <div
                    ref={scrollbarRef}
                    onClick={handleScrollbarClick}
                    className="relative mt-2 h-px w-full"
                >
                    <div
                        onMouseDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setDragging(true);
                        }}
                        className="absolute top-0 h-px rounded-full bg-[#00E5C0] cursor-grab active:cursor-grabbing"
                        style={{
                            width: `${thumbWidth}px`,
                            left: `${thumbLeft}px`,
                        }}
                    />
                </div>
            )}
        </div>
    );
}