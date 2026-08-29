import { RepositoryCategoryResponseDto } from '@modules/repositories/application/dto/responses/repository-category-response.dto';
import { RepositoryCategoryEntity } from '@modules/repositories/domain/entities/repository-category.entity';

export class RepositoryCategoryResponseMapper {
  static toRepositoryCategoryResponse(
    category: RepositoryCategoryEntity,
  ): RepositoryCategoryResponseDto {
    return {
      id: category.id as number,
      name: category.name,
      createdAt: category.createdAt as Date,
      updatedAt: category.updatedAt as Date,
    };
  }

  static toRepositoryCategoryResponseList(
    repositoryCategories: RepositoryCategoryEntity[],
  ): RepositoryCategoryResponseDto[] {
    return repositoryCategories.map((repositoryCategory) =>
      this.toRepositoryCategoryResponse(repositoryCategory),
    );
  }
}
