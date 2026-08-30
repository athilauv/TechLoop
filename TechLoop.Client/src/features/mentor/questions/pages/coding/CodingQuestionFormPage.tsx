import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Breadcrumb from "../../../../../shared/Breadcrumb.tsx";
import LoadingSpinner from "../../../../../shared/LoadingSpinner.tsx";
import { createQuestion, getMentorQuestionBySlug, updateQuestion } from "../../../../../api/mentorQuestion.api.ts";
import { getMentorSubTopics } from "../../../../../api/mentorSubTopic.api.ts";
import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";
import type { CreateQuestionRequest, MentorQuestion, UpdateQuestionRequest } from "../../../../../types/question.types.ts";
import type { MentorSubTopic } from "../../../../../types/subTopic.types.ts";
import CodingQuestionForm from "../../components/coding/CodingQuestionForm.tsx";

const CodingQuestionFormPage = () => {
    const { slug } = useParams<{ slug?: string }>();
    const navigate = useNavigate();
    const isEdit = Boolean(slug?.trim());
    const { data: subTopics = [], isLoading: subTopicsLoading } = useQuery<MentorSubTopic[]>({
        queryKey: ["mentor-subtopics"],
        queryFn: () => getMentorSubTopics(),
    });

    const { data: question, isLoading: questionLoading } = useQuery<MentorQuestion>({
        queryKey: ["mentor-question", slug],
        queryFn: () => getMentorQuestionBySlug(slug as string),
        enabled: isEdit,
    });

    const questionId = question?.id;

    const handleSubmit = async (
        request: CreateQuestionRequest | UpdateQuestionRequest,
    ) => {
        try {
            if (isEdit) {
                if (!questionId) return;
                await updateQuestion(questionId, request as UpdateQuestionRequest);
                showToast.success("Coding question updated successfully.");
                navigate(`/mentor/questions/coding/${request.slug}`);
            } else {
                await createQuestion(request);
                showToast.success("Coding question created successfully.");
                navigate(`/mentor/questions/coding/${request.slug}`);
            }
        } catch (error) {
            showToast.error(getErrorMessage(error, isEdit ? "Failed to update coding question." : "Failed to create coding question.",),);
            throw error;
        }
    };

    const handleCancel = () => {
        navigate(
            isEdit && slug ? `/mentor/questions/coding/${slug}` : "/mentor/questions/coding",
        );
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
            <div className="flex items-center gap-3">
                <button type="button" onClick={handleCancel} aria-label="Back" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--cs-border)] text-[var(--cs-text-secondary)] transition hover:border-[var(--cs-accent-border)] hover:text-[var(--cs-accent)]">
                    <ArrowLeft size={15} />
                </button>
                <Breadcrumb items={[
                    { label: "Questions", onClick: () => navigate("/mentor/questions") },
                    { label: "Coding Questions", onClick: () => navigate("/mentor/questions/coding") },
                    { label: isEdit ? "Edit" : "Create" },
                ]} />
            </div>

            <div className="mx-auto mt-6 max-w-3xl">
                <div className="rounded-2xl bg-[var(--cs-surface)] p-6 ring-1 ring-inset ring-[var(--cs-border)]/60">
                    <h1 className="text-xl font-bold text-[var(--cs-text)]">
                        {isEdit ? "Edit Coding Question" : "Create Coding Question"}
                    </h1>

                    <div className="mt-6">
                        <CodingQuestionForm
                            question={question}
                            subTopics={subTopics}
                            subTopicsLoading={subTopicsLoading}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingQuestionFormPage;
