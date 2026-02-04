const express = require('express');
const router = express.Router();
const {
    createFinancialHealth,
    getFinancialHealthAssessments,
    getFinancialHealthById,
    updateFinancialHealth,
    deleteFinancialHealth,
    getFinancialHealthStats
} = require('../controllers/financialHealthController');
const { authenticate } = require('../middlewares/authMiddleware');

// Validation middleware
const validateFinancialHealth = (req, res, next) => {
    const { firstName, lastName, dateOfBirth, maritalStatus, occupationStatus, annualIncome, emergencyFund, hasHealthInsurance, hasLifeInsurance } = req.body;
    const errors = [];

    // Required field validation
    if (!firstName || firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters long');
    }
    if (!lastName || lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters long');
    }
    if (!dateOfBirth || dateOfBirth.trim().length === 0) {
        errors.push('Date of birth is required');
    }
    if (!maritalStatus || maritalStatus.trim().length === 0) {
        errors.push('Marital status is required');
    }
    if (!occupationStatus || occupationStatus.trim().length === 0) {
        errors.push('Occupation status is required');
    }
    if (!annualIncome || annualIncome.trim().length === 0) {
        errors.push('Annual income is required');
    }
    // NOTE: Emergency fund / insurance fields are optional in the frontend (no *), so don't require them here.

    // Enum validation
    const validMaritalStatus = ['Single', 'Married', 'Divorced', 'Widowed', 'Other'];
    if (maritalStatus && !validMaritalStatus.includes(maritalStatus)) {
        errors.push(`Invalid marital status. Must be one of: ${validMaritalStatus.join(', ')}`);
    }

    const validOccupationStatus = ['salaried', 'self-employed', 'business', 'retired', 'other'];
    if (occupationStatus && !validOccupationStatus.includes(occupationStatus)) {
        errors.push(`Invalid occupation status. Must be one of: ${validOccupationStatus.join(', ')}`);
    }

    const validHealthInsurance = ['Yes', 'No', 'Planning to get'];
    if (hasHealthInsurance && !validHealthInsurance.includes(hasHealthInsurance)) {
        errors.push(`Invalid health insurance status. Must be one of: ${validHealthInsurance.join(', ')}`);
    }

    const validLifeInsurance = ['Yes', 'No', 'Planning to get'];
    if (hasLifeInsurance && !validLifeInsurance.includes(hasLifeInsurance)) {
        errors.push(`Invalid life insurance status. Must be one of: ${validLifeInsurance.join(', ')}`);
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

// Sanitization middleware
const sanitizeFinancialHealth = (req, res, next) => {
    // Normalize enum-like fields coming from frontend (accept lowercase / alternate labels)
    // Keep stored values consistent with model enums.
    const normalize = (raw, mapping) => {
        if (raw === undefined || raw === null) return raw;
        const value = typeof raw === 'string' ? raw.trim() : raw;
        if (typeof value !== 'string') return value;
        const key = value.toLowerCase();
        return mapping[key] || value;
    };

    // maritalStatus frontend values: single/married/divorced/widowed/(other)
    if (req.body.maritalStatus) {
        req.body.maritalStatus = normalize(req.body.maritalStatus, {
            'single': 'Single',
            'married': 'Married',
            'divorced': 'Divorced',
            'widowed': 'Widowed',
            'other': 'Other',
        });
    }

    // occupationStatus frontend values: salaried/self-employed/business/retired/other
    // These values are now used directly in the model, no normalization needed
    // Just ensure it's trimmed
    if (req.body.occupationStatus) {
        req.body.occupationStatus = req.body.occupationStatus.trim();
    }

    // yes/no normalization for fields that are enums in the model
    if (req.body.hasHealthInsurance) {
        req.body.hasHealthInsurance = normalize(req.body.hasHealthInsurance, {
            'yes': 'Yes',
            'no': 'No',
            'planning to get': 'Planning to get',
            'planning': 'Planning to get',
        });
    }
    if (req.body.hasLifeInsurance) {
        req.body.hasLifeInsurance = normalize(req.body.hasLifeInsurance, {
            'yes': 'Yes',
            'no': 'No',
            'planning to get': 'Planning to get',
            'planning': 'Planning to get',
        });
    }

    // Sanitize string fields
    const stringFields = [
        'firstName', 'middleName', 'lastName', 'dateOfBirth', 'maritalStatus',
        'dependents', 'occupationStatus', 'annualIncome', 'expectedGrowthRate',
        'taxBracket', 'taxRegime', 'otherLoan', 'monthlyIncome', 'monthlyExpenses',
        'emergencyFund', 'emergencyFundMonths', 'bankSavingsFDs', 'mutualFundsEquity',
        'bondsDebentures', 'goldSilver', 'realEstate', 'retirementAccounts',
        'insuranceDetails', 'outstandingLoans', 'emiCommitments', 'marketVolatilityComfort',
        'primaryInvestmentObjective', 'investmentHorizon', 'preferredAssetClasses',
        'internationalInvestments', 'healthInsuranceCoverage', 'healthInsuranceFamilyMembers',
        'lifeInsuranceType', 'lifeInsuranceCoverage', 'otherProtection', 'adequatelyInsured',
        'shortTermGoals', 'mediumTermGoals', 'longTermGoals', 'otherMilestone',
        'hasWillEstatePlan', 'wantsTrustsSuccession', 'nomineesUpdated',
        'investmentPreference', 'portfolioReviewFrequency', 'investmentApproach',
        'timeTrackingInvestments', 'preferredReviewMeetings', 'digitalAccessPreference'
    ];

    stringFields.forEach(field => {
        if (req.body[field] && typeof req.body[field] === 'string') {
            req.body[field] = req.body[field].trim();
        }
    });

    // If optional fields are submitted as empty strings, drop them so enums/validators don't fail.
    ['emergencyFund', 'hasHealthInsurance', 'hasLifeInsurance'].forEach((field) => {
        if (req.body[field] === '') {
            delete req.body[field];
        }
    });

    // Sanitize array fields
    if (req.body.existingLoans && Array.isArray(req.body.existingLoans)) {
        req.body.existingLoans = req.body.existingLoans.filter(loan => loan && loan.trim().length > 0);
    }
    if (req.body.specificMilestones && Array.isArray(req.body.specificMilestones)) {
        req.body.specificMilestones = req.body.specificMilestones.filter(milestone => milestone && milestone.trim().length > 0);
    }
    if (req.body.advisorExpectations && Array.isArray(req.body.advisorExpectations)) {
        req.body.advisorExpectations = req.body.advisorExpectations.filter(expectation => expectation && expectation.trim().length > 0);
    }

    next();
};

// Rate limiting middleware (simple implementation)
const rateLimit = (() => {
    const requests = new Map();
    const WINDOW_SIZE = 15 * 60 * 1000; // 15 minutes
    // In production keep this strict; in development allow frequent testing.
    const MAX_REQUESTS = process.env.NODE_ENV === 'development' ? 50 : 3;

    return (req, res, next) => {
        const clientId = req.ip || req.connection.remoteAddress;
        const now = Date.now();

        if (!requests.has(clientId)) {
            requests.set(clientId, []);
        }

        const clientRequests = requests.get(clientId);

        // Remove old requests outside the window
        const validRequests = clientRequests.filter(time => now - time < WINDOW_SIZE);
        requests.set(clientId, validRequests);

        if (validRequests.length >= MAX_REQUESTS) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests. Please try again later.',
                retryAfter: Math.ceil(WINDOW_SIZE / 1000)
            });
        }

        validRequests.push(now);
        next();
    };
})();

// Routes

// POST /api/v1/financial-health - Create new financial health assessment
router.post('/',
    rateLimit,
    sanitizeFinancialHealth,
    validateFinancialHealth,
    createFinancialHealth
);

// GET /api/v1/financial-health - Get all assessments (with pagination and filtering)
router.get('/', authenticate, getFinancialHealthAssessments);

// GET /api/v1/financial-health/stats - Get assessment statistics
router.get('/stats', authenticate, getFinancialHealthStats);

// GET /api/v1/financial-health/:id - Get assessment by ID
router.get('/:id', authenticate, getFinancialHealthById);

// PUT /api/v1/financial-health/:id - Update assessment
router.put('/:id', authenticate, updateFinancialHealth);

// DELETE /api/v1/financial-health/:id - Delete assessment
router.delete('/:id', authenticate, deleteFinancialHealth);

module.exports = router;

