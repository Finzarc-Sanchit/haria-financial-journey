const FinancialHealth = require("../models/financialHealthModel");
const logger = require("../config/logger");
const mailer = require("../config/mailer");

// Create a new financial health assessment
const createFinancialHealth = async (req, res) => {
    try {
        const assessmentData = req.body;

        // Create new financial health assessment
        const assessment = new FinancialHealth(assessmentData);
        await assessment.save();

        // Send confirmation email to user
        try {
            await mailer.sendFinancialHealthConfirmation({
                to: assessment.email,
                name: assessment.firstName,
            });
            logger.info(`Confirmation email sent to: ${assessment.email}`);
        } catch (emailError) {
            logger.error(
                `Failed to send confirmation email to ${assessment.email}:`,
                emailError
            );
            // Don't fail the request if email fails
        }

        // Send notification email to admin
        try {
            await mailer.sendFinancialHealthAdminNotification({
                assessment,
            });
            logger.info(`Admin notification sent for financial health assessment: ${assessment._id}`);
        } catch (emailError) {
            logger.error(
                `Failed to send admin notification for assessment ${assessment._id}:`,
                emailError
            );
            // Don't fail the request if email fails
        }

        logger.info(`New financial health assessment created: ${assessment._id} - ${assessment.fullName}`);

        res.status(201).json({
            success: true,
            message: "Financial health assessment created successfully",
            data: assessment,
        });
    } catch (error) {
        logger.error("Error creating financial health assessment:", error);

        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors,
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Something went wrong",
        });
    }
};

// Get all financial health assessments with pagination and filtering
const getFinancialHealthAssessments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        // Filter by status
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Filter by occupation status
        if (req.query.occupationStatus) {
            filter.occupationStatus = req.query.occupationStatus;
        }

        // Filter by date range
        if (req.query.startDate && req.query.endDate) {
            filter.createdAt = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate),
            };
        }

        // Search by name
        if (req.query.search) {
            filter.$or = [
                { firstName: { $regex: req.query.search, $options: 'i' } },
                { lastName: { $regex: req.query.search, $options: 'i' } },
            ];
        }

        const assessments = await FinancialHealth.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await FinancialHealth.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        logger.info(
            `Retrieved ${assessments.length} financial health assessments (page ${page}/${totalPages})`
        );

        res.status(200).json({
            success: true,
            message: "Financial health assessments retrieved successfully",
            data: {
                assessments,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalAssessments: total,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            },
        });
    } catch (error) {
        logger.error("Error retrieving financial health assessments:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Something went wrong",
        });
    }
};

// Get financial health assessment by ID
const getFinancialHealthById = async (req, res) => {
    try {
        const assessment = await FinancialHealth.findById(req.params.id);

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Financial health assessment not found",
            });
        }

        logger.info(`Retrieved financial health assessment: ${assessment._id}`);

        res.status(200).json({
            success: true,
            message: "Financial health assessment retrieved successfully",
            data: assessment,
        });
    } catch (error) {
        logger.error("Error retrieving financial health assessment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Something went wrong",
        });
    }
};

// Update financial health assessment
const updateFinancialHealth = async (req, res) => {
    try {
        const { status, ...updateData } = req.body;

        const assessment = await FinancialHealth.findById(req.params.id);
        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Financial health assessment not found",
            });
        }

        // Update status if provided
        if (status) {
            assessment.status = status;
        }

        // Update other fields
        Object.keys(updateData).forEach((key) => {
            if (assessment.schema.paths[key]) {
                assessment[key] = updateData[key];
            }
        });

        await assessment.save();

        logger.info(`Financial health assessment updated: ${assessment._id}`);

        res.status(200).json({
            success: true,
            message: "Financial health assessment updated successfully",
            data: assessment,
        });
    } catch (error) {
        logger.error("Error updating financial health assessment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Something went wrong",
        });
    }
};

// Delete financial health assessment
const deleteFinancialHealth = async (req, res) => {
    try {
        const assessment = await FinancialHealth.findByIdAndDelete(req.params.id);

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Financial health assessment not found",
            });
        }

        logger.info(`Financial health assessment deleted: ${assessment._id}`);

        res.status(200).json({
            success: true,
            message: "Financial health assessment deleted successfully",
        });
    } catch (error) {
        logger.error("Error deleting financial health assessment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Something went wrong",
        });
    }
};

// Get financial health assessment statistics
const getFinancialHealthStats = async (req, res) => {
    try {
        const stats = await FinancialHealth.aggregate([
            {
                $group: {
                    _id: null,
                    totalAssessments: { $sum: 1 },
                    newAssessments: {
                        $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] },
                    },
                    reviewedAssessments: {
                        $sum: { $cond: [{ $eq: ["$status", "reviewed"] }, 1, 0] },
                    },
                    inProgressAssessments: {
                        $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] },
                    },
                    completedAssessments: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                    },
                },
            },
        ]);

        const occupationStats = await FinancialHealth.aggregate([
            {
                $group: {
                    _id: "$occupationStatus",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        // Convert occupationStats array to object format
        const occupationObject = {};
        occupationStats.forEach(occupation => {
            occupationObject[occupation._id] = occupation.count;
        });

        const monthlyStats = await FinancialHealth.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 12 },
        ]);

        const maritalStatusStats = await FinancialHealth.aggregate([
            {
                $group: {
                    _id: "$maritalStatus",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        const maritalStatusObject = {};
        maritalStatusStats.forEach(status => {
            maritalStatusObject[status._id] = status.count;
        });

        res.status(200).json({
            success: true,
            message: "Statistics retrieved successfully",
            data: {
                overview: stats[0] || {},
                occupations: occupationObject,
                maritalStatus: maritalStatusObject,
                monthly: monthlyStats,
            },
        });
    } catch (error) {
        logger.error("Error retrieving financial health statistics:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Something went wrong",
        });
    }
};

module.exports = {
    createFinancialHealth,
    getFinancialHealthAssessments,
    getFinancialHealthById,
    updateFinancialHealth,
    deleteFinancialHealth,
    getFinancialHealthStats,
};

