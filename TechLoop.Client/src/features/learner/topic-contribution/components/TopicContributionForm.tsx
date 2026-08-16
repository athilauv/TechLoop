import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
    Check,
    ChevronDown,
    Loader2,
    Search,
    X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
    createTopicContribution,
} from "../../../../api/topicContribution.api.ts";

import {
    getTechnologies,
} from "../../../../api/technology.api.ts";

import {
    getCurriculum,
} from "../../../../api/curriculum.api.ts";

import type {
    LearnerTechnology,
} from "../../../../types/technology.types.ts";

import type {
    CurriculumTopic,
    CurriculumSubTopic,
} from "../../../../types/curriculum.types.ts";

import type {
    CreateTopicContributionRequest,
} from "../../../../types/topicContribution.types.ts";
import { ExampleType } from "../../../../types/enums/example-type.ts";

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

type SelectorType = | "technology" | "topic" | "subTopic" | null;

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

export default function TopicContributionForm() {
    const navigate = useNavigate();

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
        queryKey: ["learner-curriculum", form.technologyId,],

        queryFn: () =>
            getCurriculum(form.technologyId as number),

        enabled: form.technologyId !== null,
    });

    const filteredTechnologies =
        useMemo(() => {
            const search = technologySearch.trim().toLowerCase();
            if (!search) {
                return technologies;
            }

            return technologies.filter((technology) => technology.name.toLowerCase().includes(search)
            );
        }, [technologies, technologySearch]);

    const filteredTopics = useMemo<CurriculumTopic[]>(() => {
            const topics = curriculum?.topics ?? [];
            const search = topicSearch.trim().toLowerCase();

            if (!search) {
                return topics;
            }

            return topics.filter(
                (topic) => topic.title.toLowerCase().includes(search));
        }, [curriculum, topicSearch]);

    const selectedTopic = useMemo(() => {
            if (form.topicId === null) {
                return null;
            }

            return (curriculum?.topics.find((topic) => topic.id === form.topicId) ?? null);
        }, [curriculum, form.topicId]);

    const filteredSubTopics = useMemo<CurriculumSubTopic[]>(() => {
            const subTopics = selectedTopic?.subTopics ?? [];
            const search = subTopicSearch.trim().toLowerCase();

            if (!search) {
                return subTopics;
            }

            return subTopics.filter((subTopic) => subTopic.title.toLowerCase().includes(search));
        }, [selectedTopic, subTopicSearch,]);

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

        onError: () => {
            toast.error("Unable to submit contribution.");
        },
    });

    const updateField = (
        field: keyof FormState,
        value: | string | number | null
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: "",
        }));
    };

    const handleTechnologySelect = (
        technology: LearnerTechnology
    ) => {
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

    const validate = (): boolean => {
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

        return (Object.keys(nextErrors).length === 0);
    };

    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const request:
            CreateTopicContributionRequest = {
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

    const selectedTechnology = technologies.find((technology) =>
                technology.id === form.technologyId) ?? null;

    const selectedSubTopic = selectedTopic?.subTopics.find(
            (subTopic) =>
                subTopic.id === form.subTopicId) ?? null;

    const renderSelector = (
        type: | "technology" | "topic" | "subTopic"
    ) => {
        const isOpen = activeSelector === type;
        const disabled = type === "topic" ? form.technologyId === null : type === "subTopic" ? form.topicId === null : false;

        let label = "";
        let placeholder = "";
        let search = "";
        let setSearch: | ((value: string) => void) | undefined;

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
                <button type="button" disabled={disabled}
                    onClick={() => setActiveSelector(isOpen ? null : type)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm outline-none transition ${disabled ? "cursor-not-allowed border-[#223A59] bg-[#0E192A] text-[#5C7394]" : "border-[#223A59] bg-[#101C30] text-[#B9C8DC] hover:border-[#00E8C2]/40 focus:border-[#00E8C2] focus:ring-2 focus:ring-[#00E8C2]/25"
                    }`}>
                    <span className={label.startsWith("Select ") ? "text-[#5C7394]" : "text-white"}>
                        {label}
                    </span>

                    <ChevronDown size={17}
                        className={`text-[#8CA3BF] transition-transform ${
                            isOpen ? "rotate-180" : ""
                        }`}/>
                </button>

                {isOpen && !disabled && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-[#223A59] bg-[#14243C] shadow-2xl shadow-black/40">

                        {/* Search */}
                        <div className="border-b border-[#223A59] p-3">
                            <div className="flex items-center gap-2 rounded-lg border border-[#223A59] bg-[#101C30] px-3 focus-within:border-[#00E8C2]/50 transition">
                                <Search size={16} className="shrink-0 text-[#5C7394]"/>

                                <input autoFocus value={search}
                                    onChange={(event) => setSearch?.(event.target.value)}
                                    placeholder={placeholder}
                                    className="w-full bg-transparent py-2 text-sm text-white placeholder:text-[#5C7394] outline-none"/>

                                {search && (
                                    <button type="button" onClick={() => setSearch?.("")}
                                        className="text-[#5C7394] hover:text-white">
                                        <X size={15} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-64 overflow-y-auto p-1.5">

                            {type === "technology" && isTechnologiesLoading && (
                                    <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-[#8CA3BF]">
                                        <Loader2 size={16} className="animate-spin"/>
                                        Loading technologies...
                                    </div>
                                )}

                            {type === "technology" && isTechnologiesError && (
                                    <div className="px-4 py-6 text-center text-sm text-red-400">
                                        Unable to load technologies.
                                    </div>
                                )}

                            {type === "topic" && isCurriculumLoading && (
                                    <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-[#8CA3BF]">
                                        <Loader2 size={16} className="animate-spin"/>
                                        Loading topics...
                                    </div>
                                )}

                            {type === "topic" && isCurriculumError && (
                                    <div className="px-4 py-6 text-center text-sm text-red-400">
                                        Unable to load topics.
                                    </div>
                                )}

                            {type === "technology" && !isTechnologiesLoading && !isTechnologiesError && filteredTechnologies.length === 0 && (
                                    <div className="px-4 py-6 text-center text-sm text-[#8CA3BF]">
                                        No technologies found.
                                    </div>
                                )}

                            {type === "topic" && !isCurriculumLoading && !isCurriculumError && filteredTopics.length === 0 && (
                                    <div className="px-4 py-6 text-center text-sm text-[#8CA3BF]">
                                        No topics found.
                                    </div>
                                )}

                            {type === "subTopic" && filteredSubTopics.length === 0 && (
                                    <div className="px-4 py-6 text-center text-sm text-[#8CA3BF]">
                                        No subtopics found.
                                    </div>
                                )}

                            {type === "technology" && filteredTechnologies.map((technology) => (
                                        <button key={technology.id} type="button"
                                            onClick={() => handleTechnologySelect(technology)}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-[#00E8C2]/10">
                                            <div>
                                                <p className="font-medium text-white">
                                                    {technology.name}
                                                </p>

                                                <p className="mt-0.5 text-xs text-[#5C7394]">
                                                    {technology.slug}
                                                </p>
                                            </div>

                                            {form.technologyId === technology.id && (
                                                    <Check size={16} className="text-[#00E8C2]"/>
                                                )}
                                        </button>
                                    )
                                )}

                            {type === "topic" && filteredTopics.map((topic) => (
                                        <button key={topic.id} type="button"
                                            onClick={() => handleTopicSelect(topic)}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-[#00E8C2]/10">
                                            <div>
                                                <p className="font-medium text-white">
                                                    {topic.title}
                                                </p>

                                                <p className="mt-0.5 text-xs text-[#5C7394]">
                                                    {topic.subTopics.length}{" "}
                                                    subtopics
                                                </p>
                                            </div>

                                            {form.topicId === topic.id && (
                                                <Check size={16} className="text-[#00E8C2]"/>
                                            )}
                                        </button>
                                    )
                                )}

                            {type === "subTopic" && filteredSubTopics.map((subTopic) => (
                                        <button key={subTopic.id} type="button"
                                            onClick={() => handleSubTopicSelect(subTopic)}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-[#00E8C2]/10">
                                            <div>
                                                <p className="font-medium text-white">
                                                    {subTopic.title}
                                                </p>
                                            </div>

                                            {form.subTopicId === subTopic.id && (
                                                    <Check size={16} className="text-[#00E8C2]"/>
                                                )}
                                        </button>
                                    )
                                )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-[#223A59] bg-[#14243C] p-6"
        >
            {/* Header */}

            <div>
                <h1 className="text-xl font-semibold text-white">
                    Create Contribution
                </h1>

                <p className="mt-1 text-sm text-[#8CA3BF]">
                    Share useful knowledge with the TechLoop community.
                </p>
            </div>

            <div className="space-y-5">

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#B9C8DC]">
                        Technology
                    </label>

                    {renderSelector("technology")}

                    {errors.technologyId && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.technologyId}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#B9C8DC]">
                        Topic
                    </label>

                    {renderSelector("topic")}

                    {form.technologyId === null && (
                        <p className="mt-1 text-xs text-[#5C7394]">
                            Select a technology first.
                        </p>
                    )}

                    {errors.topicId && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.topicId}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#B9C8DC]">
                        SubTopic
                        <span className="ml-1 font-normal text-[#5C7394]">
                            (Optional)
                        </span>
                    </label>

                    {renderSelector("subTopic")}

                    {form.topicId === null && (
                        <p className="mt-1 text-xs text-[#5C7394]">
                            Select a topic first.
                        </p>
                    )}

                    {errors.subTopicId && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.subTopicId}
                        </p>
                    )}
                </div>

            </div>


            <div>
                <label className="mb-1.5 block text-sm font-medium text-[#B9C8DC]">
                    Title
                </label>

                <input
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                        updateField("title", event.target.value)
                    }
                    placeholder="Contribution title"
                    className="w-full rounded-lg border border-[#223A59] bg-[#101C30] px-3 py-2.5 text-sm text-white placeholder:text-[#5C7394] outline-none transition focus:border-[#00E8C2] focus:ring-2 focus:ring-[#00E8C2]/25"
                />

                {errors.title && (
                    <p className="mt-1 text-xs text-red-400">
                        {errors.title}
                    </p>
                )}
            </div>


            <div>
                <label className="mb-1.5 block text-sm font-medium text-[#B9C8DC]">
                    Description
                </label>

                <textarea
                    rows={6}
                    value={form.description}
                    onChange={(event) =>
                        updateField("description", event.target.value)
                    }
                    placeholder="Explain your contribution..."
                    className="w-full resize-y rounded-lg border border-[#223A59] bg-[#101C30] px-3 py-2.5 text-sm text-white placeholder:text-[#5C7394] outline-none transition focus:border-[#00E8C2] focus:ring-2 focus:ring-[#00E8C2]/25"
                />

                {errors.description && (
                    <p className="mt-1 text-xs text-red-400">
                        {errors.description}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-[#B9C8DC]">
                    Example
                    <span className="ml-1 font-normal text-[#5C7394]">
                        (Optional)
                    </span>
                </label>

                <textarea
                    rows={8}
                    value={form.example}
                    onChange={(event) =>
                        updateField("example", event.target.value)}
                    placeholder="Optional example or code"
                    className="w-full resize-y rounded-lg border border-[#223A59] bg-[#101C30] px-3 py-2.5 font-mono text-sm text-white placeholder:text-[#5C7394] outline-none transition focus:border-[#00E8C2] focus:ring-2 focus:ring-[#00E8C2]/25"/>
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-[#B9C8DC]">
                    Example Type
                    <span className="ml-1 font-normal text-[#5C7394]">
                        (Optional)
                    </span>
                </label>

                <select
                    value={form.exampleType}
                    onChange={(event) =>
                        updateField("exampleType", event.target.value)
                    }
                    className="w-full rounded-lg border border-[#223A59] bg-[#101C30] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#00E8C2] focus:ring-2 focus:ring-[#00E8C2]/25"
                >
                    <option value="">Select example type</option>
                    <option value={ExampleType.Text}>Text</option>
                    <option value={ExampleType.Code}>Code</option>
                    <option value={ExampleType.Link}>Link</option>
                    <option value={ExampleType.Image}>Image</option>
                    <option value={ExampleType.Video}>Video</option>
                    <option value={ExampleType.Pdf}>PDF</option>
                </select>

                {errors.exampleType && (
                    <p className="mt-1 text-xs text-red-400">
                        {errors.exampleType}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-[#B9C8DC]">
                    Reference URL
                    <span className="ml-1 font-normal text-[#5C7394]">
                        (Optional)
                    </span>
                </label>

                <input
                    type="url"
                    value={form.referenceUrl}
                    onChange={(event) =>
                        updateField("referenceUrl", event.target.value)
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border border-[#223A59] bg-[#101C30] px-3 py-2.5 text-sm text-white placeholder:text-[#5C7394] outline-none transition focus:border-[#00E8C2] focus:ring-2 focus:ring-[#00E8C2]/25"
                />

                {errors.referenceUrl && (
                    <p className="mt-1 text-xs text-red-400">
                        {errors.referenceUrl}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3 border-t border-[#223A59] pt-5">

                <button
                    type="button"
                    onClick={() => navigate("/learner/topic-contributions")}
                    disabled={mutation.isPending}
                    className="rounded-lg border border-[#223A59] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#101C30] disabled:opacity-50"
                >
                    Cancel
                </button>

                <button type="submit" disabled={mutation.isPending}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#00E8C2] px-5 py-2.5 text-sm font-medium text-[#081423] transition hover:bg-[#00DDB9] disabled:cursor-not-allowed disabled:opacity-60">
                    {mutation.isPending && (
                        <Loader2 size={16} className="animate-spin" />
                    )}
                    Submit Contribution
                </button>

            </div>
        </form>
    );
}