import { ExplorerResponseDto } from '@modules/files/application/dto/responses/explorer-response.dto';
import { FileResponseMapper } from '@modules/files/application/mappers/file-response.mapper';
import { FolderBreadcrumbResponseMapper } from '@modules/files/application/mappers/folder-breadcrumb-response.mapper';
import { FolderResponseMapper } from '@modules/files/application/mappers/folder-response.mapper';
import { FileEntity } from '@modules/files/domain/entities/file.entity';
import { FolderEntity } from '@modules/files/domain/entities/folder.entity';

export class ExplorerResponseMapper {
  static toExplorerResponse(params: {
    repositoryName: string;
    breadcrumbs: FolderEntity[];
    folders: FolderEntity[];
    files: FileEntity[];
  }): ExplorerResponseDto {
    return {
      breadcrumbs: [
        FolderBreadcrumbResponseMapper.toRepositoryBreadcrumbResponse(
          params.repositoryName,
        ),
        ...FolderBreadcrumbResponseMapper.toFolderBreadcrumbResponseList(
          params.breadcrumbs,
        ),
      ],
      folders: FolderResponseMapper.toFolderResponseList(params.folders),
      files: FileResponseMapper.toFileResponseList(params.files),
    };
  }
}
