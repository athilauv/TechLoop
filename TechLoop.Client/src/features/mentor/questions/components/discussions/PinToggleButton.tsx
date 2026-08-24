import { Pin } from "lucide-react";

interface PinToggleButtonProps {
    isPinned: boolean;
    onToggle: () => void | Promise<void>;
}

const PinToggleButton = ({ isPinned, onToggle }: PinToggleButtonProps) => {
    return (
        <button
            type="button"
            onClick={() => void onToggle()}
            aria-label={isPinned ? "Unpin discussion" : "Pin discussion"}
            title={isPinned ? "Unpin discussion" : "Pin discussion"}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-primary)]/40 ${
                isPinned
                    ? "border-[var(--cs-primary)]/30 bg-[var(--cs-primary)]/10 text-[var(--cs-primary)]"
                    : "border-[var(--cs-border)] text-[var(--cs-text-muted)] hover:bg-white/5 hover:text-[var(--cs-primary)]"
            }`}
        >
            <Pin size={15} className={isPinned ? "fill-current" : ""} />
        </button>
    );
};

export default PinToggleButton;
