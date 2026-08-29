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
import { SkeletonModule } from 'primeng/skeleton';

import { NotificationService } from '@core/services/notification.service';
import { RepositoryFacade } from '@features/repositories/application/facades/repository.facade';
import { REPOSITORY_MESSAGES } from '@features/repositories/constants/repository-messages.constants';
import { RepositoryCategoryModel } from '@features/repositories/domain/models/repository-category.model';
import { RepositoryModel } from '@features/repositories/domain/models/repository.model';
import { RepositoryCardComponent } from '@features/repositories/presentation/components/repository-card/repository-card.component';
import {
  AppPaginationChange,
  AppPaginationComponent,
} from '@shared/ui/components/app-pagination/app-pagination.component';
import { getApiErrorNotificationMessage } from '@shared/utils/api-notification.util';

@Component({
  selector: 'app-repository-explore-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    KeyFilterModule,
    SkeletonModule,
    AppPaginationComponent,
    RepositoryCardComponent,
  ],
  templateUrl: './repository-explore-page.component.html',
  styleUrl: './repository-explore-page.component.scss',
})
export class RepositoryExplorePageComponent implements OnInit {
  private readonly repositoryFacade = inject(RepositoryFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly REPOSITORY_MESSAGES = REPOSITORY_MESSAGES;
  protected readonly repositorySearchKeyFilter = /^(?!.*--)[A-Za-z0-9-]+$/;

  private readonly categoryMaxLength = 50;

  protected search = '';
  protected owner = '';
  protected selectedCategory: RepositoryCategoryModel | string | null = null;

  protected readonly page = signal(1);
  protected readonly limit = signal(10);

  protected readonly repositories = this.repositoryFacade.exploreRepositories;
  protected readonly repositoriesLoading = this.repositoryFacade.exploreRepositoriesLoading;
  protected readonly categories = this.repositoryFacade.categories;

  protected readonly items = computed(() => this.repositories()?.items ?? []);
  protected readonly total = computed(() => this.repositories()?.total ?? 0);

  ngOnInit(): void {
    this.repositoryFacade.clearExploreRepositories();
    this.loadRepositories();
  }

  protected handleSearchChange(value: string | number | null | undefined): void {
    this.search = String(value ?? '')
      .toLowerCase()
      .replace(/--+/g, '-');
  }

  protected handleOwnerChange(value: string | number | null | undefined): void {
    this.owner = String(value ?? '')
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
    this.owner = this.owner.trim();

    if (typeof this.selectedCategory === 'string') {
      this.selectedCategory = this.normalizeCategoryValue(this.selectedCategory).trim();
    }

    this.page.set(1);
    this.loadRepositories();
  }

  protected clearFilters(): void {
    this.search = '';
    this.owner = '';
    this.selectedCategory = null;
    this.page.set(1);
    this.loadRepositories();
  }

  protected onPageChange(event: AppPaginationChange): void {
    this.page.set(event.page + 1);
    this.limit.set(event.rows);
    this.loadRepositories();
  }

  protected openRepository(repository: RepositoryModel): void {
    void this.router.navigate(['/repositories', repository.id]);
  }

  protected openOwnerProfile(repository: RepositoryModel): void {
    void this.router.navigate(['/profiles/view', repository.owner.id]);
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

  private loadRepositories(): void {
    this.repositoryFacade
      .findExplore({
        page: this.page(),
        limit: this.limit(),
        search: this.search || undefined,
        owner: this.owner || undefined,
        category: this.getCategoryName(),
      })
      .subscribe({
        error: (error: HttpErrorResponse) => {
          this.notificationService.error(
            'Repositorios',
            getApiErrorNotificationMessage(error, REPOSITORY_MESSAGES.EXPLORE.ERROR),
          );
        },
      });
  }
}
