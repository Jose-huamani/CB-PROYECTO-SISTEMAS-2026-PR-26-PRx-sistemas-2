import { FileModel } from '@features/files/domain/models/file.model';
import { FolderModel } from '@features/files/domain/models/folder.model';

export type FileExplorerItemType = 'folder' | 'file';

export interface FileExplorerFolderItemModel {
  key: string;
  type: 'folder';
  data: FolderModel;
}

export interface FileExplorerFileItemModel {
  key: string;
  type: 'file';
  data: FileModel;
}

export type FileExplorerItemModel = FileExplorerFolderItemModel | FileExplorerFileItemModel;
