import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { setupMentorProfile } from "../../api/auth.api.ts";
import { showToast } from "../../utils/toast.ts";
import authImage from "../../assets/AuthImage.jpg";

interface PasswordFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

function PasswordField({
                           label,
                           placeholder,
                           value,
                           onChange,
                           error,
                       }: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold tracking-[0.8px] uppercase text-[#7a99bb]">
                {label}
            </label>

            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoComplete="new-password"
                    className={`w-full px-3.5 pr-16 py-[11px] bg-[#0a1525] border rounded-[7px] text-sm text-[#e8f0fe] placeholder-[#4a6380] outline-none transition-all duration-200
                    focus:border-[#00e5c0]
                    focus:shadow-[0_0_0_3px_rgba(0,229,192,0.1)]
                    ${
                        error
                            ? "border-[#e05c5c]"
                            : "border-[#1e3254]"
                    }`}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7a99bb] hover:text-[#00e5c0]"
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>

            {error && (
                <span className="text-[11px] text-[#e05c5c]">
                    {error}
                </span>
            )}
        </div>
    );
}

interface TextFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
}

function TextField({
                       label,
                       placeholder,
                       value,
                       onChange,
                       error,
                       type = "text",
                   }: TextFieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold tracking-[0.8px] uppercase text-[#7a99bb]">
                {label}
            </label>

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full px-3.5 py-[11px] bg-[#0a1525] border rounded-[7px] text-sm text-[#e8f0fe] placeholder-[#4a6380] outline-none transition-all duration-200
                focus:border-[#00e5c0]
                focus:shadow-[0_0_0_3px_rgba(0,229,192,0.1)]
                ${
                    error
                        ? "border-[#e05c5c]"
                        : "border-[#1e3254]"
                }`}
            />

            {error && (
                <span className="text-[11px] text-[#e05c5c]">
                    {error}
                </span>
            )}
        </div>
    );
}

interface RequirementProps {
    valid: boolean;
    text: string;
}

function Requirement({
                         valid,
                         text,
                     }: RequirementProps) {
    return (
        <div className="flex items-center gap-2">
            <span
                className={`text-[11px] ${
                    valid
                        ? "text-[#00e5c0]"
                        : "text-[#4a6380]"
                }`}
            >
                {valid ? "✓" : "○"}
            </span>

            <span
                className={`text-[11px] ${
                    valid
                        ? "text-[#7a99bb]"
                        : "text-[#4a6380]"
                }`}
            >
                {text}
            </span>
        </div>
    );
}

export default function MentorSetupPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const email = searchParams.get("email") ?? "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [phoneNumber, setPhoneNumber] = useState("");
    const [bio, setBio] = useState("");
    const [linkedInUrl, setLinkedInUrl] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] =
        useState<Record<string, string>>({});

    const validate = (): boolean => {
        const e: Record<string, string> = {};

        if (!email.trim()) {
            e.email = "Invalid mentor invitation link.";
        }

        if (!password) {
            e.password = "Password is required.";
        } else if (password.length < 8) {
            e.password =
                "Password must be at least 8 characters.";
        } else if (!/[A-Z]/.test(password)) {
            e.password =
                "Password must contain an uppercase letter.";
        } else if (!/[a-z]/.test(password)) {
            e.password =
                "Password must contain a lowercase letter.";
        } else if (!/[0-9]/.test(password)) {
            e.password =
                "Password must contain a digit.";
        } else if (!/[^a-zA-Z0-9]/.test(password)) {
            e.password =
                "Password must contain a special character.";
        }

        if (!confirmPassword) {
            e.confirmPassword =
                "Please confirm your password.";
        } else if (confirmPassword !== password) {
            e.confirmPassword =
                "Passwords do not match.";
        }

        if (linkedInUrl.trim()) {
            try {
                new URL(linkedInUrl);
            } catch {
                e.linkedInUrl =
                    "Enter a valid LinkedIn URL.";
            }
        }

        if (githubUrl.trim()) {
            try {
                new URL(githubUrl);
            } catch {
                e.githubUrl =
                    "Enter a valid GitHub URL.";
            }
        }

        if (profileImageUrl.trim()) {
            try {
                new URL(profileImageUrl);
            } catch {
                e.profileImageUrl =
                    "Enter a valid image URL.";
            }
        }

        setErrors(e);

        return Object.keys(e).length === 0;
    };

    const handleSetup = async () => {
        if (!validate()) return;

        setLoading(true);

        try {
            await setupMentorProfile(email, {
                password,
                confirmPassword,
                phoneNumber,
                bio,
                linkedInUrl,
                githubUrl,
                profileImageUrl,
            });

            showToast.success(
                "Mentor account activated successfully."
            );

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1200);
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to activate mentor account.";

            showToast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-[#0b1628] font-[Inter,system-ui,sans-serif] py-8"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(30,50,84,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,50,84,0.35) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
            }}
        >
            <div className="flex w-[820px] bg-[#0f1e35] rounded-2xl border border-[#1e3254] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

                {/* LEFT PANEL */}

                <div className="relative w-[40%] flex-shrink-0 bg-[#0d1a2e] border-r border-[#1e3254] flex items-end p-8 overflow-hidden">

                    <div
                        className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[180px] h-[180px] rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(0,229,192,0.18) 0%, transparent 70%)",
                        }}
                    />

                    <img
                        src={authImage}
                        alt="TechLoop"
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />

                    <div className="relative z-10">
                        <Link
                            to="/"
                            className="no-underline"
                        >
                            <span className="text-[22px] font-bold text-[#e8f0fe]">
                                Tech
                            </span>

                            <span className="text-[22px] font-bold text-[#00e5c0]">
                                Loop
                            </span>
                        </Link>

                        <p className="text-[11px] text-[#4a6380] mt-1">
                            Unified · Secure · Shared Infrastructure
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL */}

                <div className="relative flex-1 px-9 py-8">

                    <div className="absolute top-[18px] right-5 w-2.5 h-2.5 rounded-full bg-[#00e5c0] shadow-[0_0_8px_#00e5c0]" />

                    {/* HEADING */}

                    <div className="mb-6">
                        <p className="text-[10px] uppercase tracking-[1px] font-semibold text-[#00e5c0] mb-2">
                            Mentor Setup
                        </p>

                        <h1 className="text-2xl font-bold text-white">
                            Activate your account
                        </h1>

                        <p className="text-[#7a99bb] mt-1">
                            Set your password and complete your mentor profile.
                        </p>
                    </div>

                    {/* EMAIL */}

                    <div className="mb-5">
                        <label className="text-[10px] font-semibold tracking-[0.8px] uppercase text-[#7a99bb]">
                            Email
                        </label>

                        <div className="mt-1.5 px-3.5 py-[11px] bg-[#07111f] border border-[#1e3254] rounded-[7px] text-sm text-[#7a99bb]">
                            {email || "Invalid invitation"}
                        </div>

                        {errors.email && (
                            <span className="text-[11px] text-[#e05c5c]">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="space-y-4">

                        {/* PASSWORD */}

                        <div className="grid grid-cols-2 gap-3">

                            <PasswordField
                                label="Password"
                                placeholder="Min. 8 characters"
                                value={password}
                                onChange={setPassword}
                                error={errors.password}
                            />

                            <PasswordField
                                label="Confirm Password"
                                placeholder="Repeat password"
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                                error={errors.confirmPassword}
                            />

                        </div>

                        {/* REQUIREMENTS */}

                        <div className="rounded-lg border border-[#1e3254] bg-[#0a1525] px-3.5 py-3">

                            <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#7a99bb] mb-2">
                                Password requirements
                            </p>

                            <div className="grid grid-cols-2 gap-y-1">

                                <Requirement
                                    valid={password.length >= 8}
                                    text="8+ characters"
                                />

                                <Requirement
                                    valid={/[A-Z]/.test(password)}
                                    text="Uppercase letter"
                                />

                                <Requirement
                                    valid={/[a-z]/.test(password)}
                                    text="Lowercase letter"
                                />

                                <Requirement
                                    valid={/[0-9]/.test(password)}
                                    text="Number"
                                />

                                <Requirement
                                    valid={/[^a-zA-Z0-9]/.test(password)}
                                    text="Special character"
                                />

                            </div>
                        </div>

                        {/* PHONE */}

                        <TextField
                            label="Phone Number"
                            type="tel"
                            placeholder="+971 50 000 0000"
                            value={phoneNumber}
                            onChange={setPhoneNumber}/>

                        {/* BIO */}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-semibold tracking-[0.8px] uppercase text-[#7a99bb]">
                                Bio
                            </label>

                            <textarea
                                placeholder="Tell learners a little about yourself"
                                value={bio}
                                onChange={(e) =>
                                    setBio(e.target.value)
                                }
                                rows={3}
                                className="w-full px-3.5 py-[11px] bg-[#0a1525] border border-[#1e3254] rounded-[7px] text-sm text-[#e8f0fe] placeholder-[#4a6380] outline-none resize-none focus:border-[#00e5c0] focus:shadow-[0_0_0_3px_rgba(0,229,192,0.1)]"/>
                        </div>

                        {/* SOCIAL LINKS */}

                        <div className="grid grid-cols-2 gap-3">

                            <TextField
                                label="LinkedIn URL"
                                placeholder="https://linkedin.com/in/..."
                                value={linkedInUrl}
                                onChange={setLinkedInUrl}
                                error={errors.linkedInUrl}/>

                            <TextField
                                label="GitHub URL"
                                placeholder="https://github.com/..."
                                value={githubUrl}
                                onChange={setGithubUrl}
                                error={errors.githubUrl}/>

                        </div>

                        {/* PROFILE IMAGE */}

                        <TextField
                            label="Profile Image URL"
                            placeholder="https://..."
                            value={profileImageUrl}
                            onChange={setProfileImageUrl}
                            error={errors.profileImageUrl}/>

                        {/* SUBMIT */}

                        <button onClick={handleSetup} disabled={loading} className="w-full py-3 rounded-lg bg-[#00e5c0] font-bold text-black disabled:opacity-50">
                            {loading ? "Activating..." : "Activate Mentor Account"}
                        </button>

                        <p className="text-center text-[11px] text-[#4a6380]">
                            This setup link is only for your initial
                            mentor account activation.
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}