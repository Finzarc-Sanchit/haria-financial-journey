import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ClipboardCheck, Send, Loader2 } from "lucide-react";
import financialHealthService, { CreateFinancialHealthData } from "@/services/financialHealthService";

const FinancialHealthForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Section 1: Personal & Professional Information
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    maritalStatus: "",
    dependents: "",
    occupationStatus: "",
    annualIncome: "",
    expectedGrowthRate: "",
    taxBracket: "",
    taxRegime: "",
    existingLoans: [] as string[],
    otherLoan: "",
    
    // Section 2: Current Financial Position
    monthlyIncome: "",
    monthlyExpenses: "",
    emergencyFund: "",
    emergencyFundMonths: "",
    bankSavingsFDs: "",
    mutualFundsEquity: "",
    bondsDebentures: "",
    goldSilver: "",
    realEstate: "",
    retirementAccounts: "",
    insuranceDetails: "",
    outstandingLoans: "",
    emiCommitments: "",
    
    // Section 3: Risk Profile & Investment Preferences
    marketVolatilityComfort: "",
    primaryInvestmentObjective: "",
    investmentHorizon: "",
    preferredAssetClasses: "",
    internationalInvestments: "",
    
    // Section 4: Insurance & Protection Planning
    hasHealthInsurance: "",
    healthInsuranceCoverage: "",
    healthInsuranceFamilyMembers: "",
    hasLifeInsurance: "",
    lifeInsuranceType: "",
    lifeInsuranceCoverage: "",
    otherProtection: "",
    adequatelyInsured: "",
    
    // Section 5: Goals & Aspirations
    shortTermGoals: "",
    mediumTermGoals: "",
    longTermGoals: "",
    specificMilestones: [] as string[],
    otherMilestone: "",
    
    // Section 6: Estate & Legacy Planning
    hasWillEstatePlan: "",
    wantsTrustsSuccession: "",
    nomineesUpdated: "",
    
    // Section 7: Financial Behavior & Preferences
    investmentPreference: "",
    portfolioReviewFrequency: "",
    investmentApproach: "",
    timeTrackingInvestments: "",
    
    // Section 8: Advisor Expectations
    advisorExpectations: [] as string[],
    preferredReviewMeetings: "",
    digitalAccessPreference: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[name as keyof typeof prev] as string[];
      if (checked) {
        return { ...prev, [name]: [...currentArray, value] };
      } else {
        return { ...prev, [name]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create assessment using the service
      const assessmentData: CreateFinancialHealthData = {
        ...formData,
      };

      await financialHealthService.createAssessment(assessmentData);

      toast({
        title: "Success!",
        description: "Your financial health assessment has been submitted. We'll contact you soon!",
        duration: 5000,
      });
      
      // Reset form and scroll to top
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        maritalStatus: "",
        dependents: "",
        occupationStatus: "",
        annualIncome: "",
        expectedGrowthRate: "",
        taxBracket: "",
        taxRegime: "",
        existingLoans: [] as string[],
        otherLoan: "",
        monthlyIncome: "",
        monthlyExpenses: "",
        emergencyFund: "",
        emergencyFundMonths: "",
        bankSavingsFDs: "",
        mutualFundsEquity: "",
        bondsDebentures: "",
        goldSilver: "",
        realEstate: "",
        retirementAccounts: "",
        insuranceDetails: "",
        outstandingLoans: "",
        emiCommitments: "",
        marketVolatilityComfort: "",
        primaryInvestmentObjective: "",
        investmentHorizon: "",
        preferredAssetClasses: "",
        internationalInvestments: "",
        hasHealthInsurance: "",
        healthInsuranceCoverage: "",
        healthInsuranceFamilyMembers: "",
        hasLifeInsurance: "",
        lifeInsuranceType: "",
        lifeInsuranceCoverage: "",
        otherProtection: "",
        adequatelyInsured: "",
        shortTermGoals: "",
        mediumTermGoals: "",
        longTermGoals: "",
        specificMilestones: [] as string[],
        otherMilestone: "",
        hasWillEstatePlan: "",
        wantsTrustsSuccession: "",
        nomineesUpdated: "",
        investmentPreference: "",
        portfolioReviewFrequency: "",
        investmentApproach: "",
        timeTrackingInvestments: "",
        advisorExpectations: [] as string[],
        preferredReviewMeetings: "",
        digitalAccessPreference: "",
      });
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error('Error submitting financial health assessment:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your assessment. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-tertiary pt-16 md:pt-20 lg:pt-20">
      {/* Form Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Financial Health Assessment
            </h1>
            <p className="font-crimson text-base md:text-lg text-white/80 leading-relaxed max-w-3xl">
              Help us understand your complete financial picture. Fill out this comprehensive questionnaire, 
              and our experts will reach out with personalized recommendations tailored to your goals.
            </p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Personal & Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl font-semibold text-tertiary">Personal & Professional Information</CardTitle>
                  <CardDescription className="font-crimson">Tell us about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Details */}
                  <div>
                    <Label className="font-crimson font-semibold text-base mb-3 block">1. Personal Details</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="font-crimson text-sm">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          placeholder="First name"
                          className="font-crimson"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="middleName" className="font-crimson text-sm">Middle Name</Label>
                        <Input
                          id="middleName"
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleInputChange}
                          placeholder="Middle name"
                          className="font-crimson"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="font-crimson text-sm">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          placeholder="Last name"
                          className="font-crimson"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-crimson text-sm">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your.email@example.com"
                          className="font-crimson"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-crimson text-sm">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="+91 12345 67890"
                          className="font-crimson"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="font-crimson text-sm">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          required
                          className="font-crimson"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maritalStatus" className="font-crimson text-sm">Marital Status *</Label>
                        <Select 
                          name="maritalStatus" 
                          value={formData.maritalStatus}
                          onValueChange={(value) => handleSelectChange("maritalStatus", value)}
                        >
                          <SelectTrigger className="font-crimson">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dependents" className="font-crimson text-sm">Dependents (if any)</Label>
                        <Input
                          id="dependents"
                          name="dependents"
                          value={formData.dependents}
                          onChange={handleInputChange}
                          placeholder="Number and details"
                          className="font-crimson"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Occupation & Employment Status */}
                  <div>
                    <Label className="font-crimson font-semibold text-base mb-3 block">2. Occupation & Employment Status *</Label>
                    <RadioGroup 
                      value={formData.occupationStatus}
                      onValueChange={(value) => handleSelectChange("occupationStatus", value)}
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="salaried" id="salaried" />
                        <Label htmlFor="salaried" className="font-crimson cursor-pointer">Salaried</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="self-employed" id="self-employed" />
                        <Label htmlFor="self-employed" className="font-crimson cursor-pointer">Self-employed</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="business" id="business" />
                        <Label htmlFor="business" className="font-crimson cursor-pointer">Business Owner</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="retired" id="retired" />
                        <Label htmlFor="retired" className="font-crimson cursor-pointer">Retired</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other-occupation" />
                        <Label htmlFor="other-occupation" className="font-crimson cursor-pointer">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Annual Income */}
                  <div>
                    <Label className="font-crimson font-semibold text-base mb-3 block">3. Annual Income (Fixed + Variable) *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="annualIncome" className="font-crimson text-sm">Annual Income (₹)</Label>
                      <Input
                        id="annualIncome"
                        name="annualIncome"
                        value={formData.annualIncome}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., ₹15,00,000"
                        className="font-crimson"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedGrowthRate" className="font-crimson text-sm">Expected Growth Rate in Income</Label>
                      <Input
                        id="expectedGrowthRate"
                        name="expectedGrowthRate"
                        value={formData.expectedGrowthRate}
                        onChange={handleInputChange}
                        placeholder="e.g., 10% per annum"
                        className="font-crimson"
                      />
                    </div>
                  </div>
                  </div>

                  {/* Existing Loans */}
                  <div>
                    <Label className="font-crimson font-semibold text-base mb-3 block">4. Any existing loans or liabilities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: "home-loan", label: "Home Loan", value: "home" },
                        { id: "car-loan", label: "Car Loan", value: "car" },
                        { id: "personal-loan", label: "Personal Loan", value: "personal" },
                        { id: "credit-card", label: "Credit Card Debt", value: "credit" },
                      ].map((loan) => (
                        <div key={loan.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={loan.id}
                            checked={formData.existingLoans.includes(loan.value)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("existingLoans", loan.value, checked as boolean)
                            }
                          />
                          <Label htmlFor={loan.id} className="font-crimson text-sm cursor-pointer">
                            {loan.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <Input
                      id="otherLoan"
                      name="otherLoan"
                      value={formData.otherLoan}
                      onChange={handleInputChange}
                      placeholder="Other loans (please specify)"
                      className="font-crimson mt-3"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Current Financial Position */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl font-semibold text-tertiary">Current Financial Position</CardTitle>
                  <CardDescription className="font-crimson">Your current financial situation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Monthly Income vs Expenses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyIncome" className="font-crimson text-sm">1. Current Monthly Income (₹)</Label>
                      <Input
                        id="monthlyIncome"
                        name="monthlyIncome"
                        value={formData.monthlyIncome}
                        onChange={handleInputChange}
                        placeholder="e.g., 1,50,000"
                        className="font-crimson"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyExpenses" className="font-crimson text-sm">Monthly Household Expenses (₹)</Label>
                      <Input
                        id="monthlyExpenses"
                        name="monthlyExpenses"
                        value={formData.monthlyExpenses}
                        onChange={handleInputChange}
                        placeholder="e.g., 80,000"
                        className="font-crimson"
                      />
                    </div>
                  </div>

                  {/* Emergency Fund */}
                  <div>
                    <Label className="font-crimson font-semibold text-base mb-3 block">2. Do you maintain an emergency fund?</Label>
                    <RadioGroup 
                      value={formData.emergencyFund}
                      onValueChange={(value) => handleSelectChange("emergencyFund", value)}
                      className="flex gap-4 mb-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="emergency-yes" />
                        <Label htmlFor="emergency-yes" className="font-crimson cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="emergency-no" />
                        <Label htmlFor="emergency-no" className="font-crimson cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                    {formData.emergencyFund === "yes" && (
                      <Input
                        id="emergencyFundMonths"
                        name="emergencyFundMonths"
                        value={formData.emergencyFundMonths}
                        onChange={handleInputChange}
                        placeholder="How many months of expenses does it cover?"
                        className="font-crimson"
                      />
                    )}
                  </div>

                  {/* Current Assets */}
                  <div>
                    <Label className="font-crimson font-semibold text-base mb-3 block">3. Assets (approximate value in ₹)</Label>
                    <div className="space-y-3">
                      <Input
                        name="bankSavingsFDs"
                        value={formData.bankSavingsFDs}
                        onChange={handleInputChange}
                        placeholder="Bank Savings & FDs"
                        className="font-crimson"
                      />
                      <Input
                        name="mutualFundsEquity"
                        value={formData.mutualFundsEquity}
                        onChange={handleInputChange}
                        placeholder="Mutual Funds / Equity Investments"
                        className="font-crimson"
                      />
                      <Input
                        name="bondsDebentures"
                        value={formData.bondsDebentures}
                        onChange={handleInputChange}
                        placeholder="Bonds / Debentures"
                        className="font-crimson"
                      />
                      <Input
                        name="goldSilver"
                        value={formData.goldSilver}
                        onChange={handleInputChange}
                        placeholder="Gold / Silver / Other Commodities"
                        className="font-crimson"
                      />
                      <Input
                        name="realEstate"
                        value={formData.realEstate}
                        onChange={handleInputChange}
                        placeholder="Real Estate Investments"
                        className="font-crimson"
                      />
                      <Input
                        name="retirementAccounts"
                        value={formData.retirementAccounts}
                        onChange={handleInputChange}
                        placeholder="Retirement Accounts (PF, NPS, Pension Plans)"
                        className="font-crimson"
                      />
                      <Textarea
                        name="insuranceDetails"
                        value={formData.insuranceDetails}
                        onChange={handleInputChange}
                        placeholder="Insurance (Life, Health, General) with coverage details"
                        className="font-crimson min-h-[80px]"
                      />
                    </div>
                  </div>

                  {/* Current Liabilities */}
                  <div>
                    <Label className="font-crimson font-semibold text-base mb-3 block">4. Liabilities</Label>
                    <div className="space-y-3">
                      <Textarea
                        name="outstandingLoans"
                        value={formData.outstandingLoans}
                        onChange={handleInputChange}
                        placeholder="Outstanding loans (type and amount)"
                        className="font-crimson min-h-[80px]"
                      />
                      <Textarea
                        name="emiCommitments"
                        value={formData.emiCommitments}
                        onChange={handleInputChange}
                        placeholder="EMI commitments (monthly amount and duration)"
                        className="font-crimson min-h-[80px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 3: Risk Profile & Investment Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl font-semibold text-tertiary">Risk Profile & Investment Preferences</CardTitle>
                  <CardDescription className="font-crimson">Understanding your investment comfort and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Market Volatility */}
                  <div className="space-y-2">
                    <Label className="font-crimson font-semibold text-base">1. How do you feel about short-term market volatility?</Label>
                    <Select 
                      name="marketVolatilityComfort" 
                      value={formData.marketVolatilityComfort}
                      onValueChange={(value) => handleSelectChange("marketVolatilityComfort", value)}
                    >
                      <SelectTrigger className="font-crimson">
                        <SelectValue placeholder="Select your comfort level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="very-uncomfortable">Very Uncomfortable</SelectItem>
                        <SelectItem value="somewhat-uncomfortable">Somewhat Uncomfortable</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                        <SelectItem value="very-comfortable">Very Comfortable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Primary Investment Objective */}
                  <div className="space-y-2">
                    <Label className="font-crimson font-semibold text-base">2. What is your primary investment objective?</Label>
                    <Select 
                      name="primaryInvestmentObjective" 
                      value={formData.primaryInvestmentObjective}
                      onValueChange={(value) => handleSelectChange("primaryInvestmentObjective", value)}
                    >
                      <SelectTrigger className="font-crimson">
                        <SelectValue placeholder="Select your primary objective" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="capital-preservation">Capital Preservation</SelectItem>
                        <SelectItem value="regular-income">Regular Income</SelectItem>
                        <SelectItem value="balanced">Balanced Growth & Income</SelectItem>
                        <SelectItem value="wealth-creation">Wealth Creation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Investment Horizon */}
                  <div className="space-y-2">
                    <Label className="font-crimson font-semibold text-base">3. Investment Horizon for majority of your funds</Label>
                    <Select 
                      name="investmentHorizon" 
                      value={formData.investmentHorizon}
                      onValueChange={(value) => handleSelectChange("investmentHorizon", value)}
                    >
                      <SelectTrigger className="font-crimson">
                        <SelectValue placeholder="Select time horizon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<1">Less than 1 year</SelectItem>
                        <SelectItem value="1-3">1–3 years</SelectItem>
                        <SelectItem value="3-5">3–5 years</SelectItem>
                        <SelectItem value="5-10">5–10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Preferred Asset Classes */}
                  <div className="space-y-2">
                    <Label htmlFor="preferredAssetClasses" className="font-crimson font-semibold text-base">4. Preferred Asset Classes (rank in priority)</Label>
                    <Textarea
                      id="preferredAssetClasses"
                      name="preferredAssetClasses"
                      value={formData.preferredAssetClasses}
                      onChange={handleInputChange}
                      placeholder="e.g., 1. Equity, 2. Debt, 3. Gold/Silver, 4. Real Estate, 5. Alternative Investments"
                      className="font-crimson min-h-[80px]"
                    />
                  </div>

                  {/* International Investments */}
                  <div className="space-y-2">
                    <Label className="font-crimson font-semibold text-base">5. Are you comfortable investing in international assets / global funds?</Label>
                    <RadioGroup 
                      value={formData.internationalInvestments}
                      onValueChange={(value) => handleSelectChange("internationalInvestments", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="intl-yes" />
                        <Label htmlFor="intl-yes" className="font-crimson cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="intl-no" />
                        <Label htmlFor="intl-no" className="font-crimson cursor-pointer">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maybe" id="intl-maybe" />
                        <Label htmlFor="intl-maybe" className="font-crimson cursor-pointer">Maybe / Need guidance</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Section 4: Insurance & Protection Planning */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl font-semibold text-tertiary">Insurance & Protection Planning</CardTitle>
                  <CardDescription className="font-crimson">Ensuring adequate protection for you and your family</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Health Insurance */}
                  <div>
                    <Label className="font-crimson font-semibold text-base mb-3 block">1. Do you currently have health insurance?</Label>
                    <RadioGroup 
                      value={formData.hasHealthInsurance}
                      onValueChange={(value) => handleSelectChange("hasHealthInsurance", value)}
                      className="flex gap-4 mb-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="health-yes" />
                        <Label htmlFor="health-yes" className="font-crimson cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="health-no" />
                        <Label htmlFor="health-no" className="font-crimson cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                    {formData.hasHealthInsurance === "yes" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          name="healthInsuranceCoverage"
                          value={formData.healthInsuranceCoverage}
                          onChange={handleInputChange}
                          placeholder="Coverage amount (₹)"
                          className="font-crimson"
                        />
                        <Input
                          name="healthInsuranceFamilyMembers"
                          value={formData.healthInsuranceFamilyMembers}
                          onChange={handleInputChange}
                          placeholder="Family members covered"
                          className="font-crimson"
                        />
                      </div>
                    )}
                  </div>

                  {/* Life Insurance */}
                  <div>
                    <Label className="font-crimson font-semibold text-base mb-3 block">2. Do you currently have life insurance?</Label>
                    <RadioGroup 
                      value={formData.hasLifeInsurance}
                      onValueChange={(value) => handleSelectChange("hasLifeInsurance", value)}
                      className="flex gap-4 mb-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="life-yes" />
                        <Label htmlFor="life-yes" className="font-crimson cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="life-no" />
                        <Label htmlFor="life-no" className="font-crimson cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                    {formData.hasLifeInsurance === "yes" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          name="lifeInsuranceType"
                          value={formData.lifeInsuranceType}
                          onChange={handleInputChange}
                          placeholder="Type (Term, ULIP, Endowment, etc.)"
                          className="font-crimson"
                        />
                        <Input
                          name="lifeInsuranceCoverage"
                          value={formData.lifeInsuranceCoverage}
                          onChange={handleInputChange}
                          placeholder="Coverage amount (₹)"
                          className="font-crimson"
                        />
                      </div>
                    )}
                  </div>

                  {/* Other Protection */}
                  <div className="space-y-2">
                    <Label htmlFor="otherProtection" className="font-crimson font-semibold text-base">3. Any other forms of protection?</Label>
                    <Textarea
                      id="otherProtection"
                      name="otherProtection"
                      value={formData.otherProtection}
                      onChange={handleInputChange}
                      placeholder="Critical illness, accidental, term plans, etc."
                      className="font-crimson min-h-[80px]"
                    />
                  </div>

                  {/* Adequately Insured */}
                  <div className="space-y-2">
                    <Label className="font-crimson font-semibold text-base">4. Do you feel adequately insured for your dependents' financial security?</Label>
                    <RadioGroup 
                      value={formData.adequatelyInsured}
                      onValueChange={(value) => handleSelectChange("adequatelyInsured", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="adequate-yes" />
                        <Label htmlFor="adequate-yes" className="font-crimson cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="adequate-no" />
                        <Label htmlFor="adequate-no" className="font-crimson cursor-pointer">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unsure" id="adequate-unsure" />
                        <Label htmlFor="adequate-unsure" className="font-crimson cursor-pointer">Unsure</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Section 5: Goals & Aspirations */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl font-semibold text-tertiary">Goals & Aspirations</CardTitle>
                  <CardDescription className="font-crimson">What are you working towards?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="shortTermGoals" className="font-crimson font-semibold text-base">1. Short-term goals (0 to 2 years)</Label>
                    <Textarea
                      id="shortTermGoals"
                      name="shortTermGoals"
                      value={formData.shortTermGoals}
                      onChange={handleInputChange}
                      placeholder="e.g., Emergency fund, vacation, car purchase..."
                      className="font-crimson min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mediumTermGoals" className="font-crimson font-semibold text-base">2. Medium-term goals (2 to 5 years)</Label>
                    <Textarea
                      id="mediumTermGoals"
                      name="mediumTermGoals"
                      value={formData.mediumTermGoals}
                      onChange={handleInputChange}
                      placeholder="e.g., Home purchase, business expansion..."
                      className="font-crimson min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longTermGoals" className="font-crimson font-semibold text-base">3. Long-term goals (more than 5 years)</Label>
                    <Textarea
                      id="longTermGoals"
                      name="longTermGoals"
                      value={formData.longTermGoals}
                      onChange={handleInputChange}
                      placeholder="e.g., Retirement, children's education, legacy planning..."
                      className="font-crimson min-h-[100px]"
                    />
                  </div>

                  {/* Specific Milestones */}
                  <div>
                    <Label className="font-crimson font-semibold text-base mb-3 block">4. Specific milestones to plan for</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { id: "wedding", label: "Wedding", value: "wedding" },
                        { id: "foreign-edu", label: "Foreign Education", value: "education" },
                        { id: "philanthropy", label: "Philanthropy", value: "philanthropy" },
                      ].map((milestone) => (
                        <div key={milestone.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={milestone.id}
                            checked={formData.specificMilestones.includes(milestone.value)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("specificMilestones", milestone.value, checked as boolean)
                            }
                          />
                          <Label htmlFor={milestone.id} className="font-crimson text-sm cursor-pointer">
                            {milestone.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <Input
                      id="otherMilestone"
                      name="otherMilestone"
                      value={formData.otherMilestone}
                      onChange={handleInputChange}
                      placeholder="Other milestones (please specify)"
                      className="font-crimson mt-3"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Section 6: Estate & Legacy Planning */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl font-semibold text-tertiary">Estate & Legacy Planning</CardTitle>
                  <CardDescription className="font-crimson">Planning for the future</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-crimson font-semibold text-base">1. Do you have a Will or Estate Plan in place?</Label>
                    <RadioGroup 
                      value={formData.hasWillEstatePlan}
                      onValueChange={(value) => handleSelectChange("hasWillEstatePlan", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="will-yes" />
                        <Label htmlFor="will-yes" className="font-crimson cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="will-no" />
                        <Label htmlFor="will-no" className="font-crimson cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-crimson font-semibold text-base">2. Do you want to set up any Trusts or Succession Planning structures?</Label>
                    <RadioGroup 
                      value={formData.wantsTrustsSuccession}
                      onValueChange={(value) => handleSelectChange("wantsTrustsSuccession", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="trust-yes" />
                        <Label htmlFor="trust-yes" className="font-crimson cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="trust-no" />
                        <Label htmlFor="trust-no" className="font-crimson cursor-pointer">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unsure" id="trust-unsure" />
                        <Label htmlFor="trust-unsure" className="font-crimson cursor-pointer">Need Guidance</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-crimson font-semibold text-base">3. Do you have nominees updated in all your investments & insurance policies?</Label>
                    <RadioGroup 
                      value={formData.nomineesUpdated}
                      onValueChange={(value) => handleSelectChange("nomineesUpdated", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="nominee-yes" />
                        <Label htmlFor="nominee-yes" className="font-crimson cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="nominee-no" />
                        <Label htmlFor="nominee-no" className="font-crimson cursor-pointer">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="partial" id="nominee-partial" />
                        <Label htmlFor="nominee-partial" className="font-crimson cursor-pointer">Partially</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Section 7: Financial Behavior & Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl font-semibold text-tertiary">Financial Behavior & Preferences</CardTitle>
                  <CardDescription className="font-crimson">Your investment style and habits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-crimson font-semibold text-base">1. Do you prefer:</Label>
                    <RadioGroup 
                      value={formData.investmentPreference}
                      onValueChange={(value) => handleSelectChange("investmentPreference", value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="active" id="active" />
                        <Label htmlFor="active" className="font-crimson cursor-pointer">Actively managed investments</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="passive" id="passive" />
                        <Label htmlFor="passive" className="font-crimson cursor-pointer">Passive (index/ETF) investing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mix" id="mix" />
                        <Label htmlFor="mix" className="font-crimson cursor-pointer">A mix of both</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-crimson font-semibold text-base">2. How often do you review your financial portfolio?</Label>
                    <Select 
                      name="portfolioReviewFrequency" 
                      value={formData.portfolioReviewFrequency}
                      onValueChange={(value) => handleSelectChange("portfolioReviewFrequency", value)}
                    >
                      <SelectTrigger className="font-crimson">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="half-yearly">Half-yearly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                        <SelectItem value="major-events">Only when there's a major event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-crimson font-semibold text-base">3. Do you prefer automated SIP / disciplined investing or tactical lump sum calls?</Label>
                    <RadioGroup 
                      value={formData.investmentApproach}
                      onValueChange={(value) => handleSelectChange("investmentApproach", value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sip" id="sip" />
                        <Label htmlFor="sip" className="font-crimson cursor-pointer">Automated SIP / Disciplined investing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lumpsum" id="lumpsum" />
                        <Label htmlFor="lumpsum" className="font-crimson cursor-pointer">Tactical lump sum calls</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both-approach" />
                        <Label htmlFor="both-approach" className="font-crimson cursor-pointer">A mix of both</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-crimson font-semibold text-base">4. How much time do you like to spend tracking investments?</Label>
                    <Select 
                      name="timeTrackingInvestments" 
                      value={formData.timeTrackingInvestments}
                      onValueChange={(value) => handleSelectChange("timeTrackingInvestments", value)}
                    >
                      <SelectTrigger className="font-crimson">
                        <SelectValue placeholder="Select time preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal - I prefer hands-off approach</SelectItem>
                        <SelectItem value="moderate">Moderate - Regular check-ins</SelectItem>
                        <SelectItem value="active">Active - I like to track closely</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Section 8: Advisor Expectations */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl font-semibold text-tertiary">Advisor Expectations</CardTitle>
                  <CardDescription className="font-crimson">How can we serve you best?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="font-crimson font-semibold text-base mb-3 block">1. What do you expect from your financial advisor?</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: "planning", label: "Comprehensive planning & execution", value: "planning" },
                        { id: "products", label: "Product recommendations", value: "products" },
                        { id: "reviews", label: "Regular reviews and rebalancing", value: "reviews" },
                        { id: "tax", label: "Tax optimization", value: "tax" },
                        { id: "estate", label: "Estate & succession planning", value: "estate" },
                      ].map((expectation) => (
                        <div key={expectation.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={expectation.id}
                            checked={formData.advisorExpectations.includes(expectation.value)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("advisorExpectations", expectation.value, checked as boolean)
                            }
                          />
                          <Label htmlFor={expectation.id} className="font-crimson text-sm cursor-pointer">
                            {expectation.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-crimson font-semibold text-base">2. How often would you like review meetings?</Label>
                    <Select 
                      name="preferredReviewMeetings" 
                      value={formData.preferredReviewMeetings}
                      onValueChange={(value) => handleSelectChange("preferredReviewMeetings", value)}
                    >
                      <SelectTrigger className="font-crimson">
                        <SelectValue placeholder="Select meeting frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="half-yearly">Half-yearly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-crimson font-semibold text-base">3. Do you want digital access, reports, and alerts for your portfolio?</Label>
                    <RadioGroup 
                      value={formData.digitalAccessPreference}
                      onValueChange={(value) => handleSelectChange("digitalAccessPreference", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="digital-yes" />
                        <Label htmlFor="digital-yes" className="font-crimson cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="digital-no" />
                        <Label htmlFor="digital-no" className="font-crimson cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-secondary hover:bg-secondary/90 text-white px-12 py-6 text-lg font-semibold font-crimson transition-all shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Assessment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FinancialHealthForm;
