const ExcelJS = require("exceljs");

/**
 * Excel Helper Utility
 * Provides optimized functions for generating Excel files from form submissions
 */

// Excel styling constants
const COLUMN_CONFIG = {
    field: { width: 35 },
    value: { width: 50 }
};

const HEADER_STYLES = {
    contact: { color: 'FF2C3E50' },
    personal: { color: 'FF27AE60' },
    financial: { color: 'FF2980B9' },
    risk: { color: 'FF8E44AD' },
    insurance: { color: 'FFC0392B' },
    goals: { color: 'FF16A085' },
    estate: { color: 'FFD35400' },
    behavior: { color: 'FF2C3E50' },
    advisor: { color: 'FF9B59B6' }
};

/**
 * Apply header styling to a worksheet
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {string} styleKey - Key from HEADER_STYLES
 */
const applyHeaderStyle = (worksheet, styleKey) => {
    const style = HEADER_STYLES[styleKey] || HEADER_STYLES.contact;
    const headerRow = worksheet.getRow(1);

    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: style.color }
    };
};

/**
 * Create a worksheet with standard configuration
 * @param {Object} workbook - ExcelJS workbook
 * @param {string} sheetName - Name of the worksheet
 * @param {string} styleKey - Style key for header
 * @returns {Object} Configured worksheet
 */
const createWorksheet = (workbook, sheetName, styleKey) => {
    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = [
        { header: 'Field', key: 'field', ...COLUMN_CONFIG.field },
        { header: 'Value', key: 'value', ...COLUMN_CONFIG.value }
    ];
    applyHeaderStyle(worksheet, styleKey);
    return worksheet;
};

/**
 * Add data rows to a worksheet
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {Array} data - Array of {field, value} objects
 */
const addDataRows = (worksheet, data) => {
    data.forEach(row => worksheet.addRow(row));
};

/**
 * Helper function to capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
const capitalizeWords = (str) => {
    if (!str || typeof str !== 'string') return str;
    const trimmed = str.trim();

    // Skip if empty, "Not provided", "None", or similar placeholders
    if (!trimmed || /^(not provided|none|n\/a|na)$/i.test(trimmed)) {
        return str;
    }

    // Skip if it's purely numeric, email, or looks like a date/ID
    if (/^\d+$/.test(trimmed) ||
        trimmed.includes('@') ||
        /^\d{4}[-\/]\d{2}[-\/]\d{2}/.test(trimmed) ||
        trimmed.length > 20 && /^[a-f0-9]{24}$/i.test(trimmed)) {
        return str;
    }

    // Capitalize first letter of each word
    return trimmed.split(/\s+/).map(word => {
        if (!word) return word;
        // Preserve special characters at start (like currency symbols)
        const firstChar = word.charAt(0);
        if (/[^a-zA-Z]/.test(firstChar)) {
            return firstChar + (word.length > 1 ? word.charAt(1).toUpperCase() + word.slice(2).toLowerCase() : '');
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
};

/**
 * Format array values for display
 * @param {*} value - Value to format
 * @returns {string} Formatted string
 */
const formatArrayValue = (value) => {
    if (Array.isArray(value)) {
        const formatted = value.filter(Boolean).map(v => capitalizeWords(String(v))).join(', ');
        return formatted || '';
    }
    return value || '';
};

/**
 * Format value for Excel display with capitalization
 * @param {*} value - Value to format
 * @returns {string} Formatted and capitalized string
 */
const formatValue = (value) => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return formatArrayValue(value);
    return capitalizeWords(String(value));
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
    if (!date) return '';
    try {
        return new Date(date).toLocaleString();
    } catch {
        return String(date);
    }
};

/**
 * Generate Excel file for contact form submission
 * @param {Object} contact - Contact document
 * @returns {Promise<Buffer>} Excel file buffer
 */
const generateContactExcel = async (contact) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = createWorksheet(workbook, 'Contact Details', 'contact');

    const contactData = [
        { field: 'First Name', value: formatValue(contact.firstName) },
        { field: 'Last Name', value: formatValue(contact.lastName) },
        { field: 'Full Name', value: formatValue(contact.fullName) },
        { field: 'Email', value: contact.email || '' },
        { field: 'Services', value: formatArrayValue(contact.services) },
        { field: 'Message', value: formatValue(contact.message) },
        { field: 'Status', value: formatValue(contact.status) },
        { field: 'Submitted At', value: formatDate(contact.createdAt) },
        { field: 'Last Updated', value: formatDate(contact.updatedAt) }
    ];

    addDataRows(worksheet, contactData);
    return await workbook.xlsx.writeBuffer();
};

/**
 * Generate Excel file for financial health assessment
 * @param {Object} assessment - Financial health assessment document
 * @returns {Promise<Buffer>} Excel file buffer
 */
const generateFinancialHealthExcel = async (assessment) => {
    const workbook = new ExcelJS.Workbook();

    // Section 1: Personal & Professional Information
    const personalSheet = createWorksheet(workbook, 'Personal Information', 'personal');
    const personalData = [
        { field: 'First Name', value: formatValue(assessment.firstName) },
        { field: 'Middle Name', value: formatValue(assessment.middleName) },
        { field: 'Last Name', value: formatValue(assessment.lastName) },
        { field: 'Full Name', value: formatValue(assessment.fullName) },
        { field: 'Email', value: assessment.email || '' },
        { field: 'Phone', value: assessment.phone || '' },
        { field: 'Date of Birth', value: assessment.dateOfBirth || '' },
        { field: 'Age', value: assessment.age || '' },
        { field: 'Marital Status', value: formatValue(assessment.maritalStatus) },
        { field: 'Dependents', value: formatValue(assessment.dependents) },
        { field: 'Occupation Status', value: formatValue(assessment.occupationStatus) },
        { field: 'Annual Income', value: formatValue(assessment.annualIncome) },
        { field: 'Expected Growth Rate', value: formatValue(assessment.expectedGrowthRate) },
        { field: 'Tax Bracket', value: formatValue(assessment.taxBracket) },
        { field: 'Tax Regime', value: formatValue(assessment.taxRegime) },
        { field: 'Existing Loans', value: formatArrayValue(assessment.existingLoans) },
        { field: 'Other Loan Details', value: formatValue(assessment.otherLoan) }
    ];
    addDataRows(personalSheet, personalData);

    // Section 2: Current Financial Position
    const financialSheet = createWorksheet(workbook, 'Financial Position', 'financial');
    const financialData = [
        { field: 'Monthly Income', value: formatValue(assessment.monthlyIncome) },
        { field: 'Monthly Expenses', value: formatValue(assessment.monthlyExpenses) },
        { field: 'Emergency Fund', value: formatValue(assessment.emergencyFund) },
        { field: 'Emergency Fund (Months)', value: formatValue(assessment.emergencyFundMonths) },
        { field: 'Bank Savings / FDs', value: formatValue(assessment.bankSavingsFDs) },
        { field: 'Mutual Funds / Equity', value: formatValue(assessment.mutualFundsEquity) },
        { field: 'Bonds / Debentures', value: formatValue(assessment.bondsDebentures) },
        { field: 'Gold / Silver', value: formatValue(assessment.goldSilver) },
        { field: 'Real Estate', value: formatValue(assessment.realEstate) },
        { field: 'Retirement Accounts', value: formatValue(assessment.retirementAccounts) },
        { field: 'Insurance Details', value: formatValue(assessment.insuranceDetails) },
        { field: 'Outstanding Loans', value: formatValue(assessment.outstandingLoans) },
        { field: 'EMI Commitments', value: formatValue(assessment.emiCommitments) }
    ];
    addDataRows(financialSheet, financialData);

    // Section 3: Risk Profile & Investment Preferences
    const riskSheet = createWorksheet(workbook, 'Risk & Investment', 'risk');
    const riskData = [
        { field: 'Comfort with Market Volatility', value: formatValue(assessment.marketVolatilityComfort) },
        { field: 'Primary Investment Objective', value: formatValue(assessment.primaryInvestmentObjective) },
        { field: 'Investment Horizon', value: formatValue(assessment.investmentHorizon) },
        { field: 'Preferred Asset Classes', value: formatValue(assessment.preferredAssetClasses) },
        { field: 'International Investments', value: formatValue(assessment.internationalInvestments) }
    ];
    addDataRows(riskSheet, riskData);

    // Section 4: Insurance & Protection Planning
    const insuranceSheet = createWorksheet(workbook, 'Insurance', 'insurance');
    const insuranceData = [
        { field: 'Health Insurance', value: formatValue(assessment.hasHealthInsurance) },
        { field: 'Health Insurance Coverage', value: formatValue(assessment.healthInsuranceCoverage) },
        { field: 'Family Members Covered', value: formatValue(assessment.healthInsuranceFamilyMembers) },
        { field: 'Life Insurance', value: formatValue(assessment.hasLifeInsurance) },
        { field: 'Life Insurance Type', value: formatValue(assessment.lifeInsuranceType) },
        { field: 'Life Insurance Coverage', value: formatValue(assessment.lifeInsuranceCoverage) },
        { field: 'Other Protection', value: formatValue(assessment.otherProtection) },
        { field: 'Adequately Insured?', value: formatValue(assessment.adequatelyInsured) }
    ];
    addDataRows(insuranceSheet, insuranceData);

    // Section 5: Goals & Aspirations
    const goalsSheet = createWorksheet(workbook, 'Goals', 'goals');
    const goalsData = [
        { field: 'Short-Term Goals', value: formatValue(assessment.shortTermGoals) },
        { field: 'Medium-Term Goals', value: formatValue(assessment.mediumTermGoals) },
        { field: 'Long-Term Goals', value: formatValue(assessment.longTermGoals) },
        { field: 'Specific Milestones', value: formatArrayValue(assessment.specificMilestones) },
        { field: 'Other Milestone', value: formatValue(assessment.otherMilestone) }
    ];
    addDataRows(goalsSheet, goalsData);

    // Section 6: Estate & Legacy Planning
    const estateSheet = createWorksheet(workbook, 'Estate Planning', 'estate');
    const estateData = [
        { field: 'Will / Estate Plan', value: formatValue(assessment.hasWillEstatePlan) },
        { field: 'Trusts / Succession Planning', value: formatValue(assessment.wantsTrustsSuccession) },
        { field: 'Nominees Updated', value: formatValue(assessment.nomineesUpdated) }
    ];
    addDataRows(estateSheet, estateData);

    // Section 7: Financial Behavior & Preferences
    const behaviorSheet = createWorksheet(workbook, 'Behavior', 'behavior');
    const behaviorData = [
        { field: 'Investment Preference', value: formatValue(assessment.investmentPreference) },
        { field: 'Portfolio Review Frequency', value: formatValue(assessment.portfolioReviewFrequency) },
        { field: 'Investment Approach', value: formatValue(assessment.investmentApproach) },
        { field: 'Time Spent Tracking Investments', value: formatValue(assessment.timeTrackingInvestments) }
    ];
    addDataRows(behaviorSheet, behaviorData);

    // Section 8: Advisor Expectations
    const advisorSheet = createWorksheet(workbook, 'Advisor Expectations', 'advisor');
    const advisorData = [
        { field: 'Advisor Expectations', value: formatArrayValue(assessment.advisorExpectations) },
        { field: 'Preferred Review Meetings', value: formatValue(assessment.preferredReviewMeetings) },
        { field: 'Digital Access Preference', value: formatValue(assessment.digitalAccessPreference) }
    ];
    addDataRows(advisorSheet, advisorData);

    return await workbook.xlsx.writeBuffer();
};

/**
 * Generate filename for Excel attachment
 * @param {string} prefix - File prefix (e.g., 'contact-submission')
 * @param {string} id - Document ID
 * @returns {string} Formatted filename
 */
const generateFilename = (prefix, id) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    return `${prefix}-${id}-${timestamp}.xlsx`;
};

module.exports = {
    generateContactExcel,
    generateFinancialHealthExcel,
    generateFilename
};

