import axios, {
    AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
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

let isRefreshing = false;

let refreshSubscribers: Array<{
    resolve: () => void;
    reject: (error: unknown) => void;
}> = [];

const notifyRefreshSubscribers = () => {
    refreshSubscribers.forEach((subscriber) => {
        subscriber.resolve();
    });

    refreshSubscribers = [];
};

const rejectRefreshSubscribers = (error: unknown) => {
    refreshSubscribers.forEach((subscriber) => {
        subscriber.reject(error);
    });

    refreshSubscribers = [];
};

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error: AxiosError) => {
        const originalRequest =
            error.config as InternalAxiosRequestConfig & {
                _retry?: boolean;
            };

        // Only handle 401 responses
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // Do not refresh the refresh request itself
        if (originalRequest.url?.includes("/Auth/refresh")) {
            return Promise.reject(error);
        }

        // Do not retry the same request twice
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // Another request is already refreshing
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                refreshSubscribers.push({
                    resolve: () => resolve(api(originalRequest)),
                    reject,
                });
            });
        }

        isRefreshing = true;

        try {
            await api.post(
                "/Auth/refresh",
                {},
                {
                    withCredentials: true,
                }
            );

            notifyRefreshSubscribers();

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