import apiClient from "../api/apiClient";

// Define TypeScript interfaces
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
}

// Login function
export const login = async (
    credentials: LoginCredentials
): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post<LoginResponse>(
            "/auth/login",
            credentials
        );
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message ||
            "An unexpected error occurred during login"
        );
    }
};
