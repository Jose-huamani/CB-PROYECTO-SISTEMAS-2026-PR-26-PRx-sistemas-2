import { Injectable, inject } from '@angular/core';
import { Observable, finalize, forkJoin, map, switchMap, tap } from 'rxjs';

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
import { RepositoryApi } from '@features/repositories/infrastructure/api/repository.api';
import { RepositoryStore } from '@features/repositories/infrastructure/store/repository.store';
import { CreateRepositoryInvitationRequest } from '@features/repository-invitations/domain/requests/create-repository-invitation.request';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';
import { resolvePublicStorageUrl } from '@shared/utils/storage-url.util';

@Injectable({
  providedIn: 'root',
})
export class RepositoryFacade {
  private readonly repositoryApi = inject(RepositoryApi);
  private readonly repositoryStore = inject(RepositoryStore);

  readonly selectedRepository = this.repositoryStore.selectedRepository;
  readonly myRepositories = this.repositoryStore.myRepositories;
  readonly exploreRepositories = this.repositoryStore.exploreRepositories;
  readonly categories = this.repositoryStore.categories;
  readonly repositoryRoles = this.repositoryStore.repositoryRoles;
  readonly owners = this.repositoryStore.owners;
  readonly coOwners = this.repositoryStore.coOwners;
  readonly coCreators = this.repositoryStore.coCreators;
  readonly members = this.repositoryStore.members;
  readonly loading = this.repositoryStore.loading;
  readonly myRepositoriesLoading = this.repositoryStore.myRepositoriesLoading;
  readonly exploreRepositoriesLoading = this.repositoryStore.exploreRepositoriesLoading;
  readonly categoriesLoading = this.repositoryStore.categoriesLoading;
  readonly repositoryRolesLoading = this.repositoryStore.repositoryRolesLoading;
  readonly repositoryUsersLoading = this.repositoryStore.repositoryUsersLoading;
  readonly repositoryFunctions = this.repositoryStore.repositoryFunctions;

  create(data: CreateRepositoryRequest): Observable<ApiResponseModel<RepositoryModel>> {
    return this.executeWithLoading(
      this.repositoryApi.create(data).pipe(
        tap((response) => {
          const repository = response.data;

          if (!repository) {
            return;
          }

          this.repositoryStore.setSelectedRepository(this.mapRepository(repository));
        }),
      ),
    );
  }

  findCategories(
    data: GetRepositoryCategoriesRequest,
  ): Observable<ApiResponseModel<RepositoryCategoryModel[]>> {
    this.repositoryStore.setCategoriesLoading(true);

    return this.repositoryApi.findCategories(data).pipe(
      tap((response) => {
        this.repositoryStore.setCategories(response.data ?? []);
      }),
      finalize(() => {
        this.repositoryStore.setCategoriesLoading(false);
      }),
    );
  }

  findRoles(): Observable<ApiResponseModel<RepositoryRoleModel[]>> {
    this.repositoryStore.setRepositoryRolesLoading(true);

    return this.repositoryApi.findRoles().pipe(
      tap((response) => {
        this.repositoryStore.setRepositoryRoles(response.data ?? []);
      }),
      finalize(() => {
        this.repositoryStore.setRepositoryRolesLoading(false);
      }),
    );
  }

  findMe(
    data: GetMeRepositoriesRequest,
  ): Observable<ApiResponseModel<PaginatedResponseModel<RepositoryModel>>> {
    this.repositoryStore.setMyRepositoriesLoading(true);

    return this.repositoryApi.findMe(data).pipe(
      tap((response) => {
        const repositories = response.data;

        if (!repositories) {
          this.repositoryStore.setMyRepositories(null);
          return;
        }

        this.repositoryStore.setMyRepositories(this.mapPaginatedRepositories(repositories));
      }),
      finalize(() => {
        this.repositoryStore.setMyRepositoriesLoading(false);
      }),
    );
  }

  findExplore(
    data: GetExploreRepositoriesRequest,
  ): Observable<ApiResponseModel<PaginatedResponseModel<RepositoryModel>>> {
    this.repositoryStore.setExploreRepositoriesLoading(true);

    return this.repositoryApi.findExplore(data).pipe(
      tap((response) => {
        const repositories = response.data;

        if (!repositories) {
          this.repositoryStore.setExploreRepositories(null);
          return;
        }

        this.repositoryStore.setExploreRepositories(this.mapPaginatedRepositories(repositories));
      }),
      finalize(() => {
        this.repositoryStore.setExploreRepositoriesLoading(false);
      }),
    );
  }

  findMeIntimate(): Observable<ApiResponseModel<RepositoryModel>> {
    return this.executeWithLoading(
      this.repositoryApi.findMeIntimate().pipe(
        tap((response) => {
          const repository = response.data;

          if (!repository) {
            return;
          }

          this.repositoryStore.setSelectedRepository(this.mapRepository(repository));
        }),
      ),
    );
  }

  findPublicByUser(
    userId: number,
    data: GetPublicRepositoriesByUserRequest,
  ): Observable<ApiResponseModel<RepositoryModel[]>> {
    return this.repositoryApi.findPublicByUser(userId, data).pipe(
      tap((response) => {
        if (!response.data) {
          return;
        }

        response.data = response.data.map((repository) => this.mapRepository(repository));
      }),
    );
  }

  findById(id: number): Observable<ApiResponseModel<RepositoryModel>> {
    return this.executeWithLoading(
      this.repositoryApi.findById(id).pipe(
        tap((response) => {
          const repository = response.data;

          if (!repository) {
            return;
          }

          this.repositoryStore.setSelectedRepository(this.mapRepository(repository));
        }),
      ),
    );
  }

  findUsers(
    id: number,
    data: GetRepositoryUsersRequest,
  ): Observable<ApiResponseModel<PaginatedResponseModel<RepositoryUserModel>>> {
    return this.repositoryApi.findUsers(id, data).pipe(
      tap((response) => {
        if (!response.data) {
          return;
        }

        response.data = this.mapPaginatedRepositoryUsers(response.data);
      }),
    );
  }

  findRepositoryUsersPreview(repositoryId: number) {
    this.repositoryStore.setRepositoryUsersLoading(true);

    return forkJoin({
      owners: this.repositoryApi.findUsers(repositoryId, {
        role: 'propietario',
        page: 1,
        limit: 10,
      }),
      coOwners: this.repositoryApi.findUsers(repositoryId, {
        role: 'copropietario',
        page: 1,
        limit: 10,
      }),
      coCreators: this.repositoryApi.findUsers(repositoryId, {
        role: 'cocreador',
        page: 1,
        limit: 10,
      }),
      members: this.repositoryApi.findUsers(repositoryId, {
        role: 'miembro',
        page: 1,
        limit: 10,
      }),
    }).pipe(
      tap((response) => {
        this.repositoryStore.setOwners(
          response.owners.data ? this.mapPaginatedRepositoryUsers(response.owners.data) : null,
        );
        this.repositoryStore.setCoOwners(
          response.coOwners.data ? this.mapPaginatedRepositoryUsers(response.coOwners.data) : null,
        );
        this.repositoryStore.setCoCreators(
          response.coCreators.data
            ? this.mapPaginatedRepositoryUsers(response.coCreators.data)
            : null,
        );
        this.repositoryStore.setMembers(
          response.members.data ? this.mapPaginatedRepositoryUsers(response.members.data) : null,
        );
      }),
      finalize(() => {
        this.repositoryStore.setRepositoryUsersLoading(false);
      }),
    );
  }

  update(id: number, data: UpdateRepositoryRequest): Observable<ApiResponseModel<RepositoryModel>> {
    return this.executeWithLoading(
      this.repositoryApi.update(id, data).pipe(
        tap((response) => {
          const repository = response.data;

          if (!repository) {
            return;
          }

          this.repositoryStore.setSelectedRepository(this.mapRepository(repository));
        }),
      ),
    );
  }

  deleteById(id: number): Observable<ApiResponseModel<void>> {
    return this.executeWithLoading(
      this.repositoryApi.deleteById(id).pipe(
        tap(() => {
          this.repositoryStore.clearSelectedRepository();
          this.repositoryStore.clearRepositoryUsers();
        }),
      ),
    );
  }

  updateSelectedRepositoryUpdatedAt(updatedAt: string): void {
    this.repositoryStore.updateSelectedRepositoryUpdatedAt(updatedAt);
  }

  clearSelectedRepository(): void {
    this.repositoryStore.clearSelectedRepository();
  }

  clearMyRepositories(): void {
    this.repositoryStore.clearMyRepositories();
  }

  clearExploreRepositories(): void {
    this.repositoryStore.clearExploreRepositories();
  }

  clearRepositoryUsers(): void {
    this.repositoryStore.clearRepositoryUsers();
  }

  clearCategories(): void {
    this.repositoryStore.clearCategories();
  }

  clearRepositoryRoles(): void {
    this.repositoryStore.clearRepositoryRoles();
  }

  reset(): void {
    this.repositoryStore.clear();
  }

  sendInvitation(
    repositoryId: number,
    data: CreateRepositoryInvitationRequest,
  ): Observable<ApiResponseModel<void>> {
    return this.executeWithLoading(this.repositoryApi.sendInvitation(repositoryId, data));
  }

  findFunctions(): Observable<ApiResponseModel<RepositoryFunctionModel[]>> {
    return this.repositoryApi.findFunctions().pipe(
      tap((response) => {
        this.repositoryStore.setRepositoryFunctions(response.data ?? []);
      }),
    );
  }

  updateUser(
    repositoryId: number,
    userId: number,
    data: Partial<{ repositoryRoleId: number; repositoryFunctionId: number }>,
  ): Observable<ApiResponseModel<RepositoryUserModel>> {
    return this.executeWithLoading(
      this.repositoryApi
        .updateUser(repositoryId, userId, data)
        .pipe(
          switchMap((response) =>
            this.findRepositoryUsersPreview(repositoryId).pipe(map(() => response)),
          ),
        ),
    );
  }

  deleteRepositoryUser(repositoryId: number, userId: number): Observable<ApiResponseModel<void>> {
    return this.executeWithLoading(
      this.repositoryApi
        .deleteRepositoryUser(repositoryId, userId)
        .pipe(
          switchMap((response) =>
            this.findRepositoryUsersPreview(repositoryId).pipe(map(() => response)),
          ),
        ),
    );
  }

  private mapRepository(repository: RepositoryModel): RepositoryModel {
    return {
      ...repository,
      owner: {
        ...repository.owner,
        avatarUrl: resolvePublicStorageUrl(repository.owner.avatarUrl),
      },
    };
  }

  private mapPaginatedRepositories(
    response: PaginatedResponseModel<RepositoryModel>,
  ): PaginatedResponseModel<RepositoryModel> {
    return {
      ...response,
      items: response.items.map((repository) => this.mapRepository(repository)),
    };
  }

  private mapRepositoryUser(repositoryUser: RepositoryUserModel): RepositoryUserModel {
    return {
      ...repositoryUser,
      user: repositoryUser.user
        ? {
            ...repositoryUser.user,
            avatarUrl: resolvePublicStorageUrl(repositoryUser.user.avatarUrl),
          }
        : undefined,
      repository: repositoryUser.repository
        ? this.mapRepository(repositoryUser.repository)
        : undefined,
    };
  }

  private mapPaginatedRepositoryUsers(
    response: PaginatedResponseModel<RepositoryUserModel>,
  ): PaginatedResponseModel<RepositoryUserModel> {
    return {
      ...response,
      items: response.items.map((repositoryUser) => this.mapRepositoryUser(repositoryUser)),
    };
  }

  private executeWithLoading<T>(source$: Observable<T>): Observable<T> {
    this.repositoryStore.setLoading(true);

    return source$.pipe(
      finalize(() => {
        this.repositoryStore.setLoading(false);
      }),
    );
  }
}
