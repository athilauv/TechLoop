import { Link } from "react-router-dom";
import { BookOpen, Boxes, FileQuestion, ListTree } from "lucide-react";
import AdminPageHeader from "../../components/AdminPageHeader.tsx";

const areas = [
    { title: "Technologies", description: "Manage the root technology entities and publishing state.", href: "/admin/technologies", icon: Boxes },
    { title: "Technology categories", description: "Review the taxonomy used to organize technologies.", href: "/admin/technology-categories", icon: ListTree },
    { title: "Questions", description: "Review question management through the dedicated admin workflow.", href: "/admin/questions", icon: FileQuestion },
    { title: "Contributions", description: "Review learner-submitted curriculum contributions.", href: "/admin/contributions", icon: BookOpen },
];

export default function AdminContentPage() {
    return <div className="p-6 lg:p-10">
        <AdminPageHeader eyebrow="Learning content" title="Content management" description="Use the admin content areas to keep the learning hierarchy consistent and publish-ready." />
        <div className="grid gap-4 md:grid-cols-2">
            {areas.map(({ title, description, href, icon: Icon }) => <Link key={title} to={href} className="rounded-2xl border border-[#223A59] bg-[#12233B] p-6 transition-all hover:-translate-y-1 hover:border-[#00E8C2]/40">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#00E8C2]/20 bg-[#00E8C2]/10 text-[#00E8C2]"><Icon size={19}/></div>
                <h2 className="mt-5 text-lg font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#8CA3BF]">{description}</p>
            </Link>)}
        </div>
    </div>;
}
