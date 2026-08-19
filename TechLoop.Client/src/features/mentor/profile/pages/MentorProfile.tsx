import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { getMentorProfile, updateMentorProfile } from "../../../../api/mentorTopic.api.ts";
import type { MentorProfileData, UpdateMentorProfileRequest } from "../../../../types/mentor.types.ts";
import MentorProfileHeader from "../components/MentorProfileHeader";
import MentorAbout from "../components/MentorAbout";
import MentorExpertise from "../components/MentorExpertise";
import MentorContact from "../components/MentorContact";
import EditMentorProfileForm from "../components/EditMentorProfileForm";
import { showToast } from "../../../../utils/toast.tsx";
import { getErrorMessage } from "../../../../utils/error.utils.ts";

const MentorProfile = () => {
    const [profile, setProfile] = useState<MentorProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getMentorProfile();

                setProfile(data);
            } catch (err) {
                console.error("Failed to load mentor profile:", err);

                setError("Unable to load your profile.");
            } finally {
                setLoading(false);
            }
        };

        void loadProfile();
    }, []);

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
    };

    const handleUpdateProfile = async (
        data: UpdateMentorProfileRequest
    ) => {
        try {
            const result = await updateMentorProfile(data);
            if (!result.success) {
                showToast.error(result.message || "Unable to update your profile.");
                return;
            }

            const updatedProfile = await getMentorProfile();
            setProfile(updatedProfile);
            setIsEditing(false);

            showToast.success(result.message || "Profile updated successfully.");
        } catch (error: unknown) {
            showToast.error(getErrorMessage(error, "Unable to update your profile. Please try again."));
        }
    };

    if (loading) {
        return (
            <div className="min-h-full bg-[#071426] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl animate-pulse">
                    <div className="h-8 w-48 rounded-lg bg-white/10" />

                    <div className="mt-6 h-56 rounded-2xl bg-[#0B1B30]" />

                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                        <div className="h-64 rounded-2xl bg-[#0B1B30] lg:col-span-2" />

                        <div className="h-64 rounded-2xl bg-[#0B1B30]" />
                    </div>

                    <div className="mt-6 h-48 rounded-2xl bg-[#0B1B30]" />
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex min-h-full items-center justify-center bg-[#071426] p-6">
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1B30] p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                        <User className="h-6 w-6 text-red-400" />
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-white">
                        Profile unavailable
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                        {error || "Unable to load your profile."}
                    </p>

                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-6 rounded-lg bg-[#18C6A4] px-5 py-2.5 text-sm font-semibold text-[#071426] transition hover:bg-[#12B594]"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[#071426] text-white">
            <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">

                {/* Page Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-[#18C6A4]" />

                        <h1 className="text-xl font-semibold sm:text-2xl">
                            My Profile
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-slate-400">
                        Manage your mentor profile and professional information.
                    </p>
                </div>

                {/* Profile Header */}
                <MentorProfileHeader
                    profile={profile}
                    onEdit={handleEditProfile}
                />

                {/* Profile Content */}
                <div className="mt-6 grid gap-6 lg:grid-cols-3">

                    {/* About */}
                    <div className="lg:col-span-2">
                        <MentorAbout profile={profile} />
                    </div>

                    {/* Expertise */}
                    <MentorExpertise profile={profile} />

                    {/* Contact */}
                    <div className="lg:col-span-3">
                        <MentorContact profile={profile} />
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <EditMentorProfileForm
                    profile={profile}
                    onClose={handleCloseEdit}
                    onSave={handleUpdateProfile}
                />
            )}
        </div>
    );
};

export default MentorProfile;