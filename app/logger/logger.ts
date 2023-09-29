import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, printf } = format;

// Define a custom log format
const customFormat = combine(
  format.colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Customize timestamp format
  printf(({ level, message, timestamp }) => {
    return `[${timestamp}] [${level}] ${message}`;
  }),
);

// Create a Winston logger instance
const logger = createLogger({
  level: 'info', // Set the default log level (e.g., 'info', 'error', 'warn', 'debug')
  format: customFormat, // Use the custom format
  transports: [
    // Log to the console with colorization
    new transports.Console(),

    // Log errors to a separate file
    new transports.File({
      filename: 'error.log',
      level: 'error',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
      ), // Customize timestamp format
    }),

    // Log all levels to another file with daily rotation
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d', // Keep logs for 14 days
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
      ), // Customize timestamp format
    }),
  ],
});

export default logger;
