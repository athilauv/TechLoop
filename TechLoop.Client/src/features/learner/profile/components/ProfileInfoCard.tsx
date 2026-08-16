interface ProfileInfoCardProps {
    username: string;
}

export default function ProfileInfoCard({
                                            username,
                                        }: ProfileInfoCardProps) {
    return (
        <div className="rounded-2xl border border-[#17D4C3]/10 bg-[#0D1D35] p-5">
            <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#17D4C3] shadow-[0_0_8px_#17D4C3]" />

                <div>
                    <h3 className="text-sm font-semibold text-white">
                        Welcome to TechLoop
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                        {username
                            ? `Your TechLoop account is connected to ${username}.`
                            : "Manage your TechLoop account from here."}
                    </p>
                </div>
            </div>
        </div>
    );
}