import {
    useEffect,
    useRef,
    useState,
} from "react";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption<T> {
    value: T;
    label: string;
}

interface CustomSelectProps<T> {
    value: T;
    options: Array<SelectOption<T>>;
    onChange: (value: T) => void;
    placeholder?: string;
    className?: string;
}

function CustomSelect<T extends string | number>({
                                                     value,
                                                     options,
                                                     onChange,
                                                     placeholder = "Select…",
                                                     className = "",
                                                 }: CustomSelectProps<T>) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const rootRef = useRef<HTMLDivElement>(null);

    const selected = options.find(
        (option) => option.value === value
    );

    // Close on outside click
    useEffect(() => {
        if (!open) return;

        const handleClick = (event: MouseEvent) => {
            if (
                rootRef.current &&
                !rootRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [open]);

    const openMenu = () => {
        const selectedIndex = options.findIndex(
            (option) => option.value === value
        );

        setActiveIndex(selectedIndex === -1 ? 0 : selectedIndex);
        setOpen(true);
    };

    const toggleMenu = () => {
        if (open) {
            setOpen(false);
            return;
        }

        openMenu();
    };

    const commit = (index: number) => {
        const option = options[index];

        if (!option) return;

        onChange(option.value);
        setOpen(false);
    };

    const handleTriggerKeyDown = (
        event: React.KeyboardEvent<HTMLButtonElement>
    ) => {
        if (
            event.key === "Enter" ||
            event.key === " " ||
            event.key === "ArrowDown"
        ) {
            event.preventDefault();
            openMenu();
        }
    };

    const handleListKeyDown = (
        event: React.KeyboardEvent<HTMLUListElement>
    ) => {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setActiveIndex((index) =>
                    Math.min(index + 1, options.length - 1)
                );
                break;

            case "ArrowUp":
                event.preventDefault();
                setActiveIndex((index) =>
                    Math.max(index - 1, 0)
                );
                break;

            case "Enter":
                event.preventDefault();
                commit(activeIndex);
                break;

            case "Escape":
                event.preventDefault();
                setOpen(false);
                break;
        }
    };

    return (
        <div
            ref={rootRef}
            className={`relative ${className}`}
        >
            {/* Trigger */}
            <button
                type="button"
                onClick={toggleMenu}
                onKeyDown={handleTriggerKeyDown}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-2
                    rounded-lg
                    border
                    border-[var(--cs-border)]
                    bg-[var(--cs-surface)]
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-[var(--cs-text)]
                    outline-none
                    transition-colors
                    duration-150
                    hover:border-[var(--cs-border-strong,var(--cs-border))]
                    focus:border-[var(--cs-primary)]
                    focus:ring-1
                    focus:ring-[var(--cs-primary)]/30
                "
            >
                <span
                    className={
                        selected
                            ? "text-[var(--cs-text)]"
                            : "text-[var(--cs-text-muted)]"
                    }
                >
                    {selected ? selected.label : placeholder}
                </span>

                <ChevronDown
                    size={16}
                    className={`
                        shrink-0
                        text-[var(--cs-text-muted)]
                        transition-transform
                        duration-150
                        ${open ? "rotate-180" : ""}
                    `}
                />
            </button>

            {/* Menu */}
            {open && (
                <ul
                    role="listbox"
                    tabIndex={-1}
                    onKeyDown={handleListKeyDown}
                    ref={(node) => node?.focus()}
                    className="
                        absolute
                        z-20
                        mt-1.5
                        w-full
                        overflow-hidden
                        rounded-lg
                        border
                        border-[var(--cs-border)]
                        bg-[#0E1B2E]
                        py-1
                        shadow-[0_8px_24px_rgba(2,8,20,0.45)]
                        outline-none
                        animate-in
                        fade-in
                        slide-in-from-top-1
                        duration-150
                    "
                >
                    {options.map((option, index) => {
                        const isSelected =
                            option.value === value;

                        const isActive =
                            index === activeIndex;

                        return (
                            <li
                                key={String(option.value)}
                                role="none"
                            >
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseEnter={() =>
                                        setActiveIndex(index)
                                    }
                                    onClick={() =>
                                        commit(index)
                                    }
                                    className={`
                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        gap-2
                                        px-3
                                        py-2
                                        text-left
                                        text-sm
                                        transition-colors
                                        duration-100
                                        ${
                                        isSelected
                                            ? "text-[var(--cs-primary)]"
                                            : "text-[var(--cs-text)]"
                                    }
                                        ${
                                        isActive
                                            ? "bg-[var(--cs-surface-muted)]"
                                            : ""
                                    }
                                    `}
                                >
                                    {option.label}

                                    {isSelected && (
                                        <Check
                                            size={15}
                                            className="
                                                shrink-0
                                                text-[var(--cs-primary)]
                                            "
                                        />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default CustomSelect;