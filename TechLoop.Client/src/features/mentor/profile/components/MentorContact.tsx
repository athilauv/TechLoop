import {
    AtSign,
    ExternalLink,
    Mail,
    Phone,
} from "lucide-react";
import type { MentorProfileData } from "../../../../types/mentor.types.ts";

interface MentorContactProps {
    profile: MentorProfileData;
}

const MentorContact = ({ profile }: MentorContactProps) => {
    return (
        <section className="rounded-2xl border border-white/10 bg-[#0B1B30] p-5 sm:p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#18C6A4]/10">
                    <AtSign className="h-5 w-5 text-[#18C6A4]" />
                </div>

                <div>
                    <h3 className="font-semibold text-white">
                        Contact & Social
                    </h3>

                    <p className="text-xs text-slate-500">
                        Professional contact information
                    </p>
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">

                {/* Email */}
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#08182A] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                        <Mail className="h-4 w-4 text-slate-400" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs text-slate-500">
                            Email
                        </p>

                        <p className="mt-1 truncate text-sm text-slate-200">
                            {profile.email}
                        </p>
                    </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#08182A] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                        <Phone className="h-4 w-4 text-slate-400" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs text-slate-500">
                            Phone
                        </p>

                        <p className="mt-1 truncate text-sm text-slate-200">
                            {profile.phoneNumber || "Not provided"}
                        </p>
                    </div>
                </div>

                {/* LinkedIn */}
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#08182A] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs text-slate-500">
                            LinkedIn
                        </p>

                        {profile.linkedInUrl ? (
                            <a
                                href={profile.linkedInUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 flex items-center gap-1.5 truncate text-sm text-[#18C6A4] hover:underline"
                            >
                                View LinkedIn Profile
                                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                            </a>
                        ) : (
                            <p className="mt-1 text-sm text-slate-500">
                                Not provided
                            </p>
                        )}
                    </div>
                </div>

                {/* GitHub */}
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#08182A] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs text-slate-500">
                            GitHub
                        </p>

                        {profile.githubUrl ? (
                            <a
                                href={profile.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 flex items-center gap-1.5 truncate text-sm text-[#18C6A4] hover:underline"
                            >
                                View GitHub Profile
                                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                            </a>
                        ) : (
                            <p className="mt-1 text-sm text-slate-500">
                                Not provided
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MentorContact;