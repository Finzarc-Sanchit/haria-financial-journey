// Calculator Constants and Configuration

export const CALCULATOR_CONFIG = {
    SIP: {
        defaultInputs: {
            monthlyInvestment: 10000,
            durationYears: 10,
            expectedReturns: 12,
            stepUpPercent: 0,
        },
        validationRules: {
            monthlyInvestment: { min: 500, max: 500000, step: 500 },
            durationYears: { min: 1, max: 30, step: 1 },
            expectedReturns: { min: 8, max: 15, step: 0.1 },
            stepUpPercent: { min: 0, max: 10, step: 0.1 },
        },
        labels: {
            monthlyInvestment: 'Monthly Amount',
            durationYears: 'Duration (years)',
            expectedReturns: 'Expected Returns (%)',
            stepUpPercent: 'Step-Up (%)',
        }
    },
    FD: {
        defaultInputs: {
            principal: 100000,
            durationYears: 5,
            interestRate: 7.5,
        },
        validationRules: {
            principal: { min: 1000, max: 10000000, step: 1000 },
            durationYears: { min: 1, max: 10, step: 1 },
            interestRate: { min: 5, max: 12, step: 0.1 },
        }
    },
    RETIREMENT: {
        defaultInputs: {
            currentAge: 30,
            retirementAge: 60,
            monthlyExpense: 50000,
            currentSavings: 500000,
            expectedReturns: 10,
        },
        validationRules: {
            currentAge: { min: 18, max: 70, step: 1 },
            retirementAge: { min: 45, max: 80, step: 1 },
            monthlyExpense: { min: 10000, max: 500000, step: 1000 },
            currentSavings: { min: 0, max: 10000000, step: 10000 },
            expectedReturns: { min: 6, max: 15, step: 0.5 },
        }
    },
    EMERGENCY_FUND: {
        defaultInputs: {
            monthlyExpense: 50000,
            monthsCoverage: 6,
        },
        validationRules: {
            monthlyExpense: { min: 10000, max: 500000, step: 1000 },
            monthsCoverage: { min: 3, max: 12, step: 1 },
        }
    }
} as const;

export const ANIMATION_CONFIG = {
    durations: {
        fast: 0.2,
        normal: 0.3,
        slow: 0.5,
        verySlow: 0.8,
    },
    delays: {
        stagger: 0.1,
        sequence: 0.2,
    },
    spring: {
        stiffness: 100,
        damping: 12,
    }
} as const;

export const COLORS = {
    primary: '#FAFAFA',
    secondary: '#81a2b1',
    tertiary: '#3A3A3A',
    accent: '#B4A078',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
} as const; 