import type { Submission } from "../../../../types/submission.types.ts";

interface SubmissionResultProps {
    submission: Submission | null;
}

const SubmissionResult = ({
                              submission,
                          }: SubmissionResultProps) => {
    if (!submission) {
        return (
            <div className="flex min-h-32 items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                Run or submit your code to see the result.
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Submission Result
                </h2>

                <span className="text-sm font-medium">
                    {String(submission.status)}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Passed
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                        {submission.passedTestCases ?? 0}/
                        {submission.totalTestCases ?? 0}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Score
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                        {submission.score ?? 0}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Runtime
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                        {submission.executionTimeMs ?? "-"} ms
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Memory
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                        {submission.memoryUsedMb ?? "-"} MB
                    </p>
                </div>
            </div>

            {submission.compilerOutput && (
                <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        Compiler Output
                    </p>

                    <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-red-400">
                        {submission.compilerOutput}
                    </pre>
                </div>
            )}

            {submission.runtimeOutput && (
                <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        Runtime Output
                    </p>

                    <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-300">
                        {submission.runtimeOutput}
                    </pre>
                </div>
            )}

            {submission.aiReview && (
                <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        AI Review
                    </p>

                    <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {submission.aiReview}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionResult;