import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export interface AdminPageHeaderProps {
    eyebrow: string;
    title: string;
    description?: string;
    action?: ReactNode;
    backTo?: string;
    backLabel?: string;
}

export default function AdminPageHeader(
    props: AdminPageHeaderProps,
) {
    const {
        eyebrow,
        title,
        description,
        action,
        backTo,
        backLabel = "Back",
    } = props;

    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate(backTo ?? "/admin");
    };

    return (
        <div className="mb-8 border-b border-[#223A59] pb-6">
            <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00E8C2]">
                            {eyebrow}
                        </p>

                        <h1 className="mt-2 break-words text-2xl font-bold text-white sm:text-3xl">
                            {title}
                        </h1>

                        {description && (
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8CA3BF]">
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleBack}
                        aria-label={backLabel}
                        className="mt-0 inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-[#8CA3BF] transition-colors hover:bg-[#00E8C2]/10 hover:text-[#00E8C2] focus:outline-none focus:ring-2 focus:ring-[#00E8C2]/40"
                    >
                        <ArrowLeft size={16} aria-hidden="true" />
                        {backLabel}
                    </button>
                </div>

                {action && (
                    <div className="flex flex-wrap items-center gap-3">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}
