import type {
    TechnologyPractice as TechnologyPracticeData,
} from "../../../types/analytics.types";

interface TechnologyPracticeProps {
    technologies: TechnologyPracticeData[];
}

export default function TechnologyPractice({
                                               technologies,
                                           }: TechnologyPracticeProps) {
    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                Technologies
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
                What you practice
            </h2>

            {technologies.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-[#1e3254] p-8 text-center">
                    <p className="text-sm text-[#7189a8]">
                        No technology practice data yet.
                    </p>
                </div>
            ) : (
                <div className="mt-5 space-y-3">
                    {technologies.map((technology) => {
                        const successRate =
                            technology.totalAttempts > 0
                                ? Math.round(
                                    (technology.successfulAttempts /
                                        technology.totalAttempts) *
                                    100
                                )
                                : 0;

                        return (
                            <div
                                key={technology.technologyId}
                                className="rounded-xl border border-[#1e3254] bg-[#0b182b] p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-white">
                                        {technology.technologyName}
                                    </p>

                                    <span className="text-xs text-[#17D4C3]">
                                        {successRate}%
                                    </span>
                                </div>

                                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#081423]">
                                    <div
                                        className="h-full rounded-full bg-[#17D4C3]"
                                        style={{
                                            width: `${successRate}%`,
                                        }}
                                    />
                                </div>

                                <div className="mt-3 grid grid-cols-3 text-center">
                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            {technology.totalAttempts}
                                        </p>

                                        <p className="text-[10px] text-[#617b9d]">
                                            Attempts
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-[#17D4C3]">
                                            {technology.successfulAttempts}
                                        </p>

                                        <p className="text-[10px] text-[#617b9d]">
                                            Passed
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-[#e05c5c]">
                                            {technology.failedAttempts}
                                        </p>

                                        <p className="text-[10px] text-[#617b9d]">
                                            Failed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}