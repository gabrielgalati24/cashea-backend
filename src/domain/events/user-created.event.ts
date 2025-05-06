import { DomainEvent } from './domain-event';

/**
 * Event that is triggered when a new user is created
 */
export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string,
    public readonly roles: string[],
  ) {
    super();
  }

  public toPrimitive(): Record<string, any> {
    return {
      eventName: this.eventName,
      occurredOn: this.occurredOn,
      userId: this.userId,
      email: this.email,
      name: this.name,
      roles: this.roles,
    };
  }
}
