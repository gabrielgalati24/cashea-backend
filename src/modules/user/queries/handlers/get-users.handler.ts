import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '../implementations/get-users.query';
import { UserRepository } from '../../repositories/user.repository';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUsersQuery) {
    const { skip, limit } = query;
    const [users, total] = await this.userRepository.findAll({ skip, take: limit });

    return {
      items: users,
      meta: {
        total,
        page: Math.floor(skip / limit) + 1,
        limit,
        pageCount: Math.ceil(total / limit),
      },
    };
  }
}
