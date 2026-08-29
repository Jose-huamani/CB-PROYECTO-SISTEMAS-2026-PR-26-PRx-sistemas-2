import { RepositoryVisibility } from '@generated-prisma/client';

import { RepositoryCategoryResponseDto } from '@modules/repositories/application/dto/responses/repository-category-response.dto';
import { RepositoryFunctionResponseDto } from '@modules/repositories/application/dto/responses/repository-function-response.dto';
import { RepositoryRoleResponseDto } from '@modules/repositories/application/dto/responses/repository-role-response.dto';
import { TagResponseDto } from '@modules/tags/application/dto/responses/tag-response.dto';
import { UserResponseDto } from '@modules/users/application/dto/responses/user-response.dto';

export class RepositoryResponseDto {
  id!: number;
  repositoryCategoryId!: number;
  ownerUserId!: number;
  name!: string;
  visibility!: RepositoryVisibility;
  color!: string;
  description?: string | null;
  category!: RepositoryCategoryResponseDto;
  owner!: UserResponseDto;
  tags!: TagResponseDto[];
  currentUserRepository?: {
    role: RepositoryRoleResponseDto;
    function: RepositoryFunctionResponseDto;
  } | null;
  createdAt!: Date;
  updatedAt!: Date;
}
