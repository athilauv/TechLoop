import { useNavigate } from "react-router-dom";

export default function ProfileActions() {
    const navigate = useNavigate();

    return (
        <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">
                Security
            </h2>

            <div className="rounded-2xl border border-white/5 bg-[#0D1D35] p-5">
                <div className="flex items-center justify-between gap-5">
                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            Password
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Change your password to keep your account secure.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/change-password")}
                        className="
                            shrink-0
                            rounded-xl
                            border
                            border-[#17D4C3]/30
                            bg-[#17D4C3]/10
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-[#17D4C3]
                            transition
                            hover:bg-[#17D4C3]/20
                            hover:border-[#17D4C3]/50
                        "
                    >
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
}