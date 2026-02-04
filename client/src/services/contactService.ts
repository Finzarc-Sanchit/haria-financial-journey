import apiClient from "../api/apiClient";

// Define TypeScript interfaces
export interface Contact {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    services: string[];
    message: string;
    status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'closed';
    createdAt: string;
    updatedAt: string;
}

export interface CreateContactData {
    firstName: string;
    lastName: string;
    email: string;
    services: string[];
    message?: string;
}

export interface UpdateContactData {
    status?: string;
}

export interface ContactStats {
    overview: {
        totalContacts: number;
        newContacts: number;
        contactedContacts: number;
        inProgressContacts: number;
        completedContacts: number;
    };
    services: {
        [serviceName: string]: number;
    };
}

export interface ContactsResponse {
    success: boolean;
    message: string;
    data: {
        contacts: Contact[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalContacts: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    };
}

export interface ContactResponse {
    success: boolean;
    message: string;
    data: Contact;
}

export interface StatsResponse {
    success: boolean;
    message: string;
    data: ContactStats;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
}

// Contact service functions
export const contactService = {
    // Get all contacts with pagination and filtering
    getContacts: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        service?: string;
        search?: string;
    }): Promise<ContactsResponse> => {
        try {
            const queryParams = new URLSearchParams();

            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.limit) queryParams.append('limit', params.limit.toString());
            if (params?.status) queryParams.append('status', params.status);
            if (params?.service) queryParams.append('service', params.service);
            if (params?.search) queryParams.append('search', params.search);

            const response = await apiClient.get<ContactsResponse>(
                `/contact${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message ||
                "Failed to fetch contacts"
            );
        }
    },

    // Get contact by ID
    getContactById: async (id: string): Promise<ContactResponse> => {
        try {
            const response = await apiClient.get<ContactResponse>(`/contact/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message ||
                "Failed to fetch contact"
            );
        }
    },

    // Create new contact
    createContact: async (contactData: CreateContactData): Promise<ContactResponse> => {
        try {
            const response = await apiClient.post<ContactResponse>('/contact', contactData);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message ||
                "Failed to create contact"
            );
        }
    },

    // Update contact
    updateContact: async (id: string, updateData: UpdateContactData): Promise<ContactResponse> => {
        try {
            const response = await apiClient.put<ContactResponse>(`/contact/${id}`, updateData);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message ||
                "Failed to update contact"
            );
        }
    },

    // Delete contact
    deleteContact: async (id: string): Promise<ApiResponse> => {
        try {
            const response = await apiClient.delete<ApiResponse>(`/contact/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message ||
                "Failed to delete contact"
            );
        }
    },

    // Get contact statistics
    getContactStats: async (): Promise<StatsResponse> => {
        try {
            const response = await apiClient.get<StatsResponse>('/contact/stats');
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message ||
                "Failed to fetch contact statistics"
            );
        }
    }
};

// Export individual functions for convenience
export const {
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    getContactStats
} = contactService;

export default contactService;
