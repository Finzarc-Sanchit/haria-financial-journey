const config = {
    // Server
    port: process.env.PORT,

    node_env: process.env.NODE_ENV,
    client_url: process.env.CLIENT_URL,

    // db url
    mongo_url: process.env.MONGO_URL,

    // SMTP Email Configuration
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_secure: process.env.SMTP_SECURE === "true",
    smtp_user: process.env.SMTP_USER,
    smtp_pass: process.env.SMTP_PASS,

    user: {
        email: process.env.EMAIL,
        password: process.env.PASSWORD,
    },

    // Admin email configuration
    admin_email: process.env.ADMIN_EMAIL,
    admin_cc_email: process.env.ADMIN_CC_EMAIL,

    jwt_secret: process.env.JWT_SECRET,
};

module.exports = config;