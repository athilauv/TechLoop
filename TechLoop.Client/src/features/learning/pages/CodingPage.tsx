import { Code2, ListChecks } from "lucide-react";
import LearningLayout from "../components/layout/LearningLayout";
import CodingEditor from "../components/question/ CodingEditor.tsx";
import TestCaseList from "../components/question/TestCaseList";

export default function CodingPage() {
    return (
        <LearningLayout>
            <div className="overflow-hidden rounded-2xl border border-[#223A59] bg-[#14243C]">
                <div className="flex items-center gap-2 border-b border-[#223A59] bg-[#12233B] px-5 py-3">
                    <Code2 className="h-4 w-4 text-[#00E8C2]" />
                    <span className="text-sm font-medium text-white">Solution</span>
                </div>

                <div className="p-5">
                    <CodingEditor
                        starterCode=""
                        language="C#"
                        onRun={() => {}}
                        onSubmit={() => {}}
                    />
                </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-[#223A59] bg-[#14243C]">
                <div className="flex items-center gap-2 border-b border-[#223A59] bg-[#12233B] px-5 py-3">
                    <ListChecks className="h-4 w-4 text-[#8CA3BF]" />
                    <span className="text-sm font-medium text-white">Test cases</span>
                </div>

                <div className="p-5">
                    <TestCaseList testCases={[]} />
                </div>
            </div>
        </LearningLayout>
    );
}