import { useState } from "react";
import { FileQuestion } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import Breadcrumb from "../../../../../shared/Breadcrumb.tsx";
import EmptyState from "../../../../../shared/EmptyState.tsx";
import LoadingSpinner from "../../../../../shared/LoadingSpinner.tsx";

import {
    deleteQuestion,
    getMentorQuestionById,
    publishQuestion,
} from "../../../../../api/mentorQuestion.api.ts";

import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";
import { QuestionType } from "../../../../../types/enums/question-type.ts";
import type { MentorQuestion } from "../../../../../types/question.types.ts";

import QuestionDetailHeader from "../../components/question-details/QuestionDetailHeader.tsx";
import QuestionTabs from "../../components/question-details/QuestionTabs.tsx";
import OverviewTab from "../../components/question-details/OverviewTab.tsx";
import DescriptionTab from "../../components/question-details/DescriptionTab.tsx";
import McqOptionsSection from "../../components/mcq/McqOptionsSection.tsx";

const TABS = [
    { key: "overview", label: "Overview" },
    { key: "description", label: "Description" },
    { key: "options", label: "Options" },
    { key: "discussion", label: "Discussion" },
];

const McqQuestionDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [activeTab, setActiveTab] = useState("overview");
    const [publishing, setPublishing] = useState(false);

    const questionId = Number(id);
    const validQuestionId = Number.isInteger(questionId) && questionId > 0;

    const {
        data: question,
        isLoading,
        isError,
    } = useQuery<MentorQuestion>({
        queryKey: ["mentor-question", questionId],
        queryFn: () => getMentorQuestionById(questionId),
        enabled: validQuestionId,
    });

    const handleBack = () => navigate("/mentor/questions/mcq");

    const handleEdit = () => {
        if (question) {
            navigate(`/mentor/questions/mcq/${question.id}/edit`);
        }
    };

    const handlePublish = () => {
        if (!question) return;

        showToast.confirm(
            "Publish MCQ Question",
            "Are you sure you want to publish this MCQ question?",
            () => {
                void (async () => {
                    setPublishing(true);

                    try {
                        await publishQuestion(question.id);

                        await queryClient.invalidateQueries({
                            queryKey: ["mentor-question", question.id],
                        });
                        await queryClient.invalidateQueries({
                            queryKey: ["mentor-questions"],
                        });

                        showToast.success("MCQ question published successfully.");
                    } catch (error) {
                        showToast.error(
                            getErrorMessage(error, "Failed to publish MCQ question."),
                        );
                    } finally {
                        setPublishing(false);
                    }
                })();
            },
            undefined,
            "Publish",
        );
    };

    const handleDelete = () => {
        if (!question) return;

        showToast.confirm(
            "Delete MCQ Question",
            "Are you sure you want to delete this MCQ question? This action cannot be undone.",
            () => {
                void (async () => {
                    try {
                        await deleteQuestion(question.id);

                        await queryClient.invalidateQueries({
                            queryKey: ["mentor-questions"],
                        });
                        queryClient.removeQueries({
                            queryKey: ["mentor-question", question.id],
                        });

                        showToast.success("MCQ question deleted successfully.");
                        navigate("/mentor/questions/mcq");
                    } catch (error) {
                        showToast.error(getErrorMessage(error, "Failed to delete MCQ question."));
                    }
                })();
            },
            undefined,
            "Delete",
        );
    };

    if (!validQuestionId) {
        return (
            <div className="px-6 py-6">
                <EmptyState
                    icon={<FileQuestion size={24} />}
                    title="Question not found"
                    description="The requested question could not be found."
                />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError || !question || question.questionType !== QuestionType.Mcq) {
        return (
            <div className="px-6 py-6">
                <EmptyState
                    icon={<FileQuestion size={24} />}
                    title="Question not found"
                    description="The requested question could not be found."
                />
            </div>
        );
    }

    return (
        <div className="min-h-full px-6 py-6">
            <Breadcrumb
                items={[
                    { label: "Questions", onClick: () => navigate("/mentor/questions") },
                    { label: "MCQ Questions", onClick: handleBack },
                    { label: question.title },
                ]}
            />

            <div className="mx-auto mt-6 max-w-5xl">
                <div className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-6">
                    <QuestionDetailHeader
                        question={question}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onPublish={handlePublish}
                        publishing={publishing}
                    />
                </div>

                <div className="mt-6 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] px-6">
                    <QuestionTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

                    {activeTab === "overview" && <OverviewTab question={question} />}
                    {activeTab === "description" && <DescriptionTab />}
                    {activeTab === "options" && <McqOptionsSection questionId={question.id} />}
                    {/*{activeTab === "discussion" && <DiscussionPlaceholder />}*/}
                </div>
            </div>
        </div>
    );
};

export default McqQuestionDetailsPage;
