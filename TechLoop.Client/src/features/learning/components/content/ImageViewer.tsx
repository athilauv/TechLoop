import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ImageViewerProps {
    src: string;
    alt?: string;
    caption?: string;
}

export default function ImageViewer({
                                        src,
                                        alt,
                                        caption,
                                    }: ImageViewerProps) {
    const [status, setStatus] = useState<"loading" | "loaded" | "error">(
        "loading"
    );

    return (
        <figure className="space-y-3">
            <div className="flex justify-center">
                <div className="relative max-w-3xl overflow-hidden rounded-xl border border-[#223A59] bg-[#101C30]">
                    {status === "loading" && (
                        <div className="h-72 w-full animate-pulse bg-[#12233B]" />
                    )}

                    {status === "error" ? (
                        <div className="flex min-h-48 min-w-[280px] flex-col items-center justify-center gap-2 px-8 text-[#5C7394]">
                            <ImageOff className="h-6 w-6" />
                            <span className="text-sm">
                                Image failed to load
                            </span>
                        </div>
                    ) : (
                        <img
                            src={src}
                            alt={alt ?? "Learning illustration"}
                            onLoad={() => setStatus("loaded")}
                            onError={() => setStatus("error")}
                            className={`block max-h-[420px] w-auto max-w-full object-contain transition-opacity duration-300 ${
                                status === "loaded"
                                    ? "opacity-100"
                                    : "absolute opacity-0"
                            }`}
                        />
                    )}
                </div>
            </div>

            {caption && (
                <figcaption className="text-center text-sm text-[#5C7394]">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}