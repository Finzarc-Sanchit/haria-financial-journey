import { SIPCalculatorInputs, FDCalculatorInputs, RetirementCalculatorInputs, EmergencyFundInputs } from '@/types/calculator.types';

// SIP: compound calc with step-up
export function calculateSIP(inputs: SIPCalculatorInputs) {
    const months = inputs.durationYears * 12;
    let corpus = 0;
    let invested = 0;
    let m = inputs.monthlyInvestment;
    for (let i = 0; i < months; i++) {
        corpus = (corpus + m) * (1 + inputs.expectedReturns / 100 / 12);
        invested += m;
        if ((i + 1) % 12 === 0) m = m * (1 + (inputs.stepUpPercent || 0) / 100);
    }
    return { corpus, invested, returns: corpus - invested };
}

// FD: compounding frequency logic
export function calculateFD(inputs: FDCalculatorInputs) {
    const n = inputs.compoundingFrequency;
    const r = inputs.interestRate / 100;
    const t = inputs.durationYears;
    const maturity = inputs.principal * Math.pow(1 + r / n, n * t);
    const interest = maturity - inputs.principal;
    const annualized = ((Math.pow(maturity / inputs.principal, 1 / t) - 1) * 100) || 0;
    return { maturity, interest, annualized };
}

// SWP calculation using annual compounding
export function calculateSWP(
    principal: number,
    monthlyWithdrawal: number,
    years: number,
    annualReturn: number
) {
    let balance = principal;
    let totalWithdrawn = 0;
    let totalReturns = 0;
    const monthlyBreakdown: any[] = [];

    console.log(`Starting SWP calculation:`);
    console.log(`Principal: ₹${principal.toLocaleString()}`);
    console.log(`Monthly Withdrawal: ₹${monthlyWithdrawal.toLocaleString()}`);
    console.log(`Years: ${years}`);
    console.log(`Annual Return: ${annualReturn}%`);
    console.log(`Yearly Withdrawal: ₹${(monthlyWithdrawal * 12).toLocaleString()}`);
    console.log('---');

    for (let year = 1; year <= years; year++) {
        const startingBalance = balance;
        const yearlyWithdrawal = monthlyWithdrawal * 12;

        console.log(`Year ${year}:`);
        console.log(`  Opening Corpus: ₹${balance.toLocaleString()}`);

        if (balance >= yearlyWithdrawal) {
            balance -= yearlyWithdrawal;
            totalWithdrawn += yearlyWithdrawal;
            console.log(`  Withdrawals: ₹${yearlyWithdrawal.toLocaleString()} → Corpus left: ₹${balance.toLocaleString()}`);
        } else {
            totalWithdrawn += balance;
            console.log(`  Withdrawals: ₹${balance.toLocaleString()} (partial) → Corpus left: ₹0`);
            balance = 0;
        }

        const yearlyInterest = balance * (annualReturn / 100);
        balance += yearlyInterest;
        totalReturns += yearlyInterest;

        console.log(`  Growth: ${annualReturn}% of ₹${(balance - yearlyInterest).toLocaleString()} = ₹${yearlyInterest.toLocaleString()}`);
        console.log(`  Closing Corpus: ₹${balance.toLocaleString()}`);
        console.log('---');

        // Optional: create month-by-month breakdown
        for (let month = 1; month <= 12; month++) {
            monthlyBreakdown.push({
                month: (year - 1) * 12 + month,
                startingBalance: Math.round(startingBalance),
                monthlyWithdrawal: Math.round(monthlyWithdrawal),
                interestEarned: month === 12 ? Math.round(yearlyInterest) : 0,
                endingBalance: Math.round(balance)
            });
        }

        if (balance <= 0) break;
    }

    console.log(`Final Results:`);
    console.log(`Maturity Corpus: ₹${Math.round(balance).toLocaleString()}`);
    console.log(`Total Withdrawn: ₹${Math.round(totalWithdrawn).toLocaleString()}`);
    console.log(`Total Returns: ₹${Math.round(totalReturns).toLocaleString()}`);

    return {
        maturityCorpus: Math.round(balance),
        totalWithdrawn: Math.round(totalWithdrawn),
        returns: Math.round(totalReturns),
        monthlyBreakdown
    };
}