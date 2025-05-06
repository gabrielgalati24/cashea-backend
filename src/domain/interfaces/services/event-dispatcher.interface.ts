import { DomainEvent } from '../../events/domain-event';

/**
 * Interface for domain event handlers
 */
export interface IDomainEventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

export interface IEventDispatcher {
  register<T extends DomainEvent>(eventName: string, handler: IDomainEventHandler<T>): void;

  dispatch<T extends DomainEvent>(event: T): Promise<void>;

  dispatchAll(events: DomainEvent[]): Promise<void>;
}
