import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import type { MentorSubTopic } from "../../../../../types/subTopic.types.ts";

interface SubTopicSelectProps {
    subTopics: MentorSubTopic[];
    value: number;
    onChange: (subTopicId: number) => void;
    loading?: boolean;
    disabled?: boolean;
}

const SubTopicSelect = ({
                            subTopics,
                            value,
                            onChange,
                            loading = false,
                            disabled = false,
                        }: SubTopicSelectProps) => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const selected = useMemo(
        () => subTopics.find((item) => item.id === value) ?? null,
        [subTopics, value],
    );

    const filtered = useMemo(() => {
        const normalized = search.trim().toLowerCase();

        if (!normalized) {
            return subTopics;
        }

        return subTopics.filter(
            (item) =>
                item.title.toLowerCase().includes(normalized) ||
                item.slug.toLowerCase().includes(normalized),
        );
    }, [subTopics, search]);

    const handleSelect = (subTopic: MentorSubTopic) => {
        onChange(subTopic.id);
        setSearch("");
        setOpen(false);
    };

    return (
        <div className="relative isolate z-20">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                disabled={disabled || loading}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="
                    flex w-full items-center justify-between gap-2 rounded-lg border
                    border-[var(--cs-border)] bg-[var(--cs-surface-muted)] px-3 py-2.5
                    text-left text-sm outline-none transition-colors
                    focus:border-[var(--cs-primary)]
                    disabled:cursor-not-allowed disabled:opacity-60
                "
            >
                <span
                    className={
                        selected
                            ? "truncate text-[var(--cs-text)]"
                            : "text-[var(--cs-text-muted)]"
                    }
                >
                    {loading
                        ? "Loading sub topics..."
                        : selected
                            ? selected.title
                            : "Select a sub topic"}
                </span>

                <ChevronDown
                    size={16}
                    className={`shrink-0 text-[var(--cs-text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && !loading && (
                <>
                    {/*
                        Full-viewport invisible backdrop. This does two things:
                        1. Click-outside-to-close, without a document listener.
                        2. Forces the dropdown panel itself into a stacking
                           context anchored to <body>-level paint order, so it
                           can never render underneath later form fields even
                           if an ancestor further up the tree happens to
                           create its own stacking context (transform/filter/
                           opacity wrapper, etc.) that would otherwise cap a
                           plain `z-[999]` to "on top of siblings within that
                           ancestor only".
                    */}
                    <div
                        className="fixed inset-0 z-[998]"
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />
                    <div
                        className="absolute left-0 right-0 top-full z-[999] mt-2 max-h-72 overflow-hidden rounded-lg border border-[var(--cs-border)] shadow-2xl"
                        style={{ backgroundColor: "var(--cs-surface, #14243C)" }}
                    >
                        <div className="relative border-b border-[var(--cs-border)] p-2">
                            <Search
                                size={15}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cs-text-muted)]"
                            />
                            <input
                                autoFocus
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search sub topics..."
                                className="w-full rounded-md bg-transparent py-1.5 pl-7 pr-2 text-sm text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)]"
                            />
                        </div>

                        <div className="max-h-56 overflow-y-auto">
                            {filtered.length === 0 ? (
                                <div className="px-4 py-4 text-sm text-[var(--cs-text-muted)]">
                                    No sub topics found.
                                </div>
                            ) : (
                                filtered.map((subTopic) => (
                                    <button
                                        key={subTopic.id}
                                        type="button"
                                        onClick={() => handleSelect(subTopic)}
                                        className="w-full border-b border-[var(--cs-border)] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--cs-surface-muted)]"
                                    >
                                        <p className="text-sm font-medium text-[var(--cs-text)]">
                                            {subTopic.title}
                                        </p>
                                        <p className="mt-0.5 text-xs text-[var(--cs-text-muted)]">
                                            {subTopic.slug}
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SubTopicSelect;
