import { toast } from "react-toastify";
import ConfirmToast from "../shared/components/common/ConfirmToast.tsx";

export const showToast = {
    success: (message: string) =>
        toast.success(message),

    error: (message: string) =>
        toast.error(message),

    warning: (message: string) =>
        toast.warning(message),

    info: (message: string) =>
        toast.info(message),

    confirm: (
        title: string,
        message: string,
        onConfirm: () => void
    ) => {
        const toastId = toast(
            ConfirmToast({
                title,
                message,
                onConfirm: () => {
                    toast.dismiss(toastId);
                    onConfirm();
                },
                onCancel: () => {
                    toast.dismiss(toastId);
                },
            }),
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