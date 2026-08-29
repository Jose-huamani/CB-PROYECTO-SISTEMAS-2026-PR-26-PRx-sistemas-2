import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnChanges, SimpleChanges, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

import { NotificationService } from '@core/services/notification.service';
import { RepositoryFacade } from '@features/repositories/application/facades/repository.facade';
import { REPOSITORY_MESSAGES } from '@features/repositories/constants/repository-messages.constants';
import { RepositoryModel } from '@features/repositories/domain/models/repository.model';
import { RepositoryCardComponent } from '@features/repositories/presentation/components/repository-card/repository-card.component';
import { getApiErrorNotificationMessage } from '@shared/utils/api-notification.util';

@Component({
  selector: 'app-user-public-repositories',
  standalone: true,
  imports: [CommonModule, CardModule, SkeletonModule, RepositoryCardComponent],
  templateUrl: './user-public-repositories.component.html',
  styleUrl: './user-public-repositories.component.scss',
})
export class UserPublicRepositoriesComponent implements OnChanges {
  private readonly repositoryFacade = inject(RepositoryFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly userId = input.required<number>();

  protected readonly REPOSITORY_MESSAGES = REPOSITORY_MESSAGES;
  protected readonly repositories = signal<RepositoryModel[]>([]);
  protected readonly loading = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['userId']) {
      return;
    }

    this.loadRepositories();
  }

  protected openRepository(repository: RepositoryModel): void {
    void this.router.navigate(['/repositories', repository.id]);
  }

  private loadRepositories(): void {
    const userId = this.userId();

    if (!userId) {
      this.repositories.set([]);
      return;
    }

    this.loading.set(true);

    this.repositoryFacade
      .findPublicByUser(userId, {
        limit: 10,
      })
      .subscribe({
        next: (response) => {
          this.repositories.set(response.data ?? []);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.repositories.set([]);
          this.loading.set(false);

          this.notificationService.error(
            'Repositorios',
            getApiErrorNotificationMessage(error, REPOSITORY_MESSAGES.PUBLIC_BY_USER.ERROR),
          );
        },
      });
  }
}
