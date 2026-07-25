import { useState } from "react";
import { login } from "../../services/authService";
import { Link,useNavigate  } from "react-router-dom";
import { showToast} from "../../utils/toast.ts";
import authImage from "../../assets/AuthImage.jpg";


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
                    autoComplete="off"
                    className={`w-full px-3.5 pr-16 py-[11px] bg-[#0a1525] border rounded-[7px] text-sm text-[#e8f0fe] placeholder-[#4a6380] outline-none
                    ${
                        error
                            ? "border-[#e05c5c]"
                            : "border-[#1e3254]"
                    }`}
                />

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7a99bb]"
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

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    
    const validate = () => {
        const e: Record<string, string> = {};

        if (!email.includes("@"))
            e.email = "Enter a valid email address";

        if (!password)
            e.password = "Password is required";

        setErrors(e);

        return Object.keys(e).length === 0;
    };

    const navigate = useNavigate();

    const handleSignIn = async () => {
        if (!validate()) return;

        setLoading(true);

        try {
            await login({
                email,
                password,
            });

            showToast.success("Login successful");

            navigate("/learner"); 
        } catch (err: any) {
            showToast.error(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b1628]">
            <div className="flex w-[780px] min-h-[520px] bg-[#0f1e35] rounded-2xl overflow-hidden">

                <div className="relative w-[45%] border-r border-[#1e3254]">
                    <img
                        src={authImage}
                        alt="TechLoop"
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />

                    <div className="absolute bottom-8 left-8">
                        <Link to="/">
                            <span className="text-[22px] font-bold text-white">
                                Tech
                            </span>
                            <span className="text-[22px] font-bold text-[#00e5c0]">
                                Loop
                            </span>
                        </Link>

                        <p className="text-xs text-[#7a99bb] mt-1">
                            Learn · Practice · Contribute
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

                        <Link
                            to="/register"
                            className="flex-1 flex items-center justify-center py-2.5 bg-[#0f3d30] text-[#00e5c0] text-sm font-semibold no-underline"
                        >
                            Register
                        </Link>
                    </div>
                    

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white">
                            Welcome Back
                        </h1>

                        <p className="text-[#7a99bb]">
                            Continue your learning journey
                        </p>
                    </div>

                    <div className="space-y-4">

                        <Field
                            label="Email"
                            type="email"
                            placeholder="name@gmail.com"
                            value={email}
                            onChange={setEmail}
                            error={errors.email}
                        />

                        <Field
                            label="Password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={setPassword}
                            error={errors.password}
                        />

                        <button
                            onClick={handleSignIn}
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-[#00e5c0] font-bold text-black disabled:opacity-50"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>

                        <p className="text-center text-sm text-[#7a99bb]">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-[#00e5c0]"
                            >
                                Register
                            </Link>
                        </p>

                    </div>

                </div>
            </div>
        </div>
    );
}