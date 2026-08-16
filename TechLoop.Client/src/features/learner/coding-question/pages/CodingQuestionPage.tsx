import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageCircle, Play, Loader2, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import {useCodingTemplates, useQuestion, useTestCases,} from "../../../../hooks/useQuestion.ts";
import { createSubmission } from "../../../../api/submission.api.ts";
import { getQuestionDiscussions } from "../../../../api/discussion.api.ts";
import CodingQuestionHeader from "../components/CodingQuestionHeader.tsx";
import ProblemDescription from "../components/ProblemDescription.tsx";
import CodingEditor from "../components/CodingEditor.tsx";
import TestCaseList from "../components/TestCaseList.tsx";
import SubmissionResult from "../components/SubmissionResult.tsx";

const CodingQuestionPage = () => {
    const { questionId } = useParams<{ questionId: string }>();
    const navigate = useNavigate();
    const id = Number(questionId);
    const {
        data: question,
        isLoading: questionLoading,
        isError: questionError,
    } = useQuestion(id);
    const {
        data: templates = [],
        isLoading: templatesLoading,
    } = useCodingTemplates(id);
    const {
        data: testCases = [],
        isLoading: testCasesLoading,
    } = useTestCases(id);
    const {
        data: discussions = [],
        isLoading: discussionsLoading,
    } = useQuery({
        queryKey: ["question-discussions", id],
        queryFn: () => getQuestionDiscussions(id),
        enabled: id > 0,
    });
    const [code, setCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const starterCode = useMemo(() => templates[0]?.starterCode ?? "", [templates]);
    const isLoading = questionLoading || templatesLoading || testCasesLoading;
    const discussionCount = discussions.length;

    const handleRunCode = () => {
        if (!code.trim()) {
            toast.warning("Please write some code first.");
            return;
        }

        toast.info("Run Code is not implemented yet.");
    };

    const handleSubmit = async () => {
        if (!code.trim()) {
            toast.warning("Please write your solution first.");
            return;
        }

        if (isSubmitting) return;

        const technologyId = templates[0]?.technologyId;
        if (!technologyId) {
            toast.error("Unable to determine the programming language.");
            return;
        }

        try {
            setIsSubmitting(true);

            await createSubmission({
                questionId: id,
                technologyId,
                sourceCode: code,
            });

            toast.success("Code submitted successfully.");
        } catch (error: unknown) {
            console.error("Submission failed:", error);

            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || error.response?.data?.error || error.response?.data?.title;
                if (error.response?.status === 409) {
                    toast.warning("You have already solved this question.");
                } else if (message) {
                    toast.error(message);
                } else {
                    toast.error("Unable to submit your solution. Please try again.");
                }
            } else {
                toast.error("Unable to submit your solution. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDiscussions = () => {
        navigate(`/learner/coding-questions/${id}/discussions`);
    };

    if (!id || id <= 0) {
        return (
            <div className="p-6">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
                    Invalid coding question.
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-24 animate-pulse rounded-2xl bg-[#14243C]" />

                <div className="grid gap-5 lg:grid-cols-2">
                    <div className="h-[500px] animate-pulse rounded-2xl bg-[#14243C]" />
                    <div className="h-[500px] animate-pulse rounded-2xl bg-[#14243C]" />
                </div>
            </div>
        );
    }

    if (questionError || !question) {
        return (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
                Unable to load this coding question.
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <CodingQuestionHeader question={question} />

            <div className="grid gap-5 xl:grid-cols-2">
                <div className="min-w-0 space-y-5">
                    <div className="rounded-2xl border border-[#223A59] bg-[#14243C] p-5">
                        <ProblemDescription question={question} />
                    </div>

                    <div className="rounded-2xl border border-[#223A59] bg-[#14243C] p-5">
                        <h2 className="mb-4 text-base font-semibold text-white">
                            Examples
                        </h2>

                        <TestCaseList testCases={testCases} />
                    </div>

                    {question.explanation && (
                        <div className="rounded-2xl border border-[#223A59] bg-[#14243C] p-5">
                            <h2 className="mb-3 text-base font-semibold text-white">
                                Explanation
                            </h2>

                            <div className="whitespace-pre-wrap text-sm leading-7 text-[#B9C8DC]">
                                {question.explanation}
                            </div>
                        </div>
                    )}
                </div>

                <div className="min-w-0">
                    <CodingEditor starterCode={starterCode} onCodeChange={setCode}/>

                    {/* Action bar — grouped console-style control strip */}
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#223A59] bg-[#101C30] px-4 py-3">
                        <span className="min-w-0 truncate text-xs text-[#5C7394]">
                            {code.length > 0 ? `${code.length} characters` : "Start writing your solution"}
                        </span>

                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                type="button"
                                onClick={handleRunCode}
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#223A59] bg-transparent px-3.5 py-2 text-sm font-medium text-[#B9C8DC] transition hover:border-[#00E8C2]/30 hover:bg-[#14243C] hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#223A59] disabled:hover:bg-transparent"
                            >
                                <Play size={14} />
                                Run
                            </button>

                            <button
                                type="button"
                                onClick={() => void handleSubmit()}
                                disabled={!code.trim() || isSubmitting}
                                className="inline-flex min-w-[104px] items-center justify-center gap-1.5 rounded-lg bg-[#00E8C2] px-4 py-2 text-sm font-semibold text-[#081423] shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] transition hover:bg-[#00DDB9] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#00E8C2]/30 disabled:text-[#081423]/50 disabled:shadow-none"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Submitting
                                    </>
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <SubmissionResult submission={null} />

            {/* Discussion — secondary, bottom-of-page action */}
            <button
                type="button"
                onClick={openDiscussions}
                className="group flex w-full items-center justify-between rounded-xl border border-[#223A59] bg-[#101C30] px-4 py-3 text-left transition hover:border-[#00E8C2]/25 hover:bg-[#14243C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/40"
            >
                <span className="inline-flex items-center gap-2 text-sm text-[#8CA3BF] transition group-hover:text-white">
                    <MessageCircle size={16} />
                    {discussionsLoading
                        ? "Discussions"
                        : `${discussionCount} ${discussionCount === 1 ? "Discussion" : "Discussions"}`}
                </span>

                <ChevronRight
                    size={16}
                    className="text-[#5C7394] transition group-hover:translate-x-0.5 group-hover:text-[#00E8C2]"
                />
            </button>
        </div>
    );
};

export default CodingQuestionPage;