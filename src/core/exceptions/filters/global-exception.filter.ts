import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from '../base.exception';

/**
 * Global exception filter that handles all exceptions thrown within the application
 * Provides consistent error responses to clients
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorResponse: any = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Handle different types of exceptions
    if (exception instanceof BaseException) {
      // Our custom base exception
      status = exception.statusCode;
      message = exception.message;
      errorResponse = {
        ...errorResponse,
        ...exception.toJSON(),
        statusCode: status,
        message,
      };
    } else if (exception instanceof HttpException) {
      // NestJS HTTP exceptions
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        errorResponse = {
          ...errorResponse,
          ...(exceptionResponse as object),
          statusCode: status,
        };
      } else {
        errorResponse.message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      // Standard JavaScript errors
      errorResponse.message = exception.message;
      errorResponse.name = exception.name;
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    // Send error response
    response.status(status).json(errorResponse);
  }
}
