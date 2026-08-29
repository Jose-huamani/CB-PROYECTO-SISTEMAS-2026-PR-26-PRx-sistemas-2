import { Injectable, computed, signal } from '@angular/core';

import { RepositoryCategoryModel } from '@features/repositories/domain/models/repository-category.model';
import { RepositoryFunctionModel } from '@features/repositories/domain/models/repository-function.model';
import { RepositoryModel } from '@features/repositories/domain/models/repository.model';
import { RepositoryRoleModel } from '@features/repositories/domain/models/repository-role.model';
import { RepositoryUserModel } from '@features/repositories/domain/models/repository-user.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';

@Injectable({
  providedIn: 'root',
})
export class RepositoryStore {
  private readonly selectedRepositorySignal = signal<RepositoryModel | null>(null);
  private readonly myRepositoriesSignal = signal<PaginatedResponseModel<RepositoryModel> | null>(
    null,
  );
  private readonly exploreRepositoriesSignal =
    signal<PaginatedResponseModel<RepositoryModel> | null>(null);
  private readonly categoriesSignal = signal<RepositoryCategoryModel[]>([]);
  private readonly repositoryRolesSignal = signal<RepositoryRoleModel[]>([]);
  private readonly ownersSignal = signal<PaginatedResponseModel<RepositoryUserModel> | null>(null);
  private readonly coOwnersSignal = signal<PaginatedResponseModel<RepositoryUserModel> | null>(
    null,
  );
  private readonly coCreatorsSignal = signal<PaginatedResponseModel<RepositoryUserModel> | null>(
    null,
  );
  private readonly membersSignal = signal<PaginatedResponseModel<RepositoryUserModel> | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly myRepositoriesLoadingSignal = signal(false);
  private readonly exploreRepositoriesLoadingSignal = signal(false);
  private readonly categoriesLoadingSignal = signal(false);
  private readonly repositoryRolesLoadingSignal = signal(false);
  private readonly repositoryUsersLoadingSignal = signal(false);
  private readonly repositoryFunctionsSignal = signal<RepositoryFunctionModel[]>([]);
  private readonly allRepositoryUsersSignal =
    signal<PaginatedResponseModel<RepositoryUserModel> | null>(null);

  readonly selectedRepository = computed(() => this.selectedRepositorySignal());
  readonly myRepositories = computed(() => this.myRepositoriesSignal());
  readonly exploreRepositories = computed(() => this.exploreRepositoriesSignal());
  readonly categories = computed(() => this.categoriesSignal());
  readonly repositoryRoles = computed(() => this.repositoryRolesSignal());
  readonly owners = computed(() => this.ownersSignal());
  readonly coOwners = computed(() => this.coOwnersSignal());
  readonly coCreators = computed(() => this.coCreatorsSignal());
  readonly members = computed(() => this.membersSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly myRepositoriesLoading = computed(() => this.myRepositoriesLoadingSignal());
  readonly exploreRepositoriesLoading = computed(() => this.exploreRepositoriesLoadingSignal());
  readonly categoriesLoading = computed(() => this.categoriesLoadingSignal());
  readonly repositoryRolesLoading = computed(() => this.repositoryRolesLoadingSignal());
  readonly repositoryUsersLoading = computed(() => this.repositoryUsersLoadingSignal());
  readonly repositoryFunctions = computed(() => this.repositoryFunctionsSignal());
  readonly allRepositoryUsers = computed(() => this.allRepositoryUsersSignal());

  setSelectedRepository(repository: RepositoryModel | null): void {
    this.selectedRepositorySignal.set(repository);
  }

  updateSelectedRepositoryUpdatedAt(updatedAt: string): void {
    this.selectedRepositorySignal.update((repository) => {
      if (!repository) {
        return repository;
      }

      return {
        ...repository,
        updatedAt,
      };
    });
  }

  setMyRepositories(repositories: PaginatedResponseModel<RepositoryModel> | null): void {
    this.myRepositoriesSignal.set(repositories);
  }

  setExploreRepositories(repositories: PaginatedResponseModel<RepositoryModel> | null): void {
    this.exploreRepositoriesSignal.set(repositories);
  }

  setCategories(categories: RepositoryCategoryModel[]): void {
    this.categoriesSignal.set(categories);
  }

  setRepositoryRoles(roles: RepositoryRoleModel[]): void {
    this.repositoryRolesSignal.set(roles);
  }

  setOwners(owners: PaginatedResponseModel<RepositoryUserModel> | null): void {
    this.ownersSignal.set(owners);
  }

  setCoOwners(coOwners: PaginatedResponseModel<RepositoryUserModel> | null): void {
    this.coOwnersSignal.set(coOwners);
  }

  setCoCreators(coCreators: PaginatedResponseModel<RepositoryUserModel> | null): void {
    this.coCreatorsSignal.set(coCreators);
  }

  setMembers(members: PaginatedResponseModel<RepositoryUserModel> | null): void {
    this.membersSignal.set(members);
  }

  setLoading(value: boolean): void {
    this.loadingSignal.set(value);
  }

  setMyRepositoriesLoading(value: boolean): void {
    this.myRepositoriesLoadingSignal.set(value);
  }

  setExploreRepositoriesLoading(value: boolean): void {
    this.exploreRepositoriesLoadingSignal.set(value);
  }

  setCategoriesLoading(value: boolean): void {
    this.categoriesLoadingSignal.set(value);
  }

  setRepositoryRolesLoading(value: boolean): void {
    this.repositoryRolesLoadingSignal.set(value);
  }

  setRepositoryUsersLoading(value: boolean): void {
    this.repositoryUsersLoadingSignal.set(value);
  }

  clearSelectedRepository(): void {
    this.selectedRepositorySignal.set(null);
  }

  clearMyRepositories(): void {
    this.myRepositoriesSignal.set(null);
    this.myRepositoriesLoadingSignal.set(false);
  }

  clearExploreRepositories(): void {
    this.exploreRepositoriesSignal.set(null);
    this.exploreRepositoriesLoadingSignal.set(false);
  }

  clearCategories(): void {
    this.categoriesSignal.set([]);
    this.categoriesLoadingSignal.set(false);
  }

  clearRepositoryRoles(): void {
    this.repositoryRolesSignal.set([]);
    this.repositoryRolesLoadingSignal.set(false);
  }

  clearRepositoryUsers(): void {
    this.ownersSignal.set(null);
    this.coOwnersSignal.set(null);
    this.coCreatorsSignal.set(null);
    this.membersSignal.set(null);
    this.repositoryUsersLoadingSignal.set(false);
  }

  clear(): void {
    this.selectedRepositorySignal.set(null);
    this.myRepositoriesSignal.set(null);
    this.exploreRepositoriesSignal.set(null);
    this.categoriesSignal.set([]);
    this.repositoryRolesSignal.set([]);
    this.ownersSignal.set(null);
    this.coOwnersSignal.set(null);
    this.coCreatorsSignal.set(null);
    this.membersSignal.set(null);
    this.loadingSignal.set(false);
    this.myRepositoriesLoadingSignal.set(false);
    this.exploreRepositoriesLoadingSignal.set(false);
    this.categoriesLoadingSignal.set(false);
    this.repositoryRolesLoadingSignal.set(false);
    this.repositoryUsersLoadingSignal.set(false);
    this.allRepositoryUsersSignal.set(null);
    this.repositoryFunctionsSignal.set([]);
  }

  setAllRepositoryUsers(users: PaginatedResponseModel<RepositoryUserModel> | null): void {
    this.allRepositoryUsersSignal.set(users);
  }

  setRepositoryFunctions(functions: RepositoryFunctionModel[]): void {
    this.repositoryFunctionsSignal.set(functions);
  }
}
