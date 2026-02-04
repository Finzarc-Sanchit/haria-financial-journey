const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const config = require("../config/config");
const logger = require("./logger");
const { generateContactExcel, generateFinancialHealthExcel, generateFilename } = require("../utils/excelHelper");

const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: Number(config.smtp_port),
    secure: config.smtp_secure,
    auth: {
        user: config.smtp_user,
        pass: config.smtp_pass,
    },
});

// Connection check
transporter.verify((error, success) => {
    if (error) {
        logger.error("❌ Email server connection failed:", error.message);
    } else {
        logger.info("✅ Email server is ready to send messages");
    }
});

// Load HTML template from templates folder
const loadTemplate = (filename) => {
    try {
        const templatePath = path.join(__dirname, '../templates', filename);
        return fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
        logger.error(`Error loading email template "${filename}":`, error);
        return null;
    }
};

// Helper function to capitalize first letter of each word
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

// Simple template renderer: replaces {{path.to.field}} with values from data object
const renderTemplate = (filename, data) => {
    const template = loadTemplate(filename);
    if (!template) return null;

    return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
        const pathParts = key.trim().split('.');
        let value = data;

        for (const part of pathParts) {
            if (value == null) break;
            value = value[part];
        }

        if (value === undefined || value === null) return '';
        if (Array.isArray(value)) {
            return value.map(v => capitalizeWords(String(v))).join(', ');
        }
        return capitalizeWords(String(value));
    });
};


// Email templates and functions
const emailTemplates = {
    confirmation: (data) => {
        const html = renderTemplate('confirmation-email.html', {
            name: data.name,
            services: data.services
        });

        if (!html) {
            // Fallback to simple template
            return {
                subject: `Thank you for contacting Haria Investments - ${data.name}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #2c3e50;">Thank You for Your Interest!</h2>
                        <p style="color: #34495e;">Dear ${data.name},</p>
                        <p style="color: #34495e;">Thank you for reaching out to Haria Investments. We have received your inquiry regarding our <strong>${data.services}</strong> services.</p>
                        <p style="color: #34495e;">Our team will review your request and get back to you within 24 hours.</p>
                    </div>
                `
            };
        }

        return {
            subject: `Thank you for contacting Haria Investments - ${data.name}`,
            html
        };
    },

    adminNotification: (data) => {
        const html = renderTemplate('admin-contact-notification.html', data);

        return {
            subject: `New Contact Form Submission - ${data.contact.fullName}`,
            html
        };
    },

    financialHealthAdminNotification: (data) => {
        const html = renderTemplate('financial-health-admin-notification.html', data);

        return {
            subject: `New Financial Health Assessment - ${data.assessment.fullName}`,
            html
        };
    },

    financialHealthConfirmation: (data) => {
        const html = renderTemplate('financial-health-confirmation-email.html', {
            name: data.name
        });

        if (!html) {
            // Fallback to simple template
            return {
                subject: `Thank you for your Financial Health Assessment - ${data.name}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #2c3e50;">Thank You for Completing Your Assessment!</h2>
                        <p style="color: #34495e;">Dear ${data.name},</p>
                        <p style="color: #34495e;">Thank you for completing your Financial Health Assessment with Haria Investments.</p>
                        <p style="color: #34495e;">Our team will review your assessment and get back to you within 24 hours with personalized recommendations.</p>
                    </div>
                `
            };
        }

        return {
            subject: `Thank you for your Financial Health Assessment - ${data.name}`,
            html
        };
    }
};

// Email sending functions
const sendConfirmationEmail = async (data) => {
    try {
        const template = emailTemplates.confirmation(data);

        const mailOptions = {
            from: `"Haria Investments" <no-reply@hariainvestments.com>`,
            to: data.to,
            subject: template.subject,
            html: template.html
        };

        const result = await transporter.sendMail(mailOptions);
        logger.info(`Confirmation email sent successfully to ${data.to}`);
        return result;
    } catch (error) {
        logger.error('Error sending confirmation email:', error);
        throw error;
    }
};

const sendAdminNotification = async (data) => {
    try {
        const template = emailTemplates.adminNotification(data);
        const excelBuffer = await generateContactExcel(data.contact);
        const filename = generateFilename('contact-submission', data.contact._id);

        const mailOptions = {
            from: `"Haria Investments" <no-reply@hariainvestments.com>`,
            to: config.admin_email || config.smtp_user,
            cc: config.admin_cc_email,
            subject: template.subject,
            html: template.html,
            attachments: [
                {
                    filename,
                    content: excelBuffer,
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            ]
        };

        const result = await transporter.sendMail(mailOptions);
        logger.info(`Admin notification sent successfully with Excel attachment`);
        return result;
    } catch (error) {
        logger.error('Error sending admin notification:', error);
        throw error;
    }
};

const sendFinancialHealthAdminNotification = async (data) => {
    try {
        const template = emailTemplates.financialHealthAdminNotification(data);
        const excelBuffer = await generateFinancialHealthExcel(data.assessment);
        const filename = generateFilename('financial-health-assessment', data.assessment._id);

        const mailOptions = {
            from: `"Haria Investments" <no-reply@hariainvestments.com>`,
            to: config.admin_email || config.smtp_user,
            cc: config.admin_cc_email,
            subject: template.subject,
            html: template.html,
            attachments: [
                {
                    filename,
                    content: excelBuffer,
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            ]
        };

        const result = await transporter.sendMail(mailOptions);
        logger.info(`Financial health admin notification sent successfully with Excel attachment`);
        return result;
    } catch (error) {
        logger.error('Error sending financial health admin notification:', error);
        throw error;
    }
};

const sendFinancialHealthConfirmation = async (data) => {
    try {
        const template = emailTemplates.financialHealthConfirmation(data);

        const mailOptions = {
            from: `"Haria Investments" <no-reply@hariainvestments.com>`,
            to: data.to,
            subject: template.subject,
            html: template.html
        };

        const result = await transporter.sendMail(mailOptions);
        logger.info(`Financial health confirmation email sent successfully to ${data.to}`);
        return result;
    } catch (error) {
        logger.error('Error sending financial health confirmation email:', error);
        throw error;
    }
};

module.exports = {
    transporter,
    sendConfirmationEmail,
    sendAdminNotification,
    sendFinancialHealthAdminNotification,
    sendFinancialHealthConfirmation,
};