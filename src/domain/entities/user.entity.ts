import { Entity } from './entity.base';
import { Email } from '../value-objects/email.value-object';
import { ID } from '../value-objects/id.value-object';
import { BusinessRuleViolationException } from '../exceptions/business-rule-violation.exception';

export class User extends Entity<User> {
  private readonly _id: ID;
  private readonly _email: Email;
  private _name: string;
  private _roles: string[];
  private _password: string;
  private _isActive: boolean;
  private _lastLoginAt?: Date;

  private constructor(
    id: ID,
    email: Email,
    name: string,
    password: string,
    roles: string[] = ['user'],
    isActive: boolean = true,
    lastLoginAt?: Date,
  ) {
    super();
    this._id = id;
    this._email = email;
    this._name = name;
    this._password = password;
    this._roles = roles;
    this._isActive = isActive;
    this._lastLoginAt = lastLoginAt;
  }

  /**
   * Creates a new User instance
   */
  public static create(
    email: string,
    name: string,
    password: string,
    roles: string[] = ['user'],
  ): User {
    const id = ID.create();
    const emailVO = Email.from(email);

    return new User(id, emailVO, name, password, roles, true);
  }

  /**
   */
  public static reconstitute(
    id: string,
    email: string,
    name: string,
    password: string,
    roles: string[] = ['user'],
    isActive: boolean = true,
    lastLoginAt?: Date,
  ): User {
    return new User(ID.from(id), Email.from(email), name, password, roles, isActive, lastLoginAt);
  }

  /**
   * ID getter
   */
  public get id(): string {
    return this._id.toString();
  }

  /**
   * Email getter
   */
  public get email(): string {
    return this._email.toString();
  }

  /**
   * Name getter
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Roles getter
   */
  public get roles(): string[] {
    return [...this._roles];
  }

  /**
   * Password getter
   */
  public get password(): string {
    return this._password;
  }

  /**
   * IsActive getter
   */
  public get isActive(): boolean {
    return this._isActive;
  }

  /**
   * LastLoginAt getter
   */
  public get lastLoginAt(): Date | undefined {
    return this._lastLoginAt;
  }

  /**
   * Updates the user's name
   */
  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new BusinessRuleViolationException('Name cannot be empty');
    }
    this._name = name.trim();
  }

  /**
   * Adds a role to the user
   */
  public addRole(role: string): void {
    if (this._roles.includes(role)) {
      return;
    }
    this._roles = [...this._roles, role];
  }

  /**
   * Removes a role from the user
   */
  public removeRole(role: string): void {
    if (role === 'user' && this._roles.length === 1) {
      throw new BusinessRuleViolationException('Cannot remove the only role from a user');
    }
    this._roles = this._roles.filter((r) => r !== role);
  }

  /**
   * Deactivates the user
   */
  public deactivate(): void {
    this._isActive = false;
  }

  /**
   * Activates the user
   */
  public activate(): void {
    this._isActive = true;
  }

  /**
   * Records a login
   */
  public recordLogin(): void {
    this._lastLoginAt = new Date();
  }

  /**
   * Updates the user's password
   */
  public updatePassword(password: string): void {
    if (!password || password.length < 8) {
      throw new BusinessRuleViolationException('Password must be at least 8 characters');
    }
    this._password = password;
  }

  /**
   * Checks if the user has a specific role
   */
  public hasRole(role: string): boolean {
    return this._roles.includes(role);
  }

  /**
   * Equality check based on ID
   */
  public equals(entity: Entity<User>): boolean {
    if (!(entity instanceof User)) {
      return false;
    }
    return this.id === entity.id;
  }

  /**
   * Converts to a plain object for persistence
   */
  public toObject() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      password: this.password,
      roles: this.roles,
      isActive: this.isActive,
      lastLoginAt: this.lastLoginAt,
    };
  }
}
