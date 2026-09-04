import { showToast } from "./toast.tsx";

export const isPositionConflict = (message: string): boolean =>
    /position.*(already exists|already occupied|exists)/i.test(message);

export const confirmPositionShift = (
    message: string,
    noun: string,
): Promise<boolean> =>
    new Promise((resolve) => {
        showToast.confirm("Position already exists",
            `${message} Shift the existing ${noun} down?`,
            () => resolve(true),
            () => resolve(false),
            "Shift",
        );
    });
