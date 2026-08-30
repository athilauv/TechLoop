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
// Minimum horizontal movement (px) required before a pointer-down is treated
// as an intentional drag-to-scroll gesture rather than a plain click/tap.
const DRAG_THRESHOLD = 3;

const HorizontalScrollArea = ({ children, className = "" }: HorizontalScrollAreaProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    // `dragging` = a pointer is currently down and we're watching it for movement.
    // `capturing` = movement past the threshold was detected and we've taken over
    // the pointer (via setPointerCapture) to drive the scroll. Capture is only
    // ever acquired once real movement happens - a plain click never captures
    // the pointer, so it always reaches the actual row/button that was clicked.
    const dragState = useRef({
        dragging: false,
        capturing: false,
        pointerId: 0,
        startX: 0,
        startScrollLeft: 0,
        moved: false,
    });
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

        // Intentionally do NOT call setPointerCapture here. Capturing the
        // pointer immediately would redirect the resulting click event's
        // target to this container (per the Pointer Events spec, capture
        // retargets the compatibility click too), so it would never reach
        // the row or the Edit/Delete/View buttons nested inside it. We only
        // take over the pointer once we've confirmed an actual drag below.
        dragState.current = {
            dragging: true,
            capturing: false,
            pointerId: event.pointerId,
            startX: event.clientX,
            startScrollLeft: el.scrollLeft,
            moved: false,
        };
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

        if (!dragState.current.capturing) {
            if (Math.abs(delta) <= DRAG_THRESHOLD) {
                // Not enough movement yet to count as a drag - leave the
                // pointer uncaptured so a simple click still works normally.
                return;
            }

            // Threshold crossed: this is a genuine drag-to-scroll gesture.
            // Capture from this point on so the drag tracks smoothly even
            // if the pointer leaves the container.
            dragState.current.capturing = true;
            dragState.current.moved = true;
            el.setPointerCapture(dragState.current.pointerId);
            setIsDragging(true);
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
        if (dragState.current.capturing && el?.hasPointerCapture(event.pointerId)) {
            el.releasePointerCapture(event.pointerId);
        }
        dragState.current.capturing = false;
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
