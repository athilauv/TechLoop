import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ImageViewerProps {
    src: string;
    alt?: string;
    caption?: string;
}

function resolveImageUrl(src: string): string {
    if (!src) {
        return "";
    }

    if (
        src.startsWith("http://") ||
        src.startsWith("https://") ||
        src.startsWith("data:")
    ) {
        return src;
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5264";

    if (src.startsWith("/")) {
        return `${apiBaseUrl}${src}`;
    }

    return `${apiBaseUrl}/${src}`;
}

export default function ImageViewer({
                                        src,
                                        alt,
                                        caption,
                                    }: ImageViewerProps) {
    const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

    const imageUrl = resolveImageUrl(src);

    if (!imageUrl) {
        return null;
    }

    return (
        <figure className="space-y-3">
            <div className="flex justify-center">
                <div className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-[#223A59] bg-[#101C30]">
                    {status === "loading" && (
                        <div className="h-72 w-full animate-pulse bg-[#12233B]" />
                    )}

                    {status === "error" ? (
                        <div className="flex min-h-48 w-full flex-col items-center justify-center gap-2 px-8 text-[#5C7394]">
                            <ImageOff className="h-6 w-6" />

                            <span className="text-sm">
                                Image failed to load
                            </span>
                        </div>
                    ) : (
                        <img src={imageUrl}
                            alt={alt ?? "Learning illustration"}
                            onLoad={() => setStatus("loaded")}
                            onError={() => setStatus("error")}
                            className={`block max-h-[520px] w-full object-contain transition-opacity duration-300
                                ${status === "loaded" ? "opacity-100" : "absolute opacity-0"}`}/>
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