import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageCircle, Play, Loader2, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import {
    useQuestion,
    useQuestionDetails,
} from "../../../../hooks/useQuestion.ts";
import {
    createSubmission,
    getSubmissionById,
} from "../../../../api/submission.api.ts";
import {
    getJudge0Result,
    submitToJudge0,
} from "../../../../api/judge0.api.ts";
import { getQuestionDiscussions } from "../../../../api/discussion.api.ts";
import type { Submission } from "../../../../types/submission.types.ts";
import { SubmissionStatus } from "../../../../types/enums/submission-status.ts";
import CodingQuestionHeader from "../components/CodingQuestionHeader.tsx";
import ProblemDescription from "../components/ProblemDescription.tsx";
import CodingEditor from "../components/CodingEditor.tsx";
import TestCaseList from "../components/TestCaseList.tsx";
import SubmissionResult from "../components/SubmissionResult.tsx";

const TERMINAL_JUDGE0_STATUS = new Set([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

const mapJudge0Status = (statusId: number): SubmissionStatus => {
    switch (statusId) {
        case 3:
            return SubmissionStatus.Accepted;
        case 4:
            return SubmissionStatus.WrongAnswer;
        case 5:
            return SubmissionStatus.TimeLimitExceeded;
        case 6:
            return SubmissionStatus.CompileError;
        case 13:
            return SubmissionStatus.RuntimeError;
        default:
            return SubmissionStatus.RuntimeError;
    }
};

const waitForJudge0Result = async (token: string): Promise<Awaited<ReturnType<typeof getJudge0Result>>> => {
    const timeoutAt = Date.now() + 60_000;

    while (Date.now() < timeoutAt) {
        const result = await getJudge0Result(token);

        if (TERMINAL_JUDGE0_STATUS.has(result.status.id)) return result;
        await new Promise((resolve) => setTimeout(resolve, 400));
    }

    throw new Error("The code execution timed out while waiting for Judge0.");
};

const CodingQuestionPage = () => {
    const { questionSlug } = useParams<{ questionSlug: string }>();
    const navigate = useNavigate();
    const {
        data: question,
        isLoading: questionLoading,
        isError: questionError,
    } = useQuestion(questionSlug ?? "");
    const {
        data: questionDetails,
        isLoading: questionDetailsLoading,
    } = useQuestionDetails(questionSlug ?? "");
    const {
        data: discussions = [],
        isLoading: discussionsLoading,
    } = useQuery({
        queryKey: ["question-discussions", question?.id],
        queryFn: () => getQuestionDiscussions(question!.id),
        enabled: Boolean(question?.id),
    });
    const [code, setCode] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submission, setSubmission] = useState<Submission | null>(null);
    //const id = question?.id ?? 0;
    const starterCode = useMemo(
        () => questionDetails?.codingTemplate?.starterCode ?? "",
        [questionDetails],
    );
    const testCases = questionDetails?.testCases ?? [];
    const template = questionDetails?.codingTemplate ?? null;
    const isLoading = questionLoading || questionDetailsLoading;
    const discussionCount = discussions.length;
    const isBusy = isRunning || isSubmitting;

    const handleRunCode = async () => {
        if (!code.trim()) {
            toast.warning("Please write some code first.");
            return;
        }

        if (!template?.technologyId) {
            toast.error("Unable to determine the programming language.");
            return;
        }

        if (testCases.length === 0) {
            toast.warning("No sample test cases are available to run.");
            return;
        }

        try {
            setIsRunning(true);
            setSubmission(null);

            let passedTestCases = 0;
            let executionTimeMs = 0;
            let memoryUsedMb = 0;
            let finalStatus: SubmissionStatus = SubmissionStatus.Accepted;
            let compilerOutput: string | null = null;
            let runtimeOutput: string | null = null;
            let judgeToken: string | null = null;

            for (const testCase of testCases) {
                const judgeSubmission = await submitToJudge0({
                    technologyId: template.technologyId,
                    sourceCode: code,
                    standardInput: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    cpuTimeLimit: question?.timeLimitSeconds ?? null,
                    memoryLimit: question?.memoryLimitMb ? question.memoryLimitMb * 1024 : null,
                });

                const result = await waitForJudge0Result(judgeSubmission.token);
                judgeToken = result.token;

                const timeSeconds = Number(result.time ?? 0);
                if (Number.isFinite(timeSeconds)) executionTimeMs += Math.round(timeSeconds * 1000);
                const memoryBytes = result.memory ?? 0;
                memoryUsedMb = Math.max(
                    memoryUsedMb,
                    Math.ceil(memoryBytes / 1024 / 1024),
                );

                compilerOutput = result.compileOutput;
                runtimeOutput = result.stderr ?? result.stdout ?? result.message;

                if (result.status.id === 3) {
                    passedTestCases += 1;
                    continue;
                }

                finalStatus = mapJudge0Status(result.status.id);
                break;
            }

            const totalTestCases = testCases.length;
            if (passedTestCases === totalTestCases) {
                finalStatus = SubmissionStatus.Accepted;
            } else if (finalStatus === SubmissionStatus.Accepted) {
                finalStatus = SubmissionStatus.WrongAnswer;
            }

            setSubmission({
                id: 0,
                userId: "",
                questionId: question.id,
                technologyId: template.technologyId,
                sourceCode: code,
                status: finalStatus,
                executionTimeMs,
                memoryUsedMb,
                passedTestCases,
                totalTestCases,
                score: Math.round((passedTestCases / totalTestCases) * 100),
                submittedAt: new Date().toISOString(),
                compilerOutput,
                runtimeOutput,
                aiReview: null,
                judgeToken,
            });

            if (finalStatus === SubmissionStatus.Accepted) {
                toast.success("All sample test cases passed.");
            } else {
                toast.warning("The code did not pass all sample test cases.");
            }
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || error.response?.data?.error || error.response?.data?.title
                : error instanceof Error
                    ? error.message
                    : null;

            toast.error(message || "Unable to run your code. Please try again.");
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (!code.trim()) {
            toast.warning("Please write your solution first.");
            return;
        }

        if (isBusy) return;

        const technologyId = template?.technologyId;
        if (!technologyId) {
            toast.error("Unable to determine the programming language.");
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmission(null);

            const response = await createSubmission({
                questionId: question.id,
                technologyId,
                sourceCode: code,
            });

            const result = await getSubmissionById(response.id);
            setSubmission(result);

            if (result.status === SubmissionStatus.Accepted) {
                toast.success("Solution accepted.");
            } else {
                toast.warning("Submission evaluated. Check the result below.");
            }
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
        navigate(`/learner/coding-questions/${question?.slug ?? questionSlug}/discussions`);
    };

    if (!questionSlug?.trim()) {
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
                    <CodingEditor starterCode={starterCode} onCodeChange={setCode} />

                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#223A59] bg-[#101C30] px-4 py-3">
                        <span className="min-w-0 truncate text-xs text-[#5C7394]">
                            {code.length > 0 ? `${code.length} characters` : "Start writing your solution"}
                        </span>

                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                type="button"
                                onClick={() => void handleRunCode()}
                                disabled={isBusy}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#223A59] bg-transparent px-3.5 py-2 text-sm font-medium text-[#B9C8DC] transition hover:border-[#00E8C2]/30 hover:bg-[#14243C] hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                                {isRunning ? "Running" : "Run"}
                            </button>

                            <button
                                type="button"
                                onClick={() => void handleSubmit()}
                                disabled={!code.trim() || isBusy}
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

            <SubmissionResult submission={submission} />

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
