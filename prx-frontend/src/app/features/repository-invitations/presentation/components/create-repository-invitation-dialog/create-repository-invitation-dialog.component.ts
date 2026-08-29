import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { NotificationService } from '@core/services/notification.service';
import { RepositoryFacade } from '@features/repositories/application/facades/repository.facade';
import { RepositoryInvitationFacade } from '@features/repository-invitations/application/facades/repository-invitation.facade';
import { REPOSITORY_INVITATION_MESSAGES } from '@features/repository-invitations/constants/repository-invitation-messages.constants';
import { CreateRepositoryInvitationRequest } from '@features/repository-invitations/domain/requests/create-repository-invitation.request';
import { UI_MESSAGES } from '@shared/constants/ui-messages.constants';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';
import { buildCreateRepositoryInvitationForm } from '@features/repository-invitations/application/forms/create-repository-invitation.form';

interface CreateRepositoryInvitationFormModel {
  invitedUserEmail: string;
  repositoryFunctionId: number | null;
  welcomeMessage?: string;
}

@Component({
  selector: 'app-create-repository-invitation-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, DialogModule, ButtonModule],
  templateUrl: './create-repository-invitation-dialog.component.html',
  styleUrl: './create-repository-invitation-dialog.component.scss',
})
export class CreateRepositoryInvitationDialogComponent implements OnInit {
  private readonly repositoryFacade = inject(RepositoryFacade);
  private readonly invitationFacade = inject(RepositoryInvitationFacade);
  private readonly notificationService = inject(NotificationService);

  readonly repositoryId = input.required<number>();
  readonly created = output<void>();

  protected readonly visible = signal(false);
  protected readonly submitting = signal(false);

  protected readonly form = new FormGroup({});
  protected readonly repositoryFunctions = this.repositoryFacade.repositoryFunctions;

  protected fields: FormlyFieldConfig[] = [];

  protected model: CreateRepositoryInvitationFormModel = {
    invitedUserEmail: '',
    repositoryFunctionId: null,
    welcomeMessage: '',
  };

  ngOnInit(): void {
    this.loadFunctions();
  }

  open(): void {
    this.resetForm();
    this.visible.set(true);
  }

  protected close(): void {
    this.visible.set(false);
  }

  protected submit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.warn('Invitación', UI_MESSAGES.FORM.INVALID_REQUIRED);
      return;
    }

    const request = this.buildRequest();
    this.submitting.set(true);

    this.invitationFacade
      .createInvitation(this.repositoryId(), request)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          this.notificationService.success(
            'Invitación',
            getApiNotificationMessage(response, REPOSITORY_INVITATION_MESSAGES.CREATE.SUCCESS),
          );
          this.created.emit();
          this.close();
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.error(
            'Invitación',
            getApiErrorNotificationMessage(error, REPOSITORY_INVITATION_MESSAGES.CREATE.ERROR),
          );
        },
      });
  }

  private loadFunctions(): void {
    if (this.repositoryFunctions().length > 0) {
      this.buildFields();
      return;
    }

    this.repositoryFacade.findFunctions().subscribe({
      next: () => this.buildFields(),
      error: () => this.buildFields(),
    });
  }

  private buildFields(): void {
    const { fields } = buildCreateRepositoryInvitationForm({
      functionOptions: this.repositoryFunctions(),
    });
    this.fields = fields;
  }

  private buildRequest(): CreateRepositoryInvitationRequest {
    const value = this.form.getRawValue() as CreateRepositoryInvitationFormModel;

    return {
      invitedUserEmail: value.invitedUserEmail,
      repositoryFunctionId: value.repositoryFunctionId as number,
      welcomeMessage: value.welcomeMessage || undefined,
    };
  }

  private resetForm(): void {
    this.model = {
      invitedUserEmail: '',
      repositoryFunctionId: null,
      welcomeMessage: '',
    };
    this.form.reset();
  }
}
