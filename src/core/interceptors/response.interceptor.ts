import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta?: Record<string, any>;
  message?: string;
  statusCode: number;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const now = new Date();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // Handle pagination responses
        if (data && data.items && data.meta) {
          return {
            data: data.items,
            meta: data.meta,
            statusCode: response.statusCode,
            timestamp: now.toISOString(),
          };
        }

        return {
          data,
          statusCode: response.statusCode,
          timestamp: now.toISOString(),
        };
      }),
    );
  }
}
