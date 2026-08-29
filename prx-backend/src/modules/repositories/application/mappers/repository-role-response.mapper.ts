import { RepositoryRoleResponseDto } from '@modules/repositories/application/dto/responses/repository-role-response.dto';
import { RepositoryRoleEntity } from '@modules/repositories/domain/entities/repository-role.entity';

export class RepositoryRoleResponseMapper {
  static toRepositoryRoleResponse(
    role: RepositoryRoleEntity,
  ): RepositoryRoleResponseDto {
    return {
      id: role.id as number,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt as Date,
      updatedAt: role.updatedAt as Date,
    };
  }

  static toRepositoryRoleResponseList(
    roles: RepositoryRoleEntity[],
  ): RepositoryRoleResponseDto[] {
    return roles.map((role) => this.toRepositoryRoleResponse(role));
  }
}
