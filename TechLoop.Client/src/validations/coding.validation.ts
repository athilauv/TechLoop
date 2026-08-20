export const validateCodingTemplate = (
    technologyId: number,
    starterCode: string,
    solutionCode?: string | null,
): string | null => {
    if (technologyId <= 0) {
        return "Technology is required.";
    }

    if (!starterCode.trim()) {
        return "Starter code is required.";
    }

    if (starterCode.length > 50000) {
        return "Starter code cannot exceed 50000 characters.";
    }

    if (
        solutionCode &&
        solutionCode.trim() &&
        solutionCode.length > 50000
    ) {
        return "Solution code cannot exceed 50000 characters.";
    }

    return null;
};

export const validateTestCase = (
    input: string,
    expectedOutput: string,
    position: number,
): string | null => {
    if (!input.trim()) {
        return "Input is required.";
    }

    if (!expectedOutput.trim()) {
        return "Expected output is required.";
    }

    if (position <= 0) {
        return "Position must be greater than zero.";
    }

    return null;
};