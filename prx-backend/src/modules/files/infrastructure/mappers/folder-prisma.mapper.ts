import { Role } from '@generated-prisma/enums';

import { FolderEntity } from '@modules/files/domain/entities/folder.entity';
import { UserPrismaMapper } from '@modules/users/infrastructure/mappers/user-prisma.mapper';

type FolderPrismaModel = {
  id: number;
  repositoryId: number;
  parentId?: number | null;
  name: string;
  path: string;
  level: number;
  color: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy?: number | null;
  createdByUser: {
    id: number;
    username: string;
    email: string;
    password: string;
    role: Role;
    avatarUrl: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy?: number | null;
  };
};

export class FolderPrismaMapper {
  static toDomain(folder: FolderPrismaModel): FolderEntity {
    return new FolderEntity(
      folder.id,
      folder.repositoryId,
      folder.parentId ?? null,
      folder.name,
      folder.path,
      folder.level,
      folder.color,
      UserPrismaMapper.toDomain(folder.createdByUser),
      folder.createdBy,
      folder.status,
      folder.createdAt,
      folder.updatedAt,
      folder.updatedBy ?? undefined,
    );
  }

  static toDomainList(folders: FolderPrismaModel[]): FolderEntity[] {
    return folders.map((folder) => this.toDomain(folder));
  }
}
