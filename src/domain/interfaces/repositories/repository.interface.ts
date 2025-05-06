export interface IRepository<T, ID> {
  findById(id: ID): Promise<T | null>;

  save(entity: T): Promise<T>;

  remove(id: ID): Promise<void>;
}
