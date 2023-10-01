"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { combine, timestamp, printf } = winston_1.format;
// Define a custom log format
const customFormat = combine(winston_1.format.colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Customize timestamp format
printf(({ level, message, timestamp }) => {
    return `[${timestamp}] [${level}] ${message}`;
}));
// Create a Winston logger instance
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: customFormat,
    transports: [
        // Log to the console with colorization
        new winston_1.transports.Console(),
        // Log errors to a separate file
        new winston_1.transports.File({
            filename: 'error.log',
            level: 'error',
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.json()), // Customize timestamp format
        }),
        // Log all levels to another file with daily rotation
        new winston_daily_rotate_file_1.default({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.json()), // Customize timestamp format
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map