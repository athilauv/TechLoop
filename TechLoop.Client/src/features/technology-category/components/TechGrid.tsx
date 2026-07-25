import type { Technology } from "../../../types/technology";
import TechCard from "./TechCard";

interface TechGridProps {
    technologies: Technology[];
}

export default function TechGrid({
                                     technologies,
                                 }: TechGridProps) {
    return (
        <div
            className="grid gap-6
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4">
            {technologies.map((technology) => (
                <TechCard
                    key={technology.id}
                    technology={technology}
                />
            ))}
        </div>
    );
}