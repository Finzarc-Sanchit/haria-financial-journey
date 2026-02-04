import React from 'react';

interface CalculatorInputProps {
    label: string;
    value: number | string;
    onChange: (value: number) => void; // Changed to number
    type?: 'number' | 'range' | 'select';
    min?: number;
    max?: number;
    step?: number;
    options?: { label: string; value: string | number; }[];
    error?: string;
    currency?: boolean;
    name?: string;
    disabled?: boolean;
}

const SECONDARY_COLOR = 'hsl(var(--secondary))';

const formatCurrency = (val: number | string) => {
    const num = typeof val === 'string' ? Number(val) : val;
    return num.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
};

const CalculatorInput: React.FC<CalculatorInputProps> = ({
    label,
    value,
    onChange,
    type = 'number',
    min,
    max,
    step,
    options = [],
    error,
    currency,
    name,
    disabled,
}) => {
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        console.log('CalculatorInput: Slider change', { label, value: newValue });
        onChange(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        console.log('CalculatorInput: Input change', { label, value: newValue });
        onChange(newValue);
    };

    return (
        <div className="w-full max-w-xl mx-auto mb-6 flex flex-col">
            <label
                htmlFor={name}
                className="block mb-3 font-playfair text-base md:text-lg text-tertiary px-1 font-semibold"
            >
                {label}
            </label>

            {type === 'select' ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={`w-full px-3 py-3 bg-background font-crimson text-lg rounded border-2 transition-colors duration-300
            border-border focus:outline-none focus:border-secondary ${error ? 'border-destructive' : ''}`}
                    disabled={disabled}
                >
                    <option value="" disabled hidden>
                        {label}
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <div className="space-y-3">
                    <div className="relative flex items-center">
                        <input
                            id={name}
                            name={name}
                            type="number"
                            value={value}
                            min={min}
                            max={max}
                            step={step}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-3 bg-background font-crimson text-lg rounded border-2 transition-colors duration-300
              border-border focus:outline-none focus:border-secondary ${error ? 'border-destructive' : ''}`}
                            disabled={disabled}
                            aria-invalid={!!error}
                            aria-describedby={error ? `${name}-error` : undefined}
                        />
                        {currency && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-crimson text-base text-gray-500 select-none pointer-events-none">
                                {formatCurrency(value)}
                            </span>
                        )}
                    </div>
                    {min !== undefined && max !== undefined && (
                        <div className="relative">
                            <input
                                type="range"
                                min={min}
                                max={max}
                                step={step || 1}
                                value={value}
                                onChange={handleSliderChange}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/50"
                                style={{
                                    background: `linear-gradient(to right, hsl(var(--secondary)) 0%, hsl(var(--secondary)) ${((Number(value) - min) / (max - min)) * 100}%, hsl(var(--muted)) ${((Number(value) - min) / (max - min)) * 100}%, hsl(var(--muted)) 100%)`,
                                }}
                                disabled={disabled}
                            />
                        </div>
                    )}
                </div>
            )}
            {error && (
                <div id={`${name}-error`} className="text-destructive text-sm mt-1 font-crimson">
                    {error}
                </div>
            )}
        </div>
    );
};

export default CalculatorInput;