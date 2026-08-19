import { useState } from "react";
import {
    ExternalLink,
    Phone,
    Save,
    X,
} from "lucide-react";

import type {
    MentorProfileData,
    UpdateMentorProfileRequest,
} from "../../../../types/mentor.types.ts";

interface EditMentorProfileFormProps {
    profile: MentorProfileData;
    onClose: () => void;
    onSave: (data: UpdateMentorProfileRequest) => Promise<void>;
}

const EditMentorProfileForm = ({
                                   profile,
                                   onClose,
                                   onSave,
                               }: EditMentorProfileFormProps) => {
    const [formData, setFormData] =
        useState<UpdateMentorProfileRequest>({
            phoneNumber: profile.phoneNumber ?? "",
            bio: profile.bio ?? "",
            linkedInUrl: profile.linkedInUrl ?? "",
            githubUrl: profile.githubUrl ?? "",
            profileImageUrl: profile.profileImageUrl ?? "",
        });

    const [saving, setSaving] = useState(false);

    const handleChange = (
        field: keyof UpdateMentorProfileRequest,
        value: string
    ) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        try {
            setSaving(true);
            await onSave(formData);
        } catch (error) {
            console.error("Failed to update mentor profile:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0B1B30] shadow-2xl">

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0B1B30] px-5 py-4 sm:px-6">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Edit Profile
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Update your professional profile information.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 p-5 sm:p-6"
                >
                    {/* Phone */}
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-[#18C6A4]" />

                            <h3 className="text-sm font-semibold text-white">
                                Contact Information
                            </h3>
                        </div>

                        <label className="mb-2 block text-xs font-medium text-slate-400">
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(event) =>
                                handleChange(
                                    "phoneNumber",
                                    event.target.value
                                )
                            }
                            maxLength={20}
                            className="w-full rounded-lg border border-white/10 bg-[#08182A] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#18C6A4]/50"
                            placeholder="+971 50 123 4567"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">
                            Bio
                        </label>

                        <textarea
                            value={formData.bio}
                            onChange={(event) =>
                                handleChange(
                                    "bio",
                                    event.target.value
                                )
                            }
                            rows={5}
                            maxLength={1000}
                            className="w-full resize-none rounded-lg border border-white/10 bg-[#08182A] px-3 py-2.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-[#18C6A4]/50"
                            placeholder="Tell learners about yourself..."
                        />

                        <p className="mt-1 text-right text-xs text-slate-600">
                            {formData.bio.length}/1000
                        </p>
                    </div>

                    {/* Social Profiles */}
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-[#18C6A4]" />

                            <h3 className="text-sm font-semibold text-white">
                                Social Profiles
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {/* LinkedIn */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-slate-400">
                                    LinkedIn URL
                                </label>

                                <div className="relative">
                                    <ExternalLink className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                                    <input
                                        type="url"
                                        value={formData.linkedInUrl}
                                        onChange={(event) =>
                                            handleChange(
                                                "linkedInUrl",
                                                event.target.value
                                            )
                                        }
                                        maxLength={500}
                                        className="w-full rounded-lg border border-white/10 bg-[#08182A] py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#18C6A4]/50"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                            </div>

                            {/* GitHub */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-slate-400">
                                    GitHub URL
                                </label>

                                <div className="relative">
                                    <ExternalLink className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                                    <input
                                        type="url"
                                        value={formData.githubUrl}
                                        onChange={(event) =>
                                            handleChange(
                                                "githubUrl",
                                                event.target.value
                                            )
                                        }
                                        maxLength={500}
                                        className="w-full rounded-lg border border-white/10 bg-[#08182A] py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#18C6A4]/50"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Image */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">
                            Profile Image URL
                        </label>

                        <input
                            type="url"
                            value={formData.profileImageUrl}
                            onChange={(event) =>
                                handleChange("profileImageUrl", event.target.value)
                            }
                            maxLength={500}
                            className="w-full rounded-lg border border-white/10 bg-[#08182A] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#18C6A4]/50"
                            placeholder="https://example.com/profile.jpg"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#18C6A4] px-5 py-2.5 text-sm font-semibold text-[#071426] transition hover:bg-[#12B594] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />

                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMentorProfileForm;