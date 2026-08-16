import type { Submission } from "../../../../types/submission.types.ts";

interface SubmissionResultProps {
    submission: Submission | null;
}

const SubmissionResult = ({
                              submission,
                          }: SubmissionResultProps) => {
    if (!submission) {
        return (
            <div className="flex min-h-32 items-center justify-center rounded-2xl border border-[#223A59] bg-[#14243C] p-6 text-sm text-[#8CA3BF]">
                Run or submit your code to see the result.
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-[#223A59] bg-[#14243C] p-5">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">
                    Submission Result
                </h2>

                <span className="text-sm font-medium text-[#00E8C2]">
                    {String(submission.status)}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                    <p className="text-xs text-[#5C7394]">Passed</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                        {submission.passedTestCases ?? 0}/
                        {submission.totalTestCases ?? 0}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-[#5C7394]">Score</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                        {submission.score ?? 0}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-[#5C7394]">Runtime</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                        {submission.executionTimeMs ?? "-"} ms
                    </p>
                </div>

                <div>
                    <p className="text-xs text-[#5C7394]">Memory</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                        {submission.memoryUsedMb ?? "-"} MB
                    </p>
                </div>
            </div>

            {submission.compilerOutput && (
                <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-[#5C7394]">
                        Compiler Output
                    </p>

                    <pre className="overflow-x-auto rounded-lg border border-red-500/20 bg-[#0E192A] p-4 text-xs text-red-400">
                        {submission.compilerOutput}
                    </pre>
                </div>
            )}

            {submission.runtimeOutput && (
                <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-[#5C7394]">
                        Runtime Output
                    </p>

                    <pre className="overflow-x-auto rounded-lg border border-[#223A59] bg-[#0E192A] p-4 text-xs text-[#D7E1EE]">
                        {submission.runtimeOutput}
                    </pre>
                </div>
            )}

            {submission.aiReview && (
                <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-[#5C7394]">
                        AI Review
                    </p>

                    <div className="rounded-lg border border-[#223A59] bg-[#101C30] p-4 text-sm leading-6 text-[#B9C8DC]">
                        {submission.aiReview}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionResult;