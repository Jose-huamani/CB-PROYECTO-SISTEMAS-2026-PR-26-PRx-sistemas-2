import { Role } from '@generated-prisma/enums';

import { FileEntity } from '@modules/files/domain/entities/file.entity';
import { TagPrismaMapper } from '@modules/tags/infrastructure/mappers/tag-prisma.mapper';
import { UserPrismaMapper } from '@modules/users/infrastructure/mappers/user-prisma.mapper';

type FilePrismaModel = {
  id: number;
  repositoryId: number;
  folderId?: number | null;
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  storagePath: string;
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
  tagFiles: {
    tag: {
      id: number;
      name: string;
      status: number;
    };
  }[];
};

export class FilePrismaMapper {
  static toDomain(file: FilePrismaModel): FileEntity {
    return new FileEntity(
      file.id,
      file.repositoryId,
      file.folderId ?? null,
      file.name,
      file.extension,
      file.mimeType,
      file.size,
      file.storagePath,
      file.tagFiles.map((fileTag) => TagPrismaMapper.toDomain(fileTag.tag)),
      UserPrismaMapper.toDomain(file.createdByUser),
      file.createdBy,
      file.status,
      file.createdAt,
      file.updatedAt,
      file.updatedBy ?? undefined,
    );
  }

  static toDomainList(files: FilePrismaModel[]): FileEntity[] {
    return files.map((file) => this.toDomain(file));
  }
}
