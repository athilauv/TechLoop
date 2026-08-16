import { LogOut, X } from "lucide-react";

interface ConfirmToastProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmToast({
                                         title,
                                         message,
                                         onConfirm,
                                         onCancel,
                                     }: ConfirmToastProps) {
    return (
        <div className="w-[340px] rounded-xl border border-white/10 bg-[#0E192A] p-4 shadow-2xl">
            <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                    <LogOut size={18} />
                </div>

                <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-3">

                        <div>
                            <p className="text-sm font-semibold text-white">
                                {title}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-400">
                                {message}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onCancel}
                            className="shrink-0 rounded-md p-1 text-slate-500 transition hover:bg-white/5 hover:text-white"
                        >
                            <X size={15} />
                        </button>

                    </div>

                    <div className="mt-4 flex justify-end gap-2">

                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-400"
                        >
                            Log out
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}