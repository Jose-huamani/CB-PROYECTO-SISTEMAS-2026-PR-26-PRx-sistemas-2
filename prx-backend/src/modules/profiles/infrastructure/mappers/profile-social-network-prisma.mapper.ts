import { ProfileSocialNetworkEntity } from '@modules/profiles/domain/entities/profile-social-network.entity';

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

export class ProfileSocialNetworkPrismaMapper {
  static toDomain(profileSocialNetwork: ProfileSocialNetworkModel): ProfileSocialNetworkEntity {
    return new ProfileSocialNetworkEntity(
      profileSocialNetwork.id,
      profileSocialNetwork.profileId,
      profileSocialNetwork.socialNetworkId,
      profileSocialNetwork.username,
      profileSocialNetwork.status,
    );
  }

  static toDomainList(
    profileSocialNetworks: ProfileSocialNetworkModel[],
  ): ProfileSocialNetworkEntity[] {
    return profileSocialNetworks.map((profileSocialNetwork) => this.toDomain(profileSocialNetwork));
  }
}
