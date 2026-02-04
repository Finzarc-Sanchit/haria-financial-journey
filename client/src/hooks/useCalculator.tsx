import { useState, useCallback, useEffect } from 'react';
import { getValidationErrors, getWarnings } from '@/utils/validators';

export function useCalculator<TInputs extends object, TResult>(
    defaultInputs: TInputs,
    calculate: (inputs: TInputs) => TResult,
    validationRules: Partial<Record<keyof TInputs, (value: any, values: TInputs) => string | null>> = {}
) {
    const [inputs, setInputs] = useState<TInputs>(defaultInputs);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [results, setResults] = useState<TResult>(() => calculate(defaultInputs));
    const [loading, setLoading] = useState(false);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [chartReady, setChartReady] = useState(false);

    // Only update inputs, errors, warnings here
    const updateInputs = useCallback((update: (prev: TInputs) => TInputs) => {
        setInputs(prev => {
            const next = update(prev);
            setErrors(getValidationErrors(next, validationRules));
            setWarnings(getWarnings(next));
            setLoading(true);
            setChartReady(false);
            return next;
        });
    }, [validationRules]);

    // Calculate results whenever inputs change (ALWAYS up-to-date)
    useEffect(() => {
        setResults(calculate(inputs));
        setLoading(false);
        setChartReady(true);
    }, [inputs, calculate]);

    return {
        inputs,
        setInputs: updateInputs,
        errors,
        results,
        loading,
        chartReady,
        warnings,
    };
}