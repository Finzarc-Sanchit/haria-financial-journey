import { ValidationErrors } from '@/types/calculator.types';

// Range validation
export function validateRange(value: number, min: number, max: number, label = 'Value'): string | null {
    if (value < min) return `${label} should be at least ${min}`;
    if (value > max) return `${label} should not exceed ${max}`;
    return null;
}

// Cross-field checks (example: currentAge < retirementAge)
export function validateCrossFields(fields: Record<string, any>): ValidationErrors {
    const errors: ValidationErrors = {};
    if ('currentAge' in fields && 'retirementAge' in fields) {
        if (fields.currentAge >= fields.retirementAge) {
            errors.retirementAge = 'Retirement age must be greater than current age';
        }
    }
    // Add more cross-field checks as needed
    return errors;
}

// Real-time error feedback for a form
export function getValidationErrors<T extends Record<string, any>>(
    values: T,
    rules: Partial<Record<keyof T, (value: any, values: T) => string | null>>
): ValidationErrors<T> {
    const errors: ValidationErrors<T> = {};
    for (const key in rules) {
        const rule = rules[key];
        if (rule) {
            const error = rule(values[key], values);
            if (error) errors[key] = error;
        }
    }
    return errors;
}

// Warnings for edge cases (e.g., very high returns, low duration)
export function getWarnings<T extends Record<string, any>>(
    values: T
): string[] {
    const warnings: string[] = [];
    if ('expectedReturns' in values && values.expectedReturns > 15) {
        warnings.push('Expected returns are unusually high. Please verify.');
    }
    if ('durationYears' in values && values.durationYears < 1) {
        warnings.push('Duration is very short for meaningful compounding.');
    }
    // Add more edge case warnings as needed
    return warnings;
} 