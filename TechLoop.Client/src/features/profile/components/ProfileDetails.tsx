interface ProfileDetailsProps {
    username: string;
    email: string;
    role: string;
}

interface DetailRowProps {
    label: string;
    value: string;
}

function DetailRow({
                       label,
                       value,
                   }: DetailRowProps) {
    return (
        <div className="flex items-center justify-between gap-6 border-b border-white/5 py-4 last:border-b-0">
            <span className="text-sm text-slate-500">
                {label}
            </span>

            <span className="max-w-[60%] truncate text-right text-sm font-medium text-slate-200">
                {value || "—"}
            </span>
        </div>
    );
}

export default function ProfileDetails({
                                           username,
                                           email,
                                           role,
                                       }: ProfileDetailsProps) {
    return (
        <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">
                Account Information
            </h2>

            <div className="rounded-2xl border border-white/5 bg-[#0D1D35] px-5">
                <DetailRow
                    label="Username"
                    value={username}
                />

                <DetailRow
                    label="Email"
                    value={email}
                />

                <DetailRow
                    label="Role"
                    value={role}
                />
            </div>
        </div>
    );
}