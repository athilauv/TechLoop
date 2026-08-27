import type { ReactNode } from "react";

interface AdminFormFieldProps {
    label: string;
    htmlFor?: string;
    hint?: string;
    error?: string;
    required?: boolean;
    children: ReactNode;
    className?: string;
}

/**
 * Consistent label + control + helper/error text wrapper used across all
 * admin create/edit forms. Keeps spacing and typography uniform without
 * constraining which input control is used inside it.
 */
export default function AdminFormField({
    label,
    htmlFor,
    hint,
    error,
    required,
    children,
    className = "",
}: AdminFormFieldProps) {
    return (
        <div className={className}>
            <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-[#8CA3BF]">
                {label}
                {required && <span className="ml-1 text-[#F87171]">*</span>}
            </label>
            {children}
            {error ? (
                <p className="mt-1.5 text-xs text-[#F87171]">{error}</p>
            ) : hint ? (
                <p className="mt-1.5 text-xs text-[#5C7394]">{hint}</p>
            ) : null}
        </div>
    );
}

export const adminInputClass =
    "h-11 w-full rounded-xl border border-[#223A59] bg-[#101C30] px-3.5 text-sm text-white outline-none transition-colors placeholder:text-[#5C7394] focus:border-[#00E8C2] focus:ring-2 focus:ring-[#00E8C2]/15";

export const adminTextareaClass =
    "w-full rounded-xl border border-[#223A59] bg-[#101C30] px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#5C7394] focus:border-[#00E8C2] focus:ring-2 focus:ring-[#00E8C2]/15";
