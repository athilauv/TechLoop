import React from "react";

type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps {
    size?: LoaderSize;
    label?: string;
    fullScreen?: boolean;
    className?: string;
}

const SIZE_MAP: Record<LoaderSize, { ring: string; border: string }> = {
    sm: { ring: "h-5 w-5", border: "border-2" },
    md: { ring: "h-9 w-9", border: "border-[3px]" },
    lg: { ring: "h-14 w-14", border: "border-4" },
};

export const Loader: React.FC<LoaderProps> = ({
                                                  size = "md",
                                                  label,
                                                  fullScreen = false,
                                                  className = "",
                                              }) => {
    const { ring, border } = SIZE_MAP[size];

    const spinner = (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <div className="relative">
                <div
                    className={`${ring} ${border} rounded-full border-slate-700/60 border-t-teal-400 animate-spin`}
                    role="status"
                    aria-label={label ?? "Loading"}
                />
                <div
                    className={`${ring} ${border} absolute inset-0 rounded-full border-transparent border-t-teal-400/30 blur-[2px] animate-spin`}
                    aria-hidden="true"
                />
            </div>
            {label && (
                <p className="text-sm font-medium tracking-wide text-slate-400">{label}</p>
            )}
        </div>
    );

    if (!fullScreen) return spinner;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0e17]/80 backdrop-blur-sm">
            {spinner}
        </div>
    );
};

export const LoaderBar: React.FC<{ className?: string }> = ({ className = "" }) => (
    <div className={`h-1 w-full overflow-hidden rounded-full bg-slate-800/80 ${className}`}>
        <div className="h-full w-1/3 animate-[loaderBar_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-teal-500 via-teal-300 to-teal-500" />
        <style>{`
      @keyframes loaderBar {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(150%); }
        100% { transform: translateX(300%); }
      }
    `}</style>
    </div>
);

export default Loader;