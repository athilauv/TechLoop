import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { Technology } from "../../../types/technology";

interface TechCardProps {
    technology: Technology;
}

export default function TechCard({
                                     technology,
                                 }: TechCardProps) {
    return (
        <Link
            to={`/learn/${technology.id}`}
            className="
                group
                flex
                flex-col
                rounded-2xl
                border
                border-slate-700
                bg-slate-900
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-sky-500
                hover:shadow-xl
                hover:shadow-sky-500/10
            "
        >
            {/* Header */}

            <div className="flex items-start justify-between">
                <div
                    className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-800
                        overflow-hidden
                    "
                >
                    {technology.imageUrl ? (
                        <img
                            src={technology.imageUrl}
                            alt={technology.name}
                            className="h-10 w-10 object-contain"
                        />
                    ) : (
                        <BookOpen
                            className="text-sky-400"
                            size={26}
                        />
                    )}
                </div>

                <span
                    className="
                        rounded-full
                        bg-sky-500/10
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-sky-300
                    "
                >
                    Technology
                </span>
            </div>

            {/* Content */}

            <div className="mt-6 flex-1">
                <h3
                    className="
                        text-xl
                        font-bold
                        text-white
                        transition-colors
                        group-hover:text-sky-400
                    "
                >
                    {technology.name}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                    {technology.slug}
                </p>

                <p
                    className="
                        mt-4
                        line-clamp-3
                        text-sm
                        leading-7
                        text-slate-300
                    "
                >
                    {technology.description}
                </p>
            </div>

            {/* Footer */}

            <div
                className="
                    mt-8
                    flex
                    items-center
                    justify-between
                    border-t
                    border-slate-800
                    pt-5
                "
            >
                <span
                    className="
                        text-sm
                        font-semibold
                        text-sky-400
                    "
                >
                    Start Learning
                </span>

                <ArrowRight
                    size={20}
                    className="
                        text-sky-400
                        transition-transform
                        duration-300
                        group-hover:translate-x-2
                    "
                />
            </div>
        </Link>
    );
}