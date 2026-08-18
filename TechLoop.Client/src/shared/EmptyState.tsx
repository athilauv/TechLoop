import type { ReactNode } from "react";

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}

export default function EmptyState({
                                       icon,
                                       title,
                                       description,
                                       action,
                                   }: EmptyStateProps) {
    return (
        <div className="flex min-h-full items-center justify-center p-8">
            <div className="max-w-md text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--cs-border)] bg-[var(--cs-bg-surface)] text-[var(--cs-accent)]">
                    {icon}
                </div>

                <h1 className="text-2xl font-semibold text-[var(--cs-text-primary)]">
                    {title}
                </h1>

                {description && (
                    <p className="mt-2 text-sm leading-6 text-[var(--cs-text-secondary)]">
                        {description}
                    </p>
                )}

                {action && <div className="mt-6">{action}</div>}
            </div>
        </div>
    );
}