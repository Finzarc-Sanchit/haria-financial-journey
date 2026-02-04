import React from 'react';

interface CalculatorButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    loading?: boolean;
}

const variantStyles = {
    primary:
        'bg-secondary text-secondary-foreground font-playfair px-8 py-3 rounded-full text-lg shadow-lg transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-secondary',
    secondary:
        'bg-[#81a2b1] text-[#3A3A3A] font-playfair px-8 py-3 rounded-full text-lg shadow-lg transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-[#81a2b1]',
};

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
    children,
    variant = 'primary',
    loading = false,
    disabled,
    className = '',
    ...props
}) => {
    return (
        <button
            className={[
                variantStyles[variant],
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'hover:scale-[1.02] active:animate-pulse',
                className,
            ].join(' ')}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="inline-block animate-spin mr-2 align-middle w-5 h-5 border-2 border-t-transparent border-secondary-foreground rounded-full"></span>
            ) : null}
            <span className={loading ? 'opacity-70' : ''}>{children}</span>
        </button>
    );
};

export default CalculatorButton; 