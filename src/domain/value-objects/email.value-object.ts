import { BusinessRuleViolationException } from '../exceptions/business-rule-violation.exception';

export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email.toLowerCase().trim();
    this.validate();
  }

  /**
   * Creates a new Email with the given value
   * @throws BusinessRuleViolationException if the email is invalid
   */
  public static from(email: string): Email {
    return new Email(email);
  }

  private validate(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      throw new BusinessRuleViolationException('Email must be a valid email address');
    }

    if (this.value.length > 255) {
      throw new BusinessRuleViolationException('Email must be less than 255 characters');
    }
  }

  public toString(): string {
    return this.value;
  }

  public equals(email?: Email): boolean {
    if (!email) {
      return false;
    }
    return this.value === email.value;
  }
}
