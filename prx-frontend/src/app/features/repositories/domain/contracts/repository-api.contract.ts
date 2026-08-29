import { Observable } from 'rxjs';

import { RepositoryCategoryModel } from '@features/repositories/domain/models/repository-category.model';
import { RepositoryFunctionModel } from '@features/repositories/domain/models/repository-function.model';
import { RepositoryModel } from '@features/repositories/domain/models/repository.model';
import { RepositoryRoleModel } from '@features/repositories/domain/models/repository-role.model';
import { RepositoryUserModel } from '@features/repositories/domain/models/repository-user.model';
import { CreateRepositoryRequest } from '@features/repositories/domain/requests/create-repository.request';
import { GetExploreRepositoriesRequest } from '@features/repositories/domain/requests/get-explore-repositories.request';
import { GetMeRepositoriesRequest } from '@features/repositories/domain/requests/get-me-repositories.request';
import { GetPublicRepositoriesByUserRequest } from '@features/repositories/domain/requests/get-public-repositories-by-user.request';
import { GetRepositoryCategoriesRequest } from '@features/repositories/domain/requests/get-repository-categories.request';
import { GetRepositoryUsersRequest } from '@features/repositories/domain/requests/get-repository-users.request';
import { UpdateRepositoryRequest } from '@features/repositories/domain/requests/update-repository.request';
import { CreateRepositoryInvitationRequest } from '@features/repository-invitations/domain/requests/create-repository-invitation.request';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';

export abstract class RepositoryApiContract {
  abstract create(data: CreateRepositoryRequest): Observable<ApiResponseModel<RepositoryModel>>;

  abstract findCategories(
    data: GetRepositoryCategoriesRequest,
  ): Observable<ApiResponseModel<RepositoryCategoryModel[]>>;

  abstract findRoles(): Observable<ApiResponseModel<RepositoryRoleModel[]>>;

  abstract findMe(
    data: GetMeRepositoriesRequest,
  ): Observable<ApiResponseModel<PaginatedResponseModel<RepositoryModel>>>;

  abstract findExplore(
    data: GetExploreRepositoriesRequest,
  ): Observable<ApiResponseModel<PaginatedResponseModel<RepositoryModel>>>;

  abstract findMeIntimate(): Observable<ApiResponseModel<RepositoryModel>>;

  abstract findPublicByUser(
    userId: number,
    data: GetPublicRepositoriesByUserRequest,
  ): Observable<ApiResponseModel<RepositoryModel[]>>;

  abstract findById(id: number): Observable<ApiResponseModel<RepositoryModel>>;

  abstract findUsers(
    id: number,
    data: GetRepositoryUsersRequest,
  ): Observable<ApiResponseModel<PaginatedResponseModel<RepositoryUserModel>>>;

  abstract update(
    id: number,
    data: UpdateRepositoryRequest,
  ): Observable<ApiResponseModel<RepositoryModel>>;

  abstract deleteById(id: number): Observable<ApiResponseModel<void>>;

  abstract sendInvitation(
    id: number,
    data: CreateRepositoryInvitationRequest,
  ): Observable<ApiResponseModel<void>>;

  abstract findFunctions(): Observable<ApiResponseModel<RepositoryFunctionModel[]>>;

  abstract updateUser(
    repositoryId: number,
    userId: number,
    data: Partial<{ repositoryRoleId: number; repositoryFunctionId: number }>,
  ): Observable<ApiResponseModel<RepositoryUserModel>>;

  abstract deleteRepositoryUser(
    repositoryId: number,
    userId: number,
  ): Observable<ApiResponseModel<void>>;
}
