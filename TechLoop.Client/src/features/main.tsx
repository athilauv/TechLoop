import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import { ToastContainer } from "react-toastify";
import { showToast } from "./utils/toast.tsx";
import { getErrorMessage } from "./utils/error.utils.ts";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

interface OperationResult {
    success?: boolean;
    message?: string;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
        },
        mutations: {
            onSuccess: (data) => {
                const result = data as OperationResult | undefined;
                if (typeof result?.success === "boolean" && result.message) {
                    if (result.success) showToast.success(result.message);
                    else showToast.error(result.message);
                }
            },
            onError: (error) => {
                showToast.error(getErrorMessage(error, "The operation could not be completed."));
            },
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="dark"
                toastClassName="techloop-toast"
                progressClassName="techloop-toast-progress"
            />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>
);