import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { changePassword } from "../../api/auth.api.ts";
import { showToast } from "../../utils/toast.ts";
import authImage from "../../assets/AuthImage.jpg";

interface FieldProps {
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
                       }: FieldProps) {
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

export default function ChangePasswordPage() {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const e: Record<string, string> = {};

        if (!currentPassword) {
            e.currentPassword = "Current password is required.";
        }

        if (!newPassword) {
            e.newPassword = "New password is required.";
        } else if (newPassword.length < 8) {
            e.newPassword =
                "Password must be at least 8 characters.";
        } else if (!/[A-Z]/.test(newPassword)) {
            e.newPassword =
                "Password must contain an uppercase letter.";
        } else if (!/[a-z]/.test(newPassword)) {
            e.newPassword =
                "Password must contain a lowercase letter.";
        } else if (!/[0-9]/.test(newPassword)) {
            e.newPassword =
                "Password must contain a digit.";
        } else if (!/[^a-zA-Z0-9]/.test(newPassword)) {
            e.newPassword =
                "Password must contain a special character.";
        }

        if (!confirmPassword) {
            e.confirmPassword =
                "Please confirm your password.";
        } else if (confirmPassword !== newPassword) {
            e.confirmPassword =
                "Passwords do not match.";
        }

        if (
            currentPassword &&
            newPassword &&
            currentPassword === newPassword
        ) {
            e.newPassword =
                "New password must be different from current password.";
        }

        setErrors(e);

        return Object.keys(e).length === 0;
    };

    const handleChangePassword = async () => {
        if (!validate()) return;

        setLoading(true);

        try {
            await changePassword({
                currentPassword,
                newPassword,
                confirmPassword,
            });

            showToast.success(
                "Password changed successfully. Please sign in again."
            );

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1200);
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Password change failed";

            showToast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-[#0b1628] font-[Inter,system-ui,sans-serif]"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(30,50,84,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,50,84,0.35) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
            }}
        >
            <div className="flex w-[780px] min-h-[520px] bg-[#0f1e35] rounded-2xl border border-[#1e3254] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

                {/* LEFT PANEL */}

                <div className="relative w-[45%] flex-shrink-0 bg-[#0d1a2e] border-r border-[#1e3254] flex items-end p-8 overflow-hidden">

                    <div
                        className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[180px] h-[180px] rounded-full pointer-events-none"
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
                            <span className="text-[22px] font-bold text-[#e8f0fe] tracking-[-0.3px]">
                                Tech
                            </span>

                            <span className="text-[22px] font-bold text-[#00e5c0] tracking-[-0.3px]">
                                Loop
                            </span>
                        </Link>

                        <p className="text-[11px] text-[#4a6380] mt-1 tracking-[0.3px]">
                            Unified · Secure · Shared Infrastructure
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL */}

                <div className="relative flex-1 flex flex-col px-9 py-8">

                    <div className="absolute top-[18px] right-5 w-2.5 h-2.5 rounded-full bg-[#00e5c0] shadow-[0_0_8px_#00e5c0]" />

                    {/* AUTH TABS */}

                    <div className="flex border border-[#1e3254] rounded-lg overflow-hidden mb-7">
                        <Link
                            to="/login"
                            className="flex-1 flex items-center justify-center py-2.5 bg-[#0f3d30] text-[#00e5c0] text-sm font-semibold no-underline"
                        >
                            Sign In
                        </Link>

                        <Link
                            to="/register"
                            className="flex-1 flex items-center justify-center py-2.5 text-[#7a99bb] text-sm font-medium no-underline hover:text-[#e8f0fe] transition-colors"
                        >
                            Register
                        </Link>
                    </div>

                    {/* HEADING */}

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white">
                            Change Password
                        </h1>

                        <p className="text-[#7a99bb] mt-1">
                            Update your password to keep your account secure
                        </p>
                    </div>

                    {/* FORM */}

                    <div className="space-y-4">

                        <PasswordField
                            label="Current Password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={setCurrentPassword}
                            error={errors.currentPassword}
                        />

                        <PasswordField
                            label="New Password"
                            placeholder="Min. 8 characters"
                            value={newPassword}
                            onChange={setNewPassword}
                            error={errors.newPassword}
                        />

                        <PasswordField
                            label="Confirm New Password"
                            placeholder="Repeat new password"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            error={errors.confirmPassword}
                        />

                        {/* REQUIREMENTS */}

                        <div className="rounded-lg border border-[#1e3254] bg-[#0a1525] px-3.5 py-3">

                            <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#7a99bb] mb-2">
                                Password requirements
                            </p>

                            <div className="grid grid-cols-2 gap-y-1">
                                <Requirement valid={newPassword.length >= 8} text="8+ characters"/>
                                <Requirement valid={/[A-Z]/.test(newPassword)} text="Uppercase letter"/>
                                <Requirement valid={/[a-z]/.test(newPassword)} text="Lowercase letter"/>
                                <Requirement valid={/[0-9]/.test(newPassword)} text="Number"/>
                                <Requirement valid={/[^a-zA-Z0-9]/.test(newPassword)} text="Special character"/>
                            </div>
                        </div>

                        {/* SUBMIT */}

                        <button onClick={handleChangePassword} disabled={loading} className="w-full py-3 rounded-lg bg-[#00e5c0] font-bold text-black disabled:opacity-50">
                            {loading ? "Changing..." : "Change Password"}
                        </button>

                        <div className="flex justify-center">
                            <Link to="/learner" className="text-xs text-[#7a99bb] hover:text-[#00e5c0] transition-colors">
                                Cancel
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}