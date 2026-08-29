import { RepositoryFunctionResponseDto } from '@modules/repositories/application/dto/responses/repository-function-response.dto';
import { RepositoryFunctionEntity } from '@modules/repositories/domain/entities/repository-function.entity';

export class RepositoryFunctionResponseMapper {
  static toRepositoryFunctionResponse(
    repositoryFunction: RepositoryFunctionEntity,
  ): RepositoryFunctionResponseDto {
    return {
      id: repositoryFunction.id as number,
      name: repositoryFunction.name,
      description: repositoryFunction.description,
      createdAt: repositoryFunction.createdAt as Date,
      updatedAt: repositoryFunction.updatedAt as Date,
    };
  }

  static toRepositoryFunctionResponseList(
    repositoryFunctions: RepositoryFunctionEntity[],
  ): RepositoryFunctionResponseDto[] {
    return repositoryFunctions.map((repositoryFunction) =>
      this.toRepositoryFunctionResponse(repositoryFunction),
    );
  }
}
