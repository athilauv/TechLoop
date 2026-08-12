interface DashboardHeaderProps {
    hasData: boolean;
}

export default function DashboardHeader({
                                            hasData,
                                        }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-sm text-[#7a99bb]">
                {hasData
                    ? "Welcome back"
                    : "Start your learning journey"}
            </p>

            <h1 className="text-2xl font-bold text-[#e8f0fe]">
                Dashboard
            </h1>

            <p className="text-sm text-[#5f7898]">
                Track your learning progress and continue practicing.
            </p>
        </div>
    );
}