export interface CreateFileRequest {
  repositoryId: number;
  folderId?: number;
  name: string;
  tags?: string[];
  file: File;
}
