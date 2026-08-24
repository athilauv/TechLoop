import { useEffect, useState } from "react";

/**
 * Animates from 0 to `target` once `start` becomes true.
 * Pair with useScrollReveal's `inView` flag.
 */
export const useCountUp = (target: number, start: boolean, duration = 1200) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!start) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
            setValue(target);
            return;
        }

        let raf = 0;
        const startTime = performance.now();

        const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(target * eased));
            if (progress < 1) {
                raf = requestAnimationFrame(tick);
            } else {
                setValue(target);
            }
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [start, target, duration]);

    return value;
};
