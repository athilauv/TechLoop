import type { LearnerTestCase } from "../../../../types/question.types.ts";

interface TestCaseListProps {
    testCases: LearnerTestCase[];
}

const TestCaseList = ({ testCases }: TestCaseListProps) => {
    if (testCases.length === 0) {
        return (
            <div className="rounded-xl border border-[#223A59] bg-[#101C30] p-4 text-sm text-[#8CA3BF]">
                No sample test cases available.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {testCases.map((testCase, index) => (
                <div
                    key={testCase.id}
                    className="rounded-xl border border-[#223A59] bg-[#101C30] p-4"
                >
                    <div className="mb-3 inline-flex items-center rounded-md bg-[#14243C] px-2 py-1 text-xs font-medium text-[#8CA3BF]">
                        Example {index + 1}
                    </div>

                    <div className="space-y-3">
                        <div>
                            <div className="mb-1 text-xs font-medium text-[#5C7394]">
                                Input
                            </div>

                            <pre className="overflow-x-auto rounded-lg border border-[#223A59] bg-[#0E192A] p-3 text-xs text-[#D7E1EE]">
                                {testCase.input}
                            </pre>
                        </div>

                        <div>
                            <div className="mb-1 text-xs font-medium text-[#5C7394]">
                                Expected Output
                            </div>

                            <pre className="overflow-x-auto rounded-lg border border-[#223A59] bg-[#0E192A] p-3 text-xs text-[#D7E1EE]">
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