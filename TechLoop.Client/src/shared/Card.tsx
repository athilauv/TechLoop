import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "./cn.ts";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    padded?: boolean;
}

export default function Card({
                                 children,
                                 padded = false,
                                 className,
                                 ...rest
                             }: CardProps) {
    return (
        <div
            className={cn(
                "overflow-hidden rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)]",
                padded && "p-7",
                className
            )}
            {...rest}
        >
            {children}
        </div>
    );
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    divider?: "top" | "bottom" | "none";
}

export function CardSection({
                                children,
                                divider = "none",
                                className,
                                ...rest
                            }: CardSectionProps) {
    return (
        <div
            className={cn(
                "p-7",
                divider === "top" && "border-t border-[var(--cs-border)]",
                divider === "bottom" && "border-b border-[var(--cs-border)]",
                className
            )}
            {...rest}
        >
            {children}
        </div>
    );
}