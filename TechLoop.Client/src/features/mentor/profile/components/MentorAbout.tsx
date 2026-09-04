import { User } from "lucide-react";
import type { MentorProfileData } from "../../../../types/mentor.types.ts";

interface MentorAboutProps {
    profile: MentorProfileData;
}

const MentorAbout = ({ profile }: MentorAboutProps) => {
    return (
        <section className="h-full rounded-2xl border border-white/10 bg-[#0B1B30] p-5 sm:p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#18C6A4]/10">
                    <User className="h-5 w-5 text-[#18C6A4]" />
                </div>

                <div>
                    <h3 className="font-semibold text-white">
                        About
                    </h3>

                    <p className="text-xs text-slate-500">
                        Professional introduction
                    </p>
                </div>
            </div>

            <div className="mt-5">
                {profile.bio ? (
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-300">
                        {profile.bio}
                    </p>
                ) : (
                    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center">
                        <p className="text-sm text-slate-500">
                            No bio added yet.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MentorAbout;