import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetOrdersQuery {
  constructor() {}
}

@QueryHandler(GetOrdersQuery)
export class GetOrdersQueryHandler implements IQueryHandler<GetOrdersQuery> {
  async execute(query: GetOrdersQuery) {
    return [];
  }
}
