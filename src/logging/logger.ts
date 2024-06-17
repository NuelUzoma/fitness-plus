import * as winston from 'winston';
import { Injectable, LoggerService } from '@nestjs/common';
import 'winston-daily-rotate-file';

const logFormat = winston.format.printf(({ level, message, timestamp, meta }) => {
    return `${timestamp} [${level}]: ${message} ${meta ? JSON.stringify(meta) : ''}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
            filename: 'logs/%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
        new winston.transports.DailyRotateFile({
            level: 'error',
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
    ],
});

@Injectable()
export class WinstonLoggerService implements LoggerService {
    log(message: string) {
        logger.info(message);
    }
    
    error(message: string, trace: string) {
        logger.error(message, { trace });
    }
    
    warn(message: string) {
        logger.warn(message);
    }
    
    debug(message: string) {
        logger.debug(message);
    }
    
    verbose(message: string) {
        logger.verbose(message);
    }
}


export { logger };