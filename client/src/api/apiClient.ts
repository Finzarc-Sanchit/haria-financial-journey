import axios, { AxiosError, AxiosResponse } from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
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