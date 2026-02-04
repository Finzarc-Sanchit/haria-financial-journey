# Financial Health Form API Specification

## Overview
The Financial Health Form has been integrated into the frontend and requires a backend API endpoint to store submissions.

## Required Endpoint

### Create Financial Health Assessment
**Endpoint:** `POST /api/v1/financial-health`

**Request Body:**
```json
{
  "firstName": "string (required)",
  "middleName": "string (optional)",
  "lastName": "string (required)",
  "dateOfBirth": "string (required)",
  "maritalStatus": "string (required)",
  "dependents": "string (optional)",
  "occupationStatus": "string (required)",
  "annualIncome": "string (required)",
  "expectedGrowthRate": "string (optional)",
  "taxBracket": "string (optional)",
  "taxRegime": "string (optional)",
  "existingLoans": "string[] (optional)",
  "otherLoan": "string (optional)",
  "monthlyIncome": "string (optional)",
  "monthlyExpenses": "string (optional)",
  "emergencyFund": "string (required)",
  "emergencyFundMonths": "string (optional)",
  "bankSavingsFDs": "string (optional)",
  "mutualFundsEquity": "string (optional)",
  "bondsDebentures": "string (optional)",
  "goldSilver": "string (optional)",
  "realEstate": "string (optional)",
  "retirementAccounts": "string (optional)",
  "insuranceDetails": "string (optional)",
  "outstandingLoans": "string (optional)",
  "emiCommitments": "string (optional)",
  "marketVolatilityComfort": "string (optional)",
  "primaryInvestmentObjective": "string (optional)",
  "investmentHorizon": "string (optional)",
  "preferredAssetClasses": "string (optional)",
  "internationalInvestments": "string (optional)",
  "hasHealthInsurance": "string (required)",
  "healthInsuranceCoverage": "string (optional)",
  "healthInsuranceFamilyMembers": "string (optional)",
  "hasLifeInsurance": "string (required)",
  "lifeInsuranceType": "string (optional)",
  "lifeInsuranceCoverage": "string (optional)",
  "otherProtection": "string (optional)",
  "adequatelyInsured": "string (optional)",
  "shortTermGoals": "string (optional)",
  "mediumTermGoals": "string (optional)",
  "longTermGoals": "string (optional)",
  "specificMilestones": "string[] (optional)",
  "otherMilestone": "string (optional)",
  "hasWillEstatePlan": "string (optional)",
  "wantsTrustsSuccession": "string (optional)",
  "nomineesUpdated": "string (optional)",
  "investmentPreference": "string (optional)",
  "portfolioReviewFrequency": "string (optional)",
  "investmentApproach": "string (optional)",
  "timeTrackingInvestments": "string (optional)",
  "advisorExpectations": "string[] (optional)",
  "preferredReviewMeetings": "string (optional)",
  "digitalAccessPreference": "string (optional)"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Financial health assessment created successfully",
  "data": {
    "_id": "string",
    "firstName": "string",
    "lastName": "string",
    // ... all other fields
    "status": "new",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Error message here",
  "data": null
}
```

## Database Schema

### FinancialHealthAssessment Collection
- All fields from the request body
- `status` field: 'new' | 'reviewed' | 'in_progress' | 'completed'
- `createdAt`: timestamp
- `updatedAt`: timestamp

## Frontend Integration
The frontend service is already implemented in `src/services/financialHealthService.ts` and follows the same pattern as the contact service. It will:
1. Submit form data to the endpoint
2. Display success toast on successful submission
3. Reset form and scroll to top
4. Display error toast if submission fails

## Admin Dashboard Integration
Similar to contacts, you may want to add a section in the admin dashboard to view and manage financial health assessments. The frontend service includes a `getAssessmentById` method for this purpose.

