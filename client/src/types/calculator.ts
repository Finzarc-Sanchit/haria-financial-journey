export interface SWPResult {
    maturityCorpus: number;
    totalWithdrawn: number;
    returns: number;
    warning?: string;
    monthlyBreakdown?: Array<{
        month: number;
        startingBalance: number;
        monthlyWithdrawal: number;
        interestEarned: number;
        endingBalance: number;
    }>;
}