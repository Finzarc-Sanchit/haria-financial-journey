import { useMemo } from 'react';
import { FaRupeeSign } from 'react-icons/fa';
import { useCalculator } from '@/hooks/useCalculator';
import { calculateSIP } from '@/utils';
import { SIPCalculatorInputs } from '@/types';
import { validateRange } from '@/utils/validators';
import CalculatorPageLayout from '@/components/calculators/shared/CalculatorPageLayout';
import CalculatorHero from '@/components/calculators/shared/CalculatorHero';
import CalculatorFormCard from '@/components/calculators/shared/CalculatorFormCard';
import CalculatorResultCard from '@/components/calculators/shared/CalculatorResultCard';
import ChartWrapper from '@/components/calculators/shared/ChartWrapper';
import FAQSection from '@/components/calculators/shared/FAQSection';
import SIPDonutChart from '@/components/calculators/shared/SIPDonutChart';
import CalculatorInput from '@/components/calculators/shared/CalculatorInput';

const defaultInputs: SIPCalculatorInputs = {
    monthlyInvestment: 10000,
    durationYears: 10,
    expectedReturns: 12,
    stepUpPercent: 0,
};

const validationRules = {
    monthlyInvestment: (v: number) => validateRange(v, 500, 500000, 'Monthly Amount') || null,
    durationYears: (v: number) => validateRange(v, 1, 30, 'Duration') || null,
    expectedReturns: (v: number) => validateRange(v, 8, 25, 'Expected Returns') || null,
    stepUpPercent: (v: number) => validateRange(v, 0, 20, 'Step-Up') || null,
};

const faqList = [
    {
        question: 'What is a SIP?',
        answer: 'A Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly in mutual funds.',
    },
    {
        question: 'How is SIP maturity calculated?',
        answer: 'Maturity is calculated based on your monthly investment, duration, and expected returns.',
    },
    {
        question: 'Can I change my SIP amount later?',
        answer: 'Yes, you can increase or decrease your SIP amount as per your needs.',
    },
    {
        question: 'Are SIP returns guaranteed?',
        answer: 'No, SIP returns are market-linked and not guaranteed.',
    },
];

const SIPCalculator = () => {
    const { inputs, setInputs, errors, results } = useCalculator(
        defaultInputs,
        calculateSIP,
        validationRules
    );

    const metrics = useMemo(() => {
        if (!results) {
            return [
                { label: 'Maturity Value', value: 0, currency: true },
                { label: 'Invested', value: 0, currency: true },
                { label: 'Returns', value: 0, currency: true },
                { label: 'Total Return (%)', value: 0, currency: false },
            ];
        }
        return [
            {
                label: 'Maturity Value',
                value: Math.round(results.corpus || 0),
                currency: true,
            },
            {
                label: 'Invested',
                value: Math.round(results.invested || 0),
                currency: true,
            },
            {
                label: 'Returns',
                value: Math.round(results.returns || 0),
                currency: true,
            },
            {
                label: 'Total Return (%)',
                value: results.invested ? Math.round((results.returns / results.invested) * 100) : 0,
                currency: false,
            },
        ];
    }, [results]);

    const explanations = useMemo(() => {
        if (!results) return [];
        const corpus = results.corpus || 0;
        const invested = results.invested || 0;
        const returns = results.returns || 0;
        return [
            {
                label: 'Maturity Value',
                value: formatINR(corpus),
                description: 'Total amount you receive at the end of the SIP period (Invested + Returns).',
            },
            {
                label: 'Invested',
                value: formatINR(invested),
                description: 'Total money you put in via SIPs over the investment period.',
            },
            {
                label: 'Returns',
                value: formatINR(returns),
                description: 'Profit earned on your investment (Maturity Value − Invested).',
            },
            {
                label: 'Total Return (%)',
                value: invested ? Math.round((returns / invested) * 100) + '%' : '0%',
                description: 'Overall percentage gain on your invested amount: (Returns / Invested) × 100.',
            },
            {
                label: 'Pie Center (%)',
                value: corpus ? Math.round((returns / corpus) * 100) + '%' : '0%',
                description: 'What % of your final corpus is profit: (Returns / Maturity Value) × 100.',
            },
        ];
    }, [results]);

    function formatINR(num: number) {
        return num.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    }

    const handleInputChange = (key: keyof SIPCalculatorInputs) => (value: number) => {
        setInputs((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <CalculatorPageLayout>
            <CalculatorHero
                title="SIP Calculator"
                subtitle="FINANCIAL CALCULATOR"
                description="Calculate your wealth growth through Systematic Investment Plans. Plan your future with disciplined monthly investments and watch your wealth compound over time."
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'SIP Calculator' },
                ]}
                icon={<FaRupeeSign />}
                image="/Hero Section/Calculator.png"
            />
            <div className="calculator-section bg-gradient-to-br from-secondary/10 to-secondary/5 py-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 items-stretch">
                    <div className="col-span-1 flex items-center">
                        <CalculatorFormCard title="SIP Details" subtitle="Enter your investment details below">
                            <CalculatorInput
                                label="Monthly Amount"
                                value={inputs.monthlyInvestment}
                                onChange={handleInputChange('monthlyInvestment')}
                                min={500}
                                max={500000}
                                step={500}
                                currency
                                error={errors.monthlyInvestment}
                            />
                            <CalculatorInput
                                label="Duration (years)"
                                value={inputs.durationYears}
                                onChange={handleInputChange('durationYears')}
                                min={1}
                                max={30}
                                error={errors.durationYears}
                            />
                            <CalculatorInput
                                label="Expected Returns (%)"
                                value={inputs.expectedReturns}
                                onChange={handleInputChange('expectedReturns')}
                                min={8}
                                max={25}
                                step={0.1}
                                error={errors.expectedReturns}
                            />
                            <CalculatorInput
                                label="Step-Up (%)"
                                value={inputs.stepUpPercent}
                                onChange={handleInputChange('stepUpPercent')}
                                min={0}
                                max={20}
                                step={0.1}
                                error={errors.stepUpPercent}
                            />
                        </CalculatorFormCard>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <CalculatorResultCard
                            title="SIP Summary"
                            subtitle="Your SIP projection"
                            metrics={metrics}
                            chart={
                                <ChartWrapper>
                                    <SIPDonutChart
                                        invested={results.invested || 0}
                                        returns={results.returns || 0}
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

export default SIPCalculator;
