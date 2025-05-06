import { BusinessRuleViolationException } from '../exceptions/business-rule-violation.exception';

export class Money {
  private readonly amount: number;
  private readonly currency: string;

  private constructor(amount: number, currency: string = 'USD') {
    // Convert to 2 decimal places and ensure it's a number
    this.amount = Math.round(amount * 100) / 100;
    this.currency = currency.toUpperCase();
    this.validate();
  }

  /**
   * Creates a new Money instance
   * @throws BusinessRuleViolationException if the amount or currency is invalid
   */
  public static from(amount: number, currency: string = 'USD'): Money {
    return new Money(amount, currency);
  }

  /**
   * Creates a zero money instance
   */
  public static zero(currency: string = 'USD'): Money {
    return new Money(0, currency);
  }

  /**
   * Validates the money value
   */
  private validate(): void {
    if (isNaN(this.amount)) {
      throw new BusinessRuleViolationException('Money amount must be a valid number');
    }

    // Currency code validation (ISO 4217)
    const currencyCodeRegex = /^[A-Z]{3}$/;
    if (!currencyCodeRegex.test(this.currency)) {
      throw new BusinessRuleViolationException(
        'Currency must be a valid 3-letter ISO currency code',
      );
    }
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  /**
   * Returns formatted string representation (e.g., "$10.99")
   */
  public toString(): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
    });
    return formatter.format(this.amount);
  }

  /**
   * Adds another money value to this one
   * @throws BusinessRuleViolationException if currencies don't match
   */
  public add(money: Money): Money {
    if (this.currency !== money.currency) {
      throw new BusinessRuleViolationException('Cannot add money with different currencies');
    }
    return Money.from(this.amount + money.amount, this.currency);
  }

  /**
   * Subtracts another money value from this one
   * @throws BusinessRuleViolationException if currencies don't match
   */
  public subtract(money: Money): Money {
    if (this.currency !== money.currency) {
      throw new BusinessRuleViolationException('Cannot subtract money with different currencies');
    }
    return Money.from(this.amount - money.amount, this.currency);
  }

  public multiply(factor: number): Money {
    return Money.from(this.amount * factor, this.currency);
  }

  public equals(money?: Money): boolean {
    if (!money) {
      return false;
    }
    return this.amount === money.amount && this.currency === money.currency;
  }

  /**
   * Checks if this money is greater than another money amount
   * @throws BusinessRuleViolationException if currencies don't match
   */
  public greaterThan(money: Money): boolean {
    if (this.currency !== money.currency) {
      throw new BusinessRuleViolationException('Cannot compare money with different currencies');
    }
    return this.amount > money.amount;
  }

  /**
   * Checks if this money is less than another money amount
   * @throws BusinessRuleViolationException if currencies don't match
   */
  public lessThan(money: Money): boolean {
    if (this.currency !== money.currency) {
      throw new BusinessRuleViolationException('Cannot compare money with different currencies');
    }
    return this.amount < money.amount;
  }
}
