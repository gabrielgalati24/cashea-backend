import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../implementations/get-user-by-id.query';
import { UserRepository } from '../../repositories/user.repository';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUserByIdQuery) {
    return this.userRepository.findOneById(query.id);
  }
}
