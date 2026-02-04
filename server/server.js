require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./config/logger");
const config = require("./config/config");
const router = require("./routes/index");
const connectDB = require("./config/db");


const app = express();

connectDB();

app.use(helmet());

// CORS configuration
const getAllowedOrigins = () => {
    const defaultOrigins = ["http://localhost:8080", "http://localhost:5173"];
    const productionOrigins = [
        "https://www.hariainvestments.com",
        "https://hariainvestments.com",
        "http://www.hariainvestments.com",
        "http://hariainvestments.com"
    ];

    if (config.client_url) {
        const origins = typeof config.client_url === 'string'
            ? config.client_url.split(',').map(url => url.trim())
            : [config.client_url];
        return [...origins, ...defaultOrigins];
    }

    // In production, include production origins even if CLIENT_URL is not set
    if (config.node_env === 'production') {
        return [...productionOrigins, ...defaultOrigins];
    }

    return defaultOrigins;
};

const allowedOrigins = getAllowedOrigins();

// Log allowed origins on startup
logger.info(`CORS allowed origins: ${allowedOrigins.join(', ')}`);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
            if (!origin) {
                logger.info('CORS: Allowing request with no origin');
                return callback(null, true);
            }

            // Check if origin exactly matches or starts with any allowed origin
            const isAllowed = allowedOrigins.some(allowed => {
                // Exact match
                if (origin === allowed) return true;
                // Subdomain match (e.g., www.hariainvestments.com matches hariainvestments.com)
                if (origin.endsWith(allowed.replace(/^https?:\/\//, ''))) return true;
                // Starts with match
                if (origin.startsWith(allowed)) return true;
                return false;
            });

            if (isAllowed) {
                logger.info(`CORS: Allowing origin: ${origin}`);
                callback(null, true);
            } else {
                // Log for debugging
                logger.warn(`CORS blocked origin: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    morgan("combined", {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    })
);

app.get("/", (req, res) => {
    logger.info("Root route hit");
    res.status(200).json({ msg: "Hello" });
});

app.use("/api/v1", router);

const PORT = config.port || 8000;

app.listen(PORT, () => {
    logger.info(`🚀 Server running`);
});