import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

interface HorizontalScrollAreaProps {
    children: ReactNode;
    className?: string;
    minWidthClassName?: string;
}

/**
 * Horizontally-scrollable wrapper with the native scrollbar hidden
 * (see `.cs-hscroll` in index.css) while every scroll input keeps working:
 * trackpad, shift+wheel and touch swipe scroll the element natively,
 * and mouse click+drag is implemented here via the Pointer Events API.
 *
 * Used by the Question Management tables so wide tables can overflow on
 * narrow viewports without a visible scrollbar track under the content.
 */
const HorizontalScrollArea = ({ children, className = "" }: HorizontalScrollAreaProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const dragState = useRef({ dragging: false, startX: 0, startScrollLeft: 0, moved: false });
    const [isDragging, setIsDragging] = useState(false);

    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        // Only respond to the primary mouse button / primary touch or pen contact.
        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }

        const el = scrollRef.current;
        if (!el) {
            return;
        }

        dragState.current = {
            dragging: true,
            startX: event.clientX,
            startScrollLeft: el.scrollLeft,
            moved: false,
        };

        el.setPointerCapture(event.pointerId);
        setIsDragging(true);
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragState.current.dragging) {
            return;
        }

        const el = scrollRef.current;
        if (!el) {
            return;
        }

        const delta = event.clientX - dragState.current.startX;

        if (Math.abs(delta) > 3) {
            dragState.current.moved = true;
        }

        el.scrollLeft = dragState.current.startScrollLeft - delta;
    };

    const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragState.current.dragging) {
            return;
        }

        dragState.current.dragging = false;
        setIsDragging(false);

        const el = scrollRef.current;
        if (el?.hasPointerCapture(event.pointerId)) {
            el.releasePointerCapture(event.pointerId);
        }
    };

    return (
        <div
            ref={scrollRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            // A click that follows a real drag shouldn't also trigger a row's
            // onClick navigation — swallow it before it reaches the target.
            onClickCapture={(event) => {
                if (dragState.current.moved) {
                    event.preventDefault();
                    event.stopPropagation();
                    dragState.current.moved = false;
                }
            }}
            className={`cs-hscroll overflow-x-auto ${isDragging ? "is-dragging" : ""} ${className}`}
        >
            {children}
        </div>
    );
};

export default HorizontalScrollArea;
