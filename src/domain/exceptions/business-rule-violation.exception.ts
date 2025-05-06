import { DomainException } from './domain-exception';

/**
 * Exception thrown when a business rule is violated
 */
export class BusinessRuleViolationException extends DomainException {
  constructor(rule: string) {
    super(`Business rule violated: ${rule}`);
  }
}
