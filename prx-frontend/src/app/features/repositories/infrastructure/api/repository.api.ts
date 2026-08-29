import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseFeatureApi } from '@core/api/base-feature.api';
import { RepositoryApiContract } from '@features/repositories/domain/contracts/repository-api.contract';
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
import { REPOSITORY_API_CONFIG } from '@features/repositories/infrastructure/config/repository-api.config';
import { CreateRepositoryInvitationRequest } from '@features/repository-invitations/domain/requests/create-repository-invitation.request';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';

@Injectable({
  providedIn: 'root',
})
export class RepositoryApi extends BaseFeatureApi implements RepositoryApiContract {
  constructor(http: HttpClient) {
    super(http, REPOSITORY_API_CONFIG.base);
  }

  create(data: CreateRepositoryRequest): Observable<ApiResponseModel<RepositoryModel>> {
    return this.post<RepositoryModel>(this.buildUrl(REPOSITORY_API_CONFIG.endpoints.create), data);
  }

  findCategories(
    data: GetRepositoryCategoriesRequest,
  ): Observable<ApiResponseModel<RepositoryCategoryModel[]>> {
    return this.get<RepositoryCategoryModel[]>(
      this.buildUrl(REPOSITORY_API_CONFIG.endpoints.findCategories),
      {
        search: data.search,
        limit: data.limit,
      },
    );
  }

  findRoles(): Observable<ApiResponseModel<RepositoryRoleModel[]>> {
    return this.get<RepositoryRoleModel[]>(
      this.buildUrl(REPOSITORY_API_CONFIG.endpoints.findRoles),
    );
  }

  findMe(
    data: GetMeRepositoriesRequest,
  ): Observable<ApiResponseModel<PaginatedResponseModel<RepositoryModel>>> {
    return this.get<PaginatedResponseModel<RepositoryModel>>(
      this.buildUrl(REPOSITORY_API_CONFIG.endpoints.findMe),
      {
        search: data.search,
        role: data.role,
        category: data.category,
        visibility: data.visibility,
        page: data.page,
        limit: data.limit,
      },
    );
  }

  findExplore(
    data: GetExploreRepositoriesRequest,
  ): Observable<ApiResponseModel<PaginatedResponseModel<RepositoryModel>>> {
    return this.get<PaginatedResponseModel<RepositoryModel>>(
      this.buildUrl(REPOSITORY_API_CONFIG.endpoints.findExplore),
      {
        search: data.search,
        owner: data.owner,
        category: data.category,
        page: data.page,
        limit: data.limit,
      },
    );
  }

  findMeIntimate(): Observable<ApiResponseModel<RepositoryModel>> {
    return this.get<RepositoryModel>(this.buildUrl(REPOSITORY_API_CONFIG.endpoints.findMeIntimate));
  }

  findPublicByUser(
    userId: number,
    data: GetPublicRepositoriesByUserRequest,
  ): Observable<ApiResponseModel<RepositoryModel[]>> {
    return this.get<RepositoryModel[]>(
      this.buildUrl(
        REPOSITORY_API_CONFIG.endpoints.findPublicByUser.replace(':userId', userId.toString()),
      ),
      {
        limit: data.limit,
      },
    );
  }

  findById(id: number): Observable<ApiResponseModel<RepositoryModel>> {
    return this.get<RepositoryModel>(
      this.buildUrl(REPOSITORY_API_CONFIG.endpoints.findById.replace(':id', id.toString())),
    );
  }

  findUsers(
    id: number,
    data: GetRepositoryUsersRequest,
  ): Observable<ApiResponseModel<PaginatedResponseModel<RepositoryUserModel>>> {
    return this.get<PaginatedResponseModel<RepositoryUserModel>>(
      this.buildUrl(REPOSITORY_API_CONFIG.endpoints.findUsers.replace(':id', id.toString())),
      {
        search: data.search,
        role: data.role,
        function: data.function,
        scope: data.scope,
        page: data.page,
        limit: data.limit,
      },
    );
  }

  update(id: number, data: UpdateRepositoryRequest): Observable<ApiResponseModel<RepositoryModel>> {
    return this.patch<RepositoryModel>(
      this.buildUrl(REPOSITORY_API_CONFIG.endpoints.update.replace(':id', id.toString())),
      data,
    );
  }

  deleteById(id: number): Observable<ApiResponseModel<void>> {
    return this.delete<void>(
      this.buildUrl(REPOSITORY_API_CONFIG.endpoints.delete.replace(':id', id.toString())),
    );
  }

  sendInvitation(
    id: number,
    data: CreateRepositoryInvitationRequest,
  ): Observable<ApiResponseModel<void>> {
    return this.post<void>(
      this.buildUrl(REPOSITORY_API_CONFIG.endpoints.sendInvitation.replace(':id', id.toString())),
      data,
    );
  }

  findFunctions(): Observable<ApiResponseModel<RepositoryFunctionModel[]>> {
    return this.get<RepositoryFunctionModel[]>(
      this.buildUrl(REPOSITORY_API_CONFIG.endpoints.findFunctions),
    );
  }

  updateUser(
    repositoryId: number,
    userId: number,
    data: Partial<{ repositoryRoleId: number; repositoryFunctionId: number }>,
  ): Observable<ApiResponseModel<RepositoryUserModel>> {
    return this.patch<RepositoryUserModel>(
      this.buildUrl(
        REPOSITORY_API_CONFIG.endpoints.updateUser
          .replace(':id', repositoryId.toString())
          .replace(':userId', userId.toString()),
      ),
      data,
    );
  }

  deleteRepositoryUser(repositoryId: number, userId: number): Observable<ApiResponseModel<void>> {
    return this.delete<void>(
      this.buildUrl(
        REPOSITORY_API_CONFIG.endpoints.deleteUser
          .replace(':id', repositoryId.toString())
          .replace(':userId', userId.toString()),
      ),
    );
  }
}
