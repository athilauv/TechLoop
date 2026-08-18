import { toast } from "react-toastify";
import ConfirmToast from "../shared/ConfirmToast.tsx";

export const showToast = {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    warning: (message: string) => toast.warning(message),
    info: (message: string) => toast.info(message),

    confirm: (
        title: string,
        message: string,
        onConfirm: () => void,
        onCancel?: () => void,
        confirmLabel = "Confirm"
    ) => {
        const toastId = toast(
            <ConfirmToast
                title={title}
                message={message}
                confirmLabel={confirmLabel}
                onConfirm={() => {
                    toast.dismiss(toastId);
                    onConfirm();
                }}
                onCancel={() => {
                    toast.dismiss(toastId);
                    onCancel?.();
                }}
            />,
            {
                autoClose: false,
                closeButton: false,
                closeOnClick: false,
                draggable: false,
            }
        );

        return toastId;
    },
};