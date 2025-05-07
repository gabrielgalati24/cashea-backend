import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetOrderByIdQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetOrderByIdQuery)
export class GetOrderByIdQueryHandler implements IQueryHandler<GetOrderByIdQuery> {
  async execute(query: GetOrderByIdQuery) {
    return null;
  }
}
