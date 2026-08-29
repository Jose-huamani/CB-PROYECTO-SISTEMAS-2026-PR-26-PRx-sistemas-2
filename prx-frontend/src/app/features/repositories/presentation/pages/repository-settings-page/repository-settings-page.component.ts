import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { finalize } from 'rxjs';

import { AppConfirmService } from '@core/services/confirm-dialog.service';
import { NotificationService } from '@core/services/notification.service';
import { RepositoryFacade } from '@features/repositories/application/facades/repository.facade';
import { buildUpdateRepositoryFormFields } from '@features/repositories/application/forms/update-repository.form';
import { REPOSITORY_MESSAGES } from '@features/repositories/constants/repository-messages.constants';
import { RepositoryCategoryModel } from '@features/repositories/domain/models/repository-category.model';
import { RepositoryModel } from '@features/repositories/domain/models/repository.model';
import { UpdateRepositoryRequest } from '@features/repositories/domain/requests/update-repository.request';
import { UI_MESSAGES } from '@shared/constants/ui-messages.constants';
import { RepositoryVisibility } from '@shared/enums/repository-visibility.enum';
import { NotificationMessage } from '@shared/types/notification-message.type';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';

interface RepositorySettingsFormModel {
  ownerUsername: string;
  name: string;
  description?: string;
  visibility: RepositoryVisibility;
  color: string;
  category: string | RepositoryCategoryModel | null;
  tags: string[];
}

@Component({
  selector: 'app-repository-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule,
    ButtonModule,
    CardModule,
    SkeletonModule,
  ],
  templateUrl: './repository-settings-page.component.html',
  styleUrl: './repository-settings-page.component.scss',
})
export class RepositorySettingsPageComponent implements OnInit {
  private readonly repositoryFacade = inject(RepositoryFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmService = inject(AppConfirmService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly ownerRoleName = 'propietario';
  private readonly coOwnerRoleName = 'copropietario';

  protected readonly form = new FormGroup({});
  protected readonly repository = this.repositoryFacade.selectedRepository;
  protected readonly loading = this.repositoryFacade.loading;
  protected readonly submitting = signal(false);
  protected readonly deleting = signal(false);

  protected fields: FormlyFieldConfig[] = [];

  protected model: RepositorySettingsFormModel = {
    ownerUsername: '',
    name: '',
    description: '',
    visibility: RepositoryVisibility.publico,
    color: 'C9E4DE',
    category: null,
    tags: [],
  };

  protected readonly isOwner = computed(
    () => this.repository()?.currentUserRepository?.role.name === this.ownerRoleName,
  );

  protected readonly isCoOwner = computed(
    () => this.repository()?.currentUserRepository?.role.name === this.coOwnerRoleName,
  );

  protected readonly canAccessSettings = computed(() => this.isOwner() || this.isCoOwner());

  protected readonly canEditCriticalFields = computed(() => this.isOwner());

  protected readonly canDeleteRepository = computed(() => this.isOwner());

  ngOnInit(): void {
    this.loadRepository();
  }

  protected submit(): void {
    if (this.submitting() || this.deleting()) {
      return;
    }

    if (this.form.invalid) {
      this.handleInvalidForm();
      return;
    }

    if (this.form.pristine) {
      this.handleFormWithoutChanges();
      return;
    }

    const repository = this.repository();

    if (!repository) {
      return;
    }

    const request = this.buildUpdateRepositoryRequest();

    this.submitting.set(true);

    this.repositoryFacade
      .update(repository.id, request)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.handleUpdateSuccess(
            getApiNotificationMessage(response, REPOSITORY_MESSAGES.UPDATE.SUCCESS),
            response.data?.id ?? repository.id,
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleUpdateError(
            getApiErrorNotificationMessage(error, REPOSITORY_MESSAGES.UPDATE.ERROR),
          );
        },
      });
  }

  protected backToRepository(): void {
    const repository = this.repository();

    if (!repository) {
      void this.router.navigateByUrl('/');
      return;
    }

    void this.router.navigate(['/repositories', repository.id]);
  }

  protected cancel(): void {
    this.backToRepository();
  }

  protected deleteRepository(): void {
    const repository = this.repository();

    if (!repository || !this.canDeleteRepository() || this.deleting()) {
      return;
    }

    this.confirmService.confirmDelete(REPOSITORY_MESSAGES.DELETE.CONFIRM(repository.name), () => {
      this.executeDeleteRepository(repository.id);
    });
  }

  protected getRepositoryColor(repository: RepositoryModel): string {
    return `#${repository.color.replace('#', '')}`;
  }

  private loadRepository(): void {
    this.repositoryFacade.clearSelectedRepository();

    const id = this.getRepositoryId();

    if (!id) {
      this.handleInvalidRepositoryId();
      return;
    }

    this.repositoryFacade.findById(id).subscribe({
      next: (response) => {
        const repository = response.data;

        if (!repository) {
          this.handleLoadErrorMessage(REPOSITORY_MESSAGES.DETAIL.ERROR);
          return;
        }

        if (!this.canAccessSettings()) {
          this.handleUnauthorizedAccess(repository.id);
          return;
        }

        this.setFormState(repository);
      },
      error: (error: HttpErrorResponse) => {
        this.handleLoadError(error);
      },
    });
  }

  private setFormState(repository: RepositoryModel): void {
    this.model = {
      ownerUsername: repository.owner.username,
      name: repository.name,
      description: repository.description ?? '',
      visibility: repository.visibility,
      color: repository.color,
      category: repository.category.name,
      tags: repository.tags.map((tag) => tag.name),
    };

    this.fields = buildUpdateRepositoryFormFields({
      categorySuggestions: [],
      searchCategories: (event) => {
        this.searchCategories(event);
      },
      canEditCriticalFields: this.canEditCriticalFields(),
    });

    this.form.reset(this.model);
  }

  private searchCategories(event: AutoCompleteCompleteEvent): void {
    this.repositoryFacade
      .findCategories({
        search: event.query,
        limit: 10,
      })
      .subscribe({
        next: (response) => {
          this.setCategorySuggestions(response.data ?? []);
        },
        error: () => {
          this.setCategorySuggestions([]);
        },
      });
  }

  private buildUpdateRepositoryRequest(): UpdateRepositoryRequest {
    const value = this.form.getRawValue() as RepositorySettingsFormModel;

    const request: UpdateRepositoryRequest = {
      description: value.description || undefined,
      color: value.color,
      category: {
        name: this.getCategoryName(value.category),
      },
      tags: this.getTags(value.tags),
    };

    if (this.canEditCriticalFields()) {
      request.name = value.name;
      request.visibility = value.visibility;
    }

    return request;
  }

  private getCategoryName(category: RepositorySettingsFormModel['category']): string {
    if (!category) {
      return '';
    }

    if (typeof category === 'string') {
      return category;
    }

    return category.name;
  }

  private getTags(tags: RepositorySettingsFormModel['tags']): UpdateRepositoryRequest['tags'] {
    const uniqueTags = [...new Set(tags.filter(Boolean))];

    if (!uniqueTags.length) {
      return undefined;
    }

    return uniqueTags.slice(0, 5).map((name) => ({
      name,
    }));
  }

  private setCategorySuggestions(categories: RepositoryCategoryModel[]): void {
    const categoryField = this.findFieldByKey(this.fields, 'category');

    if (!categoryField) {
      return;
    }

    categoryField.props = {
      ...categoryField.props,
      suggestions: categories,
    };
  }

  private findFieldByKey(fields: FormlyFieldConfig[], key: string): FormlyFieldConfig | null {
    for (const field of fields) {
      if (field.key === key) {
        return field;
      }

      if (!field.fieldGroup) {
        continue;
      }

      const nestedField = this.findFieldByKey(field.fieldGroup, key);

      if (nestedField) {
        return nestedField;
      }
    }

    return null;
  }

  private executeDeleteRepository(repositoryId: number): void {
    this.deleting.set(true);

    this.repositoryFacade
      .deleteById(repositoryId)
      .pipe(
        finalize(() => {
          this.deleting.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.handleDeleteSuccess(
            getApiNotificationMessage(response, REPOSITORY_MESSAGES.DELETE.SUCCESS),
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleDeleteError(
            getApiErrorNotificationMessage(error, REPOSITORY_MESSAGES.DELETE.ERROR),
          );
        },
      });
  }

  private getRepositoryId(): number | null {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      return null;
    }

    return id;
  }

  private handleInvalidRepositoryId(): void {
    this.notificationService.warn('Repositorios', REPOSITORY_MESSAGES.DETAIL.INVALID_ID);
    void this.router.navigateByUrl('/');
  }

  private handleUnauthorizedAccess(repositoryId: number): void {
    this.notificationService.warn('Repositorios', REPOSITORY_MESSAGES.UPDATE.UNAUTHORIZED);
    void this.router.navigate(['/repositories', repositoryId]);
  }

  private handleLoadError(error: HttpErrorResponse): void {
    this.notificationService.error(
      'Repositorios',
      getApiErrorNotificationMessage(error, REPOSITORY_MESSAGES.DETAIL.ERROR),
    );

    void this.router.navigateByUrl('/');
  }

  private handleLoadErrorMessage(message: NotificationMessage): void {
    this.notificationService.error('Repositorios', message);
    void this.router.navigateByUrl('/');
  }

  private handleInvalidForm(): void {
    this.markFormAsTouched();
    this.notificationService.warn('Formulario', UI_MESSAGES.FORM.INVALID_REQUIRED);
  }

  private handleFormWithoutChanges(): void {
    this.notificationService.warn('Formulario', REPOSITORY_MESSAGES.UPDATE.WITHOUT_CHANGES);
  }

  private handleUpdateSuccess(message: NotificationMessage, repositoryId: number): void {
    this.notificationService.success('Repositorios', message);
    void this.router.navigate(['/repositories', repositoryId]);
  }

  private handleUpdateError(message: NotificationMessage): void {
    this.notificationService.error('Repositorios', message);
  }

  private handleDeleteSuccess(message: NotificationMessage): void {
    this.notificationService.success('Repositorios', message);
    void this.router.navigate(['/repositories/me']);
  }

  private handleDeleteError(message: NotificationMessage): void {
    this.notificationService.error('Repositorios', message);
  }

  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
}
