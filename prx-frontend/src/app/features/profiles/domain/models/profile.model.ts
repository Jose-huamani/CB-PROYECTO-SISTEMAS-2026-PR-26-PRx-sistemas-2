import { ProfileSocialNetworkModel } from '@features/profiles/domain/models/profile-social-network.model';
import { TagModel } from '@features/profiles/domain/models/tag.model';

export interface ProfileModel {
  id: number;
  userId: number;
  email?: string | null;
  firstName: string | null;
  lastName: string | null;
  secondLastName: string | null;
  biography: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  countryId: number | null;
  countryName?: string | null;
  regionId: number | null;
  regionName?: string | null;
  townId: number | null;
  townName?: string | null;
  phoneCodeId: number | null;
  isEmailVisible: boolean;
  socialNetworks: ProfileSocialNetworkModel[];
  tags: TagModel[];
  createdAt: string;
  updatedAt: string;
}
