import { FileEntity } from '@modules/files/domain/entities/file.entity';

export abstract class FileRepository {
  abstract existsByNameAndFolder(
    repositoryId: number,
    folderId: number | null,
    name: string,
    extension: string,
    excludedFileId?: number,
  ): Promise<boolean>;

  abstract existsByFolderId(
    repositoryId: number,
    folderId: number,
  ): Promise<boolean>;

  abstract create(entity: FileEntity): Promise<FileEntity>;

  abstract updateStoragePath(
    id: number,
    storagePath: string,
    updatedBy: number,
  ): Promise<FileEntity>;

  abstract softDelete(id: number, updatedBy: number): Promise<void>;

  abstract findById(id: number): Promise<FileEntity | null>;

  abstract findByIdAndRepositoryId(
    id: number,
    repositoryId: number,
  ): Promise<FileEntity | null>;

  abstract findChildren(
    repositoryId: number,
    folderId: number | null,
  ): Promise<FileEntity[]>;

  abstract searchInTree(
    repositoryId: number,
    folderId: number | null,
    parentPath: string | null,
    search: string,
    tagSearch: string,
  ): Promise<FileEntity[]>;
}
