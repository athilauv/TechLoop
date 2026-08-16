import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../../api/auth.api.ts";
import { showToast } from "../../../utils/toast.ts";
import authImage from "../../../assets/AuthImage.jpg";

interface FieldProps {
    label: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
}

function Field({
                   label,
                   type = "text",
                   placeholder,
                   value,
                   onChange,
                   error,
               }: FieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    const inputType =
        type === "password"
            ? showPassword
                ? "text"
                : "password"
            : type;

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold tracking-[0.8px] uppercase text-[#7a99bb]">
                {label}
            </label>

            <div className="relative">
                <input
                    type={inputType}
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

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7a99bb] hover:text-[#00e5c0]"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                )}
            </div>

            {error && (
                <span className="text-[11px] text-[#e05c5c]">
                    {error}
                </span>
            )}
        </div>
    );
}


export default function ResetPasswordPage() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [errors, setErrors] = useState<
        Record<string, string>
    >({});


    const validate = (): boolean => {
        const e: Record<string, string> = {};

        if (!token) {
            e.token = "Invalid or missing reset link.";
        }

        if (!password) {
            e.password = "New password is required.";
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

        setErrors(e);

        return Object.keys(e).length === 0;
    };


    const handleResetPassword = async () => {
        if (!validate()) return;

        if (!token) return;

        setLoading(true);

        try {
            await resetPassword({
                token,
                newPassword: password,
                confirmPassword,
            });

            setSuccess(true);

            showToast.success(
                "Password reset successfully"
            );

        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Password reset failed";

            showToast.error(message);

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b1628] font-[Inter,system-ui,sans-serif]"
            style={{
                backgroundImage: "linear-gradient(rgba(30,50,84,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,50,84,0.35) 1px, transparent 1px)",
                backgroundSize: "40px 40px",}}>

            <div className="flex w-[780px] min-h-[520px] bg-[#0f1e35] rounded-2xl border border-[#1e3254] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

                {/* LEFT PANEL */}
                <div className="relative w-[45%] flex-shrink-0 bg-[#0d1a2e] border-r border-[#1e3254] flex items-end p-8 overflow-hidden">
                    <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[180px] h-[180px] rounded-full pointer-events-none" style={{background: "radial-gradient(circle, rgba(0,229,192,0.18) 0%, transparent 70%)",}}/>
                    <img src={authImage} alt="TechLoop" className="absolute inset-0 w-full h-full object-cover opacity-30"/>
                    <div className="relative z-10">

                        <Link to="/" className="no-underline">
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

                    {/* STATUS DOT */}

                    <div className="absolute top-[18px] right-5 w-2.5 h-2.5 rounded-full bg-[#00e5c0] shadow-[0_0_8px_#00e5c0]" />


                    {/* TABS */}

                    <div className="flex border border-[#1e3254] rounded-lg overflow-hidden mb-7">

                        <Link to="/login" className="flex-1 flex items-center justify-center py-2.5 bg-[#0f3d30] text-[#00e5c0] text-sm font-semibold no-underline">
                            Sign In
                        </Link>

                        <Link to="/register" className="flex-1 flex items-center justify-center py-2.5 text-[#7a99bb] text-sm font-medium no-underline hover:text-[#e8f0fe] transition-colors">
                            Register
                        </Link>

                    </div>


                    {!success ? (

                        <>

                            {/* HEADING */}

                            <div className="mb-6">

                                <h1 className="text-2xl font-bold text-white">
                                    Reset Password
                                </h1>

                                <p className="text-[#7a99bb] mt-1">
                                    Create a new password for your account
                                </p>

                            </div>


                            {/* INVALID TOKEN */}

                            {!token ? (

                                <div className="flex flex-col items-center text-center mt-6">

                                    <div className="w-12 h-12 rounded-full bg-[#3d1717] border border-[#e05c5c]/30 flex items-center justify-center mb-4">
                                        <span className="text-[#e05c5c] text-xl">
                                            !
                                        </span>
                                    </div>

                                    <h2 className="text-[16px] font-semibold text-[#e8f0fe]">
                                        Invalid reset link
                                    </h2>

                                    <p className="text-[13px] text-[#7a99bb] mt-2 leading-relaxed max-w-[300px]">
                                        This password reset link is
                                        missing or invalid.
                                    </p>

                                    <Link to="/forgot-password" className="w-full mt-6 py-3 rounded-lg bg-[#00e5c0] font-bold text-black text-center no-underline">
                                        Request New Link
                                    </Link>

                                </div>

                            ) : (

                                <div className="space-y-4">

                                    {/* PASSWORD */}
                                    <Field label="New Password" type="password" placeholder="Min. 8 characters" value={password} onChange={setPassword} error={errors.password}/>

                                    {/* CONFIRM PASSWORD */}
                                    <Field label="Confirm Password" type="password" placeholder="Repeat your password" value={confirmPassword} onChange={setConfirmPassword} error={errors.confirmPassword}/>


                                    {/* PASSWORD REQUIREMENTS */}
                                    <div className="rounded-lg border border-[#1e3254] bg-[#0a1525] px-3.5 py-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#7a99bb] mb-2">
                                            Password requirements
                                        </p>

                                        <div className="grid grid-cols-2 gap-y-1">
                                            <Requirement valid={password.length >= 8} text="8+ characters"/>
                                            <Requirement valid={/[A-Z]/.test(password)} text="Uppercase letter"/>
                                            <Requirement valid={/[a-z]/.test(password)} text="Lowercase letter"/>
                                            <Requirement valid={/[0-9]/.test(password)} text="Number"/>
                                            <Requirement valid={/[^a-zA-Z0-9]/.test(password)} text="Special character"/>

                                        </div>
                                    </div>


                                    {/* TOKEN ERROR */}

                                    {errors.token && (
                                        <p className="text-[11px] text-[#e05c5c]">
                                            {errors.token}
                                        </p>
                                    )}


                                    {/* BUTTON */}

                                    <button onClick={handleResetPassword} disabled={loading} className="w-full py-3 rounded-lg bg-[#00e5c0] font-bold text-black disabled:opacity-50">
                                        {loading ? "Resetting..." : "Reset Password"}
                                    </button>


                                    <p className="text-center text-sm text-[#7a99bb]">Remember your password?{" "}
                                        <Link to="/login" className="text-[#00e5c0]">
                                            Sign in
                                        </Link>

                                    </p>

                                </div>

                            )}

                        </>

                    ) : (

                        /* SUCCESS */

                        <div className="flex flex-col items-center text-center mt-10">

                            <div className="w-14 h-14 rounded-full bg-[#0f3d30] border border-[#00e5c0]/30 flex items-center justify-center mb-5">

                                <span className="text-[#00e5c0] text-2xl">
                                    ✓
                                </span>

                            </div>

                            <h2 className="text-lg font-semibold text-[#e8f0fe]">
                                Password reset successful
                            </h2>

                            <p className="text-[13px] text-[#7a99bb] mt-2 leading-relaxed max-w-[320px]">
                                Your password has been changed successfully.
                                Please sign in with your new password.
                            </p>

                            <button onClick={() => navigate("/login")} className="w-full mt-7 py-3 rounded-lg bg-[#00e5c0] font-bold text-black">
                                Continue to Login
                            </button>

                        </div>

                    )}

                </div>

            </div>
        </div>
    );
}


/* PASSWORD REQUIREMENT */

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

            <span className={`text-[11px] ${valid ? "text-[#00e5c0]" : "text-[#4a6380]"
                }`}>
                {valid ? "✓" : "○"}
            </span>

            <span className={`text-[11px] ${valid ? "text-[#7a99bb]" : "text-[#4a6380]"}`}>
                {text}
            </span>

        </div>
    );
}