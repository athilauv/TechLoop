import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BookOpen } from "lucide-react";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { getMentorCurriculum } from "../../../../api/mentor.api.ts";
import {
    getMentorTopicById,
    createTopic,
    updateTopic,
    deleteTopic,
    publishTopic,
} from "../../../../api/mentorTopic.api.ts";
import {
    getMentorSubTopicById,
    createSubTopic,
    updateSubTopic,
    deleteSubTopic,
    publishSubTopic,
} from "../../../../api/mentorSubTopic.api.ts";
import type { MentorCurriculum } from "../../../../types/mentor.types.ts";
import type {
    MentorTopic,
    CreateTopicRequest,
    UpdateTopicRequest,
} from "../../../../types/topic.types.ts";
import type {
    MentorSubTopic,
    CreateSubTopicRequest,
    UpdateSubTopicRequest,
} from "../../../../types/subTopic.types.ts";
import { showToast } from "../../../../utils/toast.tsx";
import ContentTree from "../components/sidebar/ContentTree.tsx";
import MentorContentDetails from "../components/detail/MentorContentDetails.tsx";
import TopicForm from "../components/forms/TopicForm.tsx";
import SubTopicForm from "../components/forms/SubTopicForm.tsx";
import Button from "../../../../shared/Button.tsx";
import EmptyState from "../../../../shared/EmptyState.tsx";
import LoadingSpinner from "../../../../shared/LoadingSpinner.tsx";

type SelectedType = "topic" | "subtopic" | null;

type FormType =
    | "topic-create"
    | "topic-edit"
    | "subtopic-create"
    | "subtopic-edit"
    | null;

const isPositionConflict = (message: string): boolean =>
    /position.*(already exists|already occupied|exists)/i.test(message);

const confirmPositionShift = (
    message: string,
    noun: string
): Promise<boolean> =>
    new Promise((resolve) => {
        showToast.confirm(
            "Position already exists",
            `${message} Shift the existing ${noun} down?`,
            () => resolve(true),
            () => resolve(false),
            "Shift"
        );
    });

const confirmTopicDelete = (): Promise<boolean> =>
    new Promise((resolve) => {
        showToast.confirm(
            "Delete topic",
            "Are you sure you want to delete this topic?",
            () => resolve(true),
            () => resolve(false),
            "Delete"
        );
    });

const confirmSubTopicDelete = (): Promise<boolean> =>
    new Promise((resolve) => {
        showToast.confirm(
            "Delete subtopic",
            "Are you sure you want to delete this subtopic?",
            () => resolve(true),
            () => resolve(false),
            "Delete"
        );
    });

export default function MentorContentPage() {
    const queryClient = useQueryClient();

    const {
        data: curriculum,
        isLoading,
        isError,
    } = useQuery<MentorCurriculum>({
        queryKey: ["mentor-curriculum"],
        queryFn: getMentorCurriculum,
    });

    const [selectedType, setSelectedType] = useState<SelectedType>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<MentorTopic | null>(null);
    const [selectedSubTopic, setSelectedSubTopic] =
        useState<MentorSubTopic | null>(null);
    const [formType, setFormType] = useState<FormType>(null);

    const refreshCurriculum = async () => {
        await queryClient.invalidateQueries({
            queryKey: ["mentor-curriculum"],
        });
    };

    const resetSelection = () => {
        setSelectedType(null);
        setSelectedId(null);
        setSelectedTopic(null);
        setSelectedSubTopic(null);
        setFormType(null);
    };

    const handleSelectTopic = async (topicId: number) => {
        setSelectedType("topic");
        setSelectedId(topicId);
        setSelectedSubTopic(null);
        setFormType(null);

        try {
            const topic = await getMentorTopicById(topicId);
            setSelectedTopic(topic);
        } catch (error: unknown) {
            setSelectedTopic(null);
            toast.error(getErrorMessage(error, "Unable to load topic."));
        }
    };

    const handleSelectSubTopic = async (subTopicId: number) => {
        setSelectedType("subtopic");
        setSelectedId(subTopicId);
        setSelectedTopic(null);
        setFormType(null);

        try {
            const subTopic = await getMentorSubTopicById(subTopicId);
            setSelectedSubTopic(subTopic);
        } catch (error: unknown) {
            setSelectedSubTopic(null);
            toast.error(getErrorMessage(error, "Unable to load subtopic."));
        }
    };

    const handleCreateTopic = () => {
        setSelectedType(null);
        setSelectedId(null);
        setSelectedTopic(null);
        setSelectedSubTopic(null);
        setFormType("topic-create");
    };

    const handleTopicCreate = async (request: CreateTopicRequest) => {
        const submit = (shiftPositions: boolean) =>
            createTopic({ ...request, shiftPositions });

        const completeCreate = async (message: string) => {
            toast.success(message || "Topic created successfully.");
            await refreshCurriculum();
            setFormType(null);
        };

        try {
            const response = await submit(false);

            if (!response.success) {
                if (!isPositionConflict(response.message)) {
                    toast.error(response.message);
                    return;
                }

                const confirmed = await confirmPositionShift(response.message, "topics");
                if (!confirmed) return;

                const retryResponse = await submit(true);

                if (!retryResponse.success) {
                    toast.error(retryResponse.message);
                    return;
                }

                await completeCreate(retryResponse.message);
                return;
            }

            await completeCreate(response.message);
        } catch (error: unknown) {
            const message = getErrorMessage(error, "Unable to create topic.");

            if (!isPositionConflict(message)) {
                toast.error(message);
                return;
            }

            const confirmed = await confirmPositionShift(message, "topics");
            if (!confirmed) return;

            try {
                const retryResponse = await submit(true);

                if (!retryResponse.success) {
                    toast.error(retryResponse.message);
                    return;
                }

                await completeCreate(retryResponse.message);
            } catch (retryError: unknown) {
                toast.error(
                    getErrorMessage(retryError, "Unable to create topic.")
                );
            }
        }
    };

    const handleEditTopic = async (topicId: number) => {
        try {
            const topic = await getMentorTopicById(topicId);

            setSelectedType("topic");
            setSelectedId(topicId);
            setSelectedTopic(topic);
            setSelectedSubTopic(null);
            setFormType("topic-edit");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Unable to load topic."));
        }
    };

    const handleTopicUpdate = async (request: UpdateTopicRequest) => {
        if (selectedId === null) {
            toast.error("No topic selected.");
            return;
        }

        const topicId = selectedId;
        const submit = (shiftPositions: boolean) =>
            updateTopic(topicId, { ...request, shiftPositions });

        const completeUpdate = async (message: string) => {
            toast.success(message || "Topic updated successfully.");
            await refreshCurriculum();
            setFormType(null);
            await handleSelectTopic(topicId);
        };

        try {
            const response = await submit(false);

            if (!response.success) {
                if (!isPositionConflict(response.message)) {
                    toast.error(response.message);
                    return;
                }

                const confirmed = await confirmPositionShift(response.message, "topics");
                if (!confirmed) return;

                const retryResponse = await submit(true);

                if (!retryResponse.success) {
                    toast.error(retryResponse.message);
                    return;
                }

                await completeUpdate(retryResponse.message);
                return;
            }

            await completeUpdate(response.message);
        } catch (error: unknown) {
            const message = getErrorMessage(error, "Unable to update topic.");

            if (!isPositionConflict(message)) {
                toast.error(message);
                return;
            }

            const confirmed = await confirmPositionShift(message, "topics");
            if (!confirmed) return;

            try {
                const retryResponse = await submit(true);

                if (!retryResponse.success) {
                    toast.error(retryResponse.message);
                    return;
                }

                await completeUpdate(retryResponse.message);
            } catch (retryError: unknown) {
                toast.error(
                    getErrorMessage(retryError, "Unable to update topic.")
                );
            }
        }
    };

    const handleDeleteTopic = async (topicId: number) => {
        const confirmed = await confirmTopicDelete();
        if (!confirmed) return;

        try {
            const response = await deleteTopic(topicId);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message || "Topic deleted successfully.");
            await refreshCurriculum();
            resetSelection();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Unable to delete topic."));
        }
    };

    const handlePublishTopic = async (topicId: number) => {
        try {
            const response = await publishTopic(topicId);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message || "Topic published successfully.");
            await refreshCurriculum();
            await handleSelectTopic(topicId);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Unable to publish topic."));
        }
    };

    const handleCreateSubTopic = (topicId: number) => {
        setSelectedType("topic");
        setSelectedId(topicId);
        setSelectedSubTopic(null);
        setFormType("subtopic-create");
    };

    const handleSubTopicCreate = async (request: CreateSubTopicRequest) => {
        const submit = (shiftPositions: boolean) =>
            createSubTopic({ ...request, shiftPositions });

        const completeCreate = async (message: string) => {
            toast.success(message || "SubTopic created successfully.");
            await refreshCurriculum();
            setFormType(null);

            if (selectedId !== null) {
                await handleSelectTopic(selectedId);
            }
        };

        try {
            const response = await submit(false);

            if (!response.success) {
                if (!isPositionConflict(response.message)) {
                    toast.error(response.message);
                    return;
                }

                const confirmed = await confirmPositionShift(response.message, "subtopics");
                if (!confirmed) return;

                const retryResponse = await submit(true);

                if (!retryResponse.success) {
                    toast.error(retryResponse.message);
                    return;
                }

                await completeCreate(retryResponse.message);
                return;
            }

            await completeCreate(response.message);
        } catch (error: unknown) {
            const message = getErrorMessage(error, "Unable to create subtopic.");

            if (!isPositionConflict(message)) {
                toast.error(message);
                return;
            }

            const confirmed = await confirmPositionShift(message, "subtopics");
            if (!confirmed) return;

            try {
                const retryResponse = await submit(true);

                if (!retryResponse.success) {
                    toast.error(retryResponse.message);
                    return;
                }

                await completeCreate(retryResponse.message);
            } catch (retryError: unknown) {
                toast.error(
                    getErrorMessage(retryError, "Unable to create subtopic.")
                );
            }
        }
    };

    const handleEditSubTopic = async (subTopicId: number) => {
        try {
            const subTopic = await getMentorSubTopicById(subTopicId);

            setSelectedType("subtopic");
            setSelectedId(subTopicId);
            setSelectedTopic(null);
            setSelectedSubTopic(subTopic);
            setFormType("subtopic-edit");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Unable to load subtopic."));
        }
    };

    const handleSubTopicUpdate = async (request: UpdateSubTopicRequest) => {
        if (selectedId === null) {
            toast.error("No subtopic selected.");
            return;
        }

        const subTopicId = selectedId;
        const submit = (shiftPositions: boolean) =>
            updateSubTopic(subTopicId, { ...request, shiftPositions });

        const completeUpdate = async (message: string) => {
            toast.success(message || "SubTopic updated successfully.");
            await refreshCurriculum();
            setFormType(null);
            await handleSelectSubTopic(subTopicId);
        };

        try {
            const response = await submit(false);

            if (!response.success) {
                if (!isPositionConflict(response.message)) {
                    toast.error(response.message);
                    return;
                }

                const confirmed = await confirmPositionShift(response.message, "subtopics");
                if (!confirmed) return;

                const retryResponse = await submit(true);

                if (!retryResponse.success) {
                    toast.error(retryResponse.message);
                    return;
                }

                await completeUpdate(retryResponse.message);
                return;
            }

            await completeUpdate(response.message);
        } catch (error: unknown) {
            const message = getErrorMessage(error, "Unable to update subtopic.");

            if (!isPositionConflict(message)) {
                toast.error(message);
                return;
            }

            const confirmed = await confirmPositionShift(message, "subtopics");
            if (!confirmed) return;

            try {
                const retryResponse = await submit(true);

                if (!retryResponse.success) {
                    toast.error(retryResponse.message);
                    return;
                }

                await completeUpdate(retryResponse.message);
            } catch (retryError: unknown) {
                toast.error(
                    getErrorMessage(retryError, "Unable to update subtopic.")
                );
            }
        }
    };

    const handleDeleteSubTopic = async (subTopicId: number) => {
        const confirmed = await confirmSubTopicDelete();
        if (!confirmed) return;

        try {
            const response = await deleteSubTopic(subTopicId);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message || "SubTopic deleted successfully.");
            await refreshCurriculum();
            resetSelection();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Unable to delete subtopic."));
        }
    };

    const handlePublishSubTopic = async (subTopicId: number) => {
        try {
            const response = await publishSubTopic(subTopicId);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message || "SubTopic published successfully.");

            await refreshCurriculum();
            await handleSelectSubTopic(subTopicId);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Unable to publish subtopic."));
        }
    };

    const handleCloseForm = () => setFormType(null);

    if (isLoading) {
        return (
            <div className="content-studio-theme flex min-h-full items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError || !curriculum) {
        return (
            <div className="content-studio-theme flex min-h-full items-center justify-center">
                <div className="text-center">
                    <p className="text-[var(--cs-danger)]">
                        Unable to load mentor curriculum.
                    </p>
                    <p className="mt-2 text-sm text-[var(--cs-text-muted)]">
                        Please refresh and try again.
                    </p>
                </div>
            </div>
        );
    }

    const currentTopicId =
        selectedType === "topic" ? selectedId : selectedSubTopic?.topicId ?? null;

    return (
        <div
            className="content-studio-theme flex w-full overflow-hidden"
            style={{ height: "100dvh" }}
        >
            <div className="flex h-full w-[280px] shrink-0 flex-col overflow-hidden border-r border-[var(--cs-border)]">
                <ContentTree
                    selectedType={selectedType}
                    selectedId={selectedId}
                    onCreateTopic={handleCreateTopic}
                    onSelectTopic={handleSelectTopic}
                    onSelectSubTopic={handleSelectSubTopic}
                    onCreateSubTopic={handleCreateSubTopic}
                    onEditSubTopic={handleEditSubTopic}
                />
            </div>

            <main className="cs-scroll h-full min-w-0 flex-1 flex-col overflow-y-auto">
                {!selectedType && !formType && (
                    <EmptyState
                        icon={<BookOpen size={22} />}
                        title="Content Studio"
                        description="Select a topic or subtopic from the curriculum to manage its content."
                        action={
                            <Button variant="primary" onClick={handleCreateTopic}>
                                Create Topic
                            </Button>
                        }
                    />
                )}

                {selectedType && selectedId !== null && !formType && (
                    <MentorContentDetails
                        selectedType={selectedType}
                        topic={selectedTopic}
                        subTopic={selectedSubTopic}
                        onEditTopic={handleEditTopic}
                        onEditSubTopic={handleEditSubTopic}
                        onCreateSubTopic={handleCreateSubTopic}
                        onDeleteTopic={handleDeleteTopic}
                        onDeleteSubTopic={handleDeleteSubTopic}
                        onPublishTopic={handlePublishTopic}
                        onPublishSubTopic={handlePublishSubTopic}
                    />
                )}

                {formType === "topic-create" && (
                    <div className="mx-auto max-w-4xl p-8">
                        <TopicForm
                            mode="create"
                            technologyId={curriculum.technologyId}
                            onSubmit={handleTopicCreate}
                            onClose={handleCloseForm}
                        />
                    </div>
                )}

                {formType === "topic-edit" && selectedTopic && (
                    <div className="mx-auto max-w-4xl p-8">
                        <TopicForm
                            mode="edit"
                            technologyId={curriculum.technologyId}
                            topic={selectedTopic}
                            onSubmit={handleTopicUpdate}
                            onClose={handleCloseForm}
                        />
                    </div>
                )}

                {formType === "subtopic-create" && currentTopicId !== null && (
                    <div className="mx-auto max-w-4xl p-8">
                        <SubTopicForm
                            mode="create"
                            topicId={currentTopicId}
                            onSubmit={handleSubTopicCreate}
                            onClose={handleCloseForm}
                        />
                    </div>
                )}

                {formType === "subtopic-edit" && selectedSubTopic && (
                    <div className="mx-auto max-w-4xl p-8">
                        <SubTopicForm
                            mode="edit"
                            subTopic={selectedSubTopic}
                            onSubmit={handleSubTopicUpdate}
                            onClose={handleCloseForm}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}