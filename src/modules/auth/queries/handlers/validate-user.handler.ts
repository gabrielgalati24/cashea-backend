import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';
import { ValidateUserQuery } from '../implementations/validate-user.query';
import { UserService } from '../../../user/services/user.service';

@QueryHandler(ValidateUserQuery)
export class ValidateUserQueryHandler implements IQueryHandler<ValidateUserQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(query: ValidateUserQuery) {
    try {
      return await this.userService.findOneByEmail(query.email);
    } catch (error) {
      throw new InternalServerErrorException('Error validating user');
    }
  }
}
