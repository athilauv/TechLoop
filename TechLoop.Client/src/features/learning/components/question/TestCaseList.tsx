import { Lock } from "lucide-react";

interface TestCase {
    id: number;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
}

interface TestCaseListProps {
    testCases: TestCase[];
}

function OutputBlock({ label, value }: { label: string; value: string }) {
    return (
        <div className="overflow-hidden rounded-xl border border-[#223A59]">
            <div className="border-b border-[#223A59] bg-[#12233B] px-4 py-2 text-xs font-medium uppercase tracking-wide text-[#8CA3BF]">
                {label}
            </div>
            <pre className="overflow-x-auto bg-[#081423] p-4 font-mono text-sm text-[#00E8C2]">
                {value}
            </pre>
        </div>
    );
}

export default function TestCaseList({ testCases }: TestCaseListProps) {
    if (testCases.length === 0) {
        return (
            <div className="rounded-xl border border-[#223A59] bg-[#101C30] px-5 py-10 text-center text-sm text-[#5C7394]">
                No test cases available yet.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Test Cases</h2>

            {testCases.map((testCase, index) => (
                <div
                    key={testCase.id}
                    className="space-y-4 rounded-xl border border-[#223A59] bg-[#14243C] p-5"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#8CA3BF]">
                            Case {index + 1}
                        </span>

                        {testCase.isHidden && (
                            <span className="flex items-center gap-1.5 rounded-full border border-[#223A59] bg-[#101C30] px-2.5 py-1 text-xs text-[#5C7394]">
                                <Lock className="h-3 w-3" />
                                Hidden
                            </span>
                        )}
                    </div>

                    <OutputBlock label="Input" value={testCase.input} />

                    {!testCase.isHidden && (
                        <OutputBlock label="Expected Output" value={testCase.expectedOutput} />
                    )}
                </div>
            ))}
        </div>
    );
}