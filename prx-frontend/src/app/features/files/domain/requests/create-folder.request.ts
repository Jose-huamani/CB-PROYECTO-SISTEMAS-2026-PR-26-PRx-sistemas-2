export interface CreateFolderRequest {
  repositoryId: number;
  parentId?: number;
  name: string;
  color: string;
}
