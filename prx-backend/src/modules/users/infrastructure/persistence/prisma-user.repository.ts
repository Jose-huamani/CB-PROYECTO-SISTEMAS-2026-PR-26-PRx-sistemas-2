import { Injectable } from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { UserPrismaMapper } from '@modules/users/infrastructure/mappers/user-prisma.mapper';
import { BasePrismaRepository } from '@shared/infrastructure/persistence/base-prisma.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaUserRepository
  extends BasePrismaRepository
  implements UserRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const created = await this.prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.passwordHash,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdBy: user.createdBy,
      },
    });

    return UserPrismaMapper.toDomain(created);
  }

  async createSelfRegistered(user: UserEntity): Promise<UserEntity> {
    const created = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          username: user.username,
          email: user.email,
          password: user.passwordHash,
          role: user.role,
          avatarUrl: user.avatarUrl,
          createdBy: user.createdBy,
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: createdUser.id },
        data: {
          createdBy: createdUser.id,
        },
      });

      return updatedUser;
    });

    return UserPrismaMapper.toDomain(created);
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        status: 1,
      },
    });

    if (!user) {
      return null;
    }

    return UserPrismaMapper.toDomain(user);
  }

  async update(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        username: data.username,
        email: data.email,
        password: data.passwordHash,
        role: data.role,
        avatarUrl: data.avatarUrl,
        updatedBy: data.updatedBy,
      },
    });

    return UserPrismaMapper.toDomain(updated);
  }

  async softDelete(id: number, updatedBy: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        status: 0,
        updatedBy,
      },
    });
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: { status: 1 },
      orderBy: { id: 'desc' },
    });

    return UserPrismaMapper.toDomainList(users);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        status: 1,
      },
    });

    if (!user) {
      return null;
    }

    return UserPrismaMapper.toDomain(user);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
        status: 1,
      },
    });

    if (!user) {
      return null;
    }

    return UserPrismaMapper.toDomain(user);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        email,
        status: 1,
      },
    });

    return count > 0;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        username,
        status: 1,
      },
    });

    return count > 0;
  }
}
