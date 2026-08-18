import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
    icon?: ReactNode;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex min-w-0 items-center gap-1.5 text-sm">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <span key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
                        {item.onClick && !isLast ? (
                            <button
                                type="button"
                                onClick={item.onClick}
                                className="flex items-center gap-1.5 truncate text-[var(--cs-text-secondary)] transition hover:text-[var(--cs-accent)]"
                            >
                                {item.icon}
                                <span className="truncate">{item.label}</span>
                            </button>
                        ) : (
                            <span
                                className={
                                    isLast
                                        ? "flex items-center gap-1.5 truncate font-medium text-[var(--cs-text-primary)]"
                                        : "flex items-center gap-1.5 truncate text-[var(--cs-text-secondary)]"
                                }
                            >
                                {item.icon}
                                <span className="truncate">{item.label}</span>
                            </span>
                        )}

                        {!isLast && (
                            <ChevronRight
                                size={14}
                                className="shrink-0 text-[var(--cs-text-muted)]"
                            />
                        )}
                    </span>
                );
            })}
        </nav>
    );
}