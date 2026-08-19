import {
    BriefcaseBusiness,
    CheckCircle2,
    Edit3,
    Globe2,
    Mail,
} from "lucide-react";
import type { MentorProfileData } from "../../../../types/mentor.types.ts";

interface MentorProfileHeaderProps {
    profile: MentorProfileData;
    onEdit?: () => void;
}

const MentorProfileHeader = ({
                                 profile,
                                 onEdit,
                             }: MentorProfileHeaderProps) => {
    const getInitials = (username: string) =>
        username
            .split(" ")
            .map((name) => name.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();

    return (
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1B30]">

            {/* Cover */}
            <div className="relative h-24 bg-gradient-to-r from-[#0C2942] via-[#0E3349] to-[#0A263B] sm:h-28">
                <div className="absolute -right-12 -top-20 h-48 w-48 rounded-full border border-[#18C6A4]/10" />

                <div className="absolute bottom-0 left-0 h-px w-full bg-[#18C6A4]/20" />
            </div>

            {/* Profile Content */}
            <div className="px-5 pb-6 pt-5 sm:px-7 sm:pt-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    {/* Profile Information */}
                    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">

                        {/* Profile Image */}
                        {profile.profileImageUrl ? (
                            <img
                                src={profile.profileImageUrl}
                                alt={`${profile.username} profile`}
                                className="h-24 w-24 shrink-0 rounded-2xl border border-white/10 bg-[#08182A] object-cover shadow-lg sm:h-28 sm:w-28"
                            />
                        ) : (
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#18C6A4] text-2xl font-bold text-[#071426] shadow-lg sm:h-28 sm:w-28">
                                {getInitials(profile.username)}
                            </div>
                        )}

                        {/* Name & Details */}
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-bold text-white sm:text-2xl">
                                    {profile.username}
                                </h2>

                                <span className="inline-flex items-center gap-1 rounded-full bg-[#18C6A4]/10 px-2.5 py-1 text-xs font-medium text-[#18C6A4]">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Mentor
                                </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
                                <span className="inline-flex items-center gap-1.5">
                                    <Mail className="h-4 w-4" />
                                    {profile.email}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                    <BriefcaseBusiness className="h-4 w-4" />
                                    {profile.technologyName}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <button type="button" onClick={onEdit} className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-white/10 bg-[#10243B] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-[#18C6A4]/40 hover:bg-[#132A43] sm:self-center">
                        <Edit3 className="h-4 w-4" />
                        Edit Profile
                    </button>
                </div>

                {/* Primary Expertise */}
                <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                        Primary Expertise
                    </p>

                    <span className="inline-flex items-center gap-2 rounded-lg border border-[#18C6A4]/20 bg-[#18C6A4]/10 px-3 py-2 text-sm font-medium text-[#18C6A4]">
                        <Globe2 className="h-4 w-4" />
                        {profile.technologyName}
                    </span>
                </div>
            </div>
        </section>
    );
};

export default MentorProfileHeader;