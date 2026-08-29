import { RepositoryFunctionEntity } from '@modules/repositories/domain/entities/repository-function.entity';

type RepositoryFunctionPrismaModel = {
  id: number;
  name: string;
  description?: string | null;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy?: number | null;
};

export class RepositoryFunctionPrismaMapper {
  static toDomain(
    repositoryFunction: RepositoryFunctionPrismaModel,
  ): RepositoryFunctionEntity {
    return new RepositoryFunctionEntity(
      repositoryFunction.id,
      repositoryFunction.name,
      repositoryFunction.description ?? null,
      repositoryFunction.createdBy,
      repositoryFunction.status,
      repositoryFunction.createdAt,
      repositoryFunction.updatedAt,
      repositoryFunction.updatedBy ?? undefined,
    );
  }

  static toDomainList(
    repositoryFunctions: RepositoryFunctionPrismaModel[],
  ): RepositoryFunctionEntity[] {
    return repositoryFunctions.map((repositoryFunction) =>
      this.toDomain(repositoryFunction),
    );
  }
}
