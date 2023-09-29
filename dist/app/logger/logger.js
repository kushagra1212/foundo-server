const { createLogger, transports, format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { combine, timestamp, printf } = format;
// Define a custom log format
const customFormat = combine(format.colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Customize timestamp format
printf(({ level, message, timestamp }) => {
    return `[${timestamp}] [${level}] ${message}`;
}));
// Create a Winston logger instance
const logger = createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        // Log to the console with colorization
        new transports.Console(),
        // Log errors to a separate file
        new transports.File({
            filename: 'error.log',
            level: 'error',
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.json()), // Customize timestamp format
        }),
        // Log all levels to another file with daily rotation
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.json()), // Customize timestamp format
        }),
    ],
});
module.exports = logger;
//# sourceMappingURL=logger.js.map