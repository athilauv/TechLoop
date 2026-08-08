import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ImageViewerProps {
    src: string;
    alt?: string;
    caption?: string;
}

export default function ImageViewer({ src, alt, caption }: ImageViewerProps) {
    const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

    return (
        <figure className="space-y-3">
            <div className="relative overflow-hidden rounded-2xl border border-[#223A59] bg-[#101C30]">
                {status === "loading" && (
                    <div className="absolute inset-0 animate-pulse bg-[#12233B]" />
                )}

                {status === "error" ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-16 text-[#5C7394]">
                        <ImageOff className="h-6 w-6" />
                        <span className="text-sm">Image failed to load</span>
                    </div>
                ) : (
                    <img
                        src={src}
                        alt={alt}
                        onLoad={() => setStatus("loaded")}
                        onError={() => setStatus("error")}
                        className={`w-full object-cover transition-opacity duration-300 ${
                            status === "loaded" ? "opacity-100" : "opacity-0"
                        }`}
                    />
                )}
            </div>

            {caption && (
                <figcaption className="text-center text-sm text-[#5C7394]">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}