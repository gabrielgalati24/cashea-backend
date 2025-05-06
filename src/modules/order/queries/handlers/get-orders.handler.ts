import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(Object)
export class GetOrdersQueryHandler implements IQueryHandler<any> {
  async execute(query: any) {
    return [];
  }
}
