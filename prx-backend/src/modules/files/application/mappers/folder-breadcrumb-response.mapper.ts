import { FolderBreadcrumbResponseDto } from '@modules/files/application/dto/responses/folder-breadcrumb-response.dto';
import { FolderEntity } from '@modules/files/domain/entities/folder.entity';

export class FolderBreadcrumbResponseMapper {
  static toRepositoryBreadcrumbResponse(
    repositoryName: string,
  ): FolderBreadcrumbResponseDto {
    return {
      id: null,
      name: repositoryName,
    };
  }

  static toFolderBreadcrumbResponse(
    folder: FolderEntity,
  ): FolderBreadcrumbResponseDto {
    return {
      id: folder.id as number,
      name: folder.name,
    };
  }

  static toFolderBreadcrumbResponseList(
    folders: FolderEntity[],
  ): FolderBreadcrumbResponseDto[] {
    return folders.map((folder) => this.toFolderBreadcrumbResponse(folder));
  }
}
