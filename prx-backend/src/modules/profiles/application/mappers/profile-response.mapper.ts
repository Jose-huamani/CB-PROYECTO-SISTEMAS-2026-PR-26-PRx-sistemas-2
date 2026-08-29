import { ProfileResponseDto } from '@modules/profiles/application/dto/responses/profile-response.dto';
import { ProfileSocialNetworkEntity } from '@modules/profiles/domain/entities/profile-social-network.entity';
import { ProfileEntity } from '@modules/profiles/domain/entities/profile.entity';
import { TagResponseMapper } from '@modules/tags/application/mappers/tag-response.mapper';

export class ProfileResponseMapper {
  static toProfileResponse(profile: ProfileEntity): ProfileResponseDto {
    return {
      id: profile.id as number,
      userId: profile.id as number,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      secondLastName: profile.secondLastName,
      biography: profile.biography,
      phoneNumber: profile.phoneNumber,
      avatarUrl: profile.avatarUrl,
      countryId: profile.countryId,
      countryName: profile.countryName ?? null,
      regionId: profile.regionId,
      regionName: profile.regionName ?? null,
      townId: profile.townId,
      townName: profile.townName ?? null,
      phoneCodeId: profile.phoneCodeId,
      isEmailVisible: profile.isEmailVisible,
      socialNetworks: profile.socialNetworks as ProfileSocialNetworkEntity[],
      tags: TagResponseMapper.toTagResponseList(
        profile.tagProfiles
          .map((tagProfile) => tagProfile.tag)
          .filter((tag): tag is NonNullable<typeof tag> => Boolean(tag)),
      ),
      createdAt: profile.createdAt as Date,
      updatedAt: profile.updatedAt as Date,
    };
  }

  static toProfileResponseList(
    profiles: ProfileEntity[],
  ): ProfileResponseDto[] {
    return profiles.map((profile) => this.toProfileResponse(profile));
  }
}
