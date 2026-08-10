import axios, {
    AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
    baseURL: "http://localhost:5264",
    withCredentials: true,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
let isRefreshing = false;

let refreshSubscribers: Array<{
    resolve: () => void;
    reject: (error: unknown) => void;
}> = [];


// Notify all requests waiting for refresh
const notifyRefreshSubscribers = () => {
    refreshSubscribers.forEach((subscriber) => {
        subscriber.resolve();
    });

    refreshSubscribers = [];
};


// Reject all requests waiting for refresh
const rejectRefreshSubscribers = (error: unknown) => {
    refreshSubscribers.forEach((subscriber) => {
        subscriber.reject(error);
    });

    refreshSubscribers = [];
};


api.interceptors.response.use(
    // Normal successful response
    (response) => {
        return response;
    },

    // Error response
    async (error: AxiosError) => {

        const originalRequest =
            error.config as InternalAxiosRequestConfig & {
                _retry?: boolean;
            };

        // Only handle 401
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // Don't refresh the refresh endpoint itself
        if (
            originalRequest.url?.includes("/Auth/refresh")
        ) {
            return Promise.reject(error);
        }

        // Don't retry same request twice
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;


        // ==================================================
        // Another request is already refreshing
        // ==================================================

        if (isRefreshing) {
            return new Promise((resolve, reject) => {

                refreshSubscribers.push({
                    resolve: () => resolve(api(originalRequest)),
                    reject,
                });

            });
        }

        // Start refresh
        isRefreshing = true;

        try {
            await api.post(
                "/Auth/refresh",
                {},
                {
                    withCredentials: true,
                }
            );


            // New cookies have now been set by backend
            notifyRefreshSubscribers();

            // Retry original request
            return api(originalRequest);

        } catch (refreshError) {

            rejectRefreshSubscribers(refreshError);
            localStorage.removeItem("accessToken");
            return Promise.reject(refreshError);

        } finally {

            isRefreshing = false;

        }
    }
);


export default api;