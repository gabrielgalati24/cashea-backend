import { BaseException } from '../base.exception';

/**
 * Custom HTTP exceptions with additional context and features
 * These provide more control than the built-in NestJS HttpExceptions
 */

export class BadRequestException extends BaseException {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenException extends BaseException {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundException extends BaseException {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class ConflictException extends BaseException {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}

export class TooManyRequestsException extends BaseException {
  constructor(message: string = 'Too Many Requests') {
    super(message, 429);
  }
}

export class InternalServerErrorException extends BaseException {
  constructor(message: string = 'Internal Server Error') {
    super(message, 500);
  }
}
