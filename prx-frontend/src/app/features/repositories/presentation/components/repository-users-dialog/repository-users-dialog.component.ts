import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';

import { RepositoryUserModel } from '@features/repositories/domain/models/repository-user.model';
import {
  AppPaginationChange,
  AppPaginationComponent,
} from '@shared/ui/components/app-pagination/app-pagination.component';

@Component({
  selector: 'app-repository-users-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, SkeletonModule, AppPaginationComponent],
  templateUrl: './repository-users-dialog.component.html',
  styleUrl: './repository-users-dialog.component.scss',
})
export class RepositoryUsersDialogComponent {
  readonly visible = input(false);
  readonly title = input('');
  readonly subtitle = input('');
  readonly users = input<RepositoryUserModel[]>([]);
  readonly total = input(0);
  readonly page = input(1);
  readonly limit = input(10);
  readonly loading = input(false);
  readonly emptyMessage = input('No se encontraron usuarios.');

  readonly visibleChange = output<boolean>();
  readonly pageChange = output<AppPaginationChange>();
  readonly profileOpen = output<number>();

  protected close(): void {
    this.visibleChange.emit(false);
  }

  protected handleVisibleChange(value: boolean): void {
    this.visibleChange.emit(value);
  }

  protected handlePageChange(event: AppPaginationChange): void {
    this.pageChange.emit(event);
  }

  protected openProfile(userId: number): void {
    this.profileOpen.emit(userId);
  }

  protected getFirst(): number {
    return (this.page() - 1) * this.limit();
  }

  protected shouldShowPagination(): boolean {
    return this.total() > this.limit();
  }
}
