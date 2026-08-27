import type { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
    label: string;
    value: number;
    icon: LucideIcon;
}

export default function AdminStatCard({ label, value, icon: Icon }: AdminStatCardProps) {
    return (
        <div className="rounded-2xl border border-[#223A59] bg-[#12233B] p-5 transition-transform duration-200 hover:-translate-y-0.5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-medium text-[#5C7394]">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-white">{value.toLocaleString()}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00E8C2]/20 bg-[#00E8C2]/10 text-[#00E8C2]">
                    <Icon size={18} />
                </div>
            </div>
        </div>
    );
}
