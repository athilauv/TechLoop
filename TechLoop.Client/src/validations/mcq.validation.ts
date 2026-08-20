export const validateMcqOption = (
    optionText: string,
    position: number,
): string | null => {
    if (!optionText.trim()) {
        return "OptionText cannot be empty.";
    }

    if (optionText.trim().length > 500) {
        return "OptionText cannot exceed 500 characters.";
    }

    if (position <= 0) {
        return "Position must be greater than 0.";
    }

    return null;
};