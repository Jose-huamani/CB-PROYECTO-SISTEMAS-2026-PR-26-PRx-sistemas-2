import { ProfileEntity } from '@modules/profiles/domain/entities/profile.entity';
import { ProfileSocialNetworkPrismaMapper } from '@modules/profiles/infrastructure/mappers/profile-social-network-prisma.mapper';
import { TagProfilePrismaMapper } from '@modules/profiles/infrastructure/mappers/tag-profile-prisma.mapper';

type ProfileSocialNetworkModel = {
  id: number;
  profileId: number;
  socialNetworkId: number;
  username: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy?: number | null;
};

type TagModel = {
  id: number;
  name: string;
  status: number;
};

type TagProfileModel = {
  id: number;
  profileId: number;
  tagId: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy?: number | null;
};

type ProfilePrismaModel = {
  id: number;
  phoneCodeId: number | null;
  countryId: number | null;
  regionId: number | null;
  townId: number | null;
  isEmailVisible: boolean;
  firstName: string | null;
  lastName: string | null;
  secondLastName: string | null;
  biography: string | null;
  phoneNumber: string | null;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy?: number | null;
  user?: { email: string; avatarUrl: string } | null;
  country?: { id: number; name: string } | null;
  region?: { id: number; name: string } | null;
  town?: { id: number; name: string } | null;
  profileSocialNetworks?: ProfileSocialNetworkModel[];
  tagProfiles?: Array<TagProfileModel & { tag?: TagModel | null }>;
};

export class ProfilePrismaMapper {
  static toDomain(profile: ProfilePrismaModel): ProfileEntity {
    const entity = new ProfileEntity(
      profile.id,
      profile.firstName,
      profile.lastName,
      profile.secondLastName,
      profile.biography,
      profile.phoneNumber,
      profile.user?.email ?? null,
      profile.user?.avatarUrl ?? null,
      profile.countryId,
      profile.regionId,
      profile.townId,
      profile.phoneCodeId,
      profile.isEmailVisible,
      ProfileSocialNetworkPrismaMapper.toDomainList(profile.profileSocialNetworks ?? []),
      TagProfilePrismaMapper.toDomainList(profile.tagProfiles ?? []),
      profile.createdBy,
      profile.country?.name ?? null,
      profile.region?.name ?? null,
      profile.town?.name ?? null,
      profile.status,
      profile.createdAt,
      profile.updatedAt,
      profile.updatedBy ?? undefined,
    );
    return entity;
  }

  static toDomainList(profiles: ProfilePrismaModel[]): ProfileEntity[] {
    return profiles.map((profile) => this.toDomain(profile));
  }
}
