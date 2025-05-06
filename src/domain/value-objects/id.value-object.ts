import { randomUUID } from 'crypto';
import { BusinessRuleViolationException } from '../exceptions/business-rule-violation.exception';

export class ID {
  private readonly value: string;

  private constructor(id?: string) {
    this.value = id || randomUUID();
    this.validate();
  }

  /**
   * Creates a new ID with the given string value
   * @throws BusinessRuleViolationException if the ID is invalid
   */
  public static from(id: string): ID {
    return new ID(id);
  }

  public static create(): ID {
    return new ID();
  }

  private validate(): void {
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidV4Regex.test(this.value)) {
      throw new BusinessRuleViolationException('ID must be a valid UUID');
    }
  }

  /**
   * Returns the string representation of the ID
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Checks if this ID equals another ID
   */
  public equals(id?: ID): boolean {
    if (!id) {
      return false;
    }
    return this.value === id.value;
  }
}
