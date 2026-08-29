import { Component, inject, signal, OnInit, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SkeletonModule } from 'primeng/skeleton';
import { Location } from '@angular/common';

import { finalize, switchMap, EMPTY, forkJoin, Observable } from 'rxjs';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';

import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { RepositoryFacade } from '@features/repositories/application/facades/repository.facade';
import { RepositoryUserModel } from '@features/repositories/domain/models/repository-user.model';
import { RepositoryRoleModel } from '@features/repositories/domain/models/repository-role.model';
import { RepositoryFunctionModel } from '@features/repositories/domain/models/repository-function.model';
import { REPOSITORY_MESSAGES } from '@features/repositories/constants/repository-messages.constants';

import { AppConfirmService } from '@core/services/confirm-dialog.service';
import { NotificationService } from '@core/services/notification.service';
import {
  AppPaginationChange,
  AppPaginationComponent,
} from '@shared/ui/components/app-pagination/app-pagination.component';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';
import { NotificationMessage } from '@shared/types/notification-message.type';
import { RepositoryModel } from '@features/repositories/domain/models/repository.model';
import { RepositoryUserScope } from '@features/repositories/application/enmus/repository-user-scope.enum';
import { CreateRepositoryInvitationRequest } from '@features/repository-invitations/domain/requests/create-repository-invitation.request';
import { buildCreateRepositoryInvitationForm } from '@features/repository-invitations/application/forms/create-repository-invitation.form';

const REPO_ROLES = {
  OWNER: 'propietario',
  CO_OWNER: 'copropietario',
  CO_CREATOR: 'cocreador',
  MEMBER: 'miembro',
} as const;

const MANAGER_ROLES: string[] = [REPO_ROLES.OWNER, REPO_ROLES.CO_OWNER];
const COLLABORATOR_ROLES: string[] = [REPO_ROLES.CO_CREATOR, REPO_ROLES.MEMBER];

interface RepositoryInvitationFormModel {
  invitedUserEmail: string;
  repositoryFunctionId: number | null;
  welcomeMessage?: string;
}

@Component({
  selector: 'app-repository-team-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    CardModule,
    SelectModule,
    TagModule,
    TooltipModule,
    InputTextModule,
    TextareaModule,
    AppPaginationComponent,
    SkeletonModule,
    FormlyModule,
  ],
  templateUrl: './repository-team-settings-page.component.html',
  styleUrl: './repository-team-settings-page.component.scss',
})
export class RepositoryTeamSettingsPageComponent implements OnInit {
  protected readonly REPO_ROLES = REPO_ROLES;
  protected readonly MANAGER_ROLES = MANAGER_ROLES;
  protected readonly COLLABORATOR_ROLES = COLLABORATOR_ROLES;

  private readonly repositoryFacade = inject(RepositoryFacade);
  private readonly authFacade = inject(AuthFacade);
  private readonly confirmService = inject(AppConfirmService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);

  readonly visible = input(false);
  readonly visibleChange = output<boolean>();
  readonly success = output<void>();

  protected readonly invitationDialogVisible = signal(false);
  protected readonly isInitializing = signal(true);
  protected readonly submitting = signal(false);
  protected readonly roleActionLoading = signal(false);

  protected readonly searchTerm = signal('');
  protected readonly filterRole = signal<RepositoryRoleModel | null>(null);
  protected readonly filterFunction = signal<RepositoryFunctionModel | null>(null);
  protected readonly teamUsers = signal<RepositoryUserModel[]>([]);
  protected readonly teamTotalRecords = signal(0);
  protected readonly teamPage = signal(1);
  protected readonly teamLimit = signal(10);
  protected readonly teamTableLoading = signal(true);

  protected readonly form = new FormGroup({});
  protected model: RepositoryInvitationFormModel = {
    invitedUserEmail: '',
    repositoryFunctionId: null,
    welcomeMessage: '',
  };

  protected readonly repository = this.repositoryFacade.selectedRepository;
  protected readonly owners = computed(() => this.repositoryFacade.owners()?.items ?? []);
  protected readonly coOwners = computed(() => this.repositoryFacade.coOwners()?.items ?? []);
  protected readonly repositoryFunctions = this.repositoryFacade.repositoryFunctions;
  protected readonly repositoryRoles = this.repositoryFacade.repositoryRoles;
  protected readonly currentUserId = computed(() => this.authFacade.currentUser()?.id);

  getRepositoryColor(repository: RepositoryModel | null | undefined): string {
    const color = repository?.color;
    if (!color) {
      return '#10b981';
    }
    return color.startsWith('#') ? color : `#${color}`;
  }

  backToRepository(): void {
    const repoId = this.repository()?.id;
    if (repoId) {
      void this.router.navigate(['/repositories', repoId]);
    } else {
      this.location.back();
    }
  }
  
  protected readonly fields = computed<FormlyFieldConfig[]>(() => {
    const { fields } = buildCreateRepositoryInvitationForm({
      functionOptions: this.repositoryFunctions() ?? [],
    });
    return fields;
  });

  protected readonly isPageLoading = computed(
    () =>
      this.repositoryFacade.loading() ||
      this.repositoryFacade.repositoryUsersLoading() ||
      this.isInitializing(),
  );

  protected readonly isOwner = computed(
    () => this.repository()?.currentUserRepository?.role?.name?.toLowerCase() === REPO_ROLES.OWNER,
  );

  protected readonly isCoOwner = computed(
    () =>
      this.repository()?.currentUserRepository?.role?.name?.toLowerCase() === REPO_ROLES.CO_OWNER,
  );

  protected readonly isManager = computed(() =>
    MANAGER_ROLES.includes(
      this.repository()?.currentUserRepository?.role?.name?.toLowerCase() || '',
    ),
  );

  protected readonly filteredTeamRoles = computed(() => {
    return (this.repositoryRoles() || [])
      .filter((role) => COLLABORATOR_ROLES.includes(role.name.trim().toLowerCase()))
      .map((role) => ({
        ...role,
        name: role.name.charAt(0).toUpperCase() + role.name.slice(1),
      }));
  });

  protected readonly capitalizedFunctions = computed(() =>
    (this.repositoryFunctions() ?? []).map((func) => ({
      ...func,
      name: func.name.charAt(0).toUpperCase() + func.name.slice(1),
    })),
  );

  ngOnInit(): void {
    const repoId = Number(this.route.snapshot.paramMap.get('id'));

    if (!repoId) {
      void this.router.navigateByUrl('/');
      return;
    }

    this.initializeSettings(repoId);
  }

  protected loadTeam(): void {
    this.teamPage.set(1);
    this.fetchTeamUsers();
  }

  protected onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.teamPage.set(1);
    this.fetchTeamUsers();
  }

  protected onPageChange(event: AppPaginationChange): void {
    const targetPage = event.page + 1;
    if (targetPage === this.teamPage() && event.rows === this.teamLimit()) {
      return;
    }

    this.teamPage.set(targetPage);
    this.teamLimit.set(event.rows);
    this.fetchTeamUsers();
  }

  protected updateUserFunction(member: RepositoryUserModel, newFunctionId: number): void {
    const repoId = this.repository()?.id;
    if (!repoId || !member.user) return;

    this.repositoryFacade
      .updateUser(repoId, member.user.id, { repositoryFunctionId: newFunctionId })
      .subscribe({
        next: (response) => {
          this.handleSuccess(getApiNotificationMessage(response, REPOSITORY_MESSAGES.TEAM.SUCCES));
          this.fetchTeamUsers();
        },
        error: (err: HttpErrorResponse) => {
          this.handleError(getApiErrorNotificationMessage(err, REPOSITORY_MESSAGES.UPDATE.ERROR));
        },
      });
  }

  protected confirmPromote(member: RepositoryUserModel): void {
    if (this.isSelfAction(member, REPOSITORY_MESSAGES.WARN.CANNOT_PROMOTE_SELF)) return;

    const isTargetCoOwner = member.role?.name?.toLowerCase() === REPO_ROLES.CO_OWNER;
    const targetRoleName = isTargetCoOwner ? REPO_ROLES.OWNER : REPO_ROLES.CO_OWNER;
    const username = member.user?.username ?? 'el usuario';

    const message = isTargetCoOwner
      ? REPOSITORY_MESSAGES.TEAM.PROMOTE_OWNER(username)
      : REPOSITORY_MESSAGES.TEAM.PROMOTE_COOWNER(username);

    this.confirmService.confirm({
      header: isTargetCoOwner ? 'Transferir Propiedad' : 'Ascender colaborador',
      message: message,
      icon: isTargetCoOwner ? 'pi pi-exclamation-triangle' : 'pi pi-arrow-up',
      acceptLabel: 'Confirmar',
      acceptButtonStyleClass: 'p-button-warning',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.changeUserRole(member, targetRoleName),
    });
  }

  protected confirmDemote(member: RepositoryUserModel): void {
    if (this.isSelfAction(member, REPOSITORY_MESSAGES.WARN.CANNOT_DEMOTE_SELF)) return;

    const username = member.user?.username ?? 'el usuario';
    this.confirmService.confirm({
      header: 'Descender colaborador',
      message: REPOSITORY_MESSAGES.TEAM.DEMOTE(username),
      icon: 'pi pi-arrow-down',
      acceptLabel: 'Confirmar',
      acceptButtonStyleClass: 'p-button-warning',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.changeUserRole(member, REPO_ROLES.CO_CREATOR),
    });
  }

  protected removeUser(member: RepositoryUserModel): void {
    if (this.isSelfAction(member, REPOSITORY_MESSAGES.WARN.CANNOT_REMOVE_SELF)) return;

    const repoId = this.repository()?.id;
    if (!repoId || !member.user) return;

    this.confirmService.confirmDelete(
      `¿Estás seguro que deseas eliminar a ${member.user?.username} del repositorio?`,
      () => {
        this.repositoryFacade.deleteRepositoryUser(repoId, member.user!.id).subscribe({
          next: (response) => {
            this.handleSuccess(
              getApiNotificationMessage(response, REPOSITORY_MESSAGES.USER.DELETE_SUCCESS),
            );
            this.fetchTeamUsers();
          },
          error: (err: HttpErrorResponse) => {
            this.handleError(getApiErrorNotificationMessage(err, REPOSITORY_MESSAGES.DELETE.ERROR));
          },
        });
      },
    );
  }

  protected submit(): void {
    if (this.submitting() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const repoId = this.repository()?.id;
    if (!repoId) return;

    this.submitting.set(true);
    const requestData = this.buildInvitationRequest();

    this.repositoryFacade
      .sendInvitation(repoId, requestData)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          this.handleSuccess(
            getApiNotificationMessage(response, REPOSITORY_MESSAGES.TEAM.INVITATION_SUCCESS),
          );
          this.resetFormState();
          this.fetchTeamUsers();
        },
        error: (err: HttpErrorResponse) => {
          this.handleError(getApiErrorNotificationMessage(err, REPOSITORY_MESSAGES.CREATE.ERROR));
        },
      });
  }

  protected getRoleName(roleId: number): string {
    const role = this.repositoryRoles()?.find((r) => r.id === roleId);
    return role?.name ?? 'Sin rol';
  }

  protected getFunctionName(functionId: number): string {
    const func = this.repositoryFunctions()?.find((f) => f.id === functionId);
    return func?.name ?? 'Sin función';
  }

  protected onInvitationVisibilityChange(value: boolean): void {
    this.invitationDialogVisible.set(value);
  }

  protected close(): void {
    this.visibleChange.emit(false);
    this.form.reset();
  }

  protected handleVisibleChange(value: boolean): void {
    this.visibleChange.emit(value);
    if (!value) this.form.reset();
  }

  protected canShowOwnerActions(member: RepositoryUserModel): boolean {
    return this.isOwner() && member.user?.id !== this.currentUserId();
  }

  protected canShowTeamActionsColumn(): boolean {
    if (this.isOwner()) return true;
    if (this.isCoOwner()) return this.coOwners().length < 2;
    return false;
  }

  protected canShowPromote(member: RepositoryUserModel): boolean {
    if (member.user?.id === this.currentUserId()) return false;

    const memberRole = member.role?.name?.toLowerCase();
    if (memberRole === REPO_ROLES.OWNER) return false;
    if (memberRole === REPO_ROLES.CO_OWNER) return this.isOwner();

    if ((this.isOwner() || this.isCoOwner()) && COLLABORATOR_ROLES.includes(memberRole || '')) {
      return this.coOwners().length < 2;
    }

    return false;
  }

  protected canShowDemote(member: RepositoryUserModel): boolean {
    if (member.user?.id === this.currentUserId()) return false;
    return this.isOwner() && member.role?.name?.toLowerCase() === REPO_ROLES.CO_OWNER;
  }

  protected canEditUserFunction(member: RepositoryUserModel): boolean {
    if (this.isOwner()) {
      return true;
    }

    if (this.isCoOwner()) {
      if (member.user?.id === this.currentUserId()) {
        return false;
      }

      const memberRole = member.role?.name?.toLowerCase();
      if (memberRole === REPO_ROLES.OWNER) {
        return false;
      }
      if (memberRole === REPO_ROLES.CO_OWNER) return false;

      return true;
    }

    return false;
  }

  private initializeSettings(repoId: number): void {
    this.isInitializing.set(true);

    this.repositoryFacade
      .findById(repoId)
      .pipe(
        switchMap((res) => {
          if (!res.data) return EMPTY;
          return this.verifyAccessAndFetchData(res.data, repoId);
        }),
        finalize(() => this.isInitializing.set(false)),
      )
      .subscribe({
        next: () => this.fetchTeamUsers(),
        error: () => void this.router.navigate(['/repositories/me']),
      });
  }

  private verifyAccessAndFetchData(repositoryData: RepositoryModel, repoId: number) {
    const roleName = repositoryData?.currentUserRepository?.role?.name?.toLowerCase();

    if (!roleName || !MANAGER_ROLES.includes(roleName)) {
      this.notificationService.warn(
        REPOSITORY_MESSAGES.WARN.ACCESS_DENIED,
        REPOSITORY_MESSAGES.WARN.ACCESS_DENIED,
      );
      void this.router.navigate(['/repositories', repoId]);
      return EMPTY;
    }

    return forkJoin([
      this.repositoryFacade.findFunctions(),
      this.repositoryFacade.findRoles(),
      this.repositoryFacade.findRepositoryUsersPreview(repoId),
    ]);
  }

  private fetchTeamUsers(): void {
    const repoId = this.repository()?.id;
    if (!repoId) return;

    this.teamTableLoading.set(true);

    this.repositoryFacade
      .findUsers(repoId, {
        scope: RepositoryUserScope.TEAM,
        search: this.searchTerm() || undefined,
        role: this.filterRole()?.name || undefined,
        function: this.filterFunction()?.name || undefined,
        page: this.teamPage(),
        limit: this.teamLimit(),
      })
      .pipe(finalize(() => this.teamTableLoading.set(false)))
      .subscribe((res) => {
        this.teamUsers.set(res.data?.items ?? []);
        this.teamTotalRecords.set(res.data?.total ?? 0);
      });
  }

  private changeUserRole(member: RepositoryUserModel, targetRoleName: string): void {
    const repoId = this.repository()?.id;
    const targetRole = this.repositoryRoles()?.find(
      (r) => r.name.toLowerCase() === targetRoleName.toLowerCase(),
    );

    if (!repoId || !targetRole || !member.user) return;

    this.roleActionLoading.set(true);
    this.repositoryFacade
      .updateUser(repoId, member.user.id, { repositoryRoleId: targetRole.id })
      .pipe(finalize(() => this.roleActionLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.handleSuccess(
            getApiNotificationMessage(
              response,
              REPOSITORY_MESSAGES.USER.UPDATE_ROLE(targetRoleName),
            ),
          );
          this.fetchTeamUsers();

          if (targetRoleName.toLowerCase() === REPO_ROLES.OWNER) {
            void this.router.navigate(['/repositories', repoId]);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.handleError(getApiErrorNotificationMessage(err, REPOSITORY_MESSAGES.UPDATE.ERROR));
        },
      });
  }

  private buildInvitationRequest(): CreateRepositoryInvitationRequest {
    const rawData = this.form.getRawValue() as RepositoryInvitationFormModel;
    return {
      invitedUserEmail: rawData.invitedUserEmail,
      repositoryFunctionId: Number(rawData.repositoryFunctionId),
      welcomeMessage: rawData.welcomeMessage ?? '',
    };
  }

  private resetFormState(): void {
    this.model = {
      invitedUserEmail: '',
      repositoryFunctionId: null,
      welcomeMessage: '',
    };

    this.form.reset();
  }

  private isSelfAction(member: RepositoryUserModel, warningMessage: NotificationMessage): boolean {
    if (member.user?.id === this.currentUserId()) {
      this.notificationService.warn(REPOSITORY_MESSAGES.WARN.ACCESS_DENIED, warningMessage);
      return true;
    }
    return false;
  }

  private handleSuccess(message: NotificationMessage): void {
    this.notificationService.success('Equipo', message);
  }

  private handleError(message: NotificationMessage): void {
    this.notificationService.error('Error', message);
  }

  protected clearFilters(): void {
    this.searchTerm.set('');
    this.filterRole.set(null);
    this.filterFunction.set(null);
    this.loadTeam();
  }
}
