import { Injectable } from '@nestjs/common';

import { ProfileEntity } from '@modules/profiles/domain/entities/profile.entity';
import {
  ProfileRepository,
  ProfileUpdateInput,
} from '@modules/profiles/domain/repositories/profile.repository';
import { ProfilePrismaMapper } from '@modules/profiles/infrastructure/mappers/profile-prisma.mapper';
import { BasePrismaRepository } from '@shared/infrastructure/persistence/base-prisma.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaProfileRepository
  extends BasePrismaRepository
  implements ProfileRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(profile: ProfileEntity): Promise<ProfileEntity> {
    const created = await this.prisma.$transaction(async (tx) => {
      let socialNetworks = profile.socialNetworks.map((socialNetwork) => ({
        socialNetworkId: socialNetwork.socialNetworkId,
        username: socialNetwork.username,
        createdBy: profile.createdBy,
      }));

      if (socialNetworks.length > 0) {
        const ids = socialNetworks.map((s) => s.socialNetworkId);
        const existing = await tx.socialNetwork.findMany({
          where: { id: { in: ids }, status: 1 },
          select: { id: true },
        });
        const existingIds = new Set(existing.map((e) => e.id));
        const before = socialNetworks.length;
        socialNetworks = socialNetworks.filter((s) => existingIds.has(s.socialNetworkId));
        const after = socialNetworks.length;
        if (after !== before) {
        }
      }

      return tx.profile.create({
        data: {
          id: profile.id!,
          firstName: profile.firstName,
          lastName: profile.lastName,
          secondLastName: profile.secondLastName,
          biography: profile.biography,
          phoneNumber: profile.phoneNumber,
          countryId: profile.countryId,
          regionId: profile.regionId,
          townId: profile.townId,
          phoneCodeId: profile.phoneCodeId,
          isEmailVisible: profile.isEmailVisible,
          createdBy: profile.createdBy,
          profileSocialNetworks: socialNetworks.length
            ? {
              create: socialNetworks,
            }
            : undefined,
        },
        include: {
          user: {
            select: {
              email: true,
              avatarUrl: true,
            },
          },
          profileSocialNetworks: {
            where: { status: 1 },
          },
          tagProfiles: {
            where: { status: 1 },
            include: {
              tag: true,
            },
          },
          country: {
            select: { id: true, name: true },
          },
          region: {
            select: { id: true, name: true },
          },
          town: {
            select: { id: true, name: true },
          },
        },
      });
    });

    return ProfilePrismaMapper.toDomain(created);
  }

  async findById(id: number): Promise<ProfileEntity | null> {
    const profile = await this.prisma.profile.findFirst({
      where: {
        id,
        status: 1,
      },
      include: {
        user: {
          select: {
            email: true,
            avatarUrl: true,
          },
        },
        profileSocialNetworks: {
          where: { status: 1 },
        },
        tagProfiles: {
          where: { status: 1 },
          include: {
            tag: true,
          },
        },
        country: {
          select: { id: true, name: true },
        },
        region: {
          select: { id: true, name: true },
        },
        town: {
          select: { id: true, name: true },
        },
      },
    });

    if (!profile) {
      return null;
    }

    return ProfilePrismaMapper.toDomain(profile);
  }

  async findByUserId(userId: number): Promise<ProfileEntity | null> {
    const profile = await this.prisma.profile.findFirst({
      where: {
        id: userId,
        status: 1,
      },
      include: {
        user: {
          select: {
            email: true,
            avatarUrl: true,
          },
        },
        profileSocialNetworks: {
          where: { status: 1 },
        },
        tagProfiles: {
          where: { status: 1 },
          include: {
            tag: true,
          },
        },
      },
    });

    if (!profile) {
      return null;
    }

    return ProfilePrismaMapper.toDomain(profile);
  }

  async update(id: number, data: ProfileUpdateInput): Promise<ProfileEntity> {
    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.profile.update({
        where: { id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          secondLastName: data.secondLastName,
          biography: data.biography,
          phoneNumber: data.phoneNumber,
          countryId: data.countryId,
          regionId: data.regionId,
          townId: data.townId,
          phoneCodeId: data.phoneCodeId,
          isEmailVisible: data.isEmailVisible,
          updatedBy: data.updatedBy,
        },
      });

      if (data.socialNetworks !== undefined) {
        await tx.profileSocialNetwork.updateMany({
          where: {
            profileId: id,
            status: 1,
          },
          data: {
            status: 0,
            updatedBy: data.updatedBy,
          },
        });

        if (data.socialNetworks.length > 0) {
          const ids = data.socialNetworks.map((s) => s.socialNetworkId);
          const existing = await tx.socialNetwork.findMany({
            where: { id: { in: ids }, status: 1 },
            select: { id: true },
          });
          const existingIds = new Set(existing.map((e) => e.id));
          const filtered = data.socialNetworks.filter((s) => existingIds.has(s.socialNetworkId));
          if (filtered.length > 0) {
            await tx.profileSocialNetwork.createMany({
              data: filtered.map((socialNetwork) => ({
                profileId: id,
                socialNetworkId: socialNetwork.socialNetworkId,
                username: socialNetwork.username,
                createdBy: data.updatedBy ?? id,
              })),
            });
          }
        }
      }



      const profile = await tx.profile.findFirst({
        where: {
          id,
          status: 1,
        },
        include: {
          user: {
            select: {
              email: true,
              avatarUrl: true,
            },
          },
          profileSocialNetworks: {
            where: { status: 1 },
          },
          tagProfiles: {
            where: { status: 1 },
            include: {
              tag: true,
            },
          },
          country: {
            select: { id: true, name: true },
          },
          region: {
            select: { id: true, name: true },
          },
          town: {
            select: { id: true, name: true },
          },
        },
      });

      if (!profile) {
        throw new Error('Profile not found after update');
      }

      return profile;
    });

    return ProfilePrismaMapper.toDomain(updated);
  }

  async softDelete(id: number, updatedBy: number): Promise<void> {
    await this.prisma.profile.update({
      where: { id },
      data: {
        status: 0,
        updatedBy: updatedBy,
      },
    });
  }
}
