import { Logger as NestLogger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export class Logger extends NestLogger {
  private requestId: string;

  constructor(context?: string, requestId?: string) {
    super(context || 'Application');
    this.requestId = requestId || uuidv4();
  }

  setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  log(message: string, context?: string): void {
    super.log(this.formatMessage(message), context);
  }

  error(message: string, trace?: string, context?: string): void {
    super.error(this.formatMessage(message), trace, context);
  }

  warn(message: string, context?: string): void {
    super.warn(this.formatMessage(message), context);
  }

  debug(message: string, context?: string): void {
    super.debug(this.formatMessage(message), context);
  }

  verbose(message: string, context?: string): void {
    super.verbose(this.formatMessage(message), context);
  }

  private formatMessage(message: string): string {
    return `[${this.requestId}] ${message}`;
  }
}
