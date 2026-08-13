import { useEffect, useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import ProfileDetails from "../components/ProfileDetails";
import ProfileInfoCard from "../components/ProfileInfoCard";
import ProfileActions from "../components/ProfileActions";
import { getLearnerProfile } from "../../../api/profile.api";
import type { UserProfile } from "../../../types/profile.types";

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await getLearnerProfile();
                setUser(profile);
            } catch (err) {
                console.error("Unable to load profile:", err);
                setError("Unable to load profile.");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
                    <p className="text-sm text-slate-500">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
                    <p className="text-sm text-red-400">
                        {error || "Profile not found."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[#081423]">
            <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">

                <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#17D4C3]">
                        Account
                    </p>

                    <h1 className="mt-2 text-2xl font-bold text-white">
                        Profile
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your TechLoop account information.
                    </p>
                </div>

                <div className="mb-6 rounded-2xl border border-white/5 bg-[#0A1930] p-6">
                    <ProfileHeader username={user.username} role={user.role}/>
                </div>

                <div className="space-y-6">
                    <ProfileInfoCard username={user.username}/>

                    <ProfileDetails
                        username={user.username}
                        email={user.email}
                        role={user.role}/>

                    <ProfileActions />
                </div>

            </div>
        </div>
    );
}