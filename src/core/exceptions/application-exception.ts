import { BaseException } from './base.exception';

export class ApplicationException extends BaseException {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
  }
}

export class EntityNotFoundException extends ApplicationException {
  constructor(entityName: string, id?: string | number) {
    const message = id ? `${entityName} with id '${id}' not found` : `${entityName} not found`;
    super(message, 404);
  }
}

export class ValidationException extends ApplicationException {
  constructor(
    message: string = 'Validation failed',
    public readonly errors?: Record<string, unknown>,
  ) {
    super(message, 400);
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}
