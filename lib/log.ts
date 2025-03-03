import winston from "winston";

/**
 * Configures and returns a Winston logger instance with customized settings.
 * 
 * Features:
 * - Console transport with colorized output
 * - Log levels: error, warn, info, http, verbose, debug, silly
 * - Timestamp in ISO format
 * - Structured JSON logging in production
 * - Pretty-printed logs in development
 */
export const createLogger = (module: string) => {
	const isDevelopment = process.env.NODE_ENV !== 'production';

	// Define log format
	const formats = [
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.label({ label: module }),
	];

	// Add colorization in development
	if (isDevelopment) {
		formats.push(
			winston.format.printf(({ level, message, timestamp, label, ...meta }) => {
				const metaStr = Object.keys(meta).length ?
					`\n${JSON.stringify(meta, null, 2)}` : '';
				return `[${timestamp}] [${label}] ${level}: ${message}${metaStr}`;
			}),
			winston.format.colorize({ all: true })
		);
	} else {
		// Use JSON format in production
		formats.push(winston.format.json());
	}

	return winston.createLogger({
		level: isDevelopment ? 'debug' : 'info',
		format: winston.format.combine(...formats),
		defaultMeta: { service: 'spawnpoint' },
		transports: [
			new winston.transports.Console({
				stderrLevels: ['error'],
			}),
			// Add file transports in production if needed
			// new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
			// new winston.transports.File({ filename: 'logs/combined.log' }),
		],
	});
};

// Create a default logger for general application use
export const logger = createLogger('app');

