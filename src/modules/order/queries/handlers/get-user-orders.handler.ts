import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(Object)
export class GetUserOrdersQueryHandler implements IQueryHandler<any> {
  async execute(query: any) {
    return [];
  }
}
