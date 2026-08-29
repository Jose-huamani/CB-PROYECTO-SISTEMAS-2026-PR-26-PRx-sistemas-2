export abstract class RepositoryPort<TEntity, TId = number> {
  abstract create(entity: TEntity): Promise<TEntity>;
  abstract findById(id: TId): Promise<TEntity | null>;
  abstract update(id: TId, data: Partial<TEntity>): Promise<TEntity>;
  abstract softDelete(id: TId, updatedBy: number): Promise<void>;
}
