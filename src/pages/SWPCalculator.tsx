import { useMemo } from 'react';
import { FaUserClock } from 'react-icons/fa';
import { useCalculator } from '@/hooks/useCalculator';
import { validateRange } from '@/utils/validators';
import CalculatorPageLayout from '@/components/calculators/shared/CalculatorPageLayout';
import CalculatorHero from '@/components/calculators/shared/CalculatorHero';
import CalculatorFormCard from '@/components/calculators/shared/CalculatorFormCard';
import CalculatorResultCard from '@/components/calculators/shared/CalculatorResultCard';
import ChartWrapper from '@/components/calculators/shared/ChartWrapper';
import FAQSection from '@/components/calculators/shared/FAQSection';
import CalculatorInput from '@/components/calculators/shared/CalculatorInput';
import SWPBarChart from '@/components/calculators/shared/SWPBarChart';
import { calculateSWP } from '@/utils';
import { SWPResult } from '@/types/calculator';

const defaultInputs = {
    corpus: 1200000,
    withdrawalAmount: 10000,
    durationYears: 10,
    expectedReturns: 7,
};

const validationRules = {
    corpus: (v: number) => validateRange(v, 50000, 50000000, 'Corpus Amount') || null,
    withdrawalAmount: (v: number) => validateRange(v, 500, 500000, 'Withdrawal Amount') || null,
    durationYears: (v: number) => validateRange(v, 1, 50, 'Duration') || null,
    expectedReturns: (v: number) => validateRange(v, 3, 25, 'Expected Returns') || null,
};

const faqList = [
    {
        question: 'What is an SWP?',
        answer: 'A Systematic Withdrawal Plan (SWP) allows you to withdraw a fixed amount regularly from your mutual fund investments while showing the remaining value of your investment over time.'
    },
    {
        question: 'How is the SWP calculated?',
        answer: 'The SWP calculator uses monthly compounding where interest is calculated on the remaining balance each month, and then the withdrawal amount is deducted. This shows how long your investment will last.'
    },
    {
        question: 'What happens if my investment runs out before the tenure?',
        answer: 'If your investment corpus depletes before the desired period, the calculator will show a warning and display the actual duration your investment lasted.'
    },
    {
        question: 'Are SWP returns guaranteed?',
        answer: 'No, SWP returns depend on the performance of your underlying mutual fund investments. The calculator provides estimates based on expected returns.'
    },
    {
        question: 'Is SWP suitable for retirement planning?',
        answer: 'Yes, SWP is especially useful for retirement planning as it helps estimate steady income and shows how long your investment will last.'
    },
];

function formatINR(num: number) {
    return num.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

const SWPCalculator = () => {
    const { inputs, setInputs, errors, results, warnings } = useCalculator<typeof defaultInputs, SWPResult>(
        defaultInputs,
        (inputs) => {
            const result = calculateSWP(
                inputs.corpus,
                inputs.withdrawalAmount,
                inputs.durationYears,
                inputs.expectedReturns
            );

            if (result.maturityCorpus <= 0) {
                return {
                    ...result,
                    warning: "Investment won't last for the desired period. Please adjust your inputs."
                };
            }

            return result;
        },
        validationRules
    );

    const metrics = useMemo(() => [
        { label: 'Corpus Used', value: Math.round(inputs.corpus), currency: true },
        { label: 'Total Withdrawn', value: Math.round(results.totalWithdrawn || 0), currency: true },
        { label: 'Returns Earned', value: Math.round(results.returns || 0), currency: true },
        { label: 'Corpus Left', value: Math.round(results.maturityCorpus || 0), currency: true },
    ], [inputs.corpus, results]);

    const explanations = useMemo(() => [
        {
            label: 'Corpus Used',
            value: formatINR(inputs.corpus),
            description: 'Initial investment corpus for SWP.'
        },
        {
            label: 'Total Withdrawn',
            value: formatINR(results.totalWithdrawn || 0),
            description: 'Total money withdrawn over the SWP period.'
        },
        {
            label: 'Returns Earned',
            value: formatINR(results.returns || 0),
            description: 'Estimated profit earned on your corpus.'
        },
        {
            label: 'Corpus Left',
            value: formatINR(results.maturityCorpus || 0),
            description: 'Corpus remaining at the end of the SWP period.'
        },
    ], [inputs.corpus, results]);

    const handleInputChange = (key) => (value) => {
        setInputs((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <CalculatorPageLayout>
            <CalculatorHero
                title="SWP Calculator"
                subtitle="FINANCIAL CALCULATOR"
                description="Plan your systematic withdrawals with confidence. Calculate how long your investment will last with regular monthly withdrawals and optimal returns."
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'SWP Calculator' },
                ]}
                icon={<FaUserClock />}
                image="/Hero Section/Calculator.png"
            />
            <div className="calculator-section bg-gradient-to-br from-secondary/10 to-secondary/5 py-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 items-stretch">
                    <div className="col-span-1 flex items-center">
                        <CalculatorFormCard title="SWP Details" subtitle="Enter your withdrawal details below">
                            <CalculatorInput
                                label="Corpus Amount"
                                value={inputs.corpus}
                                onChange={handleInputChange('corpus')}
                                min={50000}
                                max={50000000}
                                step={10000}
                                currency
                                error={errors.corpus}
                            />
                            <CalculatorInput
                                label="Withdrawal Amount"
                                value={inputs.withdrawalAmount}
                                onChange={handleInputChange('withdrawalAmount')}
                                min={500}
                                max={500000}
                                step={500}
                                currency
                                error={errors.withdrawalAmount}
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
                                min={3}
                                max={25}
                                step={0.1}
                                error={errors.expectedReturns}
                            />
                            {warnings.length > 0 && (
                                <div className="text-[#81a2b1] text-sm font-crimson animate-fade-in p-4 bg-[#81a2b1]/10 rounded-lg">
                                    {warnings.map((w, index) => (
                                        <div key={index}>{w}</div>
                                    ))}
                                </div>
                            )}
                        </CalculatorFormCard>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <CalculatorResultCard
                            title="SWP Summary"
                            subtitle="Your withdrawal projection"
                            metrics={metrics}
                            chart={
                                <ChartWrapper>
                                    <SWPBarChart 
                                        corpus={inputs.corpus}
                                        withdrawn={results.totalWithdrawn || 0}
                                        returns={results.returns || 0}
                                        corpusLeft={results.maturityCorpus || 0}
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

export default SWPCalculator;
