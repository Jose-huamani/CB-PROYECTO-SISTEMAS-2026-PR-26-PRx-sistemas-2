import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs';

import { NotificationService } from '@core/services/notification.service';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { RepositoryFacade } from '@features/repositories/application/facades/repository.facade';
import { buildCreateRepositoryFormFields } from '@features/repositories/application/forms/create-repository.form';
import { REPOSITORY_MESSAGES } from '@features/repositories/constants/repository-messages.constants';
import { RepositoryCategoryModel } from '@features/repositories/domain/models/repository-category.model';
import { CreateRepositoryRequest } from '@features/repositories/domain/requests/create-repository.request';
import { UI_MESSAGES } from '@shared/constants/ui-messages.constants';
import { RepositoryVisibility } from '@shared/enums/repository-visibility.enum';
import { NotificationMessage } from '@shared/types/notification-message.type';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';

interface CreateRepositoryFormModel {
  ownerUsername: string;
  name: string;
  description?: string;
  visibility: RepositoryVisibility;
  color: string;
  category: string | RepositoryCategoryModel | null;
  tags: string[];
}

@Component({
  selector: 'app-create-repository-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, ButtonModule],
  templateUrl: './create-repository-page.component.html',
  styleUrl: './create-repository-page.component.scss',
})
export class CreateRepositoryPageComponent {
  private readonly repositoryFacade = inject(RepositoryFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({});
  protected readonly submitting = signal(false);
  protected readonly currentUser = this.authFacade.currentUser;

  protected readonly fields: FormlyFieldConfig[] = buildCreateRepositoryFormFields({
    categorySuggestions: [],
    searchCategories: (event) => {
      this.searchCategories(event);
    },
  });

  protected model: CreateRepositoryFormModel = {
    ownerUsername: '',
    name: '',
    description: '',
    visibility: RepositoryVisibility.publico,
    color: 'C9E4DE',
    category: null,
    tags: [],
  };

  constructor() {
    effect(() => {
      const user = this.currentUser();

      if (!user) {
        return;
      }

      this.model = {
        ...this.model,
        ownerUsername: user.username,
      };

      this.form.patchValue(
        {
          ownerUsername: user.username,
        },
        {
          emitEvent: false,
        },
      );
    });
  }

  protected submit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.form.invalid) {
      this.handleInvalidForm();
      return;
    }

    const request = this.buildCreateRepositoryRequest();

    this.submitting.set(true);

    this.repositoryFacade
      .create(request)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.handleCreateSuccess(
            getApiNotificationMessage(response, REPOSITORY_MESSAGES.CREATE.SUCCESS),
            response.data?.id,
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleCreateError(
            getApiErrorNotificationMessage(error, REPOSITORY_MESSAGES.CREATE.ERROR),
          );
        },
      });
  }

  protected cancel(): void {
    void this.router.navigateByUrl('/');
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

  private buildCreateRepositoryRequest(): CreateRepositoryRequest {
    const value = this.form.getRawValue() as CreateRepositoryFormModel;

    return {
      name: value.name,
      description: value.description || undefined,
      visibility: value.visibility,
      color: value.color,
      category: {
        name: this.getCategoryName(value.category),
      },
      tags: this.getTags(value.tags),
    };
  }

  private getCategoryName(category: CreateRepositoryFormModel['category']): string {
    if (!category) {
      return '';
    }

    if (typeof category === 'string') {
      return category;
    }

    return category.name;
  }

  private getTags(tags: CreateRepositoryFormModel['tags']): CreateRepositoryRequest['tags'] {
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

  private handleInvalidForm(): void {
    this.markFormAsTouched();
    this.notificationService.warn('Formulario', UI_MESSAGES.FORM.INVALID_REQUIRED);
  }

  private handleCreateSuccess(message: NotificationMessage, repositoryId?: number): void {
    this.notificationService.success('Repositorios', message);

    if (!repositoryId) {
      void this.router.navigateByUrl('/');
      return;
    }

    void this.router.navigate(['/repositories', repositoryId]);
  }

  private handleCreateError(message: NotificationMessage): void {
    this.notificationService.error('Repositorios', message);
  }

  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
}
