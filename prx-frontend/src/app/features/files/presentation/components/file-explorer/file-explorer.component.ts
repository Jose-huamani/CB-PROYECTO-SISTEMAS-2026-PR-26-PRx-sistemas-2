import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Menu, MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { AppConfirmService } from '@core/services/confirm-dialog.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { FilesFacade } from '@features/files/application/facades/files.facade';
import {
  toFileExplorerFileItem,
  toFileExplorerFolderItem,
} from '@features/files/application/utils/file-explorer-item.util';
import { sortFileExplorerItems } from '@features/files/application/utils/file-explorer-sort.util';
import { FILES_MESSAGES } from '@features/files/constants/files-messages.constants';
import { FileExplorerItemModel } from '@features/files/domain/models/file-explorer-item.model';
import { FileModel } from '@features/files/domain/models/file.model';
import { FolderModel } from '@features/files/domain/models/folder.model';
import { CreateFileRequest } from '@features/files/domain/requests/create-file.request';
import { CreateFolderRequest } from '@features/files/domain/requests/create-folder.request';
import { UpdateFolderRequest } from '@features/files/domain/requests/update-folder.request';
import {
  CreateFileDialogComponent,
  CreateFileDialogSubmit,
} from '@features/files/presentation/components/create-file-dialog/create-file-dialog.component';
import {
  CreateFolderDialogComponent,
  CreateFolderDialogSubmit,
} from '@features/files/presentation/components/create-folder-dialog/create-folder-dialog.component';
import {
  UpdateFolderDialogComponent,
  UpdateFolderDialogSubmit,
} from '@features/files/presentation/components/update-folder-dialog/update-folder-dialog.component';
import { RepositoryModel } from '@features/repositories/domain/models/repository.model';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';
import { getFileIconByExtension } from '@shared/utils/file-icon.util';
import { formatFileSize } from '@shared/utils/file-size.util';

interface FileExplorerSortEvent {
  field?: string;
  order?: number;
}

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarModule,
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MenuModule,
    SkeletonModule,
    TableModule,
    TagModule,
    TooltipModule,
    CreateFolderDialogComponent,
    UpdateFolderDialogComponent,
    CreateFileDialogComponent,
  ],
  templateUrl: './file-explorer.component.html',
  styleUrl: './file-explorer.component.scss',
})
export class FileExplorerComponent {
  readonly repository = input.required<RepositoryModel>();
  readonly repositoryUpdated = output<string>();

  private readonly filesFacade = inject(FilesFacade);
  private readonly authFacade = inject(AuthFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmService = inject(AppConfirmService);
  private readonly router = inject(Router);

  private readonly managerRoles = ['propietario', 'copropietario'];
  private readonly lastRepositoryId = signal<number | null>(null);

  protected readonly explorerContent = this.filesFacade.explorerContent;
  protected readonly currentFolderId = this.filesFacade.currentFolderId;
  protected readonly loading = this.filesFacade.loading;
  protected readonly actionLoading = this.filesFacade.actionLoading;
  protected readonly currentUser = this.authFacade.currentUser;

  protected readonly search = signal('');
  protected readonly sortField = signal<string | null>(null);
  protected readonly sortOrder = signal(1);
  protected readonly menuItems = signal<MenuItem[]>([]);
  protected readonly selectedFolder = signal<FolderModel | null>(null);
  protected readonly createFolderDialogVisible = signal(false);
  protected readonly updateFolderDialogVisible = signal(false);
  protected readonly createFileDialogVisible = signal(false);

  protected readonly skeletonRows = [1, 2, 3, 4];

  protected readonly items = computed<FileExplorerItemModel[]>(() => {
    const content = this.explorerContent();

    if (!content) {
      return [];
    }

    const folderItems = content.folders.map((folder) => toFileExplorerFolderItem(folder));
    const fileItems = content.files.map((file) => toFileExplorerFileItem(file));

    return [...folderItems, ...fileItems];
  });

  protected readonly sortedItems = computed<FileExplorerItemModel[]>(() =>
    sortFileExplorerItems(this.items(), this.sortField(), this.sortOrder()),
  );

  protected readonly breadcrumbItems = computed<MenuItem[]>(() => {
    const content = this.explorerContent();

    if (!content) {
      return [];
    }

    return content.breadcrumbs.map((breadcrumb) => ({
      label: breadcrumb.name,
      command: () => {
        this.openFolder(breadcrumb.id);
      },
    }));
  });

  protected readonly hasContent = computed(() => this.items().length > 0);

  protected readonly hasSearch = computed(() => {
    const search = this.search().trim();

    return !!search;
  });

  protected readonly hasSort = computed(() => {
    const sortField = this.sortField();

    if (!sortField) {
      return false;
    }

    return true;
  });

  protected readonly canCreateContent = computed(() => {
    if (this.isRepositoryOwner()) {
      return true;
    }

    const repository = this.repository();

    if (!repository.currentUserRepository) {
      return false;
    }

    return true;
  });

  constructor() {
    effect(() => {
      const repository = this.repository();

      if (!repository) {
        return;
      }

      if (this.lastRepositoryId() === repository.id) {
        return;
      }

      this.lastRepositoryId.set(repository.id);
      this.resetExplorerState();
      this.loadExplorer(null);
    });
  }

  protected loadExplorer(folderId: number | null, search?: string): void {
    const repository = this.repository();

    this.filesFacade
      .findExplorerContent(repository.id, {
        folderId: folderId ?? undefined,
        search,
      })
      .subscribe({
        error: (error: HttpErrorResponse) => {
          this.handleLoadExplorerError(error);
        },
      });
  }

  protected openFolder(folderId: number | null): void {
    this.search.set('');
    this.clearSort();
    this.loadExplorer(folderId);
  }

  protected openFileLocation(file: FileModel): void {
    this.search.set('');
    this.clearSort();
    this.loadExplorer(file.folderId ?? null);
  }

  protected handleSearchChange(value: string): void {
    this.search.set(value);
  }

  protected handleTableSort(event: FileExplorerSortEvent): void {
    if (!event.field || !event.order) {
      this.clearSort();
      return;
    }

    this.sortField.set(event.field);
    this.sortOrder.set(event.order);
  }

  protected submitSearch(): void {
    const search = this.search().trim();

    if (!search) {
      this.clearSearch();
      return;
    }

    this.loadExplorer(this.currentFolderId(), search);
  }

  protected clearSearch(): void {
    this.search.set('');
    this.loadExplorer(this.currentFolderId());
  }

  protected clearFilters(): void {
    this.search.set('');
    this.clearSort();
    this.loadExplorer(this.currentFolderId());
  }

  protected openCreateFolderDialog(): void {
    if (!this.canCreateContent()) {
      return;
    }

    this.createFolderDialogVisible.set(true);
  }

  protected openCreateFileDialog(): void {
    if (!this.canCreateContent()) {
      return;
    }

    this.createFileDialogVisible.set(true);
  }

  protected handleCreateFolderDialogVisibleChange(visible: boolean): void {
    this.createFolderDialogVisible.set(visible);
  }

  protected handleUpdateFolderDialogVisibleChange(visible: boolean): void {
    this.updateFolderDialogVisible.set(visible);

    if (!visible) {
      this.selectedFolder.set(null);
    }
  }

  protected handleCreateFileDialogVisibleChange(visible: boolean): void {
    this.createFileDialogVisible.set(visible);
  }

  protected createFolder(data: CreateFolderDialogSubmit): void {
    const request = this.buildCreateFolderRequest(data);

    this.filesFacade.createFolder(request).subscribe({
      next: (response) => {
        this.notificationService.success(
          'Carpetas',
          getApiNotificationMessage(response, FILES_MESSAGES.CREATE_FOLDER.SUCCESS),
        );
        this.emitRepositoryUpdated(response.data?.updatedAt);
        this.createFolderDialogVisible.set(false);
        this.loadExplorer(this.currentFolderId(), this.getActiveSearch());
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(
          'Carpetas',
          getApiErrorNotificationMessage(error, FILES_MESSAGES.CREATE_FOLDER.ERROR),
        );
      },
    });
  }

  protected createFile(data: CreateFileDialogSubmit): void {
    const request = this.buildCreateFileRequest(data);

    this.filesFacade.createFile(request).subscribe({
      next: (response) => {
        this.notificationService.success(
          'Archivos',
          getApiNotificationMessage(response, FILES_MESSAGES.CREATE_FILE.SUCCESS),
        );
        this.emitRepositoryUpdated(response.data?.updatedAt);
        this.createFileDialogVisible.set(false);
        this.loadExplorer(this.currentFolderId(), this.getActiveSearch());
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(
          'Archivos',
          getApiErrorNotificationMessage(error, FILES_MESSAGES.CREATE_FILE.ERROR),
        );
      },
    });
  }

  protected updateFolder(data: UpdateFolderDialogSubmit): void {
    const folder = this.selectedFolder();

    if (!folder) {
      return;
    }

    const request: UpdateFolderRequest = {
      name: data.name,
      color: data.color,
    };

    this.filesFacade.updateFolder(folder.id, request).subscribe({
      next: (response) => {
        this.notificationService.success(
          'Carpetas',
          getApiNotificationMessage(response, FILES_MESSAGES.UPDATE_FOLDER.SUCCESS),
        );
        this.emitRepositoryUpdated(response.data?.updatedAt);
        this.updateFolderDialogVisible.set(false);
        this.selectedFolder.set(null);
        this.loadExplorer(this.currentFolderId(), this.getActiveSearch());
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(
          'Carpetas',
          getApiErrorNotificationMessage(error, FILES_MESSAGES.UPDATE_FOLDER.ERROR),
        );
      },
    });
  }

  protected openActionsMenu(event: Event, item: FileExplorerItemModel, menu: Menu): void {
    this.menuItems.set(this.buildMenuItems(item));
    menu.toggle(event);
  }

  protected openUpdateFolderDialog(folder: FolderModel): void {
    if (!this.canManageItem(folder.creator.id)) {
      return;
    }

    this.selectedFolder.set(folder);
    this.updateFolderDialogVisible.set(true);
  }

  protected confirmDeleteFolder(folder: FolderModel): void {
    if (!this.canManageItem(folder.creator.id)) {
      return;
    }

    this.confirmService.confirmDelete(FILES_MESSAGES.DELETE_FOLDER.CONFIRM, () => {
      this.deleteFolder(folder);
    });
  }

  protected confirmDeleteFile(file: FileModel): void {
    if (!this.canManageItem(file.creator.id)) {
      return;
    }

    this.confirmService.confirmDelete(FILES_MESSAGES.DELETE_FILE.CONFIRM, () => {
      this.deleteFile(file);
    });
  }

  protected downloadFile(file: FileModel): void {
    this.filesFacade.downloadFile(file.id).subscribe({
      next: (response) => {
        const download = response.data;

        if (!download) {
          return;
        }

        this.openDownloadUrl(download.url);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(
          'Archivos',
          getApiErrorNotificationMessage(error, FILES_MESSAGES.DOWNLOAD_FILE.ERROR),
        );
      },
    });
  }

  protected openCreatorProfile(item: FileExplorerItemModel): void {
    void this.router.navigate(['/profiles/view', item.data.creator.id]);
  }

  protected getItemName(item: FileExplorerItemModel): string {
    if (item.type === 'folder') {
      return item.data.name;
    }

    return `${item.data.name}.${item.data.extension}`;
  }

  protected getItemCreationDate(item: FileExplorerItemModel): string {
    return item.data.createdAt;
  }

  protected getItemCreatorName(item: FileExplorerItemModel): string {
    return item.data.creator.username;
  }

  protected getItemCreatorAvatar(item: FileExplorerItemModel): string {
    return item.data.creator.avatarUrl;
  }

  protected getItemTypeLabel(item: FileExplorerItemModel): string {
    if (item.type === 'folder') {
      return 'Carpeta';
    }

    return item.data.extension.toUpperCase();
  }

  protected getItemTypeSeverity(item: FileExplorerItemModel): 'secondary' | 'info' {
    if (item.type === 'folder') {
      return 'secondary';
    }

    return 'info';
  }

  protected getItemIcon(item: FileExplorerItemModel): string {
    if (item.type === 'folder') {
      return 'pi pi-folder';
    }

    return getFileIconByExtension(item.data.extension);
  }

  protected getFolderColor(folder: FolderModel): string {
    return `#${folder.color.replace('#', '')}`;
  }

  protected getFileSize(file: FileModel): string {
    return formatFileSize(file.size);
  }

  private buildMenuItems(item: FileExplorerItemModel): MenuItem[] {
    if (item.type === 'folder') {
      return this.buildFolderMenuItems(item.data);
    }

    return this.buildFileMenuItems(item.data);
  }

  private buildFolderMenuItems(folder: FolderModel): MenuItem[] {
    const items: MenuItem[] = [
      {
        label: 'Abrir',
        icon: 'pi pi-folder-open',
        command: () => {
          this.openFolder(folder.id);
        },
      },
    ];

    if (this.canManageItem(folder.creator.id)) {
      items.push({
        label: 'Editar carpeta',
        icon: 'pi pi-pencil',
        command: () => {
          this.openUpdateFolderDialog(folder);
        },
      });

      items.push({
        separator: true,
      });

      items.push({
        label: 'Eliminar',
        icon: 'pi pi-trash',
        labelStyle: {
          color: 'var(--color-warning)',
        },
        iconStyle: {
          color: 'var(--color-warning)',
        },
        command: () => {
          this.confirmDeleteFolder(folder);
        },
      });
    }

    return items;
  }

  private buildFileMenuItems(file: FileModel): MenuItem[] {
    const items: MenuItem[] = [
      {
        label: 'Descargar',
        icon: 'pi pi-download',
        command: () => {
          this.downloadFile(file);
        },
      },
      {
        label: 'Abrir ubicación',
        icon: 'pi pi-folder-open',
        command: () => {
          this.openFileLocation(file);
        },
      },
    ];

    if (this.canManageItem(file.creator.id)) {
      items.push({
        separator: true,
      });

      items.push({
        label: 'Eliminar',
        icon: 'pi pi-trash',
        labelStyle: {
          color: 'var(--color-warning)',
        },
        iconStyle: {
          color: 'var(--color-warning)',
        },
        command: () => {
          this.confirmDeleteFile(file);
        },
      });
    }

    return items;
  }

  private buildCreateFolderRequest(data: CreateFolderDialogSubmit): CreateFolderRequest {
    const request: CreateFolderRequest = {
      repositoryId: this.repository().id,
      name: data.name,
      color: data.color,
    };

    const currentFolderId = this.currentFolderId();

    if (currentFolderId) {
      request.parentId = currentFolderId;
    }

    return request;
  }

  private buildCreateFileRequest(data: CreateFileDialogSubmit): CreateFileRequest {
    const request: CreateFileRequest = {
      repositoryId: this.repository().id,
      name: data.name,
      file: data.file,
    };

    const currentFolderId = this.currentFolderId();

    if (currentFolderId) {
      request.folderId = currentFolderId;
    }

    if (data.tags?.length) {
      request.tags = data.tags;
    }

    return request;
  }

  private deleteFolder(folder: FolderModel): void {
    this.filesFacade.deleteFolder(folder.id).subscribe({
      next: (response) => {
        this.notificationService.success(
          'Carpetas',
          getApiNotificationMessage(response, FILES_MESSAGES.DELETE_FOLDER.SUCCESS),
        );
        this.loadExplorer(this.currentFolderId(), this.getActiveSearch());
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(
          'Carpetas',
          getApiErrorNotificationMessage(error, FILES_MESSAGES.DELETE_FOLDER.ERROR),
        );
      },
    });
  }

  private deleteFile(file: FileModel): void {
    this.filesFacade.deleteFile(file.id).subscribe({
      next: (response) => {
        this.notificationService.success(
          'Archivos',
          getApiNotificationMessage(response, FILES_MESSAGES.DELETE_FILE.SUCCESS),
        );
        this.loadExplorer(this.currentFolderId(), this.getActiveSearch());
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(
          'Archivos',
          getApiErrorNotificationMessage(error, FILES_MESSAGES.DELETE_FILE.ERROR),
        );
      },
    });
  }

  private canManageItem(creatorId: number): boolean {
    if (this.isRepositoryManager()) {
      return true;
    }

    const user = this.currentUser();

    if (!user) {
      return false;
    }

    return user.id === creatorId;
  }

  private isRepositoryOwner(): boolean {
    const user = this.currentUser();

    if (!user) {
      return false;
    }

    return user.id === this.repository().ownerUserId;
  }

  private isRepositoryManager(): boolean {
    if (this.isRepositoryOwner()) {
      return true;
    }

    const roleName = this.repository().currentUserRepository?.role.name;

    if (!roleName) {
      return false;
    }

    return this.managerRoles.includes(roleName);
  }

  private getActiveSearch(): string | undefined {
    const search = this.search().trim();

    if (!search) {
      return undefined;
    }

    return search;
  }

  private clearSort(): void {
    this.sortField.set(null);
    this.sortOrder.set(1);
  }

  private emitRepositoryUpdated(updatedAt?: string | null): void {
    if (!updatedAt) {
      return;
    }

    this.repositoryUpdated.emit(updatedAt);
  }

  private openDownloadUrl(url: string): void {
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener';

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  private resetExplorerState(): void {
    this.filesFacade.clearExplorerContent();
    this.search.set('');
    this.clearSort();
    this.menuItems.set([]);
    this.selectedFolder.set(null);
    this.createFolderDialogVisible.set(false);
    this.updateFolderDialogVisible.set(false);
    this.createFileDialogVisible.set(false);
  }

  private handleLoadExplorerError(error: HttpErrorResponse): void {
    this.notificationService.error(
      'Explorador de archivos',
      getApiErrorNotificationMessage(error, FILES_MESSAGES.EXPLORER.ERROR),
    );
  }
}
