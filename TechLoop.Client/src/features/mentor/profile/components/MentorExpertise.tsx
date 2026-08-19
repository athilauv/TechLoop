import { BriefcaseBusiness, Globe2 } from "lucide-react";
import type { MentorProfileData } from "../../../../types/mentor.types.ts";

interface MentorExpertiseProps {
    profile: MentorProfileData;
}

const MentorExpertise = ({ profile }: MentorExpertiseProps) => {
    return (
        <section className="rounded-2xl border border-white/10 bg-[#0B1B30] p-5 sm:p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#18C6A4]/10">
                    <BriefcaseBusiness className="h-5 w-5 text-[#18C6A4]" />
                </div>

                <div>
                    <h3 className="font-semibold text-white">
                        Expertise
                    </h3>

                    <p className="text-xs text-slate-500">
                        Primary technology
                    </p>
                </div>
            </div>

            <div className="mt-5">
                <div className="rounded-xl border border-white/10 bg-[#08182A] p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-white">
                                {profile.technologyName}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Technology ID: {profile.technologyId}
                            </p>
                        </div>

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#18C6A4]/10">
                            <Globe2 className="h-4 w-4 text-[#18C6A4]" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MentorExpertise;