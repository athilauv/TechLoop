import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from "../../services/authService";
import { showToast} from "../../utils/toast.ts";
import authImage from "../../assets/AuthImage.jpg";

interface FieldProps {
    label: string
    type?: string
    placeholder: string
    value: string
    onChange: (v: string) => void
    error?: string
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
            ? (showPassword ? "text" : "password")
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
                    onChange={e => onChange(e.target.value)}
                    autoComplete="off"
                    className={`w-full px-3.5 pr-16 py-[11px] bg-[#0a1525] border rounded-[7px] text-sm text-[#e8f0fe] placeholder-[#4a6380] outline-none transition-all duration-200
                    focus:border-[#00e5c0] focus:shadow-[0_0_0_3px_rgba(0,229,192,0.1)]
                    ${error ? "border-[#e05c5c]" : "border-[#1e3254]"}`}
                />

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
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

export default function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validate = (): boolean => {
        const e: Record<string, string> = {}
        if (!name.trim()) e.name = 'Full name is required'
        if (!email.includes('@')) e.email = 'Enter a valid work email'
        if (password.length < 8) e.password = 'Minimum 8 characters'
        if (confirm !== password) e.confirm = 'Passwords do not match'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleCreateAccount = async () => {
        if (!validate()) return;

        setLoading(true);

        try {
            const result = await register({
                username: name,
                email,
                password,
            });

            console.log(result);

            showToast.success("Account created successfully");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err: any) {
            showToast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b1628] font-[Inter,system-ui,sans-serif]"
             style={{
                 backgroundImage: 'linear-gradient(rgba(30,50,84,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,50,84,0.35) 1px, transparent 1px)',
                 backgroundSize: '40px 40px',
             }}
        >
            <div className="flex w-[780px] min-h-[520px] bg-[#0f1e35] rounded-2xl border border-[#1e3254] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

                {/* ── Left decorative panel ── */}
                <div className="relative w-[45%] flex-shrink-0 bg-[#0d1a2e] border-r border-[#1e3254] flex items-end p-8 overflow-hidden">
                    {/* Glow */}
                    <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[180px] h-[180px] rounded-full pointer-events-none"
                         style={{ background: 'radial-gradient(circle, rgba(0,229,192,0.18) 0%, transparent 70%)' }} />
                    <img
                        src={authImage}
                        alt="TechLoop"
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    {/* Brand */}
                    <div className="relative z-10">
                        <Link to="/" className="no-underline">
                            <span className="text-[22px] font-bold text-[#e8f0fe] tracking-[-0.3px]">Tech</span>
                            <span className="text-[22px] font-bold text-[#00e5c0] tracking-[-0.3px]">Loop</span>
                        </Link>
                        <p className="text-[11px] text-[#4a6380] mt-1 tracking-[0.3px]">
                            Unified · Secure · Shared Infrastructure
                        </p>
                    </div>
                </div>

                {/* ── Right form panel ── */}
                <div className="relative flex-1 flex flex-col px-9 py-8">
                    {/* Status dot */}
                    <div className="absolute top-[18px] right-5 w-2.5 h-2.5 rounded-full bg-[#00e5c0] shadow-[0_0_8px_#00e5c0]" />

                    {/* Tabs */}
                    <div className="flex border border-[#1e3254] rounded-lg overflow-hidden mb-7">
                        <Link to="/login" className="flex-1 flex items-center justify-center py-2.5 text-[#7a99bb] text-sm font-medium no-underline hover:text-[#e8f0fe] transition-colors">
                            Sign In
                        </Link>
                        <button className="flex-1 py-2.5 bg-[#0f3d30] text-[#00e5c0] text-sm font-semibold cursor-pointer border-none font-[inherit]">
                            Register
                        </button>
                    </div>

                    {/* Heading */}
                    <div className="mb-5">
                        <h1 className="text-[22px] font-bold text-[#e8f0fe] tracking-[-0.4px] leading-tight">Create account</h1>
                        <p className="text-[13px] text-[#7a99bb] mt-1">Learn, Practice, and Grow together</p>
                    </div>

                    {/* Fields */}
                    <div className="flex flex-col gap-3.5 mb-[18px]">
                        <Field label="Full Name" placeholder="Name" value={name} onChange={setName} error={errors.name} />
                        <Field label="Email" type="email" placeholder="name@gmail.com" value={email} onChange={setEmail} error={errors.email} />
                        <Field label="Password" type="password" placeholder="Min. 8 characters" value={password} onChange={setPassword} error={errors.password} />
                        <Field label="Confirm Password" type="password" placeholder="Repeat password" value={confirm} onChange={setConfirm} error={errors.confirm} />
                    </div>

                    {/* CTA */}
                    <button
                        onClick={handleCreateAccount}
                        disabled={loading}
                        className="w-full py-[13px] bg-[#00e5c0] border-none rounded-lg text-[#001a14] text-[15px] font-bold cursor-pointer tracking-[0.1px] font-[inherit] transition-all duration-150 hover:bg-[#00b89a] active:scale-[0.99]"
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-2.5 my-4">
                        <div className="flex-1 h-px bg-[#1e3254]" />
                        <div className="flex-1 h-px bg-[#1e3254]" />
                    </div>

                    {/* Switch */}
                    <p className="mt-3.5 text-xs text-[#4a6380] text-center">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#00e5c0] underline underline-offset-2 text-xs hover:text-[#00b89a]">
                            Sign in
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}