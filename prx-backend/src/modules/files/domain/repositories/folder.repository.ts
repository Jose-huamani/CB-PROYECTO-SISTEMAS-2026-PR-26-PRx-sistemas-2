import { FolderEntity } from '@modules/files/domain/entities/folder.entity';

export abstract class FolderRepository {
  abstract existsByNameAndParent(
    repositoryId: number,
    parentId: number | null,
    name: string,
    excludedFolderId?: number,
  ): Promise<boolean>;

  abstract existsByParentId(
    repositoryId: number,
    parentId: number,
  ): Promise<boolean>;

  abstract create(entity: FolderEntity): Promise<FolderEntity>;

  abstract updatePath(
    id: number,
    path: string,
    updatedBy: number,
  ): Promise<FolderEntity>;

  abstract update(
    id: number,
    name: string,
    color: string,
    updatedBy: number,
  ): Promise<FolderEntity>;

  abstract softDelete(id: number, updatedBy: number): Promise<void>;

  abstract softDeleteTreeByPath(
    repositoryId: number,
    path: string,
    updatedBy: number,
  ): Promise<void>;

  abstract findById(id: number): Promise<FolderEntity | null>;

  abstract findByIdAndRepositoryId(
    id: number,
    repositoryId: number,
  ): Promise<FolderEntity | null>;

  abstract findChildren(
    repositoryId: number,
    parentId: number | null,
  ): Promise<FolderEntity[]>;

  abstract searchInTree(
    repositoryId: number,
    parentPath: string | null,
    search: string,
  ): Promise<FolderEntity[]>;

  abstract findAncestorsByPath(
    repositoryId: number,
    path: string,
  ): Promise<FolderEntity[]>;
}
