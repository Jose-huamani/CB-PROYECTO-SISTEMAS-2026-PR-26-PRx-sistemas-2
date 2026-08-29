import { Injectable, inject } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';

import { RepositoryInvitationApi } from '@features/repository-invitations/infrastructure/api/repository-invitation.api';
import { RepositoryInvitationStore } from '@features/repository-invitations/infrastructure/store/repository-invitation.store';
import { RepositoryInvitationModel } from '@features/repository-invitations/domain/models/repository-invitation.model';
import { CreateRepositoryInvitationRequest } from '@features/repository-invitations/domain/requests/create-repository-invitation.request';
import { ApiResponseModel } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class RepositoryInvitationFacade {
  private readonly api = inject(RepositoryInvitationApi);
  private readonly store = inject(RepositoryInvitationStore);

  readonly selectedInvitation = this.store.selectedInvitation;
  readonly loading = this.store.loading;
  readonly actionLoading = this.store.actionLoading;
  readonly creating = this.store.creating;

  loadInvitation(id: number): Observable<ApiResponseModel<RepositoryInvitationModel>> {
    this.store.setLoading(true);

    return this.api.findById(id).pipe(
      tap((response) => {
        this.store.setSelectedInvitation(response.data ?? null);
      }),
      finalize(() => {
        this.store.setLoading(false);
      }),
    );
  }

  getInvitation(id: number): Observable<ApiResponseModel<RepositoryInvitationModel>> {
    return this.api.findById(id);
  }

  createInvitation(
    repositoryId: number,
    request: CreateRepositoryInvitationRequest,
  ): Observable<ApiResponseModel<RepositoryInvitationModel>> {
    this.store.setCreating(true);

    return this.api.create(repositoryId, request).pipe(
      finalize(() => {
        this.store.setCreating(false);
      }),
    );
  }

  acceptInvitation(id: number): Observable<ApiResponseModel<void>> {
    this.store.setActionLoading(true);

    return this.api.accept(id).pipe(
      finalize(() => {
        this.store.setActionLoading(false);
      }),
    );
  }

  rejectInvitation(id: number): Observable<ApiResponseModel<void>> {
    this.store.setActionLoading(true);

    return this.api.reject(id).pipe(
      finalize(() => {
        this.store.setActionLoading(false);
      }),
    );
  }

  clearSelectedInvitation(): void {
    this.store.clearSelectedInvitation();
  }
}
