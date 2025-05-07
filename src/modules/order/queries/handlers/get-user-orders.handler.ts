import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetUserOrdersQuery {
  constructor(public readonly userId: number) {}
}

@QueryHandler(GetUserOrdersQuery)
export class GetUserOrdersQueryHandler implements IQueryHandler<GetUserOrdersQuery> {
  async execute(query: GetUserOrdersQuery) {
    return [];
  }
}
