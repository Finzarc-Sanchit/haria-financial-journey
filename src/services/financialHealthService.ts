import apiClient from "../api/apiClient";

// Define TypeScript interfaces
export interface FinancialHealthAssessment {
    _id: string;
    // Personal & Professional Information
    firstName: string;
    middleName?: string;
    lastName: string;
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
    dateOfBirth: string;
    maritalStatus: string;
    occupationStatus: string;
    annualIncome: string;
    emergencyFund: string;
    hasHealthInsurance: string;
    hasLifeInsurance: string;
    
    // Optional fields
    [key: string]: any;
}

export interface FinancialHealthResponse {
    success: boolean;
    message: string;
    data: FinancialHealthAssessment;
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
            throw new Error(
                error.response?.data?.message ||
                "Failed to submit financial health assessment"
            );
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
};

export const { createAssessment, getAssessmentById } = financialHealthService;

export default financialHealthService;

