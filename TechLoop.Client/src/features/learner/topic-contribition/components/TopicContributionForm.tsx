import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    GitCommitVertical,
    Loader2,
    Search,
    UploadCloud,
    X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";

import { createTopicContribution } from "../../../../api/topicContribution.api.ts";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { getTechnologies } from "../../../../api/technology.api.ts";
import { getCurriculum } from "../../../../api/curriculum.api.ts";
import type { LearnerTechnology } from "../../../../types/technology.types.ts";
import type {
    CurriculumTopic,
    CurriculumSubTopic,
} from "../../../../types/curriculum.types.ts";
import type { CreateTopicContributionRequest } from "../../../../types/topicContribution.types.ts";
import { ExampleType } from "../../../../types/enums/example-type.ts";
import CustomSelect from "../../../../shared/Customselect.tsx";

interface FormState {
    technologyId: number | null;
    topicId: number | null;
    subTopicId: number | null;
    title: string;
    description: string;
    example: string;
    exampleType: string;
    referenceUrl: string;
}

type SelectorType = "technology" | "topic" | "subTopic" | null;

const initialState: FormState = {
    technologyId: null,
    topicId: null,
    subTopicId: null,
    title: "",
    description: "",
    example: "",
    exampleType: "",
    referenceUrl: "",
};

// Which wizard step a validation error belongs to, so a failed submit can
// jump the learner straight back to the step that needs attention.
const FIELD_STEP: Record<string, number> = {
    technologyId: 0,
    topicId: 0,
    subTopicId: 0,
    title: 1,
    description: 1,
    exampleType: 1,
    referenceUrl: 1,
};

const STEPS = [
    { label: "Stage", description: "Pick where this lands in the curriculum", icon: GitCommitVertical },
    { label: "Compose", description: "Write the contribution itself", icon: Check },
    { label: "Push", description: "Review and submit for mentor review", icon: UploadCloud },
];

export default function TopicContributionForm() {
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [form, setForm] = useState<FormState>(initialState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [activeSelector, setActiveSelector] = useState<SelectorType>(null);
    const [technologySearch, setTechnologySearch] = useState("");
    const [topicSearch, setTopicSearch] = useState("");
    const [subTopicSearch, setSubTopicSearch] = useState("");

    const {
        data: technologies = [],
        isLoading: isTechnologiesLoading,
        isError: isTechnologiesError,
    } = useQuery({
        queryKey: ["learner-technologies"],
        queryFn: getTechnologies,
    });

    const {
        data: curriculum,
        isLoading: isCurriculumLoading,
        isError: isCurriculumError,
    } = useQuery({
        queryKey: ["learner-curriculum", form.technologyId],
        queryFn: () => getCurriculum(form.technologyId as number),
        enabled: form.technologyId !== null,
    });

    const filteredTechnologies = useMemo(() => {
        const search = technologySearch.trim().toLowerCase();
        if (!search) {
            return technologies;
        }
        return technologies.filter((technology) =>
            technology.name.toLowerCase().includes(search)
        );
    }, [technologies, technologySearch]);

    const filteredTopics = useMemo<CurriculumTopic[]>(() => {
        const topics = curriculum?.topics ?? [];
        const search = topicSearch.trim().toLowerCase();

        if (!search) {
            return topics;
        }

        return topics.filter((topic) => topic.title.toLowerCase().includes(search));
    }, [curriculum, topicSearch]);

    const selectedTopic = useMemo(() => {
        if (form.topicId === null) {
            return null;
        }
        return curriculum?.topics.find((topic) => topic.id === form.topicId) ?? null;
    }, [curriculum, form.topicId]);

    const filteredSubTopics = useMemo<CurriculumSubTopic[]>(() => {
        const subTopics = selectedTopic?.subTopics ?? [];
        const search = subTopicSearch.trim().toLowerCase();

        if (!search) {
            return subTopics;
        }

        return subTopics.filter((subTopic) =>
            subTopic.title.toLowerCase().includes(search)
        );
    }, [selectedTopic, subTopicSearch]);

    useEffect(() => {
        const handleClickOutside = () => {
            setActiveSelector(null);
        };

        if (activeSelector !== null) {
            document.addEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [activeSelector]);

    const mutation = useMutation({
        mutationFn: createTopicContribution,

        onSuccess: () => {
            toast.success("Contribution submitted successfully.");
            navigate("/learner/topic-contributions");
        },

        onError: (error) => {
            toast.error(
                getErrorMessage(error, "Unable to submit contribution."),
            );
        },
    });

    const updateField = (field: keyof FormState, value: string | number | null) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: "",
        }));
    };

    const handleTechnologySelect = (technology: LearnerTechnology) => {
        setForm((current) => ({
            ...current,
            technologyId: technology.id,
            topicId: null,
            subTopicId: null,
        }));

        setTechnologySearch("");
        setTopicSearch("");
        setSubTopicSearch("");
        setErrors((current) => ({
            ...current,
            technologyId: "",
            topicId: "",
            subTopicId: "",
        }));
        setActiveSelector(null);
    };

    const handleTopicSelect = (topic: CurriculumTopic) => {
        setForm((current) => ({
            ...current,
            topicId: topic.id,
            subTopicId: null,
        }));
        setTopicSearch("");
        setSubTopicSearch("");
        setErrors((current) => ({
            ...current,
            topicId: "",
            subTopicId: "",
        }));
        setActiveSelector(null);
    };

    const handleSubTopicSelect = (subTopic: CurriculumSubTopic) => {
        setForm((current) => ({
            ...current,
            subTopicId: subTopic.id,
        }));

        setSubTopicSearch("");

        setErrors((current) => ({
            ...current,
            subTopicId: "",
        }));

        setActiveSelector(null);
    };

    // Returns the computed errors object (and also persists it to state),
    // so callers can synchronously decide what to do next — e.g. jump to
    // the wizard step that contains the first invalid field.
    const validate = (): Record<string, string> => {
        const nextErrors: Record<string, string> = {};

        if (form.technologyId === null || form.technologyId <= 0) {
            nextErrors.technologyId = "Please select a technology.";
        }

        if (form.subTopicId !== null && form.topicId === null) {
            nextErrors.subTopicId = "Please select a topic first.";
        }

        if (!form.title.trim()) {
            nextErrors.title = "Title is required.";
        }

        if (!form.description.trim()) {
            nextErrors.description = "Description is required.";
        }

        if (form.exampleType.trim()) {
            const exampleType = Number(form.exampleType);

            if (!Number.isInteger(exampleType)) {
                nextErrors.exampleType = "Example type must be a valid number.";
            }
        }

        if (form.referenceUrl.trim()) {
            try {
                new URL(form.referenceUrl.trim());
            } catch {
                nextErrors.referenceUrl = "Enter a valid reference URL.";
            }
        }

        setErrors(nextErrors);

        return nextErrors;
    };

    const handleSubmit = () => {
        const nextErrors = validate();

        if (Object.keys(nextErrors).length > 0) {
            const firstErrorField = Object.keys(nextErrors)[0];
            setStep(FIELD_STEP[firstErrorField] ?? 0);
            return;
        }

        const request: CreateTopicContributionRequest = {
            technologyId: form.technologyId!,
            topicId: form.topicId,
            subTopicId: form.subTopicId,
            title: form.title.trim(),
            description: form.description.trim(),
            example: form.example.trim() ? form.example.trim() : null,
            exampleType: form.exampleType.trim() ? Number(form.exampleType) : null,
            referenceUrl: form.referenceUrl.trim() ? form.referenceUrl.trim() : null,
        };
        mutation.mutate(request);
    };

    const selectedTechnology =
        technologies.find((technology) => technology.id === form.technologyId) ?? null;

    const selectedSubTopic =
        selectedTopic?.subTopics.find((subTopic) => subTopic.id === form.subTopicId) ?? null;

    const exampleTypeLabel = (value: string) => {
        const labels: Record<string, string> = {
            [String(ExampleType.Text)]: "Text",
            [String(ExampleType.Code)]: "Code",
            [String(ExampleType.Link)]: "Link",
            [String(ExampleType.Image)]: "Image",
            [String(ExampleType.Video)]: "Video",
            [String(ExampleType.Pdf)]: "PDF",
        };
        return labels[value] ?? null;
    };

    const renderSelector = (type: "technology" | "topic" | "subTopic") => {
        const isOpen = activeSelector === type;
        const disabled =
            type === "topic"
                ? form.technologyId === null
                : type === "subTopic"
                    ? form.topicId === null
                    : false;

        let label = "";
        let placeholder = "";
        let search = "";
        let setSearch: ((value: string) => void) | undefined;

        if (type === "technology") {
            label = selectedTechnology ? selectedTechnology.name : "Select technology";
            placeholder = "Search technologies...";
            search = technologySearch;
            setSearch = setTechnologySearch;
        }

        if (type === "topic") {
            label = selectedTopic ? selectedTopic.title : "Select topic";
            placeholder = "Search topics...";
            search = topicSearch;
            setSearch = setTopicSearch;
        }

        if (type === "subTopic") {
            label = selectedSubTopic ? selectedSubTopic.title : "Select subtopic";
            placeholder = "Search subtopics...";
            search = subTopicSearch;
            setSearch = setSubTopicSearch;
        }

        return (
            <div className="relative" onClick={(event) => event.stopPropagation()}>
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setActiveSelector(isOpen ? null : type)}
                    className={`flex w-full items-center justify-between rounded-[var(--cs-radius-control)] border px-3 py-2.5 text-left text-sm outline-none transition ${
                        disabled
                            ? "cursor-not-allowed border-[var(--cs-border)] bg-[var(--cs-bg-page)] text-[var(--cs-text-muted)]"
                            : "border-[var(--cs-border)] bg-[var(--cs-bg-input)] text-[var(--cs-text-secondary)] hover:border-[var(--cs-accent-border)] focus:border-[var(--cs-accent)] focus:ring-2 focus:ring-[var(--cs-accent)]/25"
                    }`}
                >
                    <span className={label.startsWith("Select ") ? "text-[var(--cs-text-muted)]" : "text-[var(--cs-text-primary)]"}>
                        {label}
                    </span>

                    <ChevronDown
                        size={17}
                        className={`text-[var(--cs-text-secondary)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {isOpen && !disabled && (
                    <div
                        className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-[var(--cs-radius-control)] border border-[var(--cs-accent-border)] bg-[var(--cs-bg-card-raised)] shadow-xl shadow-black/30"
                        onClick={(event) => event.stopPropagation()}>
                        {/* Search */}
                        <div className="sticky top-0 z-10 border-b border-[var(--cs-border)] bg-[var(--cs-bg-card-raised)] p-2.5">
                            <div className="flex items-center gap-2 rounded-[var(--cs-radius-control)] border border-[var(--cs-border)] bg-[var(--cs-bg-input)] px-3 transition focus-within:border-[var(--cs-accent-border)]">
                                <Search size={16} className="shrink-0 text-[var(--cs-text-muted)]" />

                                <input
                                    autoFocus
                                    value={search}
                                    onChange={(event) => setSearch?.(event.target.value)}
                                    placeholder={placeholder}
                                    className="w-full bg-transparent py-2 text-sm text-[var(--cs-text-primary)] placeholder:text-[var(--cs-text-muted)] outline-none"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch?.("")}
                                        className="text-[var(--cs-text-muted)] hover:text-[var(--cs-text-primary)]"
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-56 overflow-y-auto overscroll-contain p-1.5">
                            {type === "technology" && isTechnologiesLoading && (
                                <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-[var(--cs-text-secondary)]">
                                    <Loader2 size={16} className="animate-spin" />
                                    Loading technologies...
                                </div>
                            )}

                            {type === "technology" && isTechnologiesError && (
                                <div className="px-4 py-6 text-center text-sm text-[var(--cs-danger)]">
                                    Unable to load technologies.
                                </div>
                            )}

                            {type === "topic" && isCurriculumLoading && (
                                <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-[var(--cs-text-secondary)]">
                                    <Loader2 size={16} className="animate-spin" />
                                    Loading topics...
                                </div>
                            )}

                            {type === "topic" && isCurriculumError && (
                                <div className="px-4 py-6 text-center text-sm text-[var(--cs-danger)]">
                                    Unable to load topics.
                                </div>
                            )}

                            {type === "technology" &&
                                !isTechnologiesLoading &&
                                !isTechnologiesError &&
                                filteredTechnologies.length === 0 && (
                                    <div className="px-4 py-6 text-center text-sm text-[var(--cs-text-secondary)]">
                                        No technologies found.
                                    </div>
                                )}

                            {type === "topic" &&
                                !isCurriculumLoading &&
                                !isCurriculumError &&
                                filteredTopics.length === 0 && (
                                    <div className="px-4 py-6 text-center text-sm text-[var(--cs-text-secondary)]">
                                        No topics found.
                                    </div>
                                )}

                            {type === "subTopic" && filteredSubTopics.length === 0 && (
                                <div className="px-4 py-6 text-center text-sm text-[var(--cs-text-secondary)]">
                                    No subtopics found.
                                </div>
                            )}

                            {type === "technology" &&
                                filteredTechnologies.map((technology) => (
                                    <button
                                        key={technology.id}
                                        type="button"
                                        onClick={() => handleTechnologySelect(technology)}
                                        className="flex w-full items-center justify-between rounded-[var(--cs-radius-control)] px-3 py-2.5 text-left text-sm transition hover:bg-[var(--cs-accent-subtle)]"
                                    >
                                        <div>
                                            <p className="font-medium text-[var(--cs-text-primary)]">
                                                {technology.name}
                                            </p>
                                            <p className="mt-0.5 font-[var(--cs-font-mono)] text-[11px] text-[var(--cs-text-muted)]">
                                                {technology.slug}
                                            </p>
                                        </div>
                                        {form.technologyId === technology.id && (
                                            <Check size={16} className="text-[var(--cs-accent)]" />
                                        )}
                                    </button>
                                ))}

                            {type === "topic" &&
                                filteredTopics.map((topic) => (
                                    <button
                                        key={topic.id}
                                        type="button"
                                        onClick={() => handleTopicSelect(topic)}
                                        className="flex w-full items-center justify-between rounded-[var(--cs-radius-control)] px-3 py-2.5 text-left text-sm transition hover:bg-[var(--cs-accent-subtle)]"
                                    >
                                        <div>
                                            <p className="font-medium text-[var(--cs-text-primary)]">
                                                {topic.title}
                                            </p>
                                            <p className="mt-0.5 text-xs text-[var(--cs-text-muted)]">
                                                {topic.subTopics.length} subtopics
                                            </p>
                                        </div>
                                        {form.topicId === topic.id && (
                                            <Check size={16} className="text-[var(--cs-accent)]" />
                                        )}
                                    </button>
                                ))}

                            {type === "subTopic" &&
                                filteredSubTopics.map((subTopic) => (
                                    <button
                                        key={subTopic.id}
                                        type="button"
                                        onClick={() => handleSubTopicSelect(subTopic)}
                                        className="flex w-full items-center justify-between rounded-[var(--cs-radius-control)] px-3 py-2.5 text-left text-sm transition hover:bg-[var(--cs-accent-subtle)]"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-[var(--cs-text-primary)]">
                                                {subTopic.title}
                                            </p>
                                        </div>
                                        {form.subTopicId === subTopic.id && (
                                            <Check size={16} className="text-[var(--cs-accent)]" />
                                        )}
                                    </button>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const canAdvanceFromStage = form.technologyId !== null;

    return (
        <div className="rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)]">
            {/* Wizard rail */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-[var(--cs-border)] px-6 py-5">
                {STEPS.map((entry, index) => {
                    const StepIcon = entry.icon;
                    const isActive = index === step;
                    const isDone = index < step;

                    return (
                        <div key={entry.label} className="flex shrink-0 items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (index === 0 || (index === 1 && canAdvanceFromStage) || isDone) {
                                        setStep(index);
                                    }
                                }}
                                className={`flex items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 text-sm font-medium transition ${
                                    isActive
                                        ? "border-[var(--cs-accent-border)] bg-[var(--cs-accent-subtle)] text-[var(--cs-accent)]"
                                        : isDone
                                            ? "border-[var(--cs-border)] text-[var(--cs-text-secondary)] hover:border-[var(--cs-accent-border)] hover:text-[var(--cs-accent)]"
                                            : "border-[var(--cs-border)] text-[var(--cs-text-muted)]"
                                }`}
                            >
                                <span
                                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                                        isActive || isDone
                                            ? "bg-[var(--cs-accent)] text-[var(--cs-accent-on)]"
                                            : "bg-[var(--cs-bg-input)] text-[var(--cs-text-muted)]"
                                    }`}
                                >
                                    {isDone ? <Check size={13} /> : <StepIcon size={13} />}
                                </span>
                                {entry.label}
                            </button>

                            {index < STEPS.length - 1 && (
                                <span className="h-px w-8 shrink-0 bg-[var(--cs-border)]" />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="px-6 py-6">
                <p className="text-xs text-[var(--cs-text-muted)]">{STEPS[step].description}</p>

                {/* STEP 0 — Stage */}
                {step === 0 && (
                    <div className="mt-5 space-y-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--cs-text-secondary)]">
                                Technology
                            </label>
                            {renderSelector("technology")}
                            {errors.technologyId && (
                                <p className="mt-1 text-xs text-[var(--cs-danger)]">{errors.technologyId}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--cs-text-secondary)]">
                                Topic
                                <span className="ml-1 font-normal text-[var(--cs-text-muted)]">(Optional)</span>
                            </label>
                            {renderSelector("topic")}
                            {form.technologyId === null && (
                                <p className="mt-1 text-xs text-[var(--cs-text-muted)]">
                                    Select a technology first.
                                </p>
                            )}
                            {errors.topicId && (
                                <p className="mt-1 text-xs text-[var(--cs-danger)]">{errors.topicId}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--cs-text-secondary)]">
                                SubTopic
                                <span className="ml-1 font-normal text-[var(--cs-text-muted)]">(Optional)</span>
                            </label>
                            {renderSelector("subTopic")}
                            {form.topicId === null && (
                                <p className="mt-1 text-xs text-[var(--cs-text-muted)]">Select a topic first.</p>
                            )}
                            {errors.subTopicId && (
                                <p className="mt-1 text-xs text-[var(--cs-danger)]">{errors.subTopicId}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 1 — Compose */}
                {step === 1 && (
                    <div className="mt-5 space-y-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--cs-text-secondary)]">
                                Title
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(event) => updateField("title", event.target.value)}
                                placeholder="Contribution title"
                                className="w-full rounded-[var(--cs-radius-control)] border border-[var(--cs-border)] bg-[var(--cs-bg-input)] px-3 py-2.5 text-sm text-[var(--cs-text-primary)] placeholder:text-[var(--cs-text-muted)] outline-none transition focus:border-[var(--cs-accent)] focus:ring-2 focus:ring-[var(--cs-accent)]/25"
                            />
                            {errors.title && <p className="mt-1 text-xs text-[var(--cs-danger)]">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--cs-text-secondary)]">
                                Description
                            </label>
                            <textarea
                                rows={5}
                                value={form.description}
                                onChange={(event) => updateField("description", event.target.value)}
                                placeholder="Explain your contribution..."
                                className="w-full resize-y rounded-[var(--cs-radius-control)] border border-[var(--cs-border)] bg-[var(--cs-bg-input)] px-3 py-2.5 text-sm text-[var(--cs-text-primary)] placeholder:text-[var(--cs-text-muted)] outline-none transition focus:border-[var(--cs-accent)] focus:ring-2 focus:ring-[var(--cs-accent)]/25"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-[var(--cs-danger)]">{errors.description}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--cs-text-secondary)]">
                                Example
                                <span className="ml-1 font-normal text-[var(--cs-text-muted)]">(Optional)</span>
                            </label>
                            <textarea
                                rows={6}
                                value={form.example}
                                onChange={(event) => updateField("example", event.target.value)}
                                placeholder="Optional example or code"
                                className="w-full resize-y rounded-[var(--cs-radius-control)] border border-[var(--cs-border)] bg-[var(--cs-bg-input)] px-3 py-2.5 font-[var(--cs-font-mono)] text-sm text-[var(--cs-text-primary)] placeholder:text-[var(--cs-text-muted)] outline-none transition focus:border-[var(--cs-accent)] focus:ring-2 focus:ring-[var(--cs-accent)]/25"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--cs-text-secondary)]">
                                    Example Type
                                    <span className="ml-1 font-normal text-[var(--cs-text-muted)]">(Optional)</span>
                                </label>

                                <CustomSelect
                                    value={form.exampleType}
                                    onChange={(value: string) => updateField("exampleType", value)}
                                    options={[
                                        { value: "", label: "Select example type" },
                                        { value: String(ExampleType.Text), label: "Text" },
                                        { value: String(ExampleType.Code), label: "Code" },
                                        { value: String(ExampleType.Link), label: "Link" },
                                        { value: String(ExampleType.Image), label: "Image" },
                                        { value: String(ExampleType.Video), label: "Video" },
                                        { value: String(ExampleType.Pdf), label: "PDF" },
                                    ]}/>

                                {errors.exampleType && (
                                    <p className="mt-1 text-xs text-[var(--cs-danger)]">{errors.exampleType}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--cs-text-secondary)]">
                                    Reference URL
                                    <span className="ml-1 font-normal text-[var(--cs-text-muted)]">(Optional)</span>
                                </label>
                                <input
                                    type="url"
                                    value={form.referenceUrl}
                                    onChange={(event) => updateField("referenceUrl", event.target.value)}
                                    placeholder="https://..."
                                    className="w-full rounded-[var(--cs-radius-control)] border border-[var(--cs-border)] bg-[var(--cs-bg-input)] px-3 py-2.5 text-sm text-[var(--cs-text-primary)] placeholder:text-[var(--cs-text-muted)] outline-none transition focus:border-[var(--cs-accent)] focus:ring-2 focus:ring-[var(--cs-accent)]/25"
                                />
                                {errors.referenceUrl && (
                                    <p className="mt-1 text-xs text-[var(--cs-danger)]">{errors.referenceUrl}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2 — Push (review) */}
                {step === 2 && (
                    <div className="mt-5 space-y-5">
                        <div className="rounded-[var(--cs-radius-control)] border border-[var(--cs-border)] bg-[var(--cs-bg-input)] p-4">
                            <p className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                                target
                            </p>
                            <p className="mt-1.5 text-sm text-[var(--cs-text-primary)]">
                                {selectedTechnology?.name ?? "—"}
                                {selectedTopic && <span className="text-[var(--cs-text-muted)]"> / {selectedTopic.title}</span>}
                                {selectedSubTopic && (
                                    <span className="text-[var(--cs-text-muted)]"> / {selectedSubTopic.title}</span>
                                )}
                            </p>
                        </div>

                        <div className="rounded-[var(--cs-radius-control)] border border-[var(--cs-border)] bg-[var(--cs-bg-input)] p-4">
                            <p className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                                title
                            </p>
                            <p className="mt-1.5 text-sm text-[var(--cs-text-primary)]">
                                {form.title || "—"}
                            </p>
                        </div>

                        <div className="rounded-[var(--cs-radius-control)] border border-[var(--cs-border)] bg-[var(--cs-bg-input)] p-4">
                            <p className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                                description
                            </p>
                            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-[var(--cs-text-secondary)]">
                                {form.description || "—"}
                            </p>
                        </div>

                        {form.example && (
                            <div className="rounded-[var(--cs-radius-control)] border border-[var(--cs-border)] bg-[var(--cs-bg-input)] p-4">
                                <div className="flex items-center justify-between">
                                    <p className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                                        example
                                    </p>
                                    {exampleTypeLabel(form.exampleType) && (
                                        <span className="rounded-full border border-[var(--cs-border)] px-2 py-0.5 text-[10px] text-[var(--cs-text-muted)]">
                                            {exampleTypeLabel(form.exampleType)}
                                        </span>
                                    )}
                                </div>
                                <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap font-[var(--cs-font-mono)] text-xs leading-6 text-[var(--cs-text-secondary)]">
                                    {form.example}
                                </pre>
                            </div>
                        )}

                        {form.referenceUrl && (
                            <div className="rounded-[var(--cs-radius-control)] border border-[var(--cs-border)] bg-[var(--cs-bg-input)] p-4">
                                <p className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                                    reference
                                </p>
                                <p className="mt-1.5 truncate text-sm text-[var(--cs-accent)]">{form.referenceUrl}</p>
                            </div>
                        )}

                        <p className="text-xs leading-5 text-[var(--cs-text-muted)]">
                            Once pushed, a mentor will review this contribution before it can be
                            published to learners.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer navigation */}
            <div className="flex items-center justify-between gap-3 border-t border-[var(--cs-border)] px-6 py-5">
                <button
                    type="button"
                    onClick={() =>
                        step === 0
                            ? navigate("/learner/topic-contributions")
                            : setStep((current) => current - 1)
                    }
                    disabled={mutation.isPending}
                    className="inline-flex items-center gap-1.5 rounded-[var(--cs-radius-control)] border border-[var(--cs-border)] px-4 py-2.5 text-sm font-medium text-[var(--cs-text-primary)] transition hover:bg-white/5 disabled:opacity-50"
                >
                    {step > 0 && <ChevronLeft size={15} />}
                    {step === 0 ? "Cancel" : "Back"}
                </button>

                {step < STEPS.length - 1 ? (
                    <button
                        type="button"
                        onClick={() => setStep((current) => current + 1)}
                        disabled={step === 0 && !canAdvanceFromStage}
                        className="inline-flex items-center gap-1.5 rounded-[var(--cs-radius-control)] bg-[var(--cs-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--cs-accent-on)] transition hover:bg-[var(--cs-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Continue
                        <ChevronRight size={15} />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                        className="inline-flex items-center gap-2 rounded-[var(--cs-radius-control)] bg-[var(--cs-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--cs-accent-on)] transition hover:bg-[var(--cs-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {mutation.isPending ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <UploadCloud size={16} />
                        )}
                        Push Contribution
                    </button>
                )}
            </div>
        </div>
    );
}
