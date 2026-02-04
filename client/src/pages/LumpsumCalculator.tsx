import { useMemo } from 'react';
import { Coins } from 'lucide-react';
import { useCalculator } from '@/hooks/useCalculator';
import { validateRange } from '@/utils/validators';
import CalculatorPageLayout from '@/components/calculators/shared/CalculatorPageLayout';
import CalculatorHero from '@/components/calculators/shared/CalculatorHero';
import CalculatorFormCard from '@/components/calculators/shared/CalculatorFormCard';
import CalculatorResultCard from '@/components/calculators/shared/CalculatorResultCard';
import ChartWrapper from '@/components/calculators/shared/ChartWrapper';
import CalculatorInput from '@/components/calculators/shared/CalculatorInput';
import FAQSection from '@/components/calculators/shared/FAQSection';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { motion } from 'framer-motion';

const defaultInputs = {
    principal: 100000,
    durationYears: 5,
    expectedReturns: 10,
};

const validationRules = {
    principal: (v: number) => validateRange(v, 1000, 100000000, 'Principal Amount') || null,
    durationYears: (v: number) => validateRange(v, 1, 50, 'Duration') || null,
    expectedReturns: (v: number) => validateRange(v, 1, 25, 'Expected Returns') || null,
};

const faqList = [
    { question: 'What is a Lumpsum Investment?', answer: 'A lumpsum investment is a one-time investment of a large amount in a financial instrument.' },
    { question: 'How is maturity value calculated?', answer: 'Maturity value is calculated using the compound interest formula based on principal, duration, and expected returns.' },
    { question: 'Can I withdraw before maturity?', answer: 'It depends on the investment product. Some allow early withdrawal with penalties.' },
];

function formatINR(num: number) {
    return num.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

function LumpsumBarChart({ invested, returns, maturity }: { invested: number; returns: number; maturity: number; }) {
    const data = [
        { name: 'Invested', value: invested },
        { name: 'Returns', value: returns },
        { name: 'Maturity Value', value: maturity },
    ];
    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 14, fill: '#8B7355' }} />
                    <YAxis hide />
                    <Tooltip formatter={(value: number) => formatINR(value)} contentStyle={{ backgroundColor: 'white', borderColor: '#81a2b1', borderRadius: '8px', fontFamily: 'Crimson Text, serif' }} />
                    <Bar dataKey="value" fill="#B4A078" radius={[6, 6, 6, 6]}>
                        <LabelList dataKey="value" position="top" formatter={(v) => formatINR(v)} style={{ fill: '#8B7355', fontFamily: 'Playfair Display, serif', fontWeight: 600 }} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}

const LumpsumCalculator = () => {
    const { inputs, setInputs, errors, results, warnings } = useCalculator(
        defaultInputs,
        (inputs) => {
            const maturity = inputs.principal * Math.pow(1 + inputs.expectedReturns / 100, inputs.durationYears);
            const returns = maturity - inputs.principal;
            return { invested: inputs.principal, returns, maturity };
        },
        validationRules
    );

    const metrics = useMemo(() => [
        { label: 'Invested', value: Math.round(results.invested || 0), currency: true },
        { label: 'Returns', value: Math.round(results.returns || 0), currency: true },
        { label: 'Maturity Value', value: Math.round(results.maturity || 0), currency: true },
    ], [results]);

    const explanations = useMemo(() => [
        { label: 'Invested', value: formatINR(results.invested || 0), description: 'Total amount you invested as lumpsum.' },
        { label: 'Returns', value: formatINR(results.returns || 0), description: 'Total profit earned on your investment.' },
        { label: 'Maturity Value', value: formatINR(results.maturity || 0), description: 'Total value at the end of the period.' },
    ], [results]);

    const handleInputChange = (key) => (value) => {
        setInputs((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <CalculatorPageLayout>
            <CalculatorHero
                title="Lumpsum Calculator"
                subtitle="FINANCIAL CALCULATOR"
                description="Calculate your investment growth with a one-time lumpsum investment. Understand how your money grows with compound interest over time."
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Lumpsum Calculator' }
                ]}
                icon={<Coins />}
                image="/Hero Section/Calculator.png"
            />
            <div className="calculator-section bg-gradient-to-br from-secondary/10 to-secondary/5 py-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 items-stretch">
                    <div className="col-span-1 flex items-center">
                        <CalculatorFormCard title="Lumpsum Details" subtitle="Enter your investment details below">
                            <CalculatorInput
                                label="Principal Amount (₹)"
                                value={inputs.principal}
                                onChange={handleInputChange('principal')}
                                min={1000}
                                max={100000000}
                                step={1000}
                                currency
                                error={errors.principal}
                            />
                            <CalculatorInput
                                label="Duration (years)"
                                value={inputs.durationYears}
                                onChange={handleInputChange('durationYears')}
                                min={1}
                                max={50}
                                error={errors.durationYears}
                            />
                            <CalculatorInput
                                label="Expected Returns (%)"
                                value={inputs.expectedReturns}
                                onChange={handleInputChange('expectedReturns')}
                                min={1}
                                max={25}
                                step={0.1}
                                error={errors.expectedReturns}
                            />
                        </CalculatorFormCard>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <CalculatorResultCard
                            title="Lumpsum Summary"
                            subtitle="Your investment projection"
                            metrics={metrics}
                            chart={
                                <ChartWrapper>
                                    <LumpsumBarChart
                                        invested={results.invested || 0}
                                        returns={results.returns || 0}
                                        maturity={results.maturity || 0}
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

export default LumpsumCalculator;
