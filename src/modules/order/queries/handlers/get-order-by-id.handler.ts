import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(Object)
export class GetOrderByIdQueryHandler implements IQueryHandler<any> {
  async execute(query: any) {
    return null;
  }
}
