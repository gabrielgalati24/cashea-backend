import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse = exception.getResponse();
    const timestamp = new Date().toISOString();

    // Format the error response
    if (typeof errorResponse === 'object') {
      errorResponse = {
        ...errorResponse,
        timestamp,
        path: request.url,
        method: request.method,
      };
    } else {
      errorResponse = {
        statusCode: status,
        message: errorResponse,
        timestamp,
        path: request.url,
        method: request.method,
      };
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} ${status} - ${JSON.stringify(errorResponse)}`,
      exception.stack,
    );

    // Send the error response
    response.status(status).json(errorResponse);
  }
}
