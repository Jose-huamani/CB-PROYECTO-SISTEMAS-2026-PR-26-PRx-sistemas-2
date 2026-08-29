import { FolderResponseDto } from '@modules/files/application/dto/responses/folder-response.dto';
import { FolderEntity } from '@modules/files/domain/entities/folder.entity';
import { UserResponseMapper } from '@modules/users/application/mappers/user-response.mapper';

export class FolderResponseMapper {
  static toFolderResponse(folder: FolderEntity): FolderResponseDto {
    return {
      id: folder.id as number,
      repositoryId: folder.repositoryId,
      parentId: folder.parentId,
      name: folder.name,
      path: folder.path,
      level: folder.level,
      color: folder.color,
      creator: UserResponseMapper.toUserResponse(folder.creator!),
      createdAt: folder.createdAt as Date,
      updatedAt: folder.updatedAt as Date,
    };
  }

  static toFolderResponseList(folders: FolderEntity[]): FolderResponseDto[] {
    return folders.map((folder) => this.toFolderResponse(folder));
  }
}
