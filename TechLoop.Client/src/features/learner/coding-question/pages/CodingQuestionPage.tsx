import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
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
                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                    Invalid coding question.
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />

                <div className="grid gap-5 lg:grid-cols-2">
                    <div className="h-[500px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                    <div className="h-[500px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                </div>
            </div>
        );
    }

    if (questionError || !question) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                Unable to load this coding question.
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <CodingQuestionHeader question={question} />

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <button type="button" onClick={openDiscussions}
                    className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#17D4C3] dark:text-slate-400">
                    <MessageCircle size={16} />

                    <span>
                        {discussionsLoading ? "Discussions" : `${discussionCount} ${discussionCount === 1 ? "Discussion" : "Discussions"}`}
                    </span>
                </button>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
                <div className="min-w-0 space-y-5">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <ProblemDescription question={question} />
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
                            Examples
                        </h2>

                        <TestCaseList testCases={testCases} />
                    </div>

                    {question.explanation && (
                        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                            <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
                                Explanation
                            </h2>

                            <div className="whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
                                {question.explanation}
                            </div>
                        </div>
                    )}
                </div>

                <div className="min-w-0">
                    <CodingEditor starterCode={starterCode} onCodeChange={setCode}/>

                    <div className="mt-3 flex items-center justify-between">
                        <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {code.length > 0 ? `${code.length} characters` : "Start writing your solution"}
                        </span>

                        <div className="flex gap-2">
                            <button type="button" onClick={handleRunCode} disabled={isSubmitting}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                                Run Code
                            </button>

                            <button type="button" onClick={handleSubmit} disabled={!code.trim() || isSubmitting}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <SubmissionResult submission={null} />
        </div>
    );
};

export default CodingQuestionPage;