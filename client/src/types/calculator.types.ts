// Input types for each calculator
export interface SIPCalculatorInputs {
    monthlyInvestment: number;
    durationYears: number;
    expectedReturns: number;
    stepUpPercent?: number;
}

export interface FDCalculatorInputs {
    principal: number;
    interestRate: number;
    durationYears: number;
    compoundingFrequency: number;
}

export interface RetirementCalculatorInputs {
    currentAge: number;
    retirementAge: number;
    currentCorpus: number;
    monthlyInvestment: number;
    expectedReturns: number;
    postRetirementReturns: number;
    monthlyExpenses: number;
    inflationRate: number;
}

export interface EmergencyFundInputs {
    monthlyExpenses: number;
    monthsCovered: number;
    lumpSumAvailable?: number;
}

// Generic calculator result type
export interface CalculatorResults<T> {
    inputs: T;
    result: number;
    breakdown?: Record<string, number>;
    chartData?: any;
}

// Animation config for animated numbers/charts
export interface AnimationConfig {
    durationMs: number;
    easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
    delayMs?: number;
}

// Validation errors for calculator forms
export type ValidationErrors<T = any> = {
    [K in keyof T]?: string;
}; 