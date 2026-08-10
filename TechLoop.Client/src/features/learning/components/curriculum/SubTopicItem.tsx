import { NavLink } from "react-router-dom";

interface SubTopicItemProps {
    technologySlug: string;
    topicSlug: string;
    subTopicSlug: string;
    title: string;
}

export default function SubTopicItem({
                                         technologySlug,
                                         topicSlug,
                                         subTopicSlug,
                                         title,
                                     }: SubTopicItemProps) {
    const path = `/learner/learning/${technologySlug}/${topicSlug}/${subTopicSlug}`;

    return (
        <NavLink to={path} className={({ isActive }) => ` flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200
                ${ isActive ? "bg-[#17D4C3]/10 text-[#17D4C3]" : "text-slate-400 hover:bg-white/5 hover:text-white"}
                `} >
            <span className=" h-2 w-2 flex-shrink-0 rounded-full bg-slate-600"/>
            <span className="flex-1">
                {title}
            </span>
        </NavLink>
    );
}