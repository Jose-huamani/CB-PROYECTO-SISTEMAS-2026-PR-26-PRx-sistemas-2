import { RepositoryUserScope } from '@modules/repositories/application/enums/repository-user-scope.enum';
import { RepositoryUserEntity } from '@modules/repositories/domain/entities/repository-user.entity';
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';

export abstract class RepositoryUserRepository {
  abstract findByRepositoryIdAndUserId(
    repositoryId: number,
    userId: number,
  ): Promise<RepositoryUserEntity | null>;

  abstract findPaginatedByRepositoryId(
    repositoryId: number,
    page: number,
    limit: number,
    search?: string,
    roleName?: string,
    functionName?: string,
    scope?: RepositoryUserScope,
  ): Promise<PaginatedResponseDto<RepositoryUserEntity>>;

  abstract create(
    data: Partial<RepositoryUserEntity>,
  ): Promise<RepositoryUserEntity>;

  abstract update(
    id: number,
    data: Partial<RepositoryUserEntity>,
  ): Promise<RepositoryUserEntity>;

  abstract softDelete(id: number, updatedBy: number): Promise<void>;

  abstract countByRoleName(
    repositoryId: number,
    roleName: string,
  ): Promise<number>;

  abstract transferOwnership(
    repositoryId: number,
    currentOwnerRepoUserId: number,
    targetRepoUserId: number,
    targetUserId: number,
    targetNewRoleId: number,
    targetNewFunctionId: number,
    currentOwnerNewRoleId: number,
    currentOwnerNewFunctionId: number,
    updatedBy: number,
  ): Promise<void>;

  abstract findByRepositoryIdAndUserIdIgnoreStatus(
    repositoryId: number,
    userId: number,
  ): Promise<RepositoryUserEntity | null>;

  abstract reactivate(
    id: number,
    data: Partial<RepositoryUserEntity>,
  ): Promise<RepositoryUserEntity>;
}
