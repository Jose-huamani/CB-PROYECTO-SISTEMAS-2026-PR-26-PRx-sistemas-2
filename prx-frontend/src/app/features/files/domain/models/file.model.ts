import { FileTagModel } from '@features/files/domain/models/file-tag.model';
import { CurrentUserModel } from '@shared/models/current-user.model';

export interface FileModel {
  id: number;
  repositoryId: number;
  folderId: number | null;
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  storagePath: string;
  tags: FileTagModel[];
  creator: CurrentUserModel;
  createdAt: string;
  updatedAt: string;
}
