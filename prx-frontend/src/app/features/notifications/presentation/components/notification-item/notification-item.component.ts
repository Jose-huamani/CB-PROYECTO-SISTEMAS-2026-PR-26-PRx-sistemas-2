import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

import { AppConfirmService } from '@core/services/confirm-dialog.service';
import { NotificationService } from '@core/services/notification.service';
import { NotificationsFacade } from '@features/notifications/application/facades/notifications.facade';
import { NotificationModel } from '@features/notifications/domain/models/notifications.model';
import { RepositoryInvitationFacade } from '@features/repository-invitations/application/facades/repository-invitation.facade';
import { RepositoryInvitationModel } from '@features/repository-invitations/domain/models/repository-invitation.model';
import { InvitationStatus } from '@shared/enums/invitation-status.enum';
import { NotificationType } from '@shared/enums/notification-type.enum';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';
import { REPOSITORY_INVITATION_MESSAGES } from '@features/repository-invitations/constants/repository-invitation-messages.constants';
import { SkeletonModule } from 'primeng/skeleton';
import { NOTIFICATIONS_MESSAGES } from '@features/notifications/constants/notifications-messages.constants';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule, AvatarModule, ButtonModule, SkeletonModule, RouterModule],
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.scss',
})
export class NotificationItemComponent implements OnInit {
  private readonly invitationFacade = inject(RepositoryInvitationFacade);
  private readonly notificationsFacade = inject(NotificationsFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmService = inject(AppConfirmService);

  readonly notification = input.required<NotificationModel>();

  readonly deleted = output<number>();
  readonly invitationResolved = output<{
    notificationId: number;
    accepted: boolean;
    repositoryId?: number;
  }>();

  protected readonly invitation = signal<RepositoryInvitationModel | null>(null);
  protected readonly invitationLoading = signal(false);
  protected readonly actionLoading = signal(false);
  protected readonly deleteLoading = signal(false);

  protected readonly isInvitation = computed(
    () => this.notification().type === NotificationType.invitacion_repositorio,
  );

  protected readonly canRespond = computed(() => {
    const inv = this.invitation();
    return !!inv && inv.invitationStatus === InvitationStatus.pendiente;
  });

  ngOnInit(): void {
    if (this.isInvitation()) {
      this.loadInvitation();
    }
  }

  protected accept(): void {
    this.respond('accept');
  }

  protected reject(): void {
    this.respond('reject');
  }

  protected onDelete(): void {
    if (this.deleteLoading()) {
      return;
    }

    this.confirmService.confirmDelete('¿Estás seguro que deseas eliminar esta notificación?', () =>
      this.deleteNotification(),
    );
  }

  private deleteNotification(): void {
    this.deleteLoading.set(true);

    this.notificationsFacade
      .deleteNotification(this.notification().id)
      .pipe(finalize(() => this.deleteLoading.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success('Notificaciones', NOTIFICATIONS_MESSAGES.DELETE.SUCCESS);
          this.deleted.emit(this.notification().id);
        },
        error: () => {
          this.notificationService.error('Notificaciones', NOTIFICATIONS_MESSAGES.DELETE.ERROR);
        },
      });
  }

  private loadInvitation(): void {
    this.invitationLoading.set(true);

    this.invitationFacade
      .getInvitation(this.notification().referenceId)
      .pipe(finalize(() => this.invitationLoading.set(false)))
      .subscribe({
        next: (response) => this.invitation.set(response.data ?? null),
        error: () => this.invitation.set(null),
      });
  }

  private respond(action: 'accept' | 'reject'): void {
    if (this.actionLoading()) {
      return;
    }

    const invitationId = this.notification().referenceId;
    this.actionLoading.set(true);

    const request$ =
      action === 'accept'
        ? this.invitationFacade.acceptInvitation(invitationId)
        : this.invitationFacade.rejectInvitation(invitationId);

    request$.pipe(finalize(() => this.actionLoading.set(false))).subscribe({
      next: (response) => {
        const fallback =
          action === 'accept'
            ? REPOSITORY_INVITATION_MESSAGES.ACCEPT.SUCCESS
            : REPOSITORY_INVITATION_MESSAGES.REJECT.SUCCESS;

        this.notificationService.success(
          'Invitaciones',
          getApiNotificationMessage(response, fallback),
        );

        this.invitationResolved.emit({
          notificationId: this.notification().id,
          accepted: action === 'accept',
          repositoryId: this.invitation()?.repositoryId ?? undefined,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(
          'Invitaciones',
          getApiErrorNotificationMessage(error, REPOSITORY_INVITATION_MESSAGES.ERROR),
        );
      },
    });
  }
}
