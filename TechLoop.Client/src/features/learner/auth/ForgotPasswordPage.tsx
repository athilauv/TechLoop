import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../api/auth.api.ts";
import { showToast } from "../../../utils/toast.tsx";
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
                autoComplete="email"
                className={`w-full px-3.5 py-[11px] bg-[#0a1525] border rounded-[7px] text-sm text-[#e8f0fe] placeholder-[#4a6380] outline-none transition-all duration-200
                focus:border-[#00e5c0] focus:shadow-[0_0_0_3px_rgba(0,229,192,0.1)]
                ${error ? "border-[#e05c5c]" : "border-[#1e3254]"}`}
            />

            {error && (
                <span className="text-[11px] text-[#e05c5c]">
                    {error}
                </span>
            )}
        </div>
    );
}

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const validate = (): boolean => {
        const e: Record<string, string> = {};

        if (!email.trim()) {
            e.email = "Email is required";
        } else if (!email.includes("@")) {
            e.email = "Enter a valid email address";
        }

        setErrors(e);

        return Object.keys(e).length === 0;
    };

    const handleForgotPassword = async () => {
        if (!validate()) return;

        setLoading(true);

        try {
            await forgotPassword({
                email: email.trim(),
            });

            setSubmitted(true);

            showToast.success("Password reset link sent");
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to send password reset link";

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

                {/* Left decorative panel */}
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

                {/* Right form panel */}
                <div className="relative flex-1 flex flex-col px-9 py-8">

                    {/* Status dot */}
                    <div className="absolute top-[18px] right-5 w-2.5 h-2.5 rounded-full bg-[#00e5c0] shadow-[0_0_8px_#00e5c0]" />

                    {/* Tabs */}
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

                    {/* Heading */}
                    <div className="mb-6">
                        <h1 className="text-[22px] font-bold text-[#e8f0fe] tracking-[-0.4px] leading-tight">
                            Forgot Password?
                        </h1>

                        <p className="text-[13px] text-[#7a99bb] mt-1">
                            Enter your email and we'll send you a reset link
                        </p>
                    </div>

                    {!submitted ? (
                        <>
                            {/* Email */}
                            <div className="flex flex-col gap-4">
                                <Field
                                    label="Email"
                                    type="email"
                                    placeholder="name@gmail.com"
                                    value={email}
                                    onChange={setEmail}
                                    error={errors.email}
                                />

                                {/* CTA */}
                                <button
                                    onClick={handleForgotPassword}
                                    disabled={loading}
                                    className="w-full py-[13px] bg-[#00e5c0] border-none rounded-lg text-[#001a14] text-[15px] font-bold cursor-pointer tracking-[0.1px] font-[inherit] transition-all duration-150 hover:bg-[#00b89a] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading
                                        ? "Sending..."
                                        : "Send Reset Link"}
                                </button>
                            </div>

                            {/* Back to Login */}
                            <p className="mt-6 text-xs text-[#4a6380] text-center">
                                Remember your password?{" "}
                                <Link
                                    to="/login"
                                    className="text-[#00e5c0] underline underline-offset-2 text-xs hover:text-[#00b89a]"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </>
                    ) : (
                        /* Success state */
                        <div className="flex flex-col items-center text-center mt-4">

                            <div className="w-12 h-12 rounded-full bg-[#0f3d30] border border-[#00e5c0]/30 flex items-center justify-center mb-4">
                                <span className="text-[#00e5c0] text-xl">
                                    ✓
                                </span>
                            </div>

                            <h2 className="text-[16px] font-semibold text-[#e8f0fe]">
                                Check your email
                            </h2>

                            <p className="text-[13px] text-[#7a99bb] mt-2 leading-relaxed max-w-[300px]">
                                If an account exists with this email, a
                                password reset link has been sent.
                            </p>

                            <button
                                onClick={() => navigate("/login")}
                                className="mt-6 w-full py-[13px] bg-[#00e5c0] border-none rounded-lg text-[#001a14] text-[15px] font-bold cursor-pointer font-[inherit] transition-all duration-150 hover:bg-[#00b89a] active:scale-[0.99]"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}