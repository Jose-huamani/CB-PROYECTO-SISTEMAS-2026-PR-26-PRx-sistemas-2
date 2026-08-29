import { TagResponseDto } from '@modules/tags/application/dto/responses/tag-response.dto';
import { UserResponseDto } from '@modules/users/application/dto/responses/user-response.dto';

export class FileResponseDto {
  id!: number;
  repositoryId!: number;
  folderId!: number | null;
  name!: string;
  extension!: string;
  mimeType!: string;
  size!: number;
  storagePath!: string;
  tags!: TagResponseDto[];
  creator!: UserResponseDto;
  createdAt!: Date;
  updatedAt!: Date;
}
