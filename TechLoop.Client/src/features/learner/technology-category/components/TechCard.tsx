import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Technology } from "../types/technology.ts";

interface TechCardProps {
    technology: Technology;
    index?: number;
}

export default function TechCard({ technology, index = 0 }: TechCardProps) {
    return (
        <Link
            to={`/learner/learning/${technology.slug}`}
            className="group flex flex-col rounded-2xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[#00E5C0] hover:shadow-xl hover:shadow-[#00E5C0]/10 animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 overflow-hidden">
                    {technology.imageUrl ? (
                        <img
                            src={technology.imageUrl}
                            alt={technology.name}
                            className="h-10 w-10 object-contain"
                        />
                    ) : (
                        <BookOpen className="text-[#00E5C0]" size={26} />
                    )}
                </div>
                <span className="rounded-full bg-[#00E5C0]/10 px-3 py-1 text-xs font-medium text-[#00E5C0] border border-[#00E5C0]/20">
          Technology
        </span>
            </div>

            <div className="mt-6 flex-1">
                <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#00E5C0]">
                    {technology.name}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{technology.slug}</p>
                <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-300">
                    {technology.description}
                </p>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
        <span className="text-sm font-semibold text-[#00E5C0]">
          Start Learning
        </span>
                <ArrowRight
                    size={20}
                    className="text-[#00E5C0] transition-transform duration-300 group-hover:translate-x-2"
                />
            </div>
        </Link>
    );
}