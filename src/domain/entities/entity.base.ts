import { DomainEvent } from '../events/domain-event';

/**
 * Base abstract class for all domain entities.
 * Includes common functionality like domain events.
 */
export abstract class Entity<T> {
  private domainEvents: DomainEvent[] = [];

  /**
   * Every entity must have an ID
   */
  public abstract get id(): string;

  /**
   * Adds a domain event to this entity
   */
  protected addDomainEvent(domainEvent: DomainEvent): void {
    this.domainEvents.push(domainEvent);
  }

  /**
   * Clears all domain events
   */
  public clearEvents(): void {
    this.domainEvents = [];
  }

  /**
   * Gets all domain events
   */
  public getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  /**
   * Abstract method that each entity must implement to check equality
   */
  public abstract equals(entity: Entity<T>): boolean;
}
