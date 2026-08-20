import {
    ArrowLeft,
    ChevronDown,
    Save,
    Search,
} from "lucide-react";
import {
    useMemo,
    useState,
} from "react";
import type { FormEvent } from "react";
import {
    useNavigate,
} from "react-router-dom";
import {
    useQuery,
} from "@tanstack/react-query";

import {
    createQuestion,
} from "../../../../../api/mentorQuestion.api.ts";

import {
    getMentorSubTopics,
} from "../../../../../api/mentorSubTopic.api.ts";

import Breadcrumb from "../../../../../shared/Breadcrumb";
import Button from "../../../../../shared/Button";

import {
    DifficultyLevel,
} from "../../../../../types/enums/difficulty-level.ts";

import {
    QuestionType,
} from "../../../../../types/enums/question-type.ts";

import type {
    CreateQuestionRequest,
} from "../../../../../types/question.types.ts";

import type {
    MentorSubTopic,
} from "../../../../../types/subTopic.types.ts";

import {
    getErrorMessage,
} from "../../../../../utils/error.utils.ts";

import {
    showToast,
} from "../../../../../utils/toast.tsx";

const MentorMcqCreatePage = () => {
    const navigate = useNavigate();

    // ============================================================
    // FORM STATE
    // ============================================================

    const [subTopicId, setSubTopicId] =
        useState("");

    const [title, setTitle] =
        useState("");

    const [slug, setSlug] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [mark, setMark] =
        useState("1");

    const [hint, setHint] =
        useState("");

    const [explanation, setExplanation] =
        useState("");

    const [difficulty, setDifficulty] =
        useState<DifficultyLevel>(
            DifficultyLevel.Beginner,
        );

    const [position, setPosition] =
        useState("1");

    const [imageUrl, setImageUrl] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    // ============================================================
    // SUB TOPIC DROPDOWN
    // ============================================================

    const [subTopicSearch, setSubTopicSearch] =
        useState("");

    const [
        subTopicDropdownOpen,
        setSubTopicDropdownOpen,
    ] = useState(false);

    const {
        data: subTopics = [],
        isLoading: subTopicsLoading,
        isError: subTopicsError,
    } = useQuery<MentorSubTopic[]>({
        queryKey: ["mentor-subtopics"],
        queryFn: () => getMentorSubTopics(),
    });

    const selectedSubTopic =
        useMemo<MentorSubTopic | null>(
            () =>
                subTopics.find(
                    (subTopic) =>
                        subTopic.id ===
                        Number(subTopicId),
                ) ?? null,
            [
                subTopics,
                subTopicId,
            ],
        );

    const filteredSubTopics =
        useMemo<MentorSubTopic[]>(
            () => {
                const search =
                    subTopicSearch
                        .trim()
                        .toLowerCase();

                if (!search) {
                    return subTopics;
                }

                return subTopics.filter(
                    (subTopic) =>
                        subTopic.title
                            .toLowerCase()
                            .includes(search) ||
                        subTopic.slug
                            .toLowerCase()
                            .includes(search),
                );
            },
            [
                subTopics,
                subTopicSearch,
            ],
        );

    const handleSubTopicSelect = (
        subTopic: MentorSubTopic,
    ) => {
        setSubTopicId(
            String(subTopic.id),
        );

        setSubTopicSearch("");

        setSubTopicDropdownOpen(false);
    };

    // ============================================================
    // TITLE / SLUG
    // ============================================================

    const handleTitleChange = (
        value: string,
    ) => {
        setTitle(value);

        setSlug(
            value
                .toLowerCase()
                .trim()
                .replace(
                    /[^a-z0-9\s-]/g,
                    "",
                )
                .replace(
                    /\s+/g,
                    "-",
                )
                .replace(
                    /-+/g,
                    "-",
                ),
        );
    };

    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        // Frontend validation
        if (!subTopicId) {
            showToast.error(
                "Please select a sub topic.",
            );
            return;
        }

        if (!title.trim()) {
            showToast.error(
                "Question title is required.",
            );
            return;
        }

        if (!slug.trim()) {
            showToast.error(
                "Question slug is required.",
            );
            return;
        }

        if (!description.trim()) {
            showToast.error(
                "Question description is required.",
            );
            return;
        }

        if (Number(mark) <= 0) {
            showToast.error(
                "Marks must be greater than 0.",
            );
            return;
        }

        if (Number(position) <= 0) {
            showToast.error(
                "Position must be greater than 0.",
            );
            return;
        }

        const request: CreateQuestionRequest = {
            subTopicId:
                Number(subTopicId),

            questionType:
            QuestionType.Mcq,

            title:
                title.trim(),

            slug:
                slug.trim(),

            description:
                description.trim(),

            imageUrl:
                imageUrl.trim() ||
                undefined,

            mark:
                Number(mark),

            hint:
                hint.trim(),

            explanation:
                explanation.trim(),

            difficulty,

            position:
                Number(position),
        };

        try {
            setSubmitting(true);

            await createQuestion(
                request,
            );

            showToast.success(
                "MCQ question created successfully.",
            );

            navigate(
                "/mentor/questions/mcq",
            );
        } catch (error) {
            const message =
                getErrorMessage(
                    error,
                    "Unable to create the MCQ question.",
                );

            showToast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="min-h-full px-6 py-6">

            <Breadcrumb
                items={[
                    {
                        label: "Questions",
                        onClick: () =>
                            navigate(
                                "/mentor/questions/mcq",
                            ),
                    },
                    {
                        label: "MCQ Questions",
                        onClick: () =>
                            navigate(
                                "/mentor/questions/mcq",
                            ),
                    },
                    {
                        label: "Create MCQ",
                    },
                ]}
            />

            <div className="mx-auto mt-6 max-w-4xl">

                {/* BACK */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/mentor/questions/mcq",
                        )
                    }
                    className="
                        mb-5
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        text-[var(--cs-text-muted)]
                        transition-colors
                        hover:text-[var(--cs-text)]
                    "
                >
                    <ArrowLeft size={17} />

                    Back to MCQ Questions
                </button>

                {/* CARD */}

                <section
                    className="
                        rounded-xl
                        border
                        border-[var(--cs-border)]
                        bg-[var(--cs-surface)]
                        p-6
                    "
                >
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--cs-text)]">
                            Create MCQ Question
                        </h1>

                        <p className="mt-1 text-sm text-[var(--cs-text-muted)]">
                            Create the question
                            first. Answer
                            options can be
                            added from the
                            question details
                            page.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-6"
                    >

                        {/* SUB TOPIC + POSITION */}

                        <div className="grid gap-5 sm:grid-cols-2">

                            {/* SUB TOPIC */}

                            <div className="relative z-50">

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-[var(--cs-text)]
                                    "
                                >
                                    Sub Topic
                                </label>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSubTopicDropdownOpen(
                                            (current) =>
                                                !current,
                                        )
                                    }
                                    disabled={
                                        subTopicsLoading
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        rounded-lg
                                        border
                                        border-[var(--cs-border)]
                                        bg-[var(--cs-surface-muted)]
                                        px-3
                                        py-2.5
                                        text-left
                                        text-sm
                                        outline-none
                                        transition-colors
                                        focus:border-[var(--cs-primary)]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                    aria-haspopup="listbox"
                                    aria-expanded={
                                        subTopicDropdownOpen
                                    }
                                >
                                    <span
                                        className={
                                            selectedSubTopic
                                                ? "truncate text-[var(--cs-text)]"
                                                : "text-[var(--cs-text-muted)]"
                                        }
                                    >
                                        {subTopicsLoading
                                            ? "Loading sub topics..."
                                            : selectedSubTopic
                                                ? selectedSubTopic.title
                                                : "Select a sub topic"}
                                    </span>

                                    <ChevronDown
                                        size={17}
                                        className={`
                                            ml-2
                                            shrink-0
                                            text-[var(--cs-text-muted)]
                                            transition-transform
                                            ${
                                            subTopicDropdownOpen
                                                ? "rotate-180"
                                                : ""
                                        }
                                        `}
                                    />
                                </button>

                                {subTopicDropdownOpen && (
                                    <div
                                        className="
                                            absolute
                                            left-0
                                            right-0
                                            top-full
                                            z-[9999]
                                            mt-2
                                            overflow-hidden
                                            rounded-lg
                                            border
                                            border-[#223A59]
                                            bg-[#0F1D31]
                                            shadow-2xl
                                        "
                                    >
                                        <div
                                            className="
                                                border-b
                                                border-[#223A59]
                                                bg-[#0F1D31]
                                                p-2
                                            "
                                        >
                                            <div className="relative">

                                                <Search
                                                    size={16}
                                                    className="
                                                        pointer-events-none
                                                        absolute
                                                        left-3
                                                        top-1/2
                                                        -translate-y-1/2
                                                        text-[#5C7394]
                                                    "
                                                />

                                                <input
                                                    type="text"
                                                    value={
                                                        subTopicSearch
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        setSubTopicSearch(
                                                            event.target.value,
                                                        )
                                                    }
                                                    autoFocus
                                                    placeholder="Search sub topics..."
                                                    className="
                                                        w-full
                                                        rounded-md
                                                        border
                                                        border-[#223A59]
                                                        bg-[#0A1930]
                                                        py-2
                                                        pl-9
                                                        pr-3
                                                        text-sm
                                                        text-white
                                                        outline-none
                                                        placeholder:text-[#5C7394]
                                                        focus:border-[#00E8C2]
                                                    "
                                                />

                                            </div>
                                        </div>

                                        <div
                                            className="
                                                max-h-64
                                                overflow-y-auto
                                                bg-[#0F1D31]
                                                py-1
                                            "
                                            role="listbox"
                                        >
                                            {subTopicsError ? (
                                                <div className="px-4 py-4 text-center text-sm text-red-400">
                                                    Unable to load
                                                    sub topics.
                                                </div>
                                            ) : filteredSubTopics.length ===
                                            0 ? (
                                                <div className="px-4 py-5 text-center text-sm text-[#8CA3BF]">
                                                    No sub topics
                                                    found.
                                                </div>
                                            ) : (
                                                filteredSubTopics.map(
                                                    (
                                                        subTopic,
                                                    ) => {
                                                        const selected =
                                                            Number(
                                                                subTopicId,
                                                            ) ===
                                                            subTopic.id;

                                                        return (
                                                            <button
                                                                key={
                                                                    subTopic.id
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSubTopicSelect(
                                                                        subTopic,
                                                                    )
                                                                }
                                                                className={`
                                                                    w-full
                                                                    px-3
                                                                    py-2.5
                                                                    text-left
                                                                    transition-colors
                                                                    ${
                                                                    selected
                                                                        ? "bg-[#00E8C2]/10 text-[#00E8C2]"
                                                                        : "text-white hover:bg-[#14243C]"
                                                                }
                                                                `}
                                                            >
                                                                <div className="truncate text-sm font-medium">
                                                                    {
                                                                        subTopic.title
                                                                    }
                                                                </div>

                                                                <div className="mt-0.5 truncate text-xs text-[#6F87A5]">
                                                                    {
                                                                        subTopic.slug
                                                                    }
                                                                </div>
                                                            </button>
                                                        );
                                                    },
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                <input
                                    type="hidden"
                                    value={subTopicId}
                                    required
                                />
                            </div>

                            {/* POSITION */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                                    Position
                                </label>

                                <input
                                    type="number"
                                    min={1}
                                    value={position}
                                    onChange={(event) =>
                                        setPosition(
                                            event.target.value,
                                        )
                                    }
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-[var(--cs-border)]
                                        bg-[var(--cs-surface-muted)]
                                        px-3
                                        py-2.5
                                        text-sm
                                        text-[var(--cs-text)]
                                        outline-none
                                        focus:border-[var(--cs-primary)]
                                    "
                                />
                            </div>
                        </div>

                        {/* TITLE */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                                Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    handleTitleChange(
                                        event.target.value,
                                    )
                                }
                                required
                                placeholder="Enter question title"
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-[var(--cs-border)]
                                    bg-[var(--cs-surface-muted)]
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-[var(--cs-text)]
                                    outline-none
                                    placeholder:text-[var(--cs-text-muted)]
                                    focus:border-[var(--cs-primary)]
                                "
                            />
                        </div>

                        {/* SLUG */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                                Slug
                            </label>

                            <input
                                type="text"
                                value={slug}
                                onChange={(event) =>
                                    setSlug(
                                        event.target.value,
                                    )
                                }
                                required
                                placeholder="question-slug"
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-[var(--cs-border)]
                                    bg-[var(--cs-surface-muted)]
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-[var(--cs-text)]
                                    outline-none
                                    placeholder:text-[var(--cs-text-muted)]
                                    focus:border-[var(--cs-primary)]
                                "
                            />
                        </div>

                        {/* DESCRIPTION */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value,
                                    )
                                }
                                required
                                rows={6}
                                placeholder="Explain the question..."
                                className="
                                    w-full
                                    resize-y
                                    rounded-lg
                                    border
                                    border-[var(--cs-border)]
                                    bg-[var(--cs-surface-muted)]
                                    px-3
                                    py-3
                                    text-sm
                                    text-[var(--cs-text)]
                                    outline-none
                                    placeholder:text-[var(--cs-text-muted)]
                                    focus:border-[var(--cs-primary)]
                                "
                            />
                        </div>

                        {/* MARK + DIFFICULTY */}

                        <div className="grid gap-5 sm:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                                    Marks
                                </label>

                                <input
                                    type="number"
                                    min={1}
                                    value={mark}
                                    onChange={(event) =>
                                        setMark(
                                            event.target.value,
                                        )
                                    }
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-[var(--cs-border)]
                                        bg-[var(--cs-surface-muted)]
                                        px-3
                                        py-2.5
                                        text-sm
                                        text-[var(--cs-text)]
                                        outline-none
                                        focus:border-[var(--cs-primary)]
                                    "
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                                    Difficulty
                                </label>

                                <select
                                    value={difficulty}
                                    onChange={(event) =>
                                        setDifficulty(
                                            Number(
                                                event.target.value,
                                            ) as DifficultyLevel,
                                        )
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-[var(--cs-border)]
                                        bg-[var(--cs-surface-muted)]
                                        px-3
                                        py-2.5
                                        text-sm
                                        text-[var(--cs-text)]
                                        outline-none
                                        focus:border-[var(--cs-primary)]
                                    "
                                >
                                    <option value={DifficultyLevel.Beginner}>
                                        Beginner
                                    </option>

                                    <option value={DifficultyLevel.Easy}>
                                        Easy
                                    </option>

                                    <option value={DifficultyLevel.Medium}>
                                        Medium
                                    </option>

                                    <option value={DifficultyLevel.Hard}>
                                        Hard
                                    </option>

                                    <option value={DifficultyLevel.Expert}>
                                        Expert
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* IMAGE URL */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                                Image URL
                            </label>

                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(event) =>
                                    setImageUrl(
                                        event.target.value,
                                    )
                                }
                                placeholder="https://..."
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-[var(--cs-border)]
                                    bg-[var(--cs-surface-muted)]
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-[var(--cs-text)]
                                    outline-none
                                    placeholder:text-[var(--cs-text-muted)]
                                    focus:border-[var(--cs-primary)]
                                "
                            />
                        </div>

                        {/* HINT */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                                Hint
                            </label>

                            <textarea
                                value={hint}
                                onChange={(event) =>
                                    setHint(
                                        event.target.value,
                                    )
                                }
                                rows={4}
                                placeholder="Optional hint..."
                                className="
                                    w-full
                                    resize-y
                                    rounded-lg
                                    border
                                    border-[var(--cs-border)]
                                    bg-[var(--cs-surface-muted)]
                                    px-3
                                    py-3
                                    text-sm
                                    text-[var(--cs-text)]
                                    outline-none
                                    placeholder:text-[var(--cs-text-muted)]
                                    focus:border-[var(--cs-primary)]
                                "
                            />
                        </div>

                        {/* EXPLANATION */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                                Explanation
                            </label>

                            <textarea
                                value={explanation}
                                onChange={(event) =>
                                    setExplanation(
                                        event.target.value,
                                    )
                                }
                                rows={5}
                                placeholder="Explain the correct answer..."
                                className="
                                    w-full
                                    resize-y
                                    rounded-lg
                                    border
                                    border-[var(--cs-border)]
                                    bg-[var(--cs-surface-muted)]
                                    px-3
                                    py-3
                                    text-sm
                                    text-[var(--cs-text)]
                                    outline-none
                                    placeholder:text-[var(--cs-text-muted)]
                                    focus:border-[var(--cs-primary)]
                                "
                            />
                        </div>

                        {/* ACTIONS */}

                        <div className="flex justify-end gap-3 border-t border-[var(--cs-border)] pt-5">

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() =>
                                    navigate(
                                        "/mentor/questions/mcq",
                                    )
                                }
                                disabled={submitting}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    submitting ||
                                    !subTopicId ||
                                    !title.trim() ||
                                    !slug.trim() ||
                                    !description.trim() ||
                                    Number(mark) <= 0 ||
                                    Number(position) <= 0
                                }
                            >
                                <span className="inline-flex items-center gap-2">
                                    <Save size={16} />

                                    {submitting
                                        ? "Creating..."
                                        : "Create MCQ"}
                                </span>
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default MentorMcqCreatePage;