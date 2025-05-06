import { BaseException } from './base.exception';

export class InfrastructureException extends BaseException {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode);
  }
}

/**
 * Specialized infrastructure exceptions
 */
export class DatabaseException extends InfrastructureException {
  constructor(
    message: string = 'Database operation failed',
    public readonly originalError?: unknown,
  ) {
    super(message);
  }
}

export class ExternalServiceException extends InfrastructureException {
  constructor(
    serviceName: string,
    message: string = 'External service error',
    public readonly originalError?: unknown,
  ) {
    super(`${serviceName}: ${message}`);
  }
}
