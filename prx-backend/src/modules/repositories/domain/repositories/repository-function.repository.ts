import { RepositoryFunctionEntity } from '@modules/repositories/domain/entities/repository-function.entity';

export abstract class RepositoryFunctionRepository {
  abstract findByName(name: string): Promise<RepositoryFunctionEntity | null>;

  abstract findAll(): Promise<RepositoryFunctionEntity[]>;
}
