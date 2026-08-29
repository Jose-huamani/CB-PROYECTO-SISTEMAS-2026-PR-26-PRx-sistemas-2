import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { finalize } from 'rxjs';

import { NotificationService } from '@core/services/notification.service';
import { FileExplorerComponent } from '@features/files/presentation/components/file-explorer/file-explorer.component';
import { RepositoryFacade } from '@features/repositories/application/facades/repository.facade';
import { REPOSITORY_MESSAGES } from '@features/repositories/constants/repository-messages.constants';
import { RepositoryModel } from '@features/repositories/domain/models/repository.model';
import { RepositoryUserModel } from '@features/repositories/domain/models/repository-user.model';
import { RepositoryUsersDialogComponent } from '@features/repositories/presentation/components/repository-users-dialog/repository-users-dialog.component';
import { RepositoryVisibility } from '@shared/enums/repository-visibility.enum';
import { AppPaginationChange } from '@shared/ui/components/app-pagination/app-pagination.component';
import { getApiErrorNotificationMessage } from '@shared/utils/api-notification.util';

type RepositoryUsersDialogRole = 'cocreador' | 'miembro';

@Component({
  selector: 'app-repository-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    SkeletonModule,
    TagModule,
    RepositoryUsersDialogComponent,
    FileExplorerComponent,
  ],
  templateUrl: './repository-detail-page.component.html',
  styleUrl: './repository-detail-page.component.scss',
})
export class RepositoryDetailPageComponent implements OnInit {
  private readonly repositoryFacade = inject(RepositoryFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly managerRoles = ['propietario', 'copropietario'];

  protected readonly repository = this.repositoryFacade.selectedRepository;
  protected readonly owners = this.repositoryFacade.owners;
  protected readonly coOwners = this.repositoryFacade.coOwners;
  protected readonly coCreators = this.repositoryFacade.coCreators;
  protected readonly members = this.repositoryFacade.members;
  protected readonly loading = this.repositoryFacade.loading;
  protected readonly repositoryUsersLoading = this.repositoryFacade.repositoryUsersLoading;

  protected readonly usersDialogVisible = signal(false);
  protected readonly usersDialogTitle = signal('');
  protected readonly usersDialogSubtitle = signal('');
  protected readonly usersDialogRole = signal<RepositoryUsersDialogRole | null>(null);
  protected readonly usersDialogUsers = signal<RepositoryUserModel[]>([]);
  protected readonly usersDialogTotal = signal(0);
  protected readonly usersDialogPage = signal(1);
  protected readonly usersDialogLimit = signal(10);
  protected readonly usersDialogLoading = signal(false);

  protected readonly isIntimateRepository = computed(
    () => this.repository()?.visibility === RepositoryVisibility.intimo,
  );

  protected readonly isRepositoryMember = computed(
    () => !!this.repository()?.currentUserRepository,
  );

  protected readonly isRepositoryManager = computed(() => {
    const roleName = this.repository()?.currentUserRepository?.role.name;

    if (!roleName) {
      return false;
    }

    return this.managerRoles.includes(roleName);
  });

  protected readonly canShowSettings = computed(
    () => !this.isIntimateRepository() && this.isRepositoryManager(),
  );

  protected readonly canShowTeam = computed(
    () => !this.isIntimateRepository() && this.isRepositoryManager(),
  );

  protected readonly canShowNotes = computed(
    () => this.isIntimateRepository() || this.isRepositoryMember(),
  );

  protected readonly canShowJoin = computed(() => {
    const repository = this.repository();

    if (!repository || this.isIntimateRepository()) {
      return false;
    }

    return repository.visibility === RepositoryVisibility.publico && !this.isRepositoryMember();
  });

  ngOnInit(): void {
    this.loadRepository();
  }

  protected getRepositoryTitle(repository: RepositoryModel): string {
    return `Repositorio: ${repository.name}`;
  }

  protected getRepositoryPath(repository: RepositoryModel): string {
    return `${repository.owner.username}/${repository.name}`;
  }

  protected getRepositoryColor(repository: RepositoryModel): string {
    return `#${repository.color.replace('#', '')}`;
  }

  protected getVisibilityLabel(visibility: RepositoryVisibility): string {
    const visibilityLabels: Record<RepositoryVisibility, string> = {
      [RepositoryVisibility.publico]: 'Público',
      [RepositoryVisibility.privado]: 'Privado',
      [RepositoryVisibility.intimo]: 'Íntimo',
    };

    return visibilityLabels[visibility];
  }

  protected getRemainingUsersCount(total: number, itemsLength: number): number {
    const remaining = total - itemsLength;

    if (remaining <= 0) {
      return 0;
    }

    return remaining;
  }

  protected openProfile(userId: number): void {
    void this.router.navigate(['/profiles/view', userId]);
  }

  protected openCoCreatorsDialog(): void {
    this.openRepositoryUsersDialog('cocreador', 'CoCreadores');
  }

  protected openMembersDialog(): void {
    this.openRepositoryUsersDialog('miembro', 'Miembros');
  }

  protected closeUsersDialog(): void {
    this.usersDialogVisible.set(false);
  }

  protected handleUsersDialogVisibleChange(visible: boolean): void {
    this.usersDialogVisible.set(visible);
  }

  protected handleUsersDialogPageChange(event: AppPaginationChange): void {
    this.usersDialogPage.set(event.page + 1);
    this.usersDialogLimit.set(event.rows);
    this.loadUsersDialogPage();
  }

  protected handleRepositoryUpdated(updatedAt: string): void {
    this.repositoryFacade.updateSelectedRepositoryUpdatedAt(updatedAt);
  }

  protected joinRepository(): void {
    void this.router.navigateByUrl('/');
  }

  protected openSettings(): void {
    const repository = this.repository();

    if (!repository) {
      return;
    }

    void this.router.navigate(['/repositories', repository.id, 'settings']);
  }

  protected openTeam(): void {
    const repository = this.repository();

    if (!repository) {
      return;
    }

    void this.router.navigate(['/repositories', repository.id, 'team']);
  }

  protected openNotes(): void {
    const repository = this.repository();

    if (!repository) {
      return;
    }

    if (repository.visibility === RepositoryVisibility.intimo) {
      void this.router.navigate(['/notes/repositories/me/intimate']);
      return;
    }

    void this.router.navigate(['/notes/repositories', repository.id]);
  }

  protected trackRepositoryUser(_: number, repositoryUser: RepositoryUserModel): number {
    return repositoryUser.id;
  }

  private loadRepository(): void {
    this.repositoryFacade.clearSelectedRepository();
    this.repositoryFacade.clearRepositoryUsers();

    if (this.isIntimateRoute()) {
      this.loadMeIntimateRepository();
      return;
    }

    const id = this.getRepositoryId();

    if (!id) {
      this.handleInvalidRepositoryId();
      return;
    }

    this.loadRepositoryById(id);
  }

  private loadMeIntimateRepository(): void {
    this.repositoryFacade.findMeIntimate().subscribe({
      error: (error: HttpErrorResponse) => {
        this.handleLoadError(error);
        void this.router.navigateByUrl('/');
      },
    });
  }

  private loadRepositoryById(id: number): void {
    this.repositoryFacade.findById(id).subscribe({
      next: () => {
        this.loadRepositoryUsersPreview(id);
      },
      error: (error: HttpErrorResponse) => {
        this.handleLoadError(error);
        void this.router.navigateByUrl('/');
      },
    });
  }

  private loadRepositoryUsersPreview(repositoryId: number): void {
    this.repositoryFacade.findRepositoryUsersPreview(repositoryId).subscribe({
      error: () => {
        this.repositoryFacade.clearRepositoryUsers();
      },
    });
  }

  private openRepositoryUsersDialog(role: RepositoryUsersDialogRole, title: string): void {
    this.usersDialogRole.set(role);
    this.usersDialogTitle.set(title);
    this.usersDialogSubtitle.set('Usuarios del repositorio');
    this.usersDialogPage.set(1);
    this.usersDialogLimit.set(10);
    this.usersDialogUsers.set([]);
    this.usersDialogTotal.set(0);
    this.usersDialogVisible.set(true);
    this.loadUsersDialogPage();
  }

  private loadUsersDialogPage(): void {
    const repository = this.repository();
    const role = this.usersDialogRole();

    if (!repository || !role) {
      return;
    }

    this.usersDialogLoading.set(true);

    this.repositoryFacade
      .findUsers(repository.id, {
        role,
        page: this.usersDialogPage(),
        limit: this.usersDialogLimit(),
      })
      .pipe(
        finalize(() => {
          this.usersDialogLoading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          const data = response.data;

          this.usersDialogUsers.set(data?.items ?? []);
          this.usersDialogTotal.set(data?.total ?? 0);

          if (data) {
            this.usersDialogPage.set(data.page);
            this.usersDialogLimit.set(data.limit);
          }
        },
        error: () => {
          this.usersDialogUsers.set([]);
          this.usersDialogTotal.set(0);
        },
      });
  }

  private isIntimateRoute(): boolean {
    return this.route.snapshot.url.map((segment) => segment.path).join('/') === 'me/intimate';
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

  private handleLoadError(error: HttpErrorResponse): void {
    this.notificationService.error(
      'Repositorios',
      getApiErrorNotificationMessage(error, REPOSITORY_MESSAGES.DETAIL.ERROR),
    );
  }
}
