import { IRepository } from './repository.interface';

export interface UserEntity {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface IUserRepository extends IRepository<UserEntity, string> {
  findByEmail(email: string): Promise<UserEntity | null>;

  findByRole(role: string): Promise<UserEntity[]>;
}
