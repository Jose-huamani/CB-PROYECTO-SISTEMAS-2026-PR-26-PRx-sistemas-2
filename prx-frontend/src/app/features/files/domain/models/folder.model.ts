import { CurrentUserModel } from '@shared/models/current-user.model';

export interface FolderModel {
  id: number;
  repositoryId: number;
  parentId: number | null;
  name: string;
  path: string;
  level: number;
  color: string;
  creator: CurrentUserModel;
  createdAt: string;
  updatedAt: string;
}
