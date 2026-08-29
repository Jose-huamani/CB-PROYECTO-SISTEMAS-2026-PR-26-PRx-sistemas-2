import { UserResponseDto } from '@modules/users/application/dto/responses/user-response.dto';

export class FolderResponseDto {
  id!: number;
  repositoryId!: number;
  parentId!: number | null;
  name!: string;
  path!: string;
  level!: number;
  color!: string;
  creator!: UserResponseDto;
  createdAt!: Date;
  updatedAt!: Date;
}
