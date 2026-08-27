import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

export interface AdminActionMenuItem {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
    to?: string;
    tone?: "default" | "danger";
    disabled?: boolean;
}

interface AdminActionMenuProps {
    items: AdminActionMenuItem[];
    label?: string;
}

/**
 * Compact "…" row-action menu used in enterprise data tables where more
 * than one or two actions would otherwise clutter every row. Falls back
 * to being keyboard- and click-outside-dismissible.
 */
export default function AdminActionMenu({ items, label = "Row actions" }: AdminActionMenuProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleClick = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [open]);

    return (
        <div ref={containerRef} className="relative inline-block text-left">
            <button
                type="button"
                aria-label={label}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-[#8CA3BF] transition-colors hover:bg-[#101C30] hover:text-white"
            >
                <MoreVertical size={16} />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-[#223A59] bg-[#12233B] py-1 shadow-2xl"
                >
                    {items.map((item) => {
                        const Icon = item.icon;
                        const toneClass = item.tone === "danger" ? "text-[#F87171] hover:bg-[#F87171]/10" : "text-[#8CA3BF] hover:bg-[#101C30] hover:text-white";
                        const className = `flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors ${toneClass} ${item.disabled ? "pointer-events-none opacity-40" : ""}`;

                        if (item.to) {
                            return (
                                <Link key={item.label} to={item.to} role="menuitem" className={className} onClick={() => setOpen(false)}>
                                    <Icon size={14} />
                                    {item.label}
                                </Link>
                            );
                        }

                        return (
                            <button
                                key={item.label}
                                type="button"
                                role="menuitem"
                                disabled={item.disabled}
                                onClick={() => {
                                    setOpen(false);
                                    item.onClick?.();
                                }}
                                className={className}
                            >
                                <Icon size={14} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
