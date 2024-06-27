import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Inject, LoggerService } from '@nestjs/common';
import { Request, Response } from 'express';
import { WinstonLoggerService } from 'src/logging/logger';


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
        @Inject(WinstonLoggerService) private readonly logger: LoggerService,
    ) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse: any = exception.getResponse();

        const logMessage = {
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            status,
            message: exceptionResponse.message || exception.message,
            stack: exception.stack,
        };

        this.logger.error(JSON.stringify(logMessage));

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: exceptionResponse.message || exception.message,
            });
    }
};