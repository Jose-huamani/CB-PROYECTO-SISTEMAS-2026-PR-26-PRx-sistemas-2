import { FileResponseDto } from '@modules/files/application/dto/responses/file-response.dto';
import { FolderBreadcrumbResponseDto } from '@modules/files/application/dto/responses/folder-breadcrumb-response.dto';
import { FolderResponseDto } from '@modules/files/application/dto/responses/folder-response.dto';

export class ExplorerResponseDto {
  breadcrumbs!: FolderBreadcrumbResponseDto[];
  folders!: FolderResponseDto[];
  files!: FileResponseDto[];
}
