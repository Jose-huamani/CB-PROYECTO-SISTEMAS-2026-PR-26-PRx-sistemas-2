import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';

import { NotificationService } from '@core/services/notification.service';
import { RepositoryFacade } from '@features/repositories/application/facades/repository.facade';
import { REPOSITORY_MESSAGES } from '@features/repositories/constants/repository-messages.constants';
import { RepositoryCategoryModel } from '@features/repositories/domain/models/repository-category.model';
import { RepositoryModel } from '@features/repositories/domain/models/repository.model';
import { RepositoryRoleModel } from '@features/repositories/domain/models/repository-role.model';
import { RepositoryCardComponent } from '@features/repositories/presentation/components/repository-card/repository-card.component';
import { RepositoryVisibility } from '@shared/enums/repository-visibility.enum';
import {
  AppPaginationChange,
  AppPaginationComponent,
} from '@shared/ui/components/app-pagination/app-pagination.component';
import { getApiErrorNotificationMessage } from '@shared/utils/api-notification.util';

interface VisibilityOption {
  label: string;
  value: RepositoryVisibility | null;
}

@Component({
  selector: 'app-me-repositories-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    KeyFilterModule,
    SelectModule,
    SkeletonModule,
    TabsModule,
    AppPaginationComponent,
    RepositoryCardComponent,
  ],
  templateUrl: './me-repositories-page.component.html',
  styleUrl: './me-repositories-page.component.scss',
})
export class MeRepositoriesPageComponent implements OnInit {
  private readonly repositoryFacade = inject(RepositoryFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly REPOSITORY_MESSAGES = REPOSITORY_MESSAGES;
  protected readonly repositorySearchKeyFilter = /^(?!.*--)[A-Za-z0-9-]+$/;

  private readonly categoryMaxLength = 50;

  protected search = '';
  protected selectedCategory: RepositoryCategoryModel | string | null = null;
  protected selectedVisibility: RepositoryVisibility | null = null;

  protected readonly selectedRole = signal('');
  protected readonly page = signal(1);
  protected readonly limit = signal(10);

  protected readonly repositories = this.repositoryFacade.myRepositories;
  protected readonly roles = this.repositoryFacade.repositoryRoles;
  protected readonly categories = this.repositoryFacade.categories;
  protected readonly repositoriesLoading = this.repositoryFacade.myRepositoriesLoading;
  protected readonly rolesLoading = this.repositoryFacade.repositoryRolesLoading;

  protected readonly items = computed(() => this.repositories()?.items ?? []);
  protected readonly total = computed(() => this.repositories()?.total ?? 0);

  protected readonly subtitle = computed(() => {
    const selectedRole = this.selectedRole();

    if (!selectedRole) {
      return REPOSITORY_MESSAGES.LIST.DEFAULT_SUBTITLE;
    }

    const role = this.roles().find((repositoryRole) => repositoryRole.name === selectedRole);
    const description = role?.description?.trim();

    if (!description) {
      return REPOSITORY_MESSAGES.LIST.DEFAULT_SUBTITLE;
    }

    return description;
  });

  protected readonly visibilityOptions: VisibilityOption[] = [
    {
      label: 'Todos',
      value: null,
    },
    {
      label: 'Público',
      value: RepositoryVisibility.publico,
    },
    {
      label: 'Privado',
      value: RepositoryVisibility.privado,
    },
  ];

  ngOnInit(): void {
    this.repositoryFacade.clearMyRepositories();
    this.loadRoles();
    this.loadRepositories();
  }

  protected onRoleChange(value: string | number | undefined): void {
    this.selectedRole.set(value ? String(value) : '');
    this.page.set(1);
    this.loadRepositories();
  }

  protected handleSearchChange(value: string | number | null | undefined): void {
    this.search = String(value ?? '')
      .toLowerCase()
      .replace(/--+/g, '-');
  }

  protected handleCategoryChange(value: RepositoryCategoryModel | string | null): void {
    if (!value) {
      this.selectedCategory = null;
      return;
    }

    if (typeof value === 'string') {
      this.selectedCategory = this.normalizeCategoryValue(value);
      return;
    }

    this.selectedCategory = value;
  }

  protected searchCategories(event: AutoCompleteCompleteEvent): void {
    const search = this.normalizeCategoryValue(event.query);

    this.repositoryFacade
      .findCategories({
        search: search || undefined,
        limit: 10,
      })
      .subscribe({
        error: () => {
          this.repositoryFacade.clearCategories();
        },
      });
  }

  protected applyFilters(): void {
    this.search = this.search.trim();

    if (typeof this.selectedCategory === 'string') {
      this.selectedCategory = this.normalizeCategoryValue(this.selectedCategory).trim();
    }

    this.page.set(1);
    this.loadRepositories();
  }

  protected clearFilters(): void {
    this.search = '';
    this.selectedCategory = null;
    this.selectedVisibility = null;
    this.page.set(1);
    this.loadRepositories();
  }

  protected onPageChange(event: AppPaginationChange): void {
    this.page.set(event.page + 1);
    this.limit.set(event.rows);
    this.loadRepositories();
  }

  protected openCreateRepository(): void {
    void this.router.navigate(['/repositories/create']);
  }

  protected openRepository(repository: RepositoryModel): void {
    void this.router.navigate(['/repositories', repository.id]);
  }

  protected getRoleLabel(role: RepositoryRoleModel): string {
    return role.name.charAt(0).toUpperCase() + role.name.slice(1);
  }

  protected getCategoryName(): string | undefined {
    if (!this.selectedCategory) {
      return undefined;
    }

    if (typeof this.selectedCategory === 'string') {
      return this.selectedCategory || undefined;
    }

    return this.selectedCategory.name;
  }

  private normalizeCategoryValue(value: string): string {
    return value
      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]/g, '')
      .replace(/\s+/g, ' ')
      .trimStart()
      .toUpperCase()
      .slice(0, this.categoryMaxLength);
  }

  private loadRoles(): void {
    this.repositoryFacade.findRoles().subscribe({
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(
          'Repositorios',
          getApiErrorNotificationMessage(error, REPOSITORY_MESSAGES.LIST.ROLES_ERROR),
        );
      },
    });
  }

  private loadRepositories(): void {
    this.repositoryFacade
      .findMe({
        page: this.page(),
        limit: this.limit(),
        search: this.search || undefined,
        role: this.selectedRole() || undefined,
        category: this.getCategoryName(),
        visibility: this.selectedVisibility ?? undefined,
      })
      .subscribe({
        error: (error: HttpErrorResponse) => {
          this.notificationService.error(
            'Repositorios',
            getApiErrorNotificationMessage(error, REPOSITORY_MESSAGES.LIST.ERROR),
          );
        },
      });
  }
}
