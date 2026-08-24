import { useEffect, useRef, useState } from "react";

/**
 * Lightweight, dependency-free scroll-reveal hook.
 * Swap this out for the project's existing animation system
 * (e.g. framer-motion) if one is already in use — the API
 * (ref + inView) is designed to be a drop-in replacement.
 */
export const useScrollReveal = <T extends HTMLElement>(options?: IntersectionObserverInit) => {
    const ref = useRef<T | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2, ...options },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [options]);

    return { ref, inView };
};
