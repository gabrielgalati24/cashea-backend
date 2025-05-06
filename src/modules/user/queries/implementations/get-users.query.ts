import { IQuery } from '@nestjs/cqrs';

export class GetUsersQuery implements IQuery {
  constructor(
    public readonly skip: number,
    public readonly limit: number,
  ) {}
}
