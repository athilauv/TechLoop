import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import Breadcrumb from "../../../../../shared/Breadcrumb.tsx";
import LoadingSpinner from "../../../../../shared/LoadingSpinner.tsx";

import {
    createQuestion,
    getMentorQuestionById,
    updateQuestion,
} from "../../../../../api/mentorQuestion.api.ts";

import { getMentorSubTopics } from "../../../../../api/mentorSubTopic.api.ts";
import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";

import type {
    CreateQuestionRequest,
    MentorQuestion,
    UpdateQuestionRequest,
} from "../../../../../types/question.types.ts";

import type { MentorSubTopic } from "../../../../../types/subTopic.types.ts";

import McqQuestionForm from "../../components/mcq/McqQuestionForm.tsx";

const McqQuestionFormPage = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();

    const questionId = id ? Number(id) : undefined;
    const isEdit = questionId !== undefined && Number.isInteger(questionId) && questionId > 0;

    const [submitting, setSubmitting] = useState(false);

    const { data: subTopics = [], isLoading: subTopicsLoading } = useQuery<MentorSubTopic[]>({
        queryKey: ["mentor-subtopics"],
        queryFn: () => getMentorSubTopics(),
    });

    const { data: question, isLoading: questionLoading } = useQuery<MentorQuestion>({
        queryKey: ["mentor-question", questionId],
        queryFn: () => getMentorQuestionById(questionId as number),
        enabled: isEdit,
    });

    const handleSubmit = async (request: CreateQuestionRequest | UpdateQuestionRequest) => {
        setSubmitting(true);

        try {
            if (isEdit) {
                await updateQuestion(questionId as number, request as UpdateQuestionRequest);
                showToast.success("MCQ question updated successfully.");
                navigate(`/mentor/questions/mcq/${questionId}`);
            } else {
                await createQuestion(request);
                showToast.success("MCQ question created successfully.");
                navigate("/mentor/questions/mcq");
            }
        } catch (error) {
            showToast.error(
                getErrorMessage(
                    error,
                    isEdit ? "Failed to update MCQ question." : "Failed to create MCQ question.",
                ),
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(isEdit ? `/mentor/questions/mcq/${questionId}` : "/mentor/questions/mcq");
    };

    if (subTopicsLoading || (isEdit && questionLoading)) {
        return (
            <div className="flex justify-center py-20">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-full px-6 py-6">
            <Breadcrumb
                items={[
                    { label: "Questions", onClick: () => navigate("/mentor/questions") },
                    { label: "MCQ Questions", onClick: () => navigate("/mentor/questions/mcq") },
                    { label: isEdit ? "Edit" : "Create" },
                ]}
            />

            <div className="mx-auto mt-6 max-w-3xl">
                <div className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-6">
                    <h1 className="text-xl font-bold text-[var(--cs-text)]">
                        {isEdit ? "Edit MCQ Question" : "Create MCQ Question"}
                    </h1>
                    <p className="mt-1 text-sm text-[var(--cs-text-muted)]">
                        {isEdit
                            ? "Update the MCQ question details."
                            : "Create the question first. Answer options can be added from the question details page."}
                    </p>

                    <div className="mt-6">
                        <McqQuestionForm
                            question={question}
                            subTopics={subTopics}
                            subTopicsLoading={subTopicsLoading}
                            submitting={submitting}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default McqQuestionFormPage;
