import { RepositoryCategoryEntity } from '@modules/repositories/domain/entities/repository-category.entity';

type RepositoryCategoryPrismaModel = {
  id: number;
  name: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy?: number | null;
};

export class RepositoryCategoryPrismaMapper {
  static toDomain(
    repositoryCategory: RepositoryCategoryPrismaModel,
  ): RepositoryCategoryEntity {
    return new RepositoryCategoryEntity(
      repositoryCategory.id,
      repositoryCategory.name,
      repositoryCategory.createdBy,
      repositoryCategory.status,
      repositoryCategory.createdAt,
      repositoryCategory.updatedAt,
      repositoryCategory.updatedBy ?? undefined,
    );
  }

  static toDomainList(
    repositoryCategories: RepositoryCategoryPrismaModel[],
  ): RepositoryCategoryEntity[] {
    return repositoryCategories.map((repositoryCategory) =>
      this.toDomain(repositoryCategory),
    );
  }
}
