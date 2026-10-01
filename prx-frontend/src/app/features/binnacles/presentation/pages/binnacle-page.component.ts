import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { Router } from '@angular/router';
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

interface BinnacleTaskDraft {
  id: string;
  title: string;
  completed: boolean;
}

interface BinnacleLinkDraft {
  id: string;
  url: string;
}

@Component({
  selector: 'app-binnacle-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({});
  protected readonly fields: FormlyFieldConfig[] = buildCreateBinnacleFormFields();
  protected readonly submitting = signal(false);
  protected readonly tasks = signal<BinnacleTaskDraft[]>([]);
  protected readonly links = signal<BinnacleLinkDraft[]>([]);
  protected newTaskTitle = '';
  protected newLinkUrl = '';

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

    if (!this.addTask() || !this.addLink()) {
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

  protected openBinnacle(id: number): void {
    void this.router.navigate(['/binnacles', id]);
  }

  protected addTask(): boolean {
    const title = this.newTaskTitle.trim();
    if (!title) {
      return true;
    }

    if (title.length > 250) {
      this.notificationService.warn('Bitácora', 'La tarea no puede superar los 250 caracteres.');
      return false;
    }

    this.tasks.update((tasks) => [...tasks, { id: crypto.randomUUID(), title, completed: false }]);
    this.newTaskTitle = '';
    return true;
  }

  protected toggleTask(id: string): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  }

  protected removeTask(id: string): void {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  protected addLink(): boolean {
    const url = this.normalizeUrl(this.newLinkUrl);
    if (!url) {
      return true;
    }

    if (!this.isValidUrl(url)) {
      this.notificationService.warn('Bitácora', 'Ingresa una URL válida.');
      return false;
    }

    this.links.update((links) => [...links, { id: crypto.randomUUID(), url }]);
    this.newLinkUrl = '';
    return true;
  }

  protected removeLink(id: string): void {
    this.links.update((links) => links.filter((link) => link.id !== id));
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
      tasks: this.tasks(),
      links: this.links(),
    };
  }

  private handleInvalidForm(): void {
    this.markFormAsTouched();
    this.notificationService.warn('Formulario', UI_MESSAGES.FORM.INVALID_GENERIC);
  }

  private handleCreateSuccess(message: NotificationMessage): void {
    this.notificationService.success('Bitácora', message);
    this.form.reset();
    this.tasks.set([]);
    this.links.set([]);
    this.newTaskTitle = '';
    this.newLinkUrl = '';
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

  private normalizeUrl(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) {
      return '';
    }

    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  private isValidUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
