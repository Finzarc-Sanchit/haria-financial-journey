import apiClient from "../api/apiClient";

// Define TypeScript interfaces
export interface FinancialHealthAssessment {
    _id: string;
    // Personal & Professional Information
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    maritalStatus: string;
    dependents?: string;
    occupationStatus: string;
    annualIncome: string;
    expectedGrowthRate?: string;
    taxBracket?: string;
    taxRegime?: string;
    existingLoans: string[];
    otherLoan?: string;
    
    // Current Financial Position
    monthlyIncome?: string;
    monthlyExpenses?: string;
    emergencyFund: string;
    emergencyFundMonths?: string;
    bankSavingsFDs?: string;
    mutualFundsEquity?: string;
    bondsDebentures?: string;
    goldSilver?: string;
    realEstate?: string;
    retirementAccounts?: string;
    insuranceDetails?: string;
    outstandingLoans?: string;
    emiCommitments?: string;
    
    // Risk Profile & Investment Preferences
    marketVolatilityComfort?: string;
    primaryInvestmentObjective?: string;
    investmentHorizon?: string;
    preferredAssetClasses?: string;
    internationalInvestments?: string;
    
    // Insurance & Protection Planning
    hasHealthInsurance: string;
    healthInsuranceCoverage?: string;
    healthInsuranceFamilyMembers?: string;
    hasLifeInsurance: string;
    lifeInsuranceType?: string;
    lifeInsuranceCoverage?: string;
    otherProtection?: string;
    adequatelyInsured?: string;
    
    // Goals & Aspirations
    shortTermGoals?: string;
    mediumTermGoals?: string;
    longTermGoals?: string;
    specificMilestones: string[];
    otherMilestone?: string;
    
    // Estate & Legacy Planning
    hasWillEstatePlan?: string;
    wantsTrustsSuccession?: string;
    nomineesUpdated?: string;
    
    // Financial Behavior & Preferences
    investmentPreference?: string;
    portfolioReviewFrequency?: string;
    investmentApproach?: string;
    timeTrackingInvestments?: string;
    
    // Advisor Expectations
    advisorExpectations: string[];
    preferredReviewMeetings?: string;
    digitalAccessPreference?: string;
    
    status: 'new' | 'reviewed' | 'in_progress' | 'completed';
    createdAt: string;
    updatedAt: string;
}

export interface CreateFinancialHealthData {
    // Required fields
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    maritalStatus: string;
    occupationStatus: string;
    annualIncome: string;
    
    // Optional fields
    [key: string]: any;
}

export interface UpdateFinancialHealthData {
    status?: FinancialHealthAssessment["status"];
}

export interface FinancialHealthResponse {
    success: boolean;
    message: string;
    data: FinancialHealthAssessment;
}

export interface FinancialHealthStats {
    overview: {
        totalAssessments?: number;
        newAssessments?: number;
        reviewedAssessments?: number;
        inProgressAssessments?: number;
        completedAssessments?: number;
    };
    occupations?: Record<string, number>;
    maritalStatus?: Record<string, number>;
    monthly?: Array<{
        _id: { year: number; month: number };
        count: number;
    }>;
}

export interface AssessmentsResponse {
    success: boolean;
    message: string;
    data: {
        assessments: FinancialHealthAssessment[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalAssessments: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    };
}

export interface StatsResponse {
    success: boolean;
    message: string;
    data: FinancialHealthStats;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
}

// Financial Health service functions
export const financialHealthService = {
    // Create new financial health assessment
    createAssessment: async (assessmentData: CreateFinancialHealthData): Promise<FinancialHealthResponse> => {
        try {
            const response = await apiClient.post<FinancialHealthResponse>('/financial-health', assessmentData);
            return response.data;
        } catch (error: any) {
            const status: number | undefined = error.response?.status;
            const apiErrors: string[] | undefined = error.response?.data?.errors;

            // 400: show actual validation causes (no generic "Validation failed" prefix)
            if (status === 400 && Array.isArray(apiErrors) && apiErrors.length > 0) {
                throw new Error(apiErrors.join("; "));
            }

            // 5xx: don't leak backend details
            if (typeof status === "number" && status >= 500) {
                throw new Error("Something went wrong. Please try again.");
            }

            // Fallback for other cases (network errors, 401/403, etc.)
            throw new Error(
                error.response?.data?.message ||
                "Failed to submit financial health assessment"
            );
        }
    },

    // Get all assessments with pagination and filtering (admin dashboard)
    getAssessments: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        occupationStatus?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<AssessmentsResponse> => {
        try {
            const queryParams = new URLSearchParams();

            if (params?.page) queryParams.append("page", params.page.toString());
            if (params?.limit) queryParams.append("limit", params.limit.toString());
            if (params?.status) queryParams.append("status", params.status);
            if (params?.occupationStatus) queryParams.append("occupationStatus", params.occupationStatus);
            if (params?.search) queryParams.append("search", params.search);
            if (params?.startDate) queryParams.append("startDate", params.startDate);
            if (params?.endDate) queryParams.append("endDate", params.endDate);

            const response = await apiClient.get<AssessmentsResponse>(
                `/financial-health${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
            );
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch financial health assessments");
        }
    },

    // Get assessment by ID (for admin dashboard)
    getAssessmentById: async (id: string): Promise<FinancialHealthResponse> => {
        try {
            const response = await apiClient.get<FinancialHealthResponse>(`/financial-health/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message ||
                "Failed to fetch assessment"
            );
        }
    },

    // Update assessment (admin dashboard)
    updateAssessment: async (id: string, updateData: UpdateFinancialHealthData): Promise<FinancialHealthResponse> => {
        try {
            const response = await apiClient.put<FinancialHealthResponse>(`/financial-health/${id}`, updateData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to update assessment");
        }
    },

    // Delete assessment (admin dashboard)
    deleteAssessment: async (id: string): Promise<ApiResponse> => {
        try {
            const response = await apiClient.delete<ApiResponse>(`/financial-health/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to delete assessment");
        }
    },

    // Get statistics (admin dashboard)
    getFinancialHealthStats: async (): Promise<StatsResponse> => {
        try {
            const response = await apiClient.get<StatsResponse>("/financial-health/stats");
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch financial health statistics");
        }
    },
};

export const {
    createAssessment,
    getAssessments,
    getAssessmentById,
    updateAssessment,
    deleteAssessment,
    getFinancialHealthStats,
} = financialHealthService;

export default financialHealthService;

