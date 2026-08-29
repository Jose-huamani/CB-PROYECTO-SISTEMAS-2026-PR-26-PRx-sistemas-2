import { FileModel } from '@features/files/domain/models/file.model';
import { FolderBreadcrumbModel } from '@features/files/domain/models/folder-breadcrumb.model';
import { FolderModel } from '@features/files/domain/models/folder.model';

export interface ExplorerContentModel {
  breadcrumbs: FolderBreadcrumbModel[];
  folders: FolderModel[];
  files: FileModel[];
}
