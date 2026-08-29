import { Injectable } from '@nestjs/common';
import { InvitationStatus } from '@generated-prisma/enums';

import { RepositoryInvitationEntity } from '@modules/repository-invitations/domain/entities/repository-invitation.entity';
import { RepositoryInvitationRepository } from '@modules/repository-invitations/domain/repositories/repository-invitation.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { RepositoryInvitationPrismaMapper } from '@modules/repository-invitations/infrastructure/mappers/prisma-repository-invitation.mapper';

@Injectable()
export class PrismaRepositoryInvitationRepository implements RepositoryInvitationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<RepositoryInvitationEntity | null> {
    const raw = await this.prisma.repositoryInvitation.findUnique({
      where: { id },
      include: {
        repository: {
          include: {
            repositoryCategory: true,
            ownerUser: true,
            tagRepositories: { include: { tag: true } },
          },
        },
        senderUser: true,
        invitedUser: true,
        repositoryRole: true,
        repositoryFunction: true,
      },
    });

    if (!raw) return null;
    return RepositoryInvitationPrismaMapper.toDomain(raw);
  }

  async patch(
    id: number,
    data: Partial<RepositoryInvitationEntity>,
  ): Promise<RepositoryInvitationEntity> {
    const updateData: {
      invitationStatus?: InvitationStatus;
      status?: number;
      updatedBy?: number;
    } = {};

    if (data.invitationStatus !== undefined)
      updateData.invitationStatus = data.invitationStatus;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy;

    const raw = await this.prisma.repositoryInvitation.update({
      where: { id },
      data: updateData,
      include: {
        repository: {
          include: {
            repositoryCategory: true,
            ownerUser: true,
            tagRepositories: { include: { tag: true } },
          },
        },
        senderUser: true,
        invitedUser: true,
        repositoryRole: true,
        repositoryFunction: true,
      },
    });

    return RepositoryInvitationPrismaMapper.toDomain(raw);
  }

  async findManyByStatus(
    status: string,
  ): Promise<RepositoryInvitationEntity[]> {
    const rawList = await this.prisma.repositoryInvitation.findMany({
      where: {
        invitationStatus: status as InvitationStatus,
        status: 1,
      },
      include: {
        repository: {
          include: {
            repositoryCategory: true,
            ownerUser: true,
            tagRepositories: { include: { tag: true } },
          },
        },
        senderUser: true,
        invitedUser: true,
        repositoryRole: true,
        repositoryFunction: true,
      },
    });

    return RepositoryInvitationPrismaMapper.toDomainList(rawList);
  }

  async create(
    entity: RepositoryInvitationEntity,
  ): Promise<RepositoryInvitationEntity> {
    const existingInvitation = await this.prisma.repositoryInvitation.findFirst(
      {
        where: {
          repositoryId: entity.repositoryId,
          invitedUserId: entity.invitedUserId,
          invitationStatus: InvitationStatus.pendiente,
        },
      },
    );

    let raw;

    if (existingInvitation) {
      raw = await this.prisma.repositoryInvitation.update({
        where: { id: existingInvitation.id },
        data: {
          status: 1,
          invitationStatus: entity.invitationStatus,
          repositoryRoleId: entity.repositoryRoleId,
          repositoryFunctionId: entity.repositoryFunctionId,
          welcomeMessage: entity.welcomeMessage,
          updatedBy: entity.createdBy,
        },
        include: {
          repository: {
            include: {
              repositoryCategory: true,
              ownerUser: true,
              tagRepositories: { include: { tag: true } },
            },
          },
          senderUser: true,
          invitedUser: true,
          repositoryRole: true,
          repositoryFunction: true,
        },
      });
    } else {
      raw = await this.prisma.repositoryInvitation.create({
        data: {
          repositoryId: entity.repositoryId,
          senderUserId: entity.senderUserId,
          invitedUserId: entity.invitedUserId,
          repositoryRoleId: entity.repositoryRoleId,
          repositoryFunctionId: entity.repositoryFunctionId,
          invitationStatus: entity.invitationStatus,
          welcomeMessage: entity.welcomeMessage,
          createdBy: entity.createdBy,
          status: 1,
        },
        include: {
          repository: {
            include: {
              repositoryCategory: true,
              ownerUser: true,
              tagRepositories: { include: { tag: true } },
            },
          },
          senderUser: true,
          invitedUser: true,
          repositoryRole: true,
          repositoryFunction: true,
        },
      });
    }

    return RepositoryInvitationPrismaMapper.toDomain(raw);
  }

  async findByRepositoryIdAndUserId(
    repositoryId: number,
    userId: number,
  ): Promise<RepositoryInvitationEntity | null> {
    const raw = await this.prisma.repositoryInvitation.findFirst({
      where: {
        repositoryId,
        invitedUserId: userId,
        invitationStatus: InvitationStatus.pendiente,
        status: 1,
      },
      include: {
        repository: {
          include: {
            repositoryCategory: true,
            ownerUser: true,
            tagRepositories: { include: { tag: true } },
          },
        },
        senderUser: true,
        invitedUser: true,
        repositoryRole: true,
        repositoryFunction: true,
      },
    });

    if (!raw) return null;
    return RepositoryInvitationPrismaMapper.toDomain(raw);
  }
}
