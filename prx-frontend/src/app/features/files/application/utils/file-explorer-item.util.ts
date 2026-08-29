import { FileExplorerItemModel } from '@features/files/domain/models/file-explorer-item.model';
import { FileModel } from '@features/files/domain/models/file.model';
import { FolderModel } from '@features/files/domain/models/folder.model';

export function toFileExplorerFolderItem(folder: FolderModel): FileExplorerItemModel {
  return {
    key: `folder-${folder.id}`,
    type: 'folder',
    data: folder,
  };
}

export function toFileExplorerFileItem(file: FileModel): FileExplorerItemModel {
  return {
    key: `file-${file.id}`,
    type: 'file',
    data: file,
  };
}
