import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

export function useScrollSpy(
    containerRef: RefObject<HTMLElement | null>,
    sectionIds: string[],
    options?: { enabled?: boolean }
) {
    const enabled = options?.enabled ?? true;
    const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null);
    const visibleTops = useRef<Map<string, number>>(new Map());

    useEffect(() => {
        if (!enabled) return;

        const root = containerRef.current;
        if (!root || sectionIds.length === 0) return;

        visibleTops.current = new Map();

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const id = entry.target.id;
                    if (entry.isIntersecting) {
                        visibleTops.current.set(id, entry.boundingClientRect.top);
                    } else {
                        visibleTops.current.delete(id);
                    }
                }

                if (visibleTops.current.size > 0) {
                    const [topId] = [...visibleTops.current.entries()].sort(
                        (a, b) => a[1] - b[1]
                    )[0];
                    setActiveId(topId);
                }
            },
            {
                root,
                rootMargin: "-10% 0px -70% 0px",
                threshold: [0, 0.25, 0.5, 1],
            }
        );

        const elements = sectionIds
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [containerRef, enabled, sectionIds.join("|")]);

    return activeId;
}
