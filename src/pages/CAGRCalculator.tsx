import { useMemo } from 'react';
import { LineChart as LucideLineChart } from 'lucide-react';
import { useCalculator } from '@/hooks/useCalculator';
import { validateRange } from '@/utils/validators';
import CalculatorPageLayout from '@/components/calculators/shared/CalculatorPageLayout';
import CalculatorHero from '@/components/calculators/shared/CalculatorHero';
import CalculatorFormCard from '@/components/calculators/shared/CalculatorFormCard';
import CalculatorResultCard from '@/components/calculators/shared/CalculatorResultCard';
import ChartWrapper from '@/components/calculators/shared/ChartWrapper';
import CalculatorInput from '@/components/calculators/shared/CalculatorInput';
import FAQSection from '@/components/calculators/shared/FAQSection';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const defaultInputs = {
    initialValue: 100000,
    finalValue: 200000,
    durationYears: 5,
};

const validationRules = {
    initialValue: (v: number) => validateRange(v, 100, 100000000, 'Initial Value') || null,
    finalValue: (v: number) => validateRange(v, 100, 100000000, 'Final Value') || null,
    durationYears: (v: number) => validateRange(v, 1, 50, 'Duration') || null,
};

const faqList = [
    { question: 'What is CAGR?', answer: 'CAGR (Compound Annual Growth Rate) is the rate at which an investment grows annually over a specified period.' },
    { question: 'How is CAGR calculated?', answer: 'CAGR = (Final Value / Initial Value)^(1/Years) - 1' },
    { question: 'Why use CAGR?', answer: 'CAGR provides a smoothed annual growth rate, useful for comparing investments.' },
];

function formatINR(num: number) {
    return num.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

function CAGRLineChart({ initialValue, finalValue, durationYears }: { initialValue: number; finalValue: number; durationYears: number; }) {
    const data = Array.from({ length: durationYears + 1 }, (_, i) => {
        const value = initialValue * Math.pow(finalValue / initialValue, i / durationYears);
        return { year: i, value };
    });
    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: 14, fill: '#8B7355' }} label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                    <YAxis tick={{ fontSize: 14, fill: '#8B7355' }} tickFormatter={formatINR} />
                    <Tooltip formatter={(value: number) => formatINR(value)} contentStyle={{ backgroundColor: 'white', borderColor: '#81a2b1', borderRadius: '8px', fontFamily: 'Crimson Text, serif' }} />
                    <Line type="monotone" dataKey="value" stroke="#B4A078" strokeWidth={3} dot={{ r: 4, fill: '#8B7355' }} />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    );
}

const CAGRCalculator = () => {
    const { inputs, setInputs, errors, results, warnings } = useCalculator(
        defaultInputs,
        (inputs) => {
            const cagr = inputs.durationYears > 0 ? (Math.pow(inputs.finalValue / inputs.initialValue, 1 / inputs.durationYears) - 1) * 100 : 0;
            return { cagr };
        },
        validationRules
    );

    const metrics = useMemo(() => [
        { label: 'CAGR (%)', value: results.cagr ? Math.round(results.cagr * 100) / 100 : 0, currency: false },
    ], [results]);

    const explanations = useMemo(() => [
        { label: 'CAGR (%)', value: results.cagr ? (results.cagr).toFixed(2) + '%' : '0%', description: 'Compound Annual Growth Rate over the period.' },
    ], [results]);

    const handleInputChange = (key) => (value) => {
        setInputs((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <CalculatorPageLayout>
            <CalculatorHero
                title="CAGR Calculator"
                subtitle="FINANCIAL CALCULATOR"
                description="Calculate the Compound Annual Growth Rate of your investment. Understand your investment's annualized return over time."
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'CAGR Calculator' }
                ]}
                icon={<LucideLineChart />}
                image="/Hero Section/Calculator.png"
            />
            <div className="calculator-section bg-gradient-to-br from-secondary/10 to-secondary/5 py-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 items-stretch">
                    <div className="col-span-1 flex items-center">
                        <CalculatorFormCard title="CAGR Details" subtitle="Enter your investment details below">
                            <CalculatorInput
                                label="Initial Value (₹)"
                                value={inputs.initialValue}
                                onChange={handleInputChange('initialValue')}
                                min={100}
                                max={100000000}
                                step={100}
                                currency
                                error={errors.initialValue}
                            />
                            <CalculatorInput
                                label="Final Value (₹)"
                                value={inputs.finalValue}
                                onChange={handleInputChange('finalValue')}
                                min={100}
                                max={100000000}
                                step={100}
                                currency
                                error={errors.finalValue}
                            />
                            <CalculatorInput
                                label="Duration (years)"
                                value={inputs.durationYears}
                                onChange={handleInputChange('durationYears')}
                                min={1}
                                max={50}
                                error={errors.durationYears}
                            />
                        </CalculatorFormCard>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <CalculatorResultCard
                            title="CAGR Summary"
                            subtitle="Your growth rate"
                            metrics={metrics}
                            chart={
                                <ChartWrapper>
                                    <CAGRLineChart
                                        initialValue={inputs.initialValue}
                                        finalValue={inputs.finalValue}
                                        durationYears={inputs.durationYears}
                                    />
                                </ChartWrapper>
                            }
                            explanations={explanations}
                        />
                    </div>
                </div>
            </div>
            <FAQSection faqs={faqList} />
        </CalculatorPageLayout>
    );
};

export default CAGRCalculator;
