const mongoose = require('mongoose');
const validator = require('validator');

const financialHealthSchema = new mongoose.Schema({
    // Section 1: Personal & Professional Information
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    middleName: {
        type: String,
        trim: true,
        maxlength: [50, 'Middle name cannot exceed 50 characters'],
        default: ''
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return validator.isEmail(email);
            },
            message: 'Please provide a valid email address'
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        validate: {
            validator: function (phone) {
                return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
            },
            message: 'Please provide a valid phone number'
        }
    },
    dateOfBirth: {
        type: String,
        required: [true, 'Date of birth is required'],
        trim: true
    },
    maritalStatus: {
        type: String,
        required: [true, 'Marital status is required'],
        enum: {
            values: ['Single', 'Married', 'Divorced', 'Widowed', 'Other'],
            message: 'Invalid marital status'
        }
    },
    dependents: {
        type: String,
        trim: true,
        default: ''
    },
    occupationStatus: {
        type: String,
        required: [true, 'Occupation status is required'],
        enum: {
            values: ['salaried', 'self-employed', 'business', 'retired', 'other'],
            message: 'Invalid occupation status'
        }
    },
    annualIncome: {
        type: String,
        required: [true, 'Annual income is required'],
        trim: true
    },
    expectedGrowthRate: {
        type: String,
        trim: true,
        default: ''
    },
    taxBracket: {
        type: String,
        trim: true,
        default: ''
    },
    taxRegime: {
        type: String,
        trim: true,
        default: ''
    },
    existingLoans: {
        type: [String],
        default: []
    },
    otherLoan: {
        type: String,
        trim: true,
        maxlength: [200, 'Other loan description cannot exceed 200 characters'],
        default: ''
    },

    // Section 2: Current Financial Position
    monthlyIncome: {
        type: String,
        trim: true,
        default: ''
    },
    monthlyExpenses: {
        type: String,
        trim: true,
        default: ''
    },
    emergencyFund: {
        type: String,
        trim: true,
        default: ''
    },
    emergencyFundMonths: {
        type: String,
        trim: true,
        default: ''
    },
    bankSavingsFDs: {
        type: String,
        trim: true,
        default: ''
    },
    mutualFundsEquity: {
        type: String,
        trim: true,
        default: ''
    },
    bondsDebentures: {
        type: String,
        trim: true,
        default: ''
    },
    goldSilver: {
        type: String,
        trim: true,
        default: ''
    },
    realEstate: {
        type: String,
        trim: true,
        default: ''
    },
    retirementAccounts: {
        type: String,
        trim: true,
        default: ''
    },
    insuranceDetails: {
        type: String,
        trim: true,
        maxlength: [500, 'Insurance details cannot exceed 500 characters'],
        default: ''
    },
    outstandingLoans: {
        type: String,
        trim: true,
        default: ''
    },
    emiCommitments: {
        type: String,
        trim: true,
        default: ''
    },

    // Section 3: Risk Profile & Investment Preferences
    marketVolatilityComfort: {
        type: String,
        trim: true,
        default: ''
    },
    primaryInvestmentObjective: {
        type: String,
        trim: true,
        default: ''
    },
    investmentHorizon: {
        type: String,
        trim: true,
        default: ''
    },
    preferredAssetClasses: {
        type: String,
        trim: true,
        default: ''
    },
    internationalInvestments: {
        type: String,
        trim: true,
        default: ''
    },

    // Section 4: Insurance & Protection Planning
    hasHealthInsurance: {
        type: String,
        enum: {
            values: ['Yes', 'No', 'Planning to get'],
            message: 'Invalid health insurance status'
        }
    },
    healthInsuranceCoverage: {
        type: String,
        trim: true,
        default: ''
    },
    healthInsuranceFamilyMembers: {
        type: String,
        trim: true,
        default: ''
    },
    hasLifeInsurance: {
        type: String,
        enum: {
            values: ['Yes', 'No', 'Planning to get'],
            message: 'Invalid life insurance status'
        }
    },
    lifeInsuranceType: {
        type: String,
        trim: true,
        default: ''
    },
    lifeInsuranceCoverage: {
        type: String,
        trim: true,
        default: ''
    },
    otherProtection: {
        type: String,
        trim: true,
        maxlength: [500, 'Other protection details cannot exceed 500 characters'],
        default: ''
    },
    adequatelyInsured: {
        type: String,
        trim: true,
        default: ''
    },

    // Section 5: Goals & Aspirations
    shortTermGoals: {
        type: String,
        trim: true,
        maxlength: [1000, 'Short term goals cannot exceed 1000 characters'],
        default: ''
    },
    mediumTermGoals: {
        type: String,
        trim: true,
        maxlength: [1000, 'Medium term goals cannot exceed 1000 characters'],
        default: ''
    },
    longTermGoals: {
        type: String,
        trim: true,
        maxlength: [1000, 'Long term goals cannot exceed 1000 characters'],
        default: ''
    },
    specificMilestones: {
        type: [String],
        default: []
    },
    otherMilestone: {
        type: String,
        trim: true,
        maxlength: [200, 'Other milestone cannot exceed 200 characters'],
        default: ''
    },

    // Section 6: Estate & Legacy Planning
    hasWillEstatePlan: {
        type: String,
        trim: true,
        default: ''
    },
    wantsTrustsSuccession: {
        type: String,
        trim: true,
        default: ''
    },
    nomineesUpdated: {
        type: String,
        trim: true,
        default: ''
    },

    // Section 7: Financial Behavior & Preferences
    investmentPreference: {
        type: String,
        trim: true,
        default: ''
    },
    portfolioReviewFrequency: {
        type: String,
        trim: true,
        default: ''
    },
    investmentApproach: {
        type: String,
        trim: true,
        default: ''
    },
    timeTrackingInvestments: {
        type: String,
        trim: true,
        default: ''
    },

    // Section 8: Advisor Expectations
    advisorExpectations: {
        type: [String],
        default: []
    },
    preferredReviewMeetings: {
        type: String,
        trim: true,
        default: ''
    },
    digitalAccessPreference: {
        type: String,
        trim: true,
        default: ''
    },

    status: {
        type: String,
        enum: ['new', 'reviewed', 'in_progress', 'completed'],
        default: 'new'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full name
financialHealthSchema.virtual('fullName').get(function () {
    if (this.middleName) {
        return `${this.firstName} ${this.middleName} ${this.lastName}`;
    }
    return `${this.firstName} ${this.lastName}`;
});

// Virtual for age calculation (if dateOfBirth is in valid format)
financialHealthSchema.virtual('age').get(function () {
    if (!this.dateOfBirth) return null;
    try {
        const birthDate = new Date(this.dateOfBirth);
        if (isNaN(birthDate.getTime())) return null;
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    } catch (error) {
        return null;
    }
});

// Indexes for better query performance
financialHealthSchema.index({ firstName: 1, lastName: 1 });
financialHealthSchema.index({ status: 1 });
financialHealthSchema.index({ createdAt: -1 });
financialHealthSchema.index({ occupationStatus: 1 });

// Static method to get assessments by status
financialHealthSchema.statics.getByStatus = function (status) {
    return this.find({ status });
};

// Static method to get assessments by occupation
financialHealthSchema.statics.getByOccupation = function (occupation) {
    return this.find({ occupationStatus: occupation });
};

// Instance method to update status
financialHealthSchema.methods.updateStatus = function (newStatus) {
    this.status = newStatus;
    return this.save();
};

module.exports = mongoose.model('FinancialHealth', financialHealthSchema);

