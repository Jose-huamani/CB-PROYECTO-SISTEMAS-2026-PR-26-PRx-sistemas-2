import { RepositoryCategoryEntity } from '@modules/repositories/domain/entities/repository-category.entity';

export abstract class RepositoryCategoryRepository {
  abstract findOrCreateByName(
    name: string,
    createdBy: number,
  ): Promise<RepositoryCategoryEntity | null>;

  abstract searchByName(
    search: string | undefined,
    limit: number,
  ): Promise<RepositoryCategoryEntity[]>;
}
