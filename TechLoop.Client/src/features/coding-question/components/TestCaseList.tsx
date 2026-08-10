import type { LearnerTestCase } from "../../../types/question.types.ts";

interface TestCaseListProps {
    testCases: LearnerTestCase[];
}

const TestCaseList = ({ testCases }: TestCaseListProps) => {
    if (testCases.length === 0) {
        return (
            <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                No sample test cases available.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {testCases.map((testCase, index) => (
                <div
                    key={testCase.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                    <div className="mb-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                        Example {index + 1}
                    </div>

                    <div className="space-y-3">
                        <div>
                            <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                Input
                            </div>

                            <pre className="overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-200">
                                {testCase.input}
                            </pre>
                        </div>

                        <div>
                            <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                Expected Output
                            </div>

                            <pre className="overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-200">
                                {testCase.expectedOutput}
                            </pre>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TestCaseList;