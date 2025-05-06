import { DomainException } from './domain-exception';

/**
 * Exception thrown when an entity is in an invalid state for a requested operation
 */
export class InvalidEntityStateException extends DomainException {
  constructor(entityName: string, state: string, operation: string) {
    super(`Cannot perform ${operation} on ${entityName} when in state: ${state}`);
  }
}
