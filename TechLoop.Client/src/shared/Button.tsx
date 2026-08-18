import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "./cn.ts";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "accent-outline";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ReactNode;
    loading?: boolean;
    fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-[var(--cs-accent)] text-[var(--cs-accent-on)] hover:bg-[var(--cs-accent-hover)] focus-visible:ring-[var(--cs-accent)]/40",
    secondary:
        "border border-[var(--cs-border)] text-[var(--cs-text-primary)] bg-transparent hover:bg-white/5 focus-visible:ring-[var(--cs-accent)]/30",
    ghost:
        "text-[var(--cs-text-secondary)] bg-transparent hover:bg-white/5 hover:text-[var(--cs-text-primary)] focus-visible:ring-[var(--cs-accent)]/30",
    "accent-outline":
        "border border-[var(--cs-accent-border)] text-[var(--cs-accent)] bg-transparent hover:bg-[var(--cs-accent-subtle)] focus-visible:ring-[var(--cs-accent)]/30",
    danger:
        "border border-[var(--cs-danger-border)] text-[var(--cs-danger)] bg-transparent hover:bg-[var(--cs-danger-subtle)] focus-visible:ring-[var(--cs-danger)]/30",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
        variant = "primary",
        size = "md",
        icon,
        loading = false,
        fullWidth = false,
        disabled,
        children,
        className,
        type = "button",
        ...rest
    },
    ref
) {
    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            className={cn(
                "inline-flex items-center justify-center rounded-lg font-semibold transition duration-150",
                "focus:outline-none focus-visible:ring-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                variantClasses[variant],
                sizeClasses[size],
                fullWidth && "w-full",
                className
            )}
            {...rest}
        >
            {loading ? (
                <Loader2 size={size === "sm" ? 13 : 15} className="animate-spin" />
            ) : (
                icon
            )}
            {children}
        </button>
    );
});

export default Button;