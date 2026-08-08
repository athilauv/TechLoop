import { useNavigate, useParams } from "react-router-dom";
import { Code2, ListChecks } from "lucide-react";

import LearningLayout from "../components/layout/LearningLayout";
import QuestionCard from "../components/question/QuestionCard";
import QuestionFooter from "../components/question/QuestionFooter";
import Breadcrumb from "../components/common/Breadcrumb";
import ErrorState from "../components/common/ErrorState";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import { useQuestion } from "../hooks/useQuestion";
import { QuestionType } from "../types/enums/question-type";

export default function QuestionPage() {
    const navigate = useNavigate();

    const { questionId } = useParams();

    const id = Number(questionId);

    const {
        data: question,
        isLoading,
        isError,
        refetch,
    } = useQuestion(id);

    if (isLoading) {
        return (
            <LearningLayout>
                <div className="space-y-6">
                    <LoadingSkeleton variant="text" lines={2} />
                    <LoadingSkeleton variant="card" className="h-64" />
                </div>
            </LearningLayout>
        );
    }

    if (isError || !question) {
        return (
            <LearningLayout>
                <ErrorState
                    title="Unable to load question"
                    description="Something went wrong while fetching this question. Try refreshing the page."
                    onRetry={refetch}
                />
            </LearningLayout>
        );
    }

    const isMcq = question.questionType === QuestionType.Mcq;

    return (
        <LearningLayout>
            <Breadcrumb
                items={[
                    { label: "Problems", href: "/problems" },
                    { label: question.title },
                ]}
            />

            <div className="mt-4">
                <QuestionCard
                    title={question.title}
                    description={question.description}
                    difficulty={question.difficulty}
                    mark={question.mark}
                    questionType={question.questionType}
                />
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-[#223A59] bg-[#14243C]">
                <div className="flex items-center gap-2 border-b border-[#223A59] bg-[#12233B] px-5 py-3">
                    {isMcq ? (
                        <ListChecks className="h-4 w-4 text-[#8CA3BF]" />
                    ) : (
                        <Code2 className="h-4 w-4 text-[#8CA3BF]" />
                    )}
                    <span className="text-sm font-medium text-white">
                        {isMcq ? "Multiple choice" : "Coding challenge"}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                    <p className="text-sm font-medium text-[#8CA3BF]">
                        {isMcq ? "Answer options coming next" : "Coding editor coming next"}
                    </p>
                    <p className="max-w-sm text-sm text-[#5C7394]">
                        This section will let you {isMcq ? "select an answer" : "write and run your solution"} for this question.
                    </p>
                </div>
            </div>

            <QuestionFooter onPrevious={() => navigate(-1)} onNext={() => {}} />
        </LearningLayout>
    );
}