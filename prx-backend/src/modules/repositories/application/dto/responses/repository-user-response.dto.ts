import { RepositoryFunctionResponseDto } from '@modules/repositories/application/dto/responses/repository-function-response.dto';
import { RepositoryResponseDto } from '@modules/repositories/application/dto/responses/repository-response.dto';
import { RepositoryRoleResponseDto } from '@modules/repositories/application/dto/responses/repository-role-response.dto';
import { UserResponseDto } from '@modules/users/application/dto/responses/user-response.dto';

export class RepositoryUserResponseDto {
  id!: number;
  repositoryId!: number;
  userId!: number;
  repositoryRoleId!: number;
  repositoryFunctionId!: number;
  repository?: RepositoryResponseDto;
  user?: UserResponseDto;
  role!: RepositoryRoleResponseDto;
  function!: RepositoryFunctionResponseDto;
  createdAt!: Date;
  updatedAt!: Date;
}
