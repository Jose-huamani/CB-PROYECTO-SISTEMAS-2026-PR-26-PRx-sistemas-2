import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { finalize } from 'rxjs';
import { NotificationService } from '@core/services/notification.service';
import { AppConfirmService } from '@core/services/confirm-dialog.service';
import { BinnacleFacade } from '@features/binnacles/application/facades/binnacle.facade';
import { buildCreateBinnacleFormFields } from '@features/binnacles/application/forms/create-binnacle.form';
import { BINNACLE_MESSAGES } from '@features/binnacles/constants/binnacle-messages.constants';
import { UI_MESSAGES } from '@shared/constants/ui-messages.constants';
import { NotificationMessage } from '@shared/types/notification-message.type';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';
import { AppPaginationComponent } from '@shared/ui/components/app-pagination/app-pagination.component';
import { CreateBinnacleRequest } from '@features/binnacles/domain/requests/create-binnacle.request';

interface CreateBinnacleFormValue {
  name: string;
  content: string;
}

@Component({
  selector: 'app-binnacle-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule,
    ButtonModule,
    SkeletonModule,
    AppPaginationComponent,
  ],
  templateUrl: './binnacle-page.component.html',
  styleUrl: './binnacle-page.component.scss',
})
export class BinnaclePageComponent {
  private readonly binnacleFacade = inject(BinnacleFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmService = inject(AppConfirmService);

  protected readonly form = new FormGroup({});
  protected readonly fields: FormlyFieldConfig[] = buildCreateBinnacleFormFields();
  protected readonly submitting = signal(false);

  protected readonly binnacles = this.binnacleFacade.binnacles;
  protected readonly total = this.binnacleFacade.total;
  protected readonly page = this.binnacleFacade.page;
  protected readonly limit = this.binnacleFacade.limit;
  protected readonly loading = this.binnacleFacade.loading;

  protected model: CreateBinnacleFormValue = {
    name: '',
    content: '',
  };

  constructor() {
    this.load();
  }

  protected load(): void {
    this.binnacleFacade.findPaginatedMe({ page: this.page(), limit: this.limit() });
  }

  protected submit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.form.invalid) {
      this.handleInvalidForm();
      return;
    }

    const request = this.buildCreateRequest();

    this.submitting.set(true);

    this.binnacleFacade
      .create(request)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.handleCreateSuccess(
            getApiNotificationMessage(response, BINNACLE_MESSAGES.CREATE.SUCCESS),
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleCreateError(
            getApiErrorNotificationMessage(error, BINNACLE_MESSAGES.CREATE.ERROR),
          );
        },
      });
  }

  protected onPageChange(event: { first: number; rows: number }): void {
    const newPage = event.first / event.rows + 1;
    this.binnacleFacade.findPaginatedMe({ page: newPage, limit: event.rows as number });
  }

  protected confirmDelete(id: number, name: string): void {
    this.confirmService.confirmDelete(`¿Estás seguro de eliminar la bitácora "${name}"?`, () => {
      this.delete(id);
    });
  }

  private delete(id: number): void {
    this.submitting.set(true);

    this.binnacleFacade
      .delete(id)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.handleDeleteSuccess(
            getApiNotificationMessage(response, BINNACLE_MESSAGES.DELETE.SUCCESS),
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleDeleteError(
            getApiErrorNotificationMessage(error, BINNACLE_MESSAGES.DELETE.ERROR),
          );
        },
      });
  }

  private buildCreateRequest(): CreateBinnacleRequest {
    const rawValue = this.form.getRawValue() as CreateBinnacleFormValue;
    return {
      name: rawValue.name,
      content: rawValue.content,
    };
  }

  private handleInvalidForm(): void {
    this.markFormAsTouched();
    this.notificationService.warn('Formulario', UI_MESSAGES.FORM.INVALID_GENERIC);
  }

  private handleCreateSuccess(message: NotificationMessage): void {
    this.notificationService.success('Bitácora', message);
    this.form.reset();
    this.load();
  }

  private handleCreateError(message: NotificationMessage): void {
    this.notificationService.error('Bitácora', message);
  }

  private handleDeleteSuccess(message: NotificationMessage): void {
    this.notificationService.success('Bitácora', message);
    this.load();
  }

  private handleDeleteError(message: NotificationMessage): void {
    this.notificationService.error('Bitácora', message);
  }

  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
}
