import { FileResponseDto } from '@modules/files/application/dto/responses/file-response.dto';
import { FileEntity } from '@modules/files/domain/entities/file.entity';
import { TagResponseMapper } from '@modules/tags/application/mappers/tag-response.mapper';
import { UserResponseMapper } from '@modules/users/application/mappers/user-response.mapper';

export class FileResponseMapper {
  static toFileResponse(file: FileEntity): FileResponseDto {
    return {
      id: file.id as number,
      repositoryId: file.repositoryId,
      folderId: file.folderId,
      name: file.name,
      extension: file.extension,
      mimeType: file.mimeType,
      size: file.size,
      storagePath: file.storagePath,
      tags: TagResponseMapper.toTagResponseList(file.tags),
      creator: UserResponseMapper.toUserResponse(file.creator!),
      createdAt: file.createdAt as Date,
      updatedAt: file.updatedAt as Date,
    };
  }

  static toFileResponseList(files: FileEntity[]): FileResponseDto[] {
    return files.map((file) => this.toFileResponse(file));
  }
}
