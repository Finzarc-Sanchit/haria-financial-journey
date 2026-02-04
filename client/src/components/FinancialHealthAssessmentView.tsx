import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { FinancialHealthAssessment } from "@/services/financialHealthService";
import { formatOccupationStatus } from "@/utils";

type Props = {
  assessment: FinancialHealthAssessment;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
};

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <label className="block text-base font-crimson font-semibold text-tertiary mb-2">{label}</label>
    <p className="font-crimson text-lg text-muted-foreground whitespace-pre-wrap">
      {value && value.trim().length > 0 ? value : "-"}
    </p>
  </div>
);

export default function FinancialHealthAssessmentView({ assessment, getStatusColor, getStatusIcon }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-2xl font-playfair font-bold text-tertiary">
            {assessment.firstName} {assessment.lastName}
          </p>
          <p className="font-crimson text-muted-foreground">
            Submitted: {new Date(assessment.createdAt).toLocaleString()}
          </p>
        </div>
        <Badge className={`${getStatusColor(assessment.status)} border flex items-center gap-2 w-fit text-base px-3 py-1`}>
          {getStatusIcon(assessment.status)}
          {assessment.status.replace("_", " ")}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-xl text-tertiary">Personal & Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="First Name" value={assessment.firstName} />
          <Field label="Middle Name" value={assessment.middleName} />
          <Field label="Last Name" value={assessment.lastName} />
          <Field label="Date of Birth" value={assessment.dateOfBirth} />
          <Field label="Marital Status" value={assessment.maritalStatus} />
          <Field label="Dependents" value={assessment.dependents} />
          <Field label="Occupation Status" value={formatOccupationStatus(assessment.occupationStatus)} />
          <Field label="Annual Income" value={assessment.annualIncome} />
          <Field label="Expected Growth Rate" value={assessment.expectedGrowthRate} />
          <Field label="Tax Bracket" value={assessment.taxBracket} />
          <Field label="Tax Regime" value={assessment.taxRegime} />
          <Field label="Existing Loans" value={assessment.existingLoans?.length ? assessment.existingLoans.join(", ") : ""} />
          <Field label="Other Loan" value={assessment.otherLoan} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-xl text-tertiary">Current Financial Position</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Monthly Income" value={assessment.monthlyIncome} />
          <Field label="Monthly Expenses" value={assessment.monthlyExpenses} />
          <Field label="Emergency Fund" value={assessment.emergencyFund} />
          <Field label="Emergency Fund Months" value={assessment.emergencyFundMonths} />
          <Field label="Bank Savings / FDs" value={assessment.bankSavingsFDs} />
          <Field label="Mutual Funds / Equity" value={assessment.mutualFundsEquity} />
          <Field label="Bonds / Debentures" value={assessment.bondsDebentures} />
          <Field label="Gold / Silver" value={assessment.goldSilver} />
          <Field label="Real Estate" value={assessment.realEstate} />
          <Field label="Retirement Accounts" value={assessment.retirementAccounts} />
          <Field label="Insurance Details" value={assessment.insuranceDetails} />
          <Field label="Outstanding Loans" value={assessment.outstandingLoans} />
          <Field label="EMI Commitments" value={assessment.emiCommitments} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-xl text-tertiary">Risk Profile & Investment Preferences</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Market Volatility Comfort" value={assessment.marketVolatilityComfort} />
          <Field label="Primary Objective" value={assessment.primaryInvestmentObjective} />
          <Field label="Investment Horizon" value={assessment.investmentHorizon} />
          <Field label="Preferred Asset Classes" value={assessment.preferredAssetClasses} />
          <Field label="International Investments" value={assessment.internationalInvestments} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-xl text-tertiary">Insurance & Protection Planning</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Has Health Insurance" value={assessment.hasHealthInsurance} />
          <Field label="Health Coverage" value={assessment.healthInsuranceCoverage} />
          <Field label="Covered Members" value={assessment.healthInsuranceFamilyMembers} />
          <Field label="Has Life Insurance" value={assessment.hasLifeInsurance} />
          <Field label="Life Insurance Type" value={assessment.lifeInsuranceType} />
          <Field label="Life Coverage" value={assessment.lifeInsuranceCoverage} />
          <Field label="Other Protection" value={assessment.otherProtection} />
          <Field label="Adequately Insured" value={assessment.adequatelyInsured} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-xl text-tertiary">Goals & Aspirations</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Short Term Goals" value={assessment.shortTermGoals} />
          <Field label="Medium Term Goals" value={assessment.mediumTermGoals} />
          <Field label="Long Term Goals" value={assessment.longTermGoals} />
          <Field label="Specific Milestones" value={assessment.specificMilestones?.length ? assessment.specificMilestones.join(", ") : ""} />
          <Field label="Other Milestone" value={assessment.otherMilestone} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-xl text-tertiary">Estate & Legacy Planning</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Will / Estate Plan" value={assessment.hasWillEstatePlan} />
          <Field label="Trusts / Succession" value={assessment.wantsTrustsSuccession} />
          <Field label="Nominees Updated" value={assessment.nomineesUpdated} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-xl text-tertiary">Financial Behavior & Preferences</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Investment Preference" value={assessment.investmentPreference} />
          <Field label="Review Frequency" value={assessment.portfolioReviewFrequency} />
          <Field label="Investment Approach" value={assessment.investmentApproach} />
          <Field label="Time Tracking Investments" value={assessment.timeTrackingInvestments} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-xl text-tertiary">Advisor Expectations</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Advisor Expectations"
            value={assessment.advisorExpectations?.length ? assessment.advisorExpectations.join(", ") : ""}
          />
          <Field label="Preferred Review Meetings" value={assessment.preferredReviewMeetings} />
          <Field label="Digital Access Preference" value={assessment.digitalAccessPreference} />
        </CardContent>
      </Card>
    </div>
  );
}


