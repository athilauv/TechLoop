import { useState } from "react";
import { Pin, PinOff } from "lucide-react";

interface PinToggleButtonProps {
    isPinned: boolean;
    onToggle: () => Promise<void>;
}

const PinToggleButton = ({ isPinned, onToggle }: PinToggleButtonProps) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async (event: React.MouseEvent) => {
        event.stopPropagation();
        if (loading) return;

        setLoading(true);
        try {
            await onToggle();
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={(event) => void handleClick(event)}
            disabled={loading}
            title={isPinned ? "Unpin discussion" : "Pin discussion"}
            className={`rounded-lg p-1.5 transition-colors disabled:opacity-50 ${
                isPinned
                    ? "text-amber-400 hover:bg-amber-400/10"
                    : "text-[var(--cs-text-muted)] hover:bg-[var(--cs-surface-muted)]/60 hover:text-[var(--cs-text)]"
            }`}
        >
            {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
        </button>
    );
};

export default PinToggleButton;
