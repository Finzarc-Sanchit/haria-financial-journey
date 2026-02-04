import axios, { AxiosError, AxiosResponse } from "axios";

// Determine API base URL based on environment
const getApiBaseUrl = () => {
    // If explicitly set via environment variable, use it
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }

    // In production, use relative URL (same origin) or detect from window location
    if (import.meta.env.PROD) {
        // If deployed on same domain, use relative path
        // Otherwise, construct from current origin
        const origin = window.location.origin;
        // Check if we're on a subdomain or need to use a different API domain
        // For now, assume API is on same domain with /api path
        return `${origin}/api/v1`;
    }

    // Development fallback
    return "http://localhost:8000/api/v1";
};

const apiClient = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");
        if (token && config.headers) {
            // Axios v1+ uses AxiosHeaders, which requires set() for dynamic assignment
            if (typeof config.headers.set === "function") {
                config.headers.set("Authorization", `Bearer ${token}`);
            } else {
                // fallback for possible plain object headers
                (config.headers as any)["Authorization"] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Handle errors
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("adminToken");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apiClient;