import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { USER_MESSAGES } from '@modules/users/application/constants/user-messages.constants';
import { REPOSITORY_ROLE_MESSAGES } from '@modules/repositories/application/constants/repository-role-messages.constants';

import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { RepositoryRoleRepository } from '@modules/repositories/domain/repositories/repository-role.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';
import { RepositoryUserResponseMapper } from '@modules/repositories/application/mappers/repository-user-response.mapper';
import { UpdateRepositoryUserCommand } from '@modules/repositories/application/commands/update-repository-user/update-repository-user.command';

const OWNER_ROLE_NAME = 'propietario';
const COOWNER_ROLE_NAME = 'copropietario';

@CommandHandler(UpdateRepositoryUserCommand)
export class UpdateRepositoryUserHandler implements ICommandHandler<UpdateRepositoryUserCommand> {
  constructor(
    @Inject(RepositoryUserRepository)
    private readonly repositoryUserRepository: RepositoryUserRepository,
    @Inject(RepositoryRoleRepository)
    private readonly repositoryRoleRepository: RepositoryRoleRepository,
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
  ) {}

  async execute(command: UpdateRepositoryUserCommand) {
    const { repositoryId, targetUserId, dto, requestUserId } = command;

    if (targetUserId === requestUserId) {
      throw new ConflictException(REPOSITORY_MESSAGES.CANNOT_UPDATE_SELF);
    }

    const targetUser =
      await this.repositoryUserRepository.findByRepositoryIdAndUserId(
        repositoryId,
        targetUserId,
      );

    const requestUser =
      await this.repositoryUserRepository.findByRepositoryIdAndUserId(
        repositoryId,
        requestUserId,
      );

    if (!targetUser || !requestUser) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND_IN_REPOSITORY);
    }

    const coOwnerRole =
      await this.repositoryRoleRepository.findByName(COOWNER_ROLE_NAME);

    if (coOwnerRole) {
      const isRequestorCopropietario =
        requestUser.repositoryRoleId === coOwnerRole.id;
      const isTargetCopropietario =
        targetUser.repositoryRoleId === coOwnerRole.id;

      if (isRequestorCopropietario && isTargetCopropietario) {
        throw new ForbiddenException(
          REPOSITORY_MESSAGES.CANNOT_UPDATE_OTHER_COOWNER,
        );
      }
    }

    if (dto.repositoryRoleId !== undefined) {
      const allRoles = await this.repositoryRoleRepository.findAll();
      const targetRole = allRoles.find(
        (role) => Number(role.id) === Number(dto.repositoryRoleId),
      );

      if (!targetRole) {
        throw new NotFoundException(REPOSITORY_ROLE_MESSAGES.ROLE_NOT_FOUND);
      }

      if (targetRole.name === COOWNER_ROLE_NAME) {
        const isAlreadyCoOwner =
          targetUser.repositoryRoleId === dto.repositoryRoleId;

        if (!isAlreadyCoOwner) {
          const coOwnerCount =
            await this.repositoryUserRepository.countByRoleName(
              repositoryId,
              COOWNER_ROLE_NAME,
            );

          if (coOwnerCount >= 2) {
            throw new ConflictException(
              REPOSITORY_MESSAGES.COOWNER_LIMIT_EXCEEDED,
            );
          }
        }
      }

      if (targetRole.name === OWNER_ROLE_NAME) {
        const repository =
          await this.repositoryRepository.findById(repositoryId);
        if (!repository) {
          throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);
        }

        const nameConflict =
          await this.repositoryRepository.existsByNameAndOwnerUserId(
            repository.name,
            targetUserId,
          );

        if (nameConflict) {
          throw new ConflictException(
            REPOSITORY_MESSAGES.TRANSFER_NAME_CONFLICT,
          );
        }

        await this.repositoryUserRepository.transferOwnership(
          repositoryId,
          requestUser.id as number,
          targetUser.id as number,
          targetUserId,
          dto.repositoryRoleId,
          dto.repositoryFunctionId ?? targetUser.repositoryFunctionId,
          targetUser.repositoryRoleId,
          targetUser.repositoryFunctionId,
          requestUserId,
        );

        const updatedUser =
          await this.repositoryUserRepository.findByRepositoryIdAndUserId(
            repositoryId,
            targetUserId,
          );

        return {
          message: REPOSITORY_MESSAGES.USER_UPDATED,
          data: RepositoryUserResponseMapper.toRepositoryUserResponse(
            updatedUser!,
          ),
        };
      }
    }

    const updatedUser = await this.repositoryUserRepository.update(
      targetUser.id as number,
      {
        repositoryRoleId: dto.repositoryRoleId ?? targetUser.repositoryRoleId,
        repositoryFunctionId:
          dto.repositoryFunctionId ?? targetUser.repositoryFunctionId,
        updatedBy: requestUserId,
      },
    );

    return {
      message: REPOSITORY_MESSAGES.USER_UPDATED,
      data: RepositoryUserResponseMapper.toRepositoryUserResponse(updatedUser),
    };
  }
}
