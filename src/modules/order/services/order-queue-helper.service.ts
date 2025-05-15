import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

const ORDER_DLX_EXCHANGE = 'orders.dlx.exchange';
const FINAL_DEAD_LETTER_ROUTING_KEY = 'orders.final.dead';

const RETRY_WAIT_QUEUES_WITH_TTL = [
  { name: 'orders.wait.1m.queue', ttl: 60 * 1000, routingKey: 'orders.wait.1m' },
  { name: 'orders.wait.5m.queue', ttl: 5 * 60 * 1000, routingKey: 'orders.wait.5m' },
  { name: 'orders.wait.10m.queue', ttl: 10 * 60 * 1000, routingKey: 'orders.wait.10m' },
];

@Injectable()
export class OrderQueueHelperService {
  private readonly logger = new Logger(OrderQueueHelperService.name);
  private readonly maxRetries: number;

  constructor(
    private readonly configService: ConfigService,
    @Inject('RETRY_PUBLISHER_SERVICE') private readonly client: ClientProxy,
  ) {
    this.maxRetries = this.configService.get<number>('RABBITMQ_ORDER_MAX_RETRIES', 3);
  }

  async handleMessageFailure(originalMessage: any, error: Error): Promise<void> {
    const rawMessage = originalMessage.content;
    const properties = originalMessage.properties || {};
    const headers = properties.headers || {};

    const retryCount = (headers['x-retry-count'] || 0) + 1;
    this.logger.warn(
      `Message processing failed. Attempt #${retryCount}. Error: ${error.message}`,
    );

    if (retryCount > this.maxRetries) {
      this.logger.error(
        `Message exceeded max ${this.maxRetries} retries. Sending to final DLQ.`,
      );
      const deadRecord = new RmqRecordBuilder(rawMessage)
        .setOptions({
          headers: {
            ...headers,
            'x-retry-count': retryCount,
            'x-original-error': error.message,
            'x-original-stack': error.stack,
            'x-dead-letter-timestamp': new Date().toISOString(),
          },
          priority: properties.priority,
        })
        .build();
      this.client.emit(
        { exchange: ORDER_DLX_EXCHANGE, routingKey: FINAL_DEAD_LETTER_ROUTING_KEY },
        deadRecord,
      ).subscribe({
        error: (err) => this.logger.error('Error sending message to final DLQ:', err),
      });
      return;
    }

    const waitQueueConfig = RETRY_WAIT_QUEUES_WITH_TTL[retryCount - 1];
    if (!waitQueueConfig) {
        this.logger.error(
            `Wait queue configuration not found for attempt #${retryCount}. Sending to final DLQ.`,
        );
        const deadRecord = new RmqRecordBuilder(rawMessage)
        .setOptions({
          headers: { ...headers, 'x-retry-count': retryCount, 'x-original-error': error.message },
          priority: properties.priority,
        })
        .build();
        this.client.emit({ exchange: ORDER_DLX_EXCHANGE, routingKey: FINAL_DEAD_LETTER_ROUTING_KEY }, deadRecord).subscribe({
            error: (err) => this.logger.error('Error sending message to final DLQ (fallback):', err),
        });
        return;
    }
    
    this.logger.log(
      `Retrying message. Attempt #${retryCount}. Sending to wait queue: ${waitQueueConfig.name} (TTL: ${waitQueueConfig.ttl}ms).`,
    );

    const retryRecord = new RmqRecordBuilder(rawMessage)
      .setOptions({
        headers: {
          ...headers,
          'x-retry-count': retryCount,
        },
        priority: properties.priority,
      })
      .build();

    this.client.emit(
      { exchange: ORDER_DLX_EXCHANGE, routingKey: waitQueueConfig.routingKey },
      retryRecord,
    ).subscribe({
        error: (err) => this.logger.error(`Error sending message to wait queue ${waitQueueConfig.name}:`, err),
    });
  }
} 