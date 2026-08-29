import { Injectable, computed, signal } from '@angular/core';

import { RepositoryInvitationModel } from '@features/repository-invitations/domain/models/repository-invitation.model';

@Injectable({
  providedIn: 'root',
})
export class RepositoryInvitationStore {
  private readonly selectedInvitationSignal = signal<RepositoryInvitationModel | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly actionLoadingSignal = signal(false);
  private readonly creatingSignal = signal(false);

  readonly selectedInvitation = computed(() => this.selectedInvitationSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly actionLoading = computed(() => this.actionLoadingSignal());
  readonly creating = computed(() => this.creatingSignal());

  setSelectedInvitation(invitation: RepositoryInvitationModel | null): void {
    this.selectedInvitationSignal.set(invitation);
  }

  updateSelectedInvitation(partial: Partial<RepositoryInvitationModel>): void {
    this.selectedInvitationSignal.update((current) =>
      current ? { ...current, ...partial } : current,
    );
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setActionLoading(actionLoading: boolean): void {
    this.actionLoadingSignal.set(actionLoading);
  }

  setCreating(creating: boolean): void {
    this.creatingSignal.set(creating);
  }

  clearSelectedInvitation(): void {
    this.selectedInvitationSignal.set(null);
  }

  clear(): void {
    this.selectedInvitationSignal.set(null);
    this.loadingSignal.set(false);
    this.actionLoadingSignal.set(false);
    this.creatingSignal.set(false);
  }
}
